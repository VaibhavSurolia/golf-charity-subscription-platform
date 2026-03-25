import { Card } from "@/components/ui/Card";
import { Server } from "lucide-react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-white/10 rounded-xl" />
          <div className="h-4 w-48 bg-white/5 rounded-lg" />
        </div>
        <div className="h-12 w-48 bg-rose-500/20 rounded-xl" />
      </div>

      {/* QUICK STATS SKELETON */}
      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 bg-white/[0.02] border-white/5 h-32 overflow-hidden relative">
            <div className="h-8 w-8 bg-white/10 rounded-xl mb-4" />
            <div className="h-4 w-24 bg-white/5 rounded-lg mb-2" />
            <div className="h-8 w-16 bg-white/10 rounded-lg" />
          </Card>
        ))}
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
           <div className="h-6 w-48 bg-white/10 rounded-lg" />
           <div className="h-96 w-full bg-white/[0.02] border border-white/5 rounded-3xl" />
        </div>
        <div className="space-y-6">
           <div className="h-6 w-32 bg-white/10 rounded-lg" />
           <Card className="p-8 h-64 bg-white/[0.02] border border-white/5 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
