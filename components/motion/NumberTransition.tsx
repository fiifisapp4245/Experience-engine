"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { useReducedMotion } from "./useReducedMotion";

type NumberTransitionProps = {
  value: number;
  /** If provided, animates from this value up/down to `value` on mount too. */
  from?: number;
  format?: (n: number) => string;
  durationSec?: number;
  className?: string;
};

/**
 * Animated count-up/down for score changes (e.g. 2.4 → 4.1). Pass `from` to
 * also count up from that value the moment this mounts (e.g. `from={0}` for
 * a "counting up" reveal on first render), not just on later prop changes.
 *
 * Reads the current `display` value via a ref (synced in its own no-deps
 * effect after every render) rather than mutating a separate "last handled
 * value" ref inside the animation effect body — React 18 Strict Mode
 * double-invokes mount effects in dev, and mutating that ref before the
 * animation actually finished caused the second invocation to see
 * "already at target" and no-op, leaving the number stuck at `from` forever.
 */
export function NumberTransition({
  value,
  from,
  format,
  durationSec = 0.8,
  className,
}: NumberTransitionProps) {
  const [display, setDisplay] = useState(from ?? value);
  const reducedMotion = useReducedMotion();

  const displayRef = useRef(display);
  useEffect(() => {
    displayRef.current = display;
  });

  useEffect(() => {
    if (reducedMotion) return; // shown value falls back to `value` directly below
    if (displayRef.current === value) return;

    const controls = animate(displayRef.current, value, {
      duration: durationSec,
      ease: "easeOut",
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [value, durationSec, reducedMotion]);

  const shown = reducedMotion ? value : display;
  const formatted = format ? format(shown) : shown.toFixed(1);

  return <span className={className}>{formatted}</span>;
}
