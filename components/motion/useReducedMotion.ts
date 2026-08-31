"use client";

import { useEffect, useState } from "react";

/**
 * For hand-timed sequences that aren't driven by the Motion library itself
 * (ReasoningSequence step delays, GuidedCursor autoplay pacing). Motion's
 * own animations are covered separately by <MotionConfig reducedMotion="user">
 * in app/layout.tsx.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
