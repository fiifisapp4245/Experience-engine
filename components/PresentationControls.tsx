"use client";

import { Pause, Play, X } from "lucide-react";
import { useDemoState, useDemoActions, useGuidedPlaybackState } from "@/lib/demoState";
import { goldenPath } from "@/lib/goldenPath";

/** The Guided Demo toggle, and — while active — a minimal step indicator with pause/exit. */
export function PresentationControls() {
  const { demoMode } = useDemoState();
  const { stepIndex, isPaused } = useGuidedPlaybackState();
  const { startGuided, stopGuided, setGuidedPaused } = useDemoActions();

  if (demoMode !== "guided") {
    return (
      <button
        type="button"
        onClick={startGuided}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full glow-card glow-card-brand px-4 py-2 text-sm font-medium text-brand shadow-lg hover:bg-accent transition-colors"
      >
        <Play className="h-3.5 w-3.5" /> Guided Demo
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full glow-card glow-card-brand px-3 py-2 shadow-lg">
      <span className="text-xs font-medium text-muted-foreground px-1 whitespace-nowrap">
        Step {stepIndex + 1}/{goldenPath.length}
      </span>
      <button
        type="button"
        onClick={() => setGuidedPaused(!isPaused)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-foreground hover:bg-accent transition-colors"
        aria-label={isPaused ? "Resume guided demo" : "Pause guided demo"}
      >
        {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        onClick={stopGuided}
        className="flex h-7 w-7 items-center justify-center rounded-full text-foreground hover:bg-accent transition-colors"
        aria-label="Exit guided demo"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
