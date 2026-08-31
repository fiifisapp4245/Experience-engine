"use client";

import { motion, AnimatePresence } from "motion/react";
import { customer } from "@/lib/mockData";
import { useDemoState, useDemoActions } from "@/lib/demoState";
import { Button } from "@/components/ui/button";
import { RevealSequence } from "@/components/motion/RevealSequence";

const TITLE_LINES = ["One customer.", "One experience.", "Every moment. Every network."];

type IntroProps = {
  onComplete: () => void;
};

/**
 * The opening state: a title card, then a "Meet Anna" bio card, before the
 * presenter enters the module app. `introStep` lives in shared state (not
 * local) so navigating back from the first module can land precisely on
 * the "anna" step instead of always resetting to "title" — see
 * app/page.tsx's goBack.
 */
export function Intro({ onComplete }: IntroProps) {
  const { introStep: step } = useDemoState();
  const { setIntroStep } = useDemoActions();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-16">
      <AnimatePresence mode="wait">
        {step === "title" ? (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl text-center"
          >
            <div className="text-sm font-medium tracking-[0.2em] text-brand mb-6">
              EXPERIENCE ENGINE
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight">
              <RevealSequence
                active
                staggerMs={260}
                itemClassName="block"
                items={TITLE_LINES.map((line) => ({ key: line, content: line }))}
              />
            </h1>
            <p className="mt-6 text-lg text-brand font-medium">Driven by AI.</p>
            <p className="mt-8 text-xs text-muted-foreground uppercase tracking-widest">
              The customer experience journey — powered by CXI
            </p>
            <Button size="lg" className="mt-10" onClick={() => setIntroStep("anna")}>
              Start Experience
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="anna"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full glow-card p-8 text-center"
          >
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Meet</div>
            <img
              src="/anna.png"
              alt={customer.fullName}
              className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
            />
            <h2 className="text-2xl font-semibold text-foreground">{customer.fullName}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {customer.age} · {customer.city} · {customer.lifestyle}
            </p>
            <p className="text-sm text-foreground/80 mt-6">
              Anna isn&rsquo;t logging into a dashboard. She&rsquo;s the customer whose experience the
              Experience Engine continuously understands — across every service, every moment.
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button size="lg" variant="outline" onClick={() => setIntroStep("title")}>
                Back
              </Button>
              <Button size="lg" onClick={onComplete}>
                Begin the journey
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
