import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Target, 
  Heart, 
  Trophy, 
  LogOut, 
  Server,
  CreditCard,
  DollarSign,
  X // For closing mobile menu
} from "lucide-react";
import { logout } from "@/app/(website)/auth/actions";

interface SidebarProps {
  onClose?: () => void;
  className?: string;
}

export async function DashboardSidebar({ onClose, className }: SidebarProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id)
    .single();

  const isAdmin = profile?.role?.toLowerCase() === "admin";

  const links = [
    { name: "Home", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Weekly Scores", href: "/dashboard/scores", icon: <Target size={20} /> },
    { name: "Monthly Results", href: "/dashboard/results", icon: <Trophy size={20} /> },
    { name: "My Charity", href: "/dashboard/charity", icon: <Heart size={20} /> },
    { name: "Subscription", href: "/dashboard/subscription", icon: <CreditCard size={20} /> },
    { name: "Payout History", href: "/dashboard/payouts", icon: <DollarSign size={20} /> },
    ...(isAdmin ? [{ name: "Admin Panel", href: "/admin", icon: <Server size={20} className="text-rose-400" /> }] : []),
  ];

  return (
    <aside className={`w-64 border-r border-white/10 bg-black/95 p-6 flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between mb-8 md:mb-0">
        <span className="text-lg font-bold text-white md:hidden">
          Nexus Golf
        </span>
        {onClose && (
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white md:hidden">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>
      
      <div className="border-t border-white/10 pt-4 space-y-2 mt-auto">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-rose-400/70 transition-colors hover:bg-rose-500/20 hover:text-rose-400"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
