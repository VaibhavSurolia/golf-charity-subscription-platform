"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  children: React.ReactNode;
}

export function MobileNav({ children }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black sticky top-0 z-40">
        <span className="text-xl font-bold tracking-tighter text-white">
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">Nexus</span> Golf
        </span>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-white/70 hover:text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar Content */}
          <div className="relative w-64 bg-black h-full shadow-2xl border-r border-white/10 flex-shrink-0">
            {/* We pass the children (which will be the sidebar) but we need to inject the close button logic */}
            {/* For simplicity in this implementation, we'll clone the children or just pass props */}
            {/* But since DashboardSidebar is a Server Component, we can't just wrap it easily with client state */}
            {/* Instead, we'll use this MobileNav as a wrapper in the layout that handles the toggle */}
            <div className="h-full">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
