import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row">
      {/* Mobile Nav Header & Overlay */}
      <MobileNav>
        <DashboardSidebar className="border-r-0" />
      </MobileNav>

      {/* Desktop Sidebar */}
      <DashboardSidebar className="hidden md:flex sticky top-0 h-screen" />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
