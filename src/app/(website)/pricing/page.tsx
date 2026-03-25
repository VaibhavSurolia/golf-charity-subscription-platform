"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { activateSubscription } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function handlePurchase(plan: string) {
    setLoading(plan);
    const result = await activateSubscription();
    
    if (result?.success) {
      toast.success("Subscription Activated!", {
        description: `Welcome to the ${plan} plan. You now have full access!`,
        icon: <Sparkles className="text-emerald-400" />,
        duration: 3000,
      });
      
      // Delay redirect slightly so user sees the message
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } else if (result?.error === "AUTH_REQUIRED") {
      toast.info("Please sign in first", {
        description: "You need an account to subscribe.",
      });
      router.push("/auth/login");
    } else {
      toast.error("Activation Failed", {
        description: result?.error || "Please try again later.",
      });
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Choose Your Impact Level
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Unlock your ability to participate in monthly draws, track your scores, and automatically donate to the charities you care about.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Monthly Plan */}
        <Card className="p-8 relative overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Monthly Passer</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold">$20</span>
              <span className="text-white/50">/ month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {["Enter up to 5 scores", "Automatic monthly draw entry", "10% guaranteed charity cut", "Full dashboard access"].map((ft, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  {ft}
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            onClick={() => handlePurchase("Monthly")}
            disabled={!!loading}
            variant="secondary" 
            className="w-full gap-2"
          >
            {loading === "Monthly" && <Loader2 size={18} className="animate-spin" />}
            {loading === "Monthly" ? "Activating..." : "Activate Monthly"}
          </Button>
        </Card>

        {/* Yearly Plan */}
        <Card className="p-8 relative overflow-hidden flex flex-col justify-between border-emerald-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          <div className="absolute -top-3 -right-3 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transform rotate-12 z-20">
            Save 15%
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-semibold mb-2">Yearly Pro</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold">$200</span>
              <span className="text-white/50">/ year</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {["All Monthly features", "Priority draw multiplier logic", "Exclusive badge on profile", "Guaranteed 15.5% charity match"].map((ft, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  {ft}
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            onClick={() => handlePurchase("Yearly")}
            disabled={!!loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black border-none relative z-10 gap-2"
          >
            {loading === "Yearly" && <Loader2 size={18} className="animate-spin" />}
            {loading === "Yearly" ? "Processing..." : "Activate Yearly"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
