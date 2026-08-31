"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { RevealSequence } from "@/components/motion/RevealSequence";

const LOOP_STEPS = ["COLLECT", "UNDERSTAND", "DECIDE", "ACT", "MEASURE"];

type ClosingProps = {
  onReturn: () => void;
};

export function Closing({ onReturn }: ClosingProps) {
  const [showTagline, setShowTagline] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
        The Experience Engine — closed loop
      </div>

      <RevealSequence
        active
        staggerMs={260}
        onComplete={() => setShowTagline(true)}
        className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-2xl"
        items={LOOP_STEPS.map((step, i) => ({
          key: step,
          content: (
            <div className="flex items-center gap-3">
              <span className="glow-card glow-card-brand px-5 py-2.5 text-sm font-semibold text-brand tracking-wide">
                {step}
              </span>
              <span className="text-muted-foreground" aria-hidden="true">
                {i < LOOP_STEPS.length - 1 ? "→" : "↺"}
              </span>
            </div>
          ),
        }))}
      />

      {showTagline && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-lg text-foreground font-medium mb-2">One continuous loop.</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug">
            Better experience.
            <br />
            Better business.
            <br />
            Better future.
          </h2>
          <p className="mt-6 text-sm text-brand font-medium tracking-wide">
            One customer. One experience. Every moment. Every network. Driven by AI.
          </p>
          <Button size="lg" variant="secondary" className="mt-10" onClick={onReturn}>
            Return to demo
          </Button>
        </motion.div>
      )}
    </div>
  );
}
