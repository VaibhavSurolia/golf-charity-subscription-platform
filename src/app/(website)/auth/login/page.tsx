"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GoogleButton } from "@/components/auth/GoogleButton";
import Link from "next/link";
import { login } from "../actions";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 relative overflow-hidden text-center">
        {/* Abstract Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h2>
          <p className="text-white/60 mb-8">Sign in to track your scores and impact.</p>
          
          {error && (
            <div className="p-3 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-sm mb-6">
              {error}
            </div>
          )}
          
          <GoogleButton mode="signin" />
          
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-white/40 text-sm font-medium">or continue with email</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form action={login} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="golfer@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1">Password</label>
              <input 
                name="password"
                type="password" 
                required
                className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full block">Sign In</Button>
            </div>
          </form>

          <p className="mt-6 text-sm text-white/50">
            Don't have an account? <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors">Subscribe Now</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
