"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { activateSubscription } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  async function handlePurchase(plan: string) {
    setLoading(plan);
    setIsProcessing(true);

    // Simulate a payment processing & UI setup delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const result = await activateSubscription();

      if (result?.success) {
        toast.success("Payment Successful!", {
          description: `Welcome to the ${plan} plan. Your subscription is now active!`,
          icon: <Sparkles className="text-emerald-400" />,
          duration: 3000,
        });

        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      } else if (result?.error === "AUTH_REQUIRED") {
        toast.info("Please sign in first", {
          description: "You need an account to subscribe.",
        });
        router.push("/auth/login");
        setIsProcessing(false);
      } else {
        throw new Error(result?.error || "Activation failed");
      }
    } catch (err: any) {
      toast.error("Payment Failed", {
        description: err.message || "Please try again later.",
      });
      setIsProcessing(false);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6">
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="relative">
                <div className="h-24 w-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="animate-spin text-emerald-400" size={40} />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-emerald-500/20 blur-3xl -z-10 rounded-full"
                />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter sm:text-4xl text-white">
                  Setting up your UI...
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="h-full w-full bg-emerald-500"
                    />
                  </div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] animate-pulse">
                    Initializing Nexus
                  </p>
                  <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }}
                      className="h-full w-full bg-emerald-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="max-w-[280px] mx-auto">
                 <p className="text-sm text-white/40 leading-relaxed italic">
                   Please wait while we prepare your personalized dashboard and charitable impact trackers.
                 </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <span className="text-4xl font-bold">₹1,699</span>
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
              <span className="text-4xl font-bold">₹16,999</span>
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
