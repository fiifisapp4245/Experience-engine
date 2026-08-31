"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { RevealSequence } from "@/components/motion/RevealSequence";

const LOOP_STEPS = ["COLLECT", "UNDERSTAND", "DECIDE", "ACT", "MEASURE"];
const TAGLINE_LINES = ["Better experience.", "Better business.", "Better future."];
const RADIUS_PERCENT = 34;

function nodePosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + RADIUS_PERCENT * Math.cos(angle),
    y: 50 + RADIUS_PERCENT * Math.sin(angle),
  };
}

type ClosingProps = {
  onReturn: () => void;
};

export function Closing({ onReturn }: ClosingProps) {
  const [showTagline, setShowTagline] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
        The Experience Engine — closed loop
      </div>

      <div className="relative w-full max-w-md aspect-square">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          <circle
            cx={50}
            cy={50}
            r={RADIUS_PERCENT}
            fill="none"
            stroke="var(--border)"
            strokeWidth={0.5}
            strokeDasharray="1.6 1.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <RevealSequence
          active
          staggerMs={260}
          onComplete={() => setShowTagline(true)}
          items={LOOP_STEPS.map((step, i) => {
            const { x, y } = nodePosition(i, LOOP_STEPS.length);
            return {
              key: step,
              style: {
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                translate: "-50% -50%",
              },
              content: (
                <span className="inline-block rounded-full bg-brand text-brand-foreground text-[11px] font-semibold px-3.5 py-2 tracking-wide whitespace-nowrap shadow-sm">
                  {step}
                </span>
              ),
            };
          })}
        />

        <div className="absolute inset-0 flex items-center justify-center px-12">
          {showTagline && (
            <RevealSequence
              active
              staggerMs={220}
              itemClassName="text-base md:text-lg font-semibold text-foreground leading-snug"
              items={TAGLINE_LINES.map((line) => ({ key: line, content: line }))}
            />
          )}
        </div>
      </div>

      {showTagline && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-6"
        >
          <p className="text-sm text-muted-foreground mb-2">One continuous loop.</p>
          <p className="text-sm text-brand font-medium tracking-wide">
            One customer. One experience. Every moment. Every network. Driven by AI.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" onClick={onReturn}>
            Return to demo
          </Button>
        </motion.div>
      )}
    </div>
  );
}
