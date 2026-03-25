import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row">
      {/* Mobile Nav Header & Overlay */}
      <MobileNav>
        <AdminSidebar className="border-r-0" />
      </MobileNav>

      {/* Desktop Sidebar */}
      <AdminSidebar className="hidden md:flex sticky top-0 h-screen" />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
