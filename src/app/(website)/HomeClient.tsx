"use client";

import { motion } from "framer-motion";
import { ArrowRight, Trophy, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

interface HomeClientProps {
  jackpot: number;
  charitiesCount: number;
  totalDonated: number;
}

export default function HomeClient({ jackpot, charitiesCount, totalDonated }: HomeClientProps) {
  // Simple currency formatter
  const formatCurrency = (val: number) => {
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val.toFixed(2)}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-[20%] w-[60%] h-[60%] rounded-full bg-emerald-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none" />

      <main className="relative z-10 px-6 max-w-7xl mx-auto pt-20 pb-32">
        {/* HERO SECTION */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center justify-center min-h-[70vh] text-center pt-24"
        >
          <motion.div variants={fadeIn} className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium backdrop-blur-sm mb-8">
            <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              Elevating the game. Empowering the world.
            </span>
          </motion.div>

          <motion.h1 variants={fadeIn} className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Play. Win. <span className="italic font-light text-white/70">Donate.</span>
          </motion.h1>

          <motion.p variants={fadeIn} className="max-w-2xl text-lg md:text-xl text-white/60 mb-12 leading-relaxed">
            The exclusive subscription platform that transforms your scorecard into real-world impact. Win premium prizes while supporting charities that matter.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px] gap-2">
                Join the Nexus <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto min-w-[200px]">
                Explore the impact
              </Button>
            </Link>
          </motion.div>
        </motion.section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Target className="w-8 h-8 text-emerald-400 mb-6" />,
                title: "1. Play Your Game",
                desc: "Subscribe and submit up to 5 of your latest scores. Our algorithm tracks your performance seamlessly."
              },
              {
                icon: <Trophy className="w-8 h-8 text-purple-400 mb-6" />,
                title: "2. Monthly Draw",
                desc: "Match your numbers against our automated monthly pulls. Jackpots roll over, building massive prize pools."
              },
              {
                icon: <Heart className="w-8 h-8 text-rose-400 mb-6" />,
                title: "3. Direct Impact",
                desc: "A guaranteed percentage of every subscription goes directly to your chosen charity. You win, they win."
              }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card className="h-full p-8 transition-transform hover:-translate-y-2 duration-300">
                  {step.icon}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CURRENT IMPACT STATS */}
        <section className="py-24 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative"
          >
            {/* Soft Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-indigo-500/5 to-purple-500/5 blur-3xl -z-10 rounded-[3rem]" />
            
            <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl p-8 md:p-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                
                {/* Stat 1 */}
                <div className="flex flex-col items-center">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/60 mb-3">
                    Current Jackpot
                  </div>
                  <div className="text-6xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    {formatCurrency(jackpot)}
                  </div>
                </div>

                {/* Stat 2 with Soft Separators */}
                <div className="flex flex-col items-center relative">
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400/60 mb-3">
                    Active Charities
                  </div>
                  <div className="text-6xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    {charitiesCount}
                  </div>
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400/60 mb-3">
                    Donated to Date
                  </div>
                  <div className="text-6xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    {formatCurrency(totalDonated)}+
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
