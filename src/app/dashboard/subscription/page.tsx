import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CreditCard, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status, created_at")
    .eq("id", user.id)
    .single();

  const isSubscribed = profile?.subscription_status === "active";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
        <p className="text-white/60">Manage your plan, billing, and charity impact contributions.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* CURRENT STATUS */}
        <Card className="p-8 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-3 rounded-full ${isSubscribed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm text-white/60">Current Status</p>
              <h3 className="text-2xl font-bold uppercase tracking-wide">
                {isSubscribed ? 'Active Subscriber' : 'Inactive'}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-white/60">Plan</span>
              <span className="font-medium">{isSubscribed ? 'Member Impact Plan' : 'Free Account'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-white/60">Member Since</span>
              <span className="font-medium">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          {!isSubscribed && (
            <Link href="/pricing" className="block mt-8">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black border-none">
                Get Started
              </Button>
            </Link>
          )}
        </Card>

        {/* PLAN DETAILS */}
        <Card className="p-8">
          <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-400" /> Plan Benefits
          </h4>
          <ul className="space-y-4">
            {[
              "Support local charities with every draw",
              "Enter up to 5 verified golf scores monthly",
              "Participate in the big monthly jackpot",
              "Exclusive badge on your profile",
              "Full access to historical draw statistics"
            ].map((benefit, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/80">
                <CheckCircle2 size={16} className="text-emerald-500/50 mt-0.5 shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {isSubscribed && (
        <Card className="p-6 border-amber-500/20 bg-amber-500/5">
          <div className="flex gap-4">
            <AlertCircle className="text-amber-500 shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-amber-500">Need to cancel?</h4>
              <p className="text-sm text-white/60 mt-1">
                To cancel your membership or change billing details, please contact our support team or use the Razorpay customer portal link if provided in your email receipt.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
