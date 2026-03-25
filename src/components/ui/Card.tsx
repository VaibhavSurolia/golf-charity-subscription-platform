"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-white/10 overflow-hidden relative",
          glass ? "bg-white/5 backdrop-blur-lg shadow-xl" : "bg-black/40",
          className
        )}
        {...props}
      >
        {/* Subtle top glare effect */}
        {glass && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
Card.displayName = "Card";
