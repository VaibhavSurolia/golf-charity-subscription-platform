"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart, Check, ExternalLink, Loader2 } from "lucide-react";
import { selectCharity } from "@/app/dashboard/charity/actions";

interface Charity {
  id: string;
  name: string;
  description: string;
  website: string;
  totalRaised?: number;
}

export function CharitySelector({ 
  charities, 
  currentColorId 
}: { 
  charities: Charity[], 
  currentColorId: string | null 
}) {
  const [selectedId, setSelectedId] = useState(currentColorId);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelect = async (id: string) => {
    setLoading(id);
    try {
      await selectCharity(id);
      setSelectedId(id);
    } catch (error) {
      console.error(error);
      alert("Failed to update charity preference.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {charities.map((charity) => {
        const isSelected = selectedId === charity.id;
        
        return (
          <Card 
            key={charity.id}
            className={`p-6 relative overflow-hidden transition-all duration-300 border-2 ${
              isSelected 
                ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_rgba(52,211,153,0.1)]" 
                : "border-white/5 bg-white/5 hover:border-white/20"
            }`}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center z-10">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            
            <div className="space-y-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                isSelected ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/40"
              }`}>
                <Heart size={24} fill={isSelected ? "currentColor" : "none"} />
              </div>
              
              <div>
                <h3 className="font-bold text-lg">{charity.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md">
                        Community: ${charity.totalRaised?.toLocaleString() || "0"} 
                    </span>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Raised</p>
                </div>
                <p className="text-sm text-white/40 mt-3 leading-relaxed line-clamp-2">
                  {charity.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button 
                  onClick={() => handleSelect(charity.id)}
                  disabled={isSelected || loading !== null}
                  variant={isSelected ? "secondary" : "primary"}
                  className="w-full font-bold h-11"
                >
                  {loading === charity.id ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : isSelected ? (
                    "Actively Supporting"
                  ) : (
                    "Support This Cause"
                  )}
                </Button>
                
                <a 
                  href={charity.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors"
                >
                  Learn More <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
