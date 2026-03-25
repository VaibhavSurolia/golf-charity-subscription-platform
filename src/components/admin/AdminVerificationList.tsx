"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, X, Loader2, MessageSquare } from "lucide-react";
import { verifyWinner } from "@/app/admin/verifications/actions";

interface Winner {
  id: string;
  user_id: string;
  match_count: number;
  prize_won: number;
  proof_url: string;
  verification_status: string;
  created_at: string;
  users: {
    name: string;
    email: string;
  } | {
    name: string;
    email: string;
  }[];
}

export function AdminVerificationList({ initialWinners }: { initialWinners: any[] }) {
  const [winners, setWinners] = useState<Winner[]>(initialWinners);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [comment, setComment] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVerify = async (id: string, status: 'verified' | 'rejected') => {
    setLoadingId(id + status);
    try {
      await verifyWinner(id, status, comment[id]);
      setWinners(prev => prev.filter(w => w.id !== id)); // Remove from pending list
    } catch (error) {
      alert("Verification failed: " + (error as Error).message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* FULLSIZE IMAGE MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-10 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <img src={selectedImage} alt="Fullscreen Proof" className="rounded-2xl shadow-2xl" />
            <button 
              className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold hover:text-emerald-400"
              onClick={() => setSelectedImage(null)}
            >
              <X size={20} /> Close Preview
            </button>
          </div>
        </div>
      )}

      {winners.length === 0 ? (
        <Card className="p-12 text-center text-white/20 border-dashed border-white/5">
           No pending verifications. All clear!
        </Card>
      ) : (
        winners.map((winner) => (
          <Card key={winner.id} className="p-6 bg-white/5 border-white/10">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Proof Thumbnail */}
              <div 
                className="w-full md:w-48 h-48 rounded-2xl bg-black border border-white/10 overflow-hidden relative group cursor-zoom-in"
                onClick={() => winner.proof_url && setSelectedImage(winner.proof_url)}
              >
                {winner.proof_url ? (
                  <>
                    <img 
                      src={winner.proof_url} 
                      alt="Proof" 
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(winner.proof_url); }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold gap-2"
                    >
                      🔍 View Fullscreen
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs italic text-center p-4">
                    No proof uploaded yet
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {Array.isArray(winner.users) ? winner.users[0]?.name : winner.users?.name || "Unknown User"}
                    </h3>
                    <p className="text-sm text-white/40">
                      {Array.isArray(winner.users) ? winner.users[0]?.email : winner.users?.email || "No Email"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Prize Claimed</p>
                    <p className="text-2xl font-black text-emerald-400">${Number(winner.prize_won).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                   <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-tighter">Match Count</p>
                      <p className="text-sm font-bold text-indigo-400">{winner.match_count} Numbers</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-tighter">Claim Date</p>
                      <p className="text-sm font-bold">{mounted ? new Date(winner.created_at).toLocaleDateString() : "..."}</p>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3 top-3.5 text-white/20" />
                    <input 
                      type="text"
                      placeholder="Add admin note (e.g. why rejected)..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                      value={comment[winner.id] || ""}
                      onChange={(e) => setComment({ ...comment, [winner.id]: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleVerify(winner.id, 'verified')}
                      disabled={loadingId !== null}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black border-none flex-1 font-bold gap-2"
                    >
                      {loadingId === winner.id + 'verified' ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Approve</>}
                    </Button>
                    <Button 
                      onClick={() => handleVerify(winner.id, 'rejected')}
                      disabled={loadingId !== null}
                      variant="outline"
                      className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 flex-1 font-bold gap-2"
                    >
                      {loadingId === winner.id + 'rejected' ? <Loader2 size={18} className="animate-spin" /> : <><X size={18} /> Reject</>}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
