"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { addScore } from "@/app/dashboard/scores/actions";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScoreForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(32);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("score", score.toString());
    formData.append("date", date);

    const result = await addScore(formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      onSuccess?.();
    }
    setLoading(false);
  }

  return (
    <Card className="p-8 relative overflow-hidden transition-all">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-8">
        <div className="w-full space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Round Details</h3>
            <span className="text-3xl font-bold font-mono text-emerald-400 bg-emerald-400/10 px-4 py-1 rounded-lg border border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.1)]">
              {score}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-wider text-white/40 font-bold block mb-4">Stableford Score (1-45)</label>
              <input
                type="range"
                min="1"
                max="45"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all shadow-inner"
              />
              <div className="flex justify-between text-[10px] text-white/20 mt-2 font-mono">
                <span>1</span>
                <span>20</span>
                <span>45</span>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-white/40 font-bold block mb-2">Game Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-medium cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="w-full border-t border-white/5 pt-6">
           <Button 
            onClick={handleSubmit}
            disabled={loading} 
            className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black border-none font-bold text-lg shadow-[0_0_25px_rgba(52,211,153,0.2)] transition-all active:scale-95 cursor-pointer"
          >
            {loading ? <Loader2 size={24} className="animate-spin mr-2" /> : <Plus size={24} className="mr-2" />}
            Add Score
          </Button>
           {error && <p className="text-rose-400 text-xs mt-4 text-center">{error}</p>}
        </div>
      </div>

      <p className="text-[10px] text-white/30 mt-6 text-center italic">
        * System automatically rotates out your oldest round when a 6th is added to maintain your last 5 active scores.
      </p>
    </Card>
  );
}
