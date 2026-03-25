import { createClient } from "@/lib/supabase/server";
import { CharitySelector } from "@/components/dashboard/CharitySelector";
import { Card } from "@/components/ui/Card";
import { Heart, Info, Globe } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CharityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch User Profile & Sub Date
  const { data: profile } = await supabase
    .from("users")
    .select("charity_id, created_at")
    .eq("id", user?.id)
    .single();

  // 2. Fetch All Charities with Payout totals
  const { data: charitiesData } = await supabase
    .from("charities")
    .select(`
      *,
      charity_payouts (
        amount
      )
    `)
    .order("name", { ascending: true });

  // 3. Calculate Global Stats
  const charities = charitiesData?.map((c: any) => ({
    ...c,
    totalRaised: c.charity_payouts.reduce((acc: number, p: any) => acc + Number(p.amount), 0)
  })) || [];

  const communityTotal = charities.reduce((acc, c) => acc + c.totalRaised, 0);

  // 4. Calculate Personal Impact (Estimation)
  // Logic: $0.50 per month since subscription started (or account created as proxy)
  const createdDate = new Date(profile?.created_at || Date.now());
  const now = new Date();
  const monthsActive = Math.max(1, (now.getFullYear() - createdDate.getFullYear()) * 12 + now.getMonth() - createdDate.getMonth() + 1);
  const personalImpact = monthsActive * 0.50;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Choose Your Impact</h1>
          <p className="text-white/60 mt-1 max-w-xl">
            10% of your monthly subscription is donated directly to the humanitarian cause of your choice. Selective giving, collective impact.
          </p>
        </div>
        
        <div className="inline-flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/40">
           <Info size={14} className="text-emerald-400" />
           Your selection supports our community goals.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Impact Card */}
        <Card className="p-6 border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Your Personal Impact</p>
                    <h3 className="text-4xl font-black text-white">${personalImpact.toFixed(2)}</h3>
                    <p className="text-[10px] text-emerald-400/60 font-medium mt-1">Generated from {monthsActive} months of active subscription</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Heart size={20} fill="currentColor" />
                </div>
            </div>
        </Card>

        {/* Global Impact Card */}
        <Card className="p-6 border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Community Total Raised</p>
                    <h3 className="text-4xl font-black text-white">${communityTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    <p className="text-[10px] text-blue-400/60 font-medium mt-1">Total live contributions across all humanitarian partners</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Globe size={20} />
                </div>
            </div>
        </Card>
      </div>

      {!charities || charities.length === 0 ? (
        <div className="p-12 text-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
          Loading humanitarian partners...
        </div>
      ) : (
        <CharitySelector 
          charities={charities} 
          currentColorId={profile?.charity_id || null} 
        />
      )}
    </div>
  );
}
