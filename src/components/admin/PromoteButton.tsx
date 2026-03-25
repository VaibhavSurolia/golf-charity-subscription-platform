"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, Loader2 } from "lucide-react";
import { promoteToAdmin } from "@/app/admin/users/promote-action";
import { toast } from "sonner";

export function PromoteButton({ userId, userEmail }: { userId: string, userEmail: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePromote() {
    setLoading(true);
    try {
      const result = await promoteToAdmin(userId);
      if (result.success) {
        toast.success("Success!", {
          description: `${userEmail} is now an administrator.`
        });
      } else {
        toast.error("Promotion Failed", {
          description: result.error
        });
      }
    } catch (err: any) {
      toast.error("Error", {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handlePromote}
      disabled={loading}
      className="h-8 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 gap-1.5"
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <ShieldAlert size={12} />}
      Make Admin
    </Button>
  );
}
