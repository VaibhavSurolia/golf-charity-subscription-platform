import Link from "next/link";
import { User, Menu, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/(website)/auth/actions";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tighter text-white">
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">Nexus</span> Golf
        </Link>
        
        <div className="hidden md:flex">
          {/* Main navigation removed for minimalist design */}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 md:flex"
              >
                <LayoutDashboard size={16} />
                <span>Portal</span>
              </Link>
              <form action={logout}>
                <button type="submit" className="text-white/60 hover:text-rose-400 transition-colors">
                  <LogOut size={20} />
                </button>
              </form>
            </div>
          ) : (
            <Link 
              href="/auth/login" 
              className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 md:flex"
            >
              <User size={16} />
              <span>Sign In</span>
            </Link>
          )}
          <button className="md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
