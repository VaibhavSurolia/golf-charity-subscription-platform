"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function processMonthlyDraw(manualNumbers?: number[]) {
  const authClient = await createClient();
  const supabase = await createAdminClient();

  // 1. Verification: Admin only (using standard client for user session)
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) throw new Error("Unauthorized: No session found.");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Only admins can trigger draws.");
  }

  // 2. Constants
  const TICKET_PRICE = 1699.00;
  const CHARITY_PERCENT = 0.10;
  const TIERS = {
    MATCH_5: 0.70, // 70% of prize pool
    MATCH_4: 0.20, // 20% of prize pool
    MATCH_3: 0.10  // 10% of prize pool
  };

  // 3. Fetch Current Rollover from previous months
  const { data: stats } = await supabase
    .from("system_stats")
    .select("value_decimal")
    .eq("key", "current_jackpot")
    .single();

  const previousRollover = Number(stats?.value_decimal || 0);

  // 4. Get Active Subscribers with their selected charities
  const { data: subscribers, error: subError } = await supabase
    .from("users")
    .select("id, charity_id")
    .eq("subscription_status", "active");

  if (subError) return { error: subError.message };
  if (!subscribers || subscribers.length === 0) {
    return { error: "No active subscribers found for this draw." };
  }

  // 5. Calculate Pools
  const totalRevenue = subscribers.length * TICKET_PRICE;
  const charityPool = totalRevenue * CHARITY_PERCENT;
  const prizePool = totalRevenue - charityPool;

  // Total Jackpot = (70% of current pool) + (Carried over from last month)
  const currentJackpotPool = (prizePool * TIERS.MATCH_5) + previousRollover;

  // 6. Generate Winning Numbers (Manual override or 5 random from 1-45)
  let winningNumbers: number[] = [];

  if (manualNumbers && manualNumbers.length === 5) {
    winningNumbers = manualNumbers;
    console.log(`[Draw] Using MANUAL winning numbers: ${winningNumbers.join(", ")}`);
  } else {
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) winningNumbers.push(num);
    }
    console.log(`[Draw] Generated RANDOM winning numbers: ${winningNumbers.join(", ")}`);
  }

  // 7. Create Draw Record (Initially without rollover calculation)
  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' });
  const { data: draw, error: drawError } = await supabase
    .from("draws")
    .insert({
      month: monthName,
      year: now.getFullYear(),
      winning_numbers: winningNumbers,
      total_pool: prizePool,
      charity_pool: charityPool,
      rollover_from_previous: previousRollover,
      status: 'closed'
    })
    .select()
    .single();

  if (drawError) return { error: drawError.message };

  /* 
  // --- PART 8: Proportional Charity Payouts (DISABLED: Moved to Verification Step) ---
  const { data: allCharities } = await supabase.from("charities").select("id");
  const charityCounts: Record<string, number> = {};
  let totalWithSelection = 0;

  subscribers.forEach(s => {
    if (s.charity_id) {
        charityCounts[s.charity_id] = (charityCounts[s.charity_id] || 0) + 1;
        totalWithSelection++;
    }
  });

  const payouts: { draw_id: string; charity_id: string; amount: number }[] = [];
  
  if (totalWithSelection > 0) {
    const portionPerUser = charityPool / subscribers.length;
    const unselectedShare = (subscribers.length - totalWithSelection) * portionPerUser;
    
    allCharities?.forEach(charity => {
        const userCount = charityCounts[charity.id] || 0;
        const baseAmount = userCount * portionPerUser;
        const extraFromUnselected = unselectedShare / (allCharities?.length || 1);
        payouts.push({
            draw_id: draw.id,
            charity_id: charity.id,
            amount: Number((baseAmount + extraFromUnselected).toFixed(2))
        });
    });
  } else {
    const share = charityPool / (allCharities?.length || 1);
    allCharities?.forEach(c => {
        payouts.push({
            draw_id: draw.id,
            charity_id: c.id,
            amount: Number(share.toFixed(2))
        });
    });
  }

  if (payouts.length > 0) {
    await supabase.from("charity_payouts").insert(payouts);
  }
  // --- END PART 8 ---
  */

  // 8. Calculate Match Counts for all subscribers
  const winnersList: { user_id: string; match_count: number; prize_won: number }[] = [];
  const tierCounts = { 5: 0, 4: 0, 3: 0 };

  for (const subscriber of subscribers) {
    const { data: scores } = await supabase
      .from("scores")
      .select("score")
      .eq("user_id", subscriber.id)
      .limit(10); // Check last 10 scores to be safe

    if (!scores || scores.length === 0) continue;

    const userScores = Array.from(new Set(scores.map(s => s.score))); // Unique user scores

    // Count how many of the WINNING NUMBERS the user has
    const matchCount = winningNumbers.filter(winNum => userScores.includes(winNum)).length;

    if (matchCount >= 3) {
      winnersList.push({ user_id: subscriber.id, match_count: matchCount, prize_won: 0 });
      if (matchCount === 5) tierCounts[5]++;
      if (matchCount === 4) tierCounts[4]++;
      if (matchCount === 3) tierCounts[3]++;
    }
  }

  // 9. Handle Rollover Logic
  let rolloverAmount = 0;
  if (tierCounts[5] === 0) {
    // No one won the jackpot! Carry it forward.
    rolloverAmount = currentJackpotPool;
    await supabase.from("system_stats")
      .update({ value_decimal: rolloverAmount })
      .eq("key", "current_jackpot");
  } else {
    // Someone won! Reset the system jackpot.
    await supabase.from("system_stats")
      .update({ value_decimal: 0 })
      .eq("key", "current_jackpot");
  }

  // Record rollover in the draw record
  await supabase.from("draws").update({ rollover_amount: rolloverAmount }).eq("id", draw.id);

  // 10. Distribute Prize Money to Winners
  const finalWinners = winnersList.map(w => {
    let prize = 0;
    if (w.match_count === 5 && tierCounts[5] > 0) prize = currentJackpotPool / tierCounts[5];
    if (w.match_count === 4 && tierCounts[4] > 0) prize = (prizePool * TIERS.MATCH_4) / tierCounts[4];
    if (w.match_count === 3 && tierCounts[3] > 0) prize = (prizePool * TIERS.MATCH_3) / tierCounts[3];
    return {
      draw_id: draw.id,
      user_id: w.user_id,
      match_count: w.match_count,
      prize_won: Number(prize.toFixed(2))
    };
  });

  if (finalWinners.length > 0) {
    const { error: winError } = await supabase.from("winners").insert(finalWinners);
    if (winError) return { error: winError.message };
  }

  revalidatePath("/dashboard/results");
  revalidatePath("/admin");

  return {
    success: true,
    numbers: winningNumbers,
    winnersCount: finalWinners.length,
    pool: prizePool + previousRollover,
    jackpot: currentJackpotPool,
    rolledOver: tierCounts[5] === 0 ? rolloverAmount : 0
  };
}
