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

export default function Home() {
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
        <section className="py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Card className="p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10" />
              <div className="relative z-10 grid md:grid-cols-3 gap-12">
                <div>
                  <div className="text-5xl font-bold tracking-tighter mb-2">₹142.5K</div>
                  <div className="text-sm font-medium uppercase tracking-widest text-white/50">Current Jackpot</div>
                </div>
                <div className="md:border-l md:border-r border-white/10">
                  <div className="text-5xl font-bold tracking-tighter mb-2">12</div>
                  <div className="text-sm font-medium uppercase tracking-widest text-white/50">Active Charities</div>
                </div>
                <div>
                  <div className="text-5xl font-bold tracking-tighter mb-2">₹850K+</div>
                  <div className="text-sm font-medium uppercase tracking-widest text-white/50">Donated to Date</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
