import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { DollarSign, Clock, CheckCircle, XCircle, Trophy } from "lucide-react";
import { redirect } from "next/navigation";

export default async function UserPayoutsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch all winning records for this user
  const { data: winners } = await supabase
    .from("winners")
    .select("*, draws(month, year, winning_numbers)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const totalWon = winners?.filter(w => w.verification_status === "verified")
    .reduce((sum, w) => sum + Number(w.prize_won), 0) || 0;
  
  const pendingCount = winners?.filter(w => w.verification_status === "pending").length || 0;
  const approvedCount = winners?.filter(w => w.verification_status === "verified").length || 0;
  const rejectedCount = winners?.filter(w => w.verification_status === "rejected").length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Payout History</h1>
        <p className="text-white/40 mt-1">Track your winnings and verification status.</p>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6 bg-white/[0.02] border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Total Received</p>
          <h3 className="text-3xl font-black text-emerald-400">₹{totalWon.toLocaleString()}</h3>
        </Card>
        <Card className="p-6 bg-white/[0.02] border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Approved</p>
          <h3 className="text-3xl font-black text-white">{approvedCount}</h3>
        </Card>
        <Card className="p-6 bg-white/[0.02] border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Pending</p>
          <h3 className="text-3xl font-black text-indigo-400">{pendingCount}</h3>
        </Card>
        <Card className="p-6 bg-white/[0.02] border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Rejected</p>
          <h3 className="text-3xl font-black text-rose-400">{rejectedCount}</h3>
        </Card>
      </div>

      {/* HISTORY TABLE */}
      <Card className="overflow-hidden border-white/5 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
                <th className="px-6 py-4">Draw Period</th>
                <th className="px-6 py-4">Match</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {winners && winners.length > 0 ? (
                winners.map((win) => (
                  <tr key={win.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Trophy size={16} className="text-purple-400" />
                        <span className="font-medium text-sm">
                          {win.draws?.month} {win.draws?.year}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {win.match_count} Numbers
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      ₹{Number(win.prize_won).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {win.verification_status === "verified" && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
                          <CheckCircle size={10} /> Approved
                        </div>
                      )}
                      {win.verification_status === "pending" && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                          <Clock size={10} /> Pending
                        </div>
                      )}
                      {win.verification_status === "rejected" && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase">
                          <XCircle size={10} /> Rejected
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-white/40 font-medium">
                      {new Date(win.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">
                    No winning records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
