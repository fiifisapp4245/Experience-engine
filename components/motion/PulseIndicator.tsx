"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type PulseIndicatorProps = {
  color: string;
  size?: number;
  className?: string;
};

/** Reusable pulsing dot for "degraded"/"live" states. */
export function PulseIndicator({ color, size = 8, className }: PulseIndicatorProps) {
  const haloSize = size * 2.6;
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ height: haloSize, width: haloSize }}
    >
      <motion.span
        className="absolute rounded-full"
        style={{ backgroundColor: color, height: haloSize, width: haloSize }}
        initial={{ opacity: 0.35, scale: 0.6 }}
        animate={{ opacity: 0, scale: 1.4 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative rounded-full" style={{ backgroundColor: color, height: size, width: size }} />
    </span>
  );
}
