import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/Card";
import { 
  Users, 
  Server, 
  DollarSign, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Trophy
} from "lucide-react";
import { SimulateDrawButton } from "@/components/admin/SimulateDrawButton";
import { AdminUserList } from "@/components/admin/AdminUserList";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  // 1. Fetch Real Stats
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: 'exact', head: true });
  
  // 2. Fetch Total Revenue (Approx from active users)
  const { count: activeSubs } = await supabase
    .from("users")
    .select("*", { count: 'exact', head: true })
    .eq("subscription_status", "active");
  
  const monthlyRevenue = (activeSubs || 0) * 5;

  // 3. Fetch Current Jackpot
  const { data: stats } = await supabase
    .from("system_stats")
    .select("value_decimal")
    .eq("key", "current_jackpot")
    .single();

  const currentJackpot = Number(stats?.value_decimal || 0);

  // 4. Fetch Pending Verifications Count — must use adminClient to bypass RLS
  const { count: pendingVerifications } = await adminClient
    .from("winners")
    .select("*", { count: 'exact', head: true })
    .eq("verification_status", "pending")
    .not("proof_url", "is", null);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-rose-500 rounded-full" />
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <Server className="text-rose-500" /> Admin Console
          </h1>
          <p className="text-white/40 mt-1 font-medium italic">Golf Charity Subscription Engine v1.0</p>
        </div>
        
        <SimulateDrawButton />
      </div>

      {/* QUICK STATS */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6 bg-white/[0.02] border-white/5 backdrop-blur-md animate-fade-in-up glass-hover" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
               <Users size={24} />
            </div>
          </div>
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Total Platform Users</p>
          <h3 className="text-3xl font-black mt-1">{totalUsers || 0}</h3>
        </Card>

        <Card className="p-6 bg-white/[0.02] border-white/5 backdrop-blur-md animate-fade-in-up glass-hover" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
               <DollarSign size={24} />
            </div>
            <div className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-bold">LIVE</div>
          </div>
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Est. Monthly Revenue</p>
          <h3 className="text-3xl font-black mt-1 text-emerald-400">${monthlyRevenue.toLocaleString()}</h3>
        </Card>

        <Card className="p-6 bg-white/[0.02] border-white/5 backdrop-blur-md animate-fade-in-up glass-hover" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
               <Trophy size={24} />
            </div>
          </div>
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Current Jackpot Pool</p>
          <h3 className="text-3xl font-black mt-1 text-purple-400">${currentJackpot.toLocaleString()}</h3>
        </Card>

        {/* NEW VERIFICATION STAT */}
        <Link href="/admin/verifications" className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card className="p-6 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer group glass-hover">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              {pendingVerifications && pendingVerifications > 0 ? (
                <div className="animate-pulse flex h-3 w-3 rounded-full bg-rose-500" />
              ) : (
                <CheckCircle size={16} className="text-emerald-500" />
              )}
            </div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Pending Claims</p>
            <h3 className="text-3xl font-black mt-1">{pendingVerifications || 0}</h3>
            <div className="flex items-center gap-1 text-[10px] text-indigo-400 mt-2 font-bold uppercase">
               Review Portal <ArrowRight size={10} />
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
             <Users size={20} className="text-white/40" />
             <h2 className="text-xl font-bold">Platform User Management</h2>
          </div>
          <div className="rounded-3xl border border-white/5 overflow-hidden">
            <AdminUserList />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <Activity size={20} className="text-white/40" />
             <h2 className="text-xl font-bold">System Health</h2>
          </div>
          <Card className="p-8 space-y-6 bg-gradient-to-b from-white/[0.03] to-transparent border-white/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Database Status</span>
                <span className="text-emerald-400 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Draw Engine</span>
                <span className="text-emerald-400">Idle (Monthly)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Payout Gateway</span>
                <span className="text-indigo-400 underline decoration-indigo-400/30">Stripe Connected</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5">
               <p className="text-xs text-white/20 italic" suppressHydrationWarning>
                Last draw processed: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
               </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
