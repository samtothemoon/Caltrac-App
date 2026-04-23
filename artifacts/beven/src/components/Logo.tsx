import React from "react";
import { cn } from "@/lib/utils";
import { Apple } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: "default" | "white" | "cyan";
}

export function Logo({ className, showText = true, variant = "default" }: LogoProps) {
  const colors = {
    default: {
      bg: "bg-primary",
      icon: "white",
      text: "text-foreground",
    },
    white: {
      bg: "bg-white",
      icon: "hsl(var(--primary))",
      text: "text-primary",
    },
    cyan: {
      bg: "bg-secondary",
      icon: "white",
      text: "text-secondary",
    },
  };

  const current = colors[variant];

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className={cn("w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/20 border-4 border-white/20", current.bg)}>
        <Apple className={cn("w-16 h-16", variant === "white" ? "text-primary" : "text-white")} strokeWidth={1.5} />
      </div>
      {showText && (
        <div className="text-center space-y-1">
          <span className={cn("text-4xl font-bold tracking-tighter block", current.text)}>
            Health
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
            Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
