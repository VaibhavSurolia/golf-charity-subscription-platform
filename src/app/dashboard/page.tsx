import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trophy, Target, ArrowRight, Heart, Lock, Server } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const adminSupabase = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch the user's profile and charity
  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status, name, role, charity_id, created_at, charities(name, description)")
    .eq("id", user.id)
    .single();
    
  const isAdmin = profile?.role?.toLowerCase() === "admin";
  const isSubscribed = profile?.subscription_status === "active";
  const firstName = profile?.name?.split(" ")[0] || "Golfer";
  const selectedCharity = profile?.charities as any;

  const now = new Date();

  // 3. Fetch scores
  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(5);

  // 4. Fetch Verified Winnings
  const { data: verifiedWins } = await supabase
    .from("winners")
    .select("prize_won")
    .eq("user_id", user.id)
    .eq("verification_status", "verified");

  const totalWinnings = verifiedWins?.reduce((sum, win) => sum + Number(win.prize_won), 0) || 0;

  // 4. Dashboard Personal Query (FINAL)
  // Use adminSupabase to ensure visibility of all records matching this user/charity
  const { data: personalPayouts } = profile?.charity_id
    ? await adminSupabase
        .from("charity_payouts")
        .select("amount")
        .eq("user_id", user.id)
        .eq("charity_id", profile.charity_id)
    : { data: [] };

  const recordedPersonalImpact = personalPayouts?.reduce((acc, p) => acc + Number(p.amount), 0) || 0;
  
  // 5. Personal Charity Impact (Current Month + Records)
  // Logic: Only pulling from the ledger for truth
  const personalImpact = recordedPersonalImpact;

  // 6. Overall Raised for the currently Selected cause
  const { data: causePayouts } = profile?.charity_id 
    ? await adminSupabase
        .from("charity_payouts")
        .select("amount")
        .eq("charity_id", profile.charity_id)
    : { data: [] };

  const charityTotal = causePayouts?.reduce((acc, p) => acc + Number(p.amount), 0) || 0;

  // 7. Calculate days until next draw (1st of next month)
  const nextDrawDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diffTime = nextDrawDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}</h1>
          <p className="text-white/60 mt-1">Here is your current standing for the upcoming draw.</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" className="gap-2 border-rose-500/50 text-rose-400 hover:bg-rose-500/10">
                <Server size={16} /> Admin Console
              </Button>
            </Link>
          )}
          
          {isSubscribed ? (
            <Link href="/dashboard/scores">
              <Button className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black border-none">
                Add Score <ArrowRight size={16} />
              </Button>
            </Link>
          ) : (
            <Link href="/pricing">
              <Button variant="outline" className="gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                <Lock size={16} /> Subscribe to Add Score
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* STAT CARDS */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Winnings</p>
              <h3 className="text-2xl font-bold">₹{totalWinnings.toLocaleString()}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm text-white/60">Active Scores</p>
              <h3 className="text-2xl font-bold">{isSubscribed ? `${scores?.length || 0} / 5` : <Lock size={20} className="text-white/40 mt-1" />}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-white/60 mb-1">Next Draw Status</p>
              {isSubscribed ? (
                <>
                  <h3 className="text-xl font-semibold text-white">{daysRemaining} Days Remaining</h3>
                  <p className="text-xs text-emerald-400 mt-2">Your entry is active</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white/50">Subscription Required</h3>
                  <p className="text-xs text-rose-400 mt-2">You must subscribe to enter the pending draw.</p>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">Active Pool</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3 items-start">
        {/* RECENT SCORES PANEL */}
        <Card className="p-6 md:col-span-2 relative min-h-[300px]">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg font-semibold">Your Recent Scores</h3>
            {isSubscribed && scores && scores.length > 0 && (
              <Link href="/dashboard/scores">
                <Button variant="ghost" size="sm">Manage All</Button>
              </Link>
            )}
          </div>

          {!isSubscribed ? (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center flex-col text-center rounded-2xl">
              <Lock size={48} className="text-white/20 mb-4" />
              <h4 className="text-lg font-medium mb-2">Scores Locked</h4>
              <p className="text-sm text-white/60 max-w-sm mb-6">You need an active subscription to submit your golf scores and match against the monthly draw.</p>
              <Link href="/pricing">
                <Button className="bg-white text-black hover:bg-gray-200">View Impact Plans</Button>
              </Link>
            </div>
          ) : scores && scores.length > 0 ? (
            <div className="space-y-4">
              {scores.map((score, i) => (
                <div key={score.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-black/50 flex items-center justify-center font-bold font-mono border border-emerald-500/30 text-emerald-400">
                      {score.score}
                    </div>
                    <div>
                      <p className="font-medium text-sm">Round Entry</p>
                      <p className="text-xs text-white/50" suppressHydrationWarning>{new Date(score.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-400 px-2 py-1 rounded bg-emerald-500/10">Active</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-[200px] text-white/40">
              <Target size={48} className="mb-4 opacity-50" />
              <p>No active scores recorded yet.</p>
              <Link href="/dashboard/scores" className="mt-4">
                <Button variant="secondary" size="sm">Add your first score</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* CHARITY PANEL */}
        <Card className="p-6 pb-2 relative overflow-hidden flex flex-col">
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <Heart size={120} />
          </div>
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Charity Impact</h3>
              <p className="text-sm text-white/60 mb-2">Your impact so far:</p>
              <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-emerald-400 font-mono">₹{personalImpact.toFixed(2)}</span>
                  <span className="text-[10px] text-white/40 mb-1.5 uppercase tracking-tighter">Personal Impact</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-blue-400 font-mono">₹{charityTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span className="text-[10px] text-white/40 mb-1 uppercase tracking-tighter">Raised for this Cause</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                {selectedCharity ? (
                  <>
                    <h4 className="font-bold text-emerald-400 uppercase tracking-wide text-xs">Current Choice</h4>
                    <p className="text-sm text-white font-medium mt-1">{selectedCharity.name}</p>
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-rose-400 italic">No Charity Selected</h4>
                    <p className="text-xs text-white/40 mt-1 italic">Click below to select your cause!</p>
                  </>
                )}
              </div>
            </div>
            
            <Link href="/dashboard/charity" className="mb-2">
              <Button variant="outline" className="w-full relative z-10 border-white/10 hover:bg-white/10 h-11">
                {selectedCharity ? "Change Charity" : "Select a Charity"}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
