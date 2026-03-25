import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Users, Shield, CreditCard, ChevronRight } from "lucide-react";
import { PromoteButton } from "@/components/admin/PromoteButton";

export async function AdminUserList() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return <p className="text-rose-400">Error loading users: {error.message}</p>;

  return (
    <Card className="p-6 border-rose-500/10 bg-white/5">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Users size={18} className="text-blue-400" /> Recent Signups
      </h3>
      
      <div className="space-y-4">
        {users?.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${user.role === 'admin' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'}`}>
                {user.role === 'admin' ? <Shield size={16} /> : <Users size={16} />}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold truncate max-w-[150px] md:max-w-none">{user.email}</p>
                <div className="flex items-center gap-3">
                   <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">{user.role}</p>
                   <div className="w-1 h-1 rounded-full bg-white/10" />
                   <p className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 ${user.subscription_status === 'active' ? 'text-emerald-400' : 'text-white/20'}`}>
                    <CreditCard size={10} /> {user.subscription_status}
                   </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
               {user.role !== 'admin' && (
                 <PromoteButton userId={user.id} userEmail={user.email} />
               )}
               <div className="p-2 rounded-lg text-white/10 group-hover:text-white/40 transition-colors">
                  <ChevronRight size={16} />
               </div>
            </div>
          </div>
        ))}
        {(!users || users.length === 0) && (
          <div className="text-center py-8 text-white/20">
            <Users size={32} className="mx-auto mb-2 opacity-10" />
            <p className="text-sm italic">No users found</p>
          </div>
        )}
      </div>
    </Card>
  );
}
