"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDemoState, useDemoActions, useGuidedPlaybackState } from "@/lib/demoState";
import { waitForGuidedTarget } from "@/lib/guidedTargetRegistry";
import { goldenPath, DEFAULT_STEP_HOLD_MS } from "@/lib/goldenPath";
import { useReducedMotion } from "./useReducedMotion";

const MODULE_SETTLE_MS = 520;
const SCENE_SETTLE_MS = 520;
const CURSOR_TRAVEL_MS = 700;
const AFTER_CLICK_MS = 500;
const RIPPLE_MS = 500;

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * A subtle simulated cursor that drives the golden path: navigates modules,
 * finds real interactive targets via the guided-target registry, and clicks
 * them for real — so the same code path a presenter's own click takes.
 *
 * The cursor's pixel position is local component state, never shared
 * context — it only changes once per step, not per animation frame.
 */
export function GuidedCursor() {
  const { demoMode } = useDemoState();
  const { goToModule, setScene, setGuidedStep, stopGuided } = useDemoActions();
  const { isPaused } = useGuidedPlaybackState();
  const reducedMotion = useReducedMotion();

  const [caption, setCaption] = useState<string | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const visible = demoMode === "guided";

  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // A real user pointerdown or arrow-key press interrupts guided mode.
  // The runtime's own programmatic `.click()` below never fires pointerdown,
  // so there's no ambiguity between "presenter took over" and "the cursor
  // itself acted."
  useEffect(() => {
    function onPointerDown() {
      if (demoMode === "guided") stopGuided();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (demoMode === "guided" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        stopGuided();
      }
    }
    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [demoMode, stopGuided]);

  useEffect(() => {
    if (demoMode !== "guided") return;

    let cancelled = false;

    async function waitUntilResumed() {
      while (!cancelled && isPausedRef.current) {
        await wait(150);
      }
    }

    async function run() {
      for (let i = 0; i < goldenPath.length; i++) {
        if (cancelled) return;
        await waitUntilResumed();
        if (cancelled) return;

        const step = goldenPath[i];
        setGuidedStep(i);
        setCaption(step.caption);

        if (step.kind === "navigate") {
          setTargetRect(null);
          goToModule(step.module);
          await wait(reducedMotion ? 80 : MODULE_SETTLE_MS);
        } else if (step.kind === "scene") {
          setTargetRect(null);
          setScene(step.scene);
          await wait(reducedMotion ? 80 : SCENE_SETTLE_MS);
        } else if (step.kind === "act") {
          try {
            const el = await waitForGuidedTarget(step.targetId);
            if (cancelled) return;
            el.scrollIntoView({ block: "center", behavior: reducedMotion ? "auto" : "smooth" });
            await wait(reducedMotion ? 20 : 260);
            if (cancelled) return;
            const rect = el.getBoundingClientRect();
            setTargetRect(rect);
            await wait(reducedMotion ? 20 : CURSOR_TRAVEL_MS);
            if (cancelled) return;
            setRippleKey((k) => k + 1);
            await wait(reducedMotion ? 20 : RIPPLE_MS);
            if (cancelled) return;
            el.click();
            await wait(reducedMotion ? 40 : AFTER_CLICK_MS);
          } catch {
            // Target never appeared in time — skip rather than stalling the demo.
          }
        }

        if (cancelled) return;
        await wait(step.holdMs ?? DEFAULT_STEP_HOLD_MS);
      }

      if (!cancelled) stopGuided();
    }

    run();

    return () => {
      cancelled = true;
      setCaption(null);
      setTargetRect(null);
    };
    // Intentionally only restart when demoMode flips — the loop tracks its
    // own step index locally so it isn't retriggered by every setGuidedStep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode]);

  if (!visible) return null;

  return (
    <>
      <AnimatePresence>
        {caption && (
          <motion.div
            key={caption}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] max-w-lg rounded-full glow-card glow-card-brand px-5 py-2.5 text-sm font-medium text-foreground shadow-lg pointer-events-none text-center"
          >
            {caption}
          </motion.div>
        )}
      </AnimatePresence>

      {targetRect && (
        <motion.div
          className="fixed z-[70] pointer-events-none"
          animate={{
            left: targetRect.left + targetRect.width / 2 - 8,
            top: targetRect.top + targetRect.height / 2 - 8,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        >
          <span className="block h-4 w-4 rounded-full bg-brand shadow-[0_0_0_4px_rgba(226,0,116,0.18)]" />
          <AnimatePresence>
            {rippleKey > 0 && (
              <motion.span
                key={rippleKey}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand"
                initial={{ width: 16, height: 16, opacity: 0.8 }}
                animate={{ width: 44, height: 44, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
