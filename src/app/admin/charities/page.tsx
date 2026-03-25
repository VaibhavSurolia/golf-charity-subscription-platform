import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart, Globe, Plus, Trash2, LayoutGrid } from "lucide-react";
import { registerCharity, deleteCharity } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCharitiesPage() {
  const supabase = createAdminClient();

  // 1. Fetch Charities with their payout totals
  const { data: charities } = await supabase
    .from("charities")
    .select(`
      *,
      charity_payouts (
        amount
      )
    `)
    .order("name", { ascending: true });

  const charitiesWithTotals = charities?.map((c: any) => ({
    ...c,
    totalRaised: c.charity_payouts.reduce((acc: number, p: any) => acc + Number(p.amount), 0)
  })) || [];

  return (
    <div className="space-y-10 flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Heart className="text-emerald-400" fill="currentColor" /> Charity Partners
          </h1>
          <p className="text-white/40 mt-1">Manage humanitarian organizations and track their performance.</p>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <Card className="lg:col-span-1 p-6 h-fit sticky top-24 border-white/5 bg-white/2 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Plus size={18} className="text-emerald-400" /> Register Partner
          </h3>

          <form action={async (formData) => { await registerCharity(formData); }} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Charity Name</label>
              <input
                name="name"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="e.g. Save the Children"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Website URL</label>
              <input
                name="website"
                type="url"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="https://example.org"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Description</label>
              <textarea
                name="description"
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                placeholder="Briefly describe their mission..."
              />
            </div>

            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-12 rounded-xl">
              Add Partner
            </Button>
          </form>
        </Card>

        {/* Charity List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid size={14} /> Active Partners ({charitiesWithTotals.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {charitiesWithTotals.map((charity: any) => (
              <Card key={charity.id} className="p-5 border-white/5 hover:border-white/10 transition-all flex items-center justify-between group bg-white/2">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xl">
                    {charity.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{charity.name}</h4>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-xs text-emerald-400 font-bold tracking-tight">
                        Total Raised: ${charity.totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      {charity.website && (
                        <a 
                          href={charity.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-white/60 transition-colors"
                        >
                          <Globe size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <form action={async () => { "use server"; await deleteCharity(charity.id); }}>
                    <Button 
                        variant="ghost" 
                        className="h-10 w-10 p-0 text-white/20 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <Trash2 size={18} />
                    </Button>
                </form>
              </Card>
            ))}

            {charitiesWithTotals.length === 0 && (
              <div className="p-12 text-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
                No charity partners registered yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
