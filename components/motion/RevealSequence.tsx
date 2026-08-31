"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "./useReducedMotion";

export type RevealItem = { key: string; content: React.ReactNode; style?: React.CSSProperties };

type RevealSequenceProps = {
  items: RevealItem[];
  active: boolean;
  staggerMs?: number;
  onComplete?: () => void;
  className?: string;
  itemClassName?: string;
};

/**
 * Generic staggered/sequential reveal — the base primitive behind
 * ReasoningSequence and the Network Investment Map zoom-in. Reduced-motion
 * users get every item at once and an immediate onComplete.
 */
export function RevealSequence({
  items,
  active,
  staggerMs = 260,
  onComplete,
  className,
  itemClassName,
}: RevealSequenceProps) {
  const reducedMotion = useReducedMotion();
  const effectiveStagger = reducedMotion ? 0 : staggerMs;

  useEffect(() => {
    if (!active) return;
    const total = effectiveStagger * Math.max(items.length - 1, 0) + (reducedMotion ? 0 : 400);
    const timer = setTimeout(() => onComplete?.(), total);
    return () => clearTimeout(timer);
    // Only re-run when the sequence is (re)started or its shape changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, items.length, effectiveStagger]);

  if (!active) return null;

  return (
    <div className={className}>
      {items.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: (i * effectiveStagger) / 1000,
            duration: reducedMotion ? 0.01 : 0.32,
          }}
          className={itemClassName}
          style={item.style}
        >
          {item.content}
        </motion.div>
      ))}
    </div>
  );
}
