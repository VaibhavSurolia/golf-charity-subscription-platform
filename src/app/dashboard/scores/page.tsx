import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreForm } from "@/components/dashboard/ScoreForm";
import { deleteScore } from "./actions";
import { Trash2, Calendar, Target, Lock } from "lucide-react";
import Link from "next/link";

export default async function ScoresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status")
    .eq("id", user?.id)
    .single();

  const isSubscribed = profile?.subscription_status === "active";

  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user?.id)
    .order("date", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Score Management</h1>
        <p className="text-white/60 mt-1">Submit and manage your latest 5 round scores.</p>
      </div>

      {!isSubscribed ? (
        <Card className="p-12 text-center flex flex-col items-center border-dashed border-white/20">
          <Lock size={48} className="text-white/20 mb-4" />
          <h2 className="text-xl font-bold mb-2">Subscription Required</h2>
          <p className="text-white/60 max-w-sm mb-8">
            You need an active subscription to submit scores and participate in the monthly draws.
          </p>
          <Link href="/pricing">
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black border-none">
              View Plans
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <ScoreForm />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target size={20} className="text-emerald-400" /> 
                Active Entries
              </h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                {scores?.length || 0} / 5 Rounds
              </span>
            </div>
            
            {scores && scores.length > 0 ? (
              <Card className="divide-y divide-white/5 bg-white/5 border-white/10">
                {scores.map((score) => (
                  <div key={score.id} className="p-4 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="text-2xl font-black font-mono text-emerald-400 w-10">
                        {score.score}
                      </div>
                      <div className="h-8 w-px bg-white/10" />
                      <div>
                        <div className="flex items-center gap-2 text-white font-medium">
                          {new Date(score.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Verified Round</div>
                      </div>
                    </div>
                    
                    <form action={async () => {
                      "use server";
                      await deleteScore(score.id);
                    }}>
                      <button className="p-2 text-white/10 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                ))}
              </Card>
            ) : (
              <Card className="p-12 text-center text-white/30 border-dashed border-white/10">
                <p>No scores submitted yet.</p>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
