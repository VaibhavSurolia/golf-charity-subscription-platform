import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import {
  Trophy,
  TrendingUp,
  Calendar,
  Hash,
  ArrowRight,
  Loader2,
  Sparkles,
  Heart,
  Target
} from "lucide-react";
import { WinnerClaimModal } from "@/components/dashboard/WinnerClaimModal";
import { RealtimeWinnerListener } from "@/components/dashboard/RealtimeWinnerListener";
import Link from "next/link";

export default async function DrawResultsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Latest Draw
  const { data: latestDraw } = await supabase
    .from("draws")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // 2. Fetch User's Winner Records for this draw (ALL of them)
  const { data: winRecords } = await supabase
    .from("winners")
    .select("*")
    .eq("draw_id", latestDraw?.id)
    .eq("user_id", user?.id);

  // 3. Fetch User's Scores for context
  const { data: userScores } = await supabase
    .from("scores")
    .select("score")
    .eq("user_id", user?.id)
    .limit(5);

  const userUniqueScores = Array.from(new Set(userScores?.map(s => s.score) || []));
  const matchedNumbers = latestDraw?.winning_numbers.filter((num: number) => userUniqueScores.includes(num)) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {user && <RealtimeWinnerListener userId={user.id} />}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monthly Draw Results</h1>
        <p className="text-white/60 mt-1">Check if your scores matched this month's winning numbers.</p>
      </div>

      {!latestDraw ? (
        <Card className="p-12 text-center text-white/30 border-dashed border-white/10">
          <Calendar size={48} className="mx-auto mb-4 opacity-20" />
          <p>No draws have been processed yet. Stay tuned for the end of the month!</p>
        </Card>
      ) : (
        <>
          {/* Winning Numbers Header */}
          <Card className="p-8 relative overflow-hidden bg-emerald-500/5 border-emerald-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} /> Official {latestDraw.month} {latestDraw.year} Numbers
              </div>

              <div className="flex justify-center gap-3 md:gap-6">
                {latestDraw.winning_numbers.map((num: number, i: number) => (
                  <div key={i} className="h-14 w-14 md:h-20 md:w-20 rounded-2xl bg-black border-2 border-emerald-500/50 flex items-center justify-center text-2xl md:text-4xl font-black text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                    {num}
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center gap-6 md:gap-12 pt-4">
                <div className="text-center">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Monthly Revenue</p>
                  <p className="text-xl font-bold text-white">₹{Number(latestDraw.total_pool).toLocaleString()}</p>
                </div>

                {latestDraw.rollover_from_previous > 0 && (
                  <>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="text-center">
                      <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Rollover Added</p>
                      <p className="text-xl font-bold text-rose-400">+₹{Number(latestDraw.rollover_from_previous).toLocaleString()}</p>
                    </div>
                  </>
                )}

                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-xs text-emerald-400 uppercase tracking-widest mb-1">Charity Support</p>
                  <p className="text-xl font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <Heart size={16} fill="currentColor" /> ₹{Number(latestDraw.charity_pool).toLocaleString()}
                  </p>
                </div>
              </div>

              {latestDraw.rollover_amount > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                  <p className="text-sm font-semibold text-rose-400 flex items-center justify-center gap-2">
                    <TrendingUp size={16} /> NO JACKPOT WINNER this month! ₹{Number(latestDraw.rollover_amount).toLocaleString()} rolls over to next draw!
                  </p>
                </div>
              )}
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Match Summary */}
            <Card className="p-6 space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target size={18} className="text-emerald-400" /> Your Matches
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/60">Number of Matches</span>
                  <span className="text-2xl font-bold text-emerald-400 underline decoration-emerald-500/50 underline-offset-4 decoration-2">{matchedNumbers.length}</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Matching Scores</p>
                  <div className="flex gap-2 flex-wrap">
                    {matchedNumbers.length > 0 ? (
                      matchedNumbers.map((num: number, i: number) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-bold border border-emerald-500/30">
                          {num}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-white/20 italic">No matches this time</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Prize Status Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 px-2">
                <Trophy size={18} className="text-yellow-400" /> Your Winning Status
              </h3>

              {winRecords && winRecords.length > 0 ? (
                winRecords.map((record) => (
                  <div key={record.id} className="space-y-4">
                    <Card className="p-6 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-white/5 relative overflow-hidden text-center space-y-4">
                      <div className={`inline-flex h-20 w-20 items-center justify-center rounded-full border transition-all ${
                        record.verification_status === 'verified' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : record.verification_status === 'rejected'
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          : record.verification_status === 'pending'
                          ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                          : 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'
                      }`}>
                        <Trophy size={40} />
                      </div>

                      <div>
                        <p className="text-2xl font-black text-white uppercase">
                          {record.verification_status === 'verified' ? "Verified Winner!" : "Tier Match!"}
                        </p>
                        <p className={`text-sm font-medium ${
                          record.verification_status === 'verified' ? 'text-emerald-400' : 'text-yellow-400/80'
                        }`}>
                          Matched {record.match_count} numbers.
                        </p>
                      </div>

                      <div className="py-4 px-6 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                          {record.verification_status === 'verified' ? "Final Prize" : "Estimated Prize"}
                        </p>
                        <p className={`text-4xl font-black ${
                           record.verification_status === 'verified' ? 'text-emerald-400' : 'text-yellow-400'
                        }`}>
                          ₹{Number(record.prize_won).toLocaleString()}
                        </p>
                      </div>

                      {/* Status Messages */}
                      {(record.verification_status === 'pending' || (!record.verification_status && record.proof_url)) && record.proof_url && (
                        <div className="space-y-3 mt-6 pt-6 border-t border-white/5">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/40 flex items-center justify-center gap-2">
                            <Loader2 size={14} className="animate-spin" /> Verification Pending...
                          </div>
                          <a
                            href={record.proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center text-[10px] text-emerald-400/60 hover:text-emerald-400 transition-colors uppercase tracking-widest font-bold font-mono"
                          >
                            View Submitted Proof
                          </a>
                        </div>
                      )}

                      {record.verification_status === 'rejected' && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-left">
                          <p className="font-bold underline mb-1">Claim Rejected</p>
                          <p>{record.admin_comment || "Proof mismatch. Contact support."}</p>
                        </div>
                      )}
                    </Card>

                    {/* Individual Upload Section — only show if not yet claimed/uploaded */}
                    {!record.verification_status && !record.proof_url && (
                      <WinnerClaimModal winnerId={record.id} />
                    )}
                  </div>
                ))
              ) : (
                <Card className="p-12 text-center bg-white/5 border-white/5">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/20 mb-4">
                    <TrendingUp size={40} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-white/60">Better luck next time!</p>
                    <p className="text-sm text-white/40 max-w-[200px] mx-auto">Keep submitting your scores to stay in the game.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
