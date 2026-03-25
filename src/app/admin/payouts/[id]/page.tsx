import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, CheckCircle, Clock, XCircle, Trophy, User, Calendar, Image as ImageIcon, MessageSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PayoutDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminClient();
  const { id } = await params;

  const { data: win, error } = await supabase
    .from("winners")
    .select(`
      *,
      users(name, email),
      draws(month, year, winning_numbers)
    `)
    .eq("id", id)
    .single();

  if (error || !win) {
    notFound();
  }

  // users may be an array if it's a one-to-many relationship in the view, but let's handle both
  const userName = Array.isArray(win.users) ? win.users[0]?.name : win.users?.name;
  const userEmail = Array.isArray(win.users) ? win.users[0]?.email : win.users?.email;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link href="/admin/payouts" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Payouts
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Payout Details</h1>
        <p className="text-white/40">Comprehensive view of the prize claim and verification history.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-white/[0.02] border-white/5 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <User size={20} className="text-white/40" />
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Winner Profile</p>
              <h3 className="text-lg font-bold">{userName || "Unknown"}</h3>
              <p className="text-sm text-white/60">{userEmail}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Calendar size={20} className="text-white/40" />
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Draw Period</p>
              <h3 className="text-lg font-bold">{win.draws?.month} {win.draws?.year}</h3>
              <p className="text-sm text-white/60">Claimed on {new Date(win.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-purple-400" />
            <div>
              <p className="text-xs text-purple-400/60 uppercase tracking-widest font-bold">Match Result</p>
              <h3 className="text-lg font-bold">{win.match_count} Numbers Matched</h3>
              {win.draws?.winning_numbers && (
                <p className="text-sm text-white/60 mt-1 font-mono">
                  Winning combo: {win.draws.winning_numbers.join(", ")}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/[0.02] border-white/5 space-y-6">
          <div className="space-y-2">
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Prize Amount</p>
            <h2 className="text-5xl font-black text-emerald-400">₹{Number(win.prize_won).toLocaleString()}</h2>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/5">
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Verification Status</p>
            <div className="flex items-center gap-3 mt-2">
              {win.verification_status === "verified" ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider text-sm">
                  <CheckCircle size={18} /> Verified
                </div>
              ) : win.verification_status === "pending" ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold uppercase tracking-wider text-sm">
                  <Clock size={18} /> Pending Claim
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 font-bold uppercase tracking-wider text-sm">
                  <XCircle size={18} /> Rejected
                </div>
              )}
            </div>
            {win.admin_notes && (
              <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 flex gap-3 text-sm text-white/60">
                <MessageSquare size={16} className="text-white/40 shrink-0 mt-0.5" />
                <p>"{win.admin_notes}"</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white/[0.02] border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <ImageIcon size={20} className="text-white/40" />
             <h3 className="text-lg font-bold">Scorecard Proof</h3>
          </div>
        </div>

        {win.proof_url ? (
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-black flex justify-center p-4">
            <img 
              src={win.proof_url} 
              alt="Scorecard Proof" 
              className="max-h-[600px] object-contain rounded-xl"
            />
          </div>
        ) : (
          <div className="py-20 text-center text-white/20 italic rounded-2xl border border-dashed border-white/10 bg-black/20">
            No proof image was uploaded for this claim.
          </div>
        )}
      </Card>
    </div>
  );
}
