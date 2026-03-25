import { createClient } from "@/lib/supabase/server";
import { CharitySelector } from "@/components/dashboard/CharitySelector";
import { Heart, Info } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CharityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch User Profile
  const { data: profile } = await supabase
    .from("users")
    .select("charity_id")
    .eq("id", user?.id)
    .single();

  // 2. Fetch All Charities
  const { data: charities } = await supabase
    .from("charities")
    .select("*")
    .order("name", { ascending: true });

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
           You can change your selection at any time.
        </div>
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

      {/* Impact Stats Placeholder */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 flex flex-col items-center text-center space-y-4">
         <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">
            <Heart size={24} fill="currentColor" />
         </div>
         <div className="max-w-md">
            <h4 className="text-lg font-bold">Your 10% Contribution</h4>
            <p className="text-sm text-white/40 mt-1">
              Every month, $0.50 of your $5.00 subscription goes directly to your chosen partner. (Using $20 ticket model? $2.00 donation). 
              Our community has raised over $12,500 so far this year!
            </p>
         </div>
      </div>
    </div>
  );
}
