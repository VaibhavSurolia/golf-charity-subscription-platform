"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { signup } from "../actions";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-white hover:bg-gray-100 text-black font-bold h-12 transition-all duration-300"
    >
      {pending ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        "Create Account"
      )}
    </Button>
  );
}

function SignupForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 relative overflow-hidden text-center">
        {/* Abstract Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Join the Nexus</h2>
          <p className="text-white/60 mb-8">Start tracking scores and feeding the charity pool.</p>

          {error && (
            <div className="p-3 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-sm mb-6">
              {error}
            </div>
          )}
          
          <form action={signup} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1">Full Name</label>
              <input 
                name="name"
                type="text" 
                required
                className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="Tiger Woods"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="tiger@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1">Password</label>
              <input 
                name="password"
                type="password" 
                required
                className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>

          <p className="mt-6 text-sm text-white/50">
            Already have an account? <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SignupForm />
        </Suspense>
    )
}
