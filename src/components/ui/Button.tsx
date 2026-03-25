"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-white text-black hover:bg-gray-200 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]",
      secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-md",
      outline: "border-2 border-white/20 text-white hover:border-white/40 bg-transparent",
      ghost: "text-white/70 hover:text-white hover:bg-white/10 bg-transparent",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-8 text-sm",
      lg: "h-14 px-10 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// Motion wrapped button for easy animations
export const MotionButton = motion(Button as React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>);
