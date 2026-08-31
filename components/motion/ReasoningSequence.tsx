"use client";

import { cn } from "@/lib/utils";
import { RevealSequence } from "./RevealSequence";

export type ReasoningStep = { label: string; emphasis?: boolean };

type ReasoningSequenceProps = {
  steps: ReasoningStep[];
  active: boolean;
  onComplete?: () => void;
  className?: string;
};

/**
 * The "AI is thinking" chain — signals → anomaly → context → root cause →
 * recommendation — as a short, presentation-friendly stepper. The last step
 * (the recommendation) gets emphasis styling automatically.
 */
export function ReasoningSequence({ steps, active, onComplete, className }: ReasoningSequenceProps) {
  return (
    <RevealSequence
      active={active}
      onComplete={onComplete}
      staggerMs={320}
      className={cn("flex flex-col", className)}
      items={steps.map((step, i) => ({
        key: step.label,
        content: (
          <div className="flex items-start gap-2.5">
            <div className="flex flex-col items-center pt-0.5 self-stretch">
              <span
                className={cn(
                  "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[9px] font-medium",
                  step.emphasis ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </span>
              {i < steps.length - 1 && (
                <span className="w-px flex-1 bg-border mt-1" aria-hidden="true" />
              )}
            </div>
            <p
              className={cn(
                "text-xs pb-2.5",
                step.emphasis ? "font-semibold text-brand" : "text-foreground/90"
              )}
            >
              {step.label}
            </p>
          </div>
        ),
      }))}
    />
  );
}
