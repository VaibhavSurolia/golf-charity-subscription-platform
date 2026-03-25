"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PlayCircle, Loader2, Sparkles, Settings2, X } from "lucide-react";
import { processMonthlyDraw } from "@/app/admin/draws/actions";
import { toast } from "sonner";

export function OfficialDrawButton() {
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualNumbers, setManualNumbers] = useState(["", "", "", "", ""]);

  const handleInputChange = (index: number, value: string) => {
    const newNumbers = [...manualNumbers];
    newNumbers[index] = value.replace(/\D/g, "").slice(0, 2); // Only numbers, max 2 digits
    setManualNumbers(newNumbers);
  };

  async function handleSimulate() {
    let numbers: number[] | undefined = undefined;

    if (manualMode) {
      numbers = manualNumbers.map(n => parseInt(n)).filter(n => !isNaN(n));
      const uniqueNumbers = new Set(numbers);

      if (numbers.length !== 5) {
        toast.error("Please enter 5 numbers for manual draw.");
        return;
      }
      if (uniqueNumbers.size !== 5) {
        toast.error("Duplicate numbers are not allowed.");
        return;
      }
      if (numbers.some(n => n < 1 || n > 45)) {
        toast.error("Numbers must be between 1 and 45.");
        return;
      }
    }

    setLoading(true);
    try {
      const result = await processMonthlyDraw(numbers);
      if (result.success) {
        toast.success("Official Draw Completed!", {
          description: `Winning Numbers: ${result.numbers.join(", ")}. Found ${result.winnersCount} winners. Total Pool: ₹${result.pool.toLocaleString()}`,
          icon: <Sparkles className="text-emerald-400" />,
          duration: 10000,
        });
        if (manualMode) setManualMode(false);
      } else {
        toast.error("Draw Failed", {
          description: result.error,
        });
      }
    } catch (err: any) {
      toast.error("System Error", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex items-center gap-2">
        {manualMode && (
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10 animate-in fade-in slide-in-from-right-4">
            {manualNumbers.map((num, i) => (
              <input
                key={i}
                type="text"
                value={num}
                onChange={(e) => handleInputChange(i, e.target.value)}
                placeholder="00"
                className="w-10 h-10 bg-black border border-white/20 rounded-lg text-center font-bold text-sm focus:border-rose-500 outline-none transition-colors"
              />
            ))}
            <button
              onClick={() => setManualMode(false)}
              className="p-2 text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <Button
          onClick={() => setManualMode(!manualMode)}
          variant="outline"
          className={`px-3 border-white/10 ${manualMode ? "bg-white/10" : ""}`}
          disabled={loading}
          title="Manual Override (Test Mode)"
        >
          <Settings2 size={16} />
        </Button>

        <Button
          onClick={handleSimulate}
          disabled={loading}
          className="bg-rose-500 hover:bg-rose-600 text-white gap-2 border-0 shadow-lg shadow-rose-500/20 px-6 font-bold"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />}
          {loading ? "Processing..." : manualMode ? "Process Manual Draw" : "Run Official Monthly Draw"}
        </Button>
      </div>

      {manualMode && (
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
          Manual Override Enabled (Admin Testing)
        </p>
      )}
    </div>
  );
}
