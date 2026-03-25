import { AdminUserList } from "@/components/admin/AdminUserList";
import { Users, Server } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-blue-500 rounded-full" />
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <Users size={32} className="text-blue-500" /> User Management
          </h1>
          <p className="text-white/40 mt-1 font-medium italic">Full platform user registry and permissions.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
           <Server size={20} className="text-white/20" />
           <h2 className="text-xl font-bold">Comprehensive User Directory</h2>
        </div>
        <div className="rounded-3xl border border-white/5 overflow-hidden">
          <AdminUserList limit={100} showTitle={false} full={true} />
        </div>
      </div>
    </div>
  );
}
