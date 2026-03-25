import { Card } from "@/components/ui/Card";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="flex items-center justify-between opacity-50">
        <div className="h-4 w-32 bg-white/10 rounded-lg" />
        <div className="h-10 w-48 bg-indigo-500/10 rounded-xl" />
      </div>

      <div className="space-y-4">
        <div className="h-10 w-64 bg-white/10 rounded-xl" />
        <div className="h-4 w-96 bg-white/5 rounded-lg" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 bg-white/5 border-white/10 h-64 overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 rounded-2xl bg-black/50" />
              <div className="flex-1 space-y-6">
                 <div className="flex justify-between">
                    <div className="space-y-2">
                       <div className="h-6 w-48 bg-white/10 rounded-lg" />
                       <div className="h-4 w-32 bg-white/5 rounded-lg" />
                    </div>
                    <div className="h-12 w-24 bg-emerald-500/10 rounded-xl" />
                 </div>
                 <div className="h-12 w-full bg-white/5 rounded-xl border border-white/5" />
                 <div className="flex gap-4">
                    <div className="h-10 flex-1 bg-white/10 rounded-xl" />
                    <div className="h-10 flex-1 bg-white/10 rounded-xl" />
                 </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
