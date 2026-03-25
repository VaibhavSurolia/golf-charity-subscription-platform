import Link from "next/link";
import { Users, ServerIcon, DollarSign, LayoutDashboard, ShieldAlert, Heart, LogOut } from "lucide-react";
import { logout } from "@/app/(website)/auth/actions";

export function AdminSidebar() {
  const links = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
    { name: "Charities", href: "/admin/charities", icon: <Heart size={20} /> },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-black/95 p-6 flex flex-col h-screen sticky top-0">
      <div className="mb-6 px-4 pb-4 border-b border-white/10 flex items-center gap-2 text-rose-500 font-medium">
        <ShieldAlert size={20}/> ADMIN PORTAL
      </div>
      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white hover:text-rose-400"
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 pt-4 mt-auto">
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
