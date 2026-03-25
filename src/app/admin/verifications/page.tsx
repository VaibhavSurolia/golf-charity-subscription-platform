import { createAdminClient } from "@/lib/supabase/admin";
import { AdminVerificationList } from "@/components/admin/AdminVerificationList";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminVerificationPage() {
  const supabase = await createAdminClient();

  // Fetch pending verifications with profiles
  const { data: winners, error } = await supabase
    .from("winners")
    .select(`
      *,
      users (
        name,
        email
      )
    `)
    .eq("verification_status", "pending")
    .not("proof_url", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Verification Fetch Error (Supabase):", error);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <ShieldCheck size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">Verification Portal</span>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Prize Verifications</h1>
        <p className="text-white/60">Review and validate score proof submitted by winners.</p>
      </div>

      <AdminVerificationList initialWinners={winners || []} />
    </div>
  );
}
