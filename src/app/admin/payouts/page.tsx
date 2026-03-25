import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/Card";
import { Banknote, Users, Trophy, CheckCircle, Clock, XCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const supabase = createAdminClient();

  // Fetch all winners across the platform
  const { data: allWinners } = await supabase
    .from("winners")
    .select(`
      *,
      users!inner(name, email),
      draws(month, year)
    `)
    .order("created_at", { ascending: false });

  const totalDistributed = allWinners?.filter(w => w.verification_status === "verified")
    .reduce((sum, w) => sum + Number(w.prize_won), 0) || 0;

  const pendingWinnings = allWinners?.filter(w => w.verification_status === "pending")
    .reduce((sum, w) => sum + Number(w.prize_won), 0) || 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Banknote className="text-indigo-400" /> Platform Payouts
          </h1>
          <p className="text-white/40 mt-2 font-medium">Global ledger of prize distributions and verification status.</p>
        </div>
      </div>

      {/* ADMIN OVERVIEW */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Total Distributed</p>
          <h3 className="text-4xl font-black text-emerald-400">₹{totalDistributed.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-400/60 font-black tracking-widest">
            PLATFORM TOTAL <CheckCircle size={10} />
          </div>
        </Card>

        <Card className="p-8 bg-white/[0.02] border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Pending Distribution</p>
          <h3 className="text-4xl font-black text-indigo-400">₹{pendingWinnings.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-indigo-400/60 font-black tracking-widest italic">
            AWAITING VERIFICATION <Clock size={10} className="animate-pulse" />
          </div>
        </Card>

        <Card className="p-8 bg-white/[0.02] border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Total Participants Won</p>
          <h3 className="text-4xl font-black text-white">{allWinners?.length || 0}</h3>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-white/30 font-black tracking-widest">
             UNIQUE WIN RECORDS <Trophy size={10} />
          </div>
        </Card>
      </div>

      {/* GLOBAL LEDGER */}
      <Card className="overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.2em] font-black text-white/30">
                <th className="px-8 py-5">Winner</th>
                <th className="px-8 py-5">Draw Period</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allWinners && allWinners.length > 0 ? (
                allWinners.map((win: any) => (
                  <tr key={win.id} className="hover:bg-white/[0.03] transition-all group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-white text-sm">{win.users?.name || "Unknown"}</div>
                      <div className="text-[10px] text-white/30 tracking-wider uppercase mt-0.5">{win.users?.email}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-medium text-white/80">
                        {win.draws?.month} {win.draws?.year}
                      </div>
                      <div className="text-[10px] text-indigo-400/60 mt-0.5 font-bold tracking-widest">{win.match_count} NUMBERS MATCHED</div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-lg font-black text-white tracking-tight">₹{Number(win.prize_won).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      {win.verification_status === "verified" ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                          <CheckCircle size={10} /> Verified
                        </div>
                      ) : win.verification_status === "pending" ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black tracking-widest uppercase">
                          <Clock size={10} /> Pending Claim
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-black tracking-widest uppercase">
                          <XCircle size={10} /> Rejected
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <Link 
                        href={win.verification_status === 'pending' ? "/admin/verifications" : `/admin/payouts/${win.id}`}
                        className="inline-flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all text-xs font-bold"
                       >
                         {win.verification_status === 'pending' ? 'Review Claim' : 'View Details'} <ArrowUpRight size={14} />
                       </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-white/20 italic font-medium tracking-wide">
                    No payout records found in the platform ledger.
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
