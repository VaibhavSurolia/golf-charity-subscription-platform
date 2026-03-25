import { createAdminClient } from "@/lib/supabase/admin";
import HomeClient from "@/app/(website)/HomeClient";

export default async function Home() {
  const supabase = createAdminClient();

  // 1. Fetch Current Jackpot
  const { data: jackpotData } = await supabase
    .from("system_stats")
    .select("value_decimal")
    .eq("key", "current_jackpot")
    .single();
  const currentJackpot = Number(jackpotData?.value_decimal) || 0;

  // 2. Fetch Active Charities Count
  const { count: charitiesCount } = await supabase
    .from("charities")
    .select("*", { count: 'exact', head: true });

  // 3. Fetch Total Donated (Community Payouts)
  const { data: payouts } = await supabase
    .from("charity_payouts")
    .select("amount");
  const totalDonated = payouts?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  return (
    <HomeClient 
      jackpot={currentJackpot} 
      charitiesCount={charitiesCount || 0} 
      totalDonated={totalDonated} 
    />
  );
}
