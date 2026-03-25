"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Upload, Check, Loader2, Camera, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { submitClaim } from "@/app/dashboard/results/claim-actions";

export function WinnerClaimModal({ winnerId }: { winnerId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${winnerId}-${Math.random()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('winner-proofs')
        .upload(filePath, file);

      if (uploadError) throw new Error("Storage upload failed: " + uploadError.message);

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('winner-proofs')
        .getPublicUrl(filePath);

      // 3. Submit Claim via Server Action
      await submitClaim(winnerId, publicUrl);
      
      setDone(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  if (done) {
    return (
      <Card className="p-8 text-center bg-emerald-500/10 border-emerald-500/20">
        <div className="h-16 w-16 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto mb-4 scale-up-center">
          <Check size={32} strokeWidth={3} />
        </div>
        <h3 className="text-xl font-bold">Claim Submitted!</h3>
        <p className="text-sm text-white/60 mt-2">
          An administrator will review your proof. You'll receive a notification once verified.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8 space-y-6 border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Camera size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Verify Your Win</h3>
          <p className="text-xs text-white/40">Upload a photo of your scorecard or GPS tracker proof.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div 
          className={`h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
            file ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"
          }`}
        >
          {file ? (
            <div className="text-center p-4">
               <Check size={32} className="text-emerald-400 mx-auto mb-2" />
               <p className="text-sm font-medium text-white/80">{file.name}</p>
               <button onClick={() => setFile(null)} className="text-[10px] text-rose-400 uppercase tracking-widest mt-2 hover:underline">Remove</button>
            </div>
          ) : (
            <>
              <input 
                type="file" 
                id="proof-upload" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="proof-upload" className="flex flex-col items-center cursor-pointer group">
                 <div className="h-12 w-12 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center mb-3 transition-colors">
                    <Upload size={20} className="text-white/40" />
                 </div>
                 <p className="text-sm font-medium">Click to upload photo</p>
                 <p className="text-[10px] text-white/20 mt-1 uppercase tracking-tighter">JPEG, PNG up to 5MB</p>
              </label>
            </>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <Button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full h-12 font-bold gap-2"
        >
          {uploading ? (
            <><Loader2 size={18} className="animate-spin" /> Uploading...</>
          ) : (
            "Submit Verification Claim"
          )}
        </Button>
      </div>
    </Card>
  );
}
