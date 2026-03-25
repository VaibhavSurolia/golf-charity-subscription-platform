"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Listens for real-time updates to the winners table and refreshes the page
 * when a status changes (e.g., from 'pending' to 'verified').
 */
export function RealtimeWinnerListener({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('realtime_winners')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'winners',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          // Refresh the server component data
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, router]);

  return null;
}
