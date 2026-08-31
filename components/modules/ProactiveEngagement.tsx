"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2, Signal, Wifi, BatteryFull } from "lucide-react";
import { proactiveEngagement, customer } from "@/lib/mockData";
import { formatScore } from "@/lib/theme";
import { getRoamingScenario } from "@/lib/roamingScenario";
import { useDemoState, useDemoActions } from "@/lib/demoState";
import { useGuidedTarget } from "@/lib/guidedTargetRegistry";
import { ModuleHeader } from "@/components/ModuleHeader";
import { NumberTransition } from "@/components/motion/NumberTransition";
import { Button } from "@/components/ui/button";

// Cards sit on the page's gray canvas (see app/page.tsx) — white, no stroke.
const CARD = "bg-card rounded-[var(--radius-xl)]";

export function ProactiveEngagement() {
  const { roamingStatus } = useDemoState();
  const { acceptRecommendation } = useDemoActions();
  const activateRef = useGuidedTarget("proactive-activate");

  const scenario = getRoamingScenario(roamingStatus);
  const isBusy = roamingStatus === "accepted";
  const isDone = roamingStatus === "recovered";
  const isAccepted = isBusy || isDone;

  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={6}
        section="ACT"
        title="Proactive Engagement"
        description={`The engine reaches out to ${customer.name} before she has to complain — and offers a fix in one tap.`}
      />

      <div className="flex-1 flex flex-col items-center justify-center py-4 gap-5">
        <div className="relative w-full max-w-[380px] sm:w-[300px] rounded-[2.25rem] bg-[#14182b] p-2.5 shadow-[0_1px_2px_rgba(20,24,43,0.06),0_16px_32px_-16px_rgba(20,24,43,0.35)]">
          <div className="absolute left-1/2 top-3 -translate-x-1/2 h-1.5 w-16 rounded-full bg-black/40 z-10" />
          <div className="rounded-[1.75rem] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[11px] text-muted-foreground">
              <span>21:12</span>
              <div className="flex items-center gap-1">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <BatteryFull className="h-3 w-3" />
              </div>
            </div>

            <div className="flex items-center gap-2 px-5 py-2 border-b border-border">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground text-xs font-semibold">
                EE
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Experience Engine</div>
                <div className="text-[11px] text-muted-foreground">Proactive support</div>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-2.5 px-4 py-4 min-h-[460px] sm:min-h-[380px]">
              {proactiveEngagement.messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.25 }}
                  className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-2.5 text-sm text-foreground/90"
                >
                  {msg.text}
                </motion.div>
              ))}

              <AnimatePresence>
                {isAccepted && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-brand px-3.5 py-2.5 text-sm text-brand-foreground flex items-center gap-1.5"
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 shrink-0" /> Pass activated
                      </>
                    ) : (
                      <>
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> Switching network…
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-4 pb-5 pt-2">
              <Button
                ref={activateRef as React.Ref<HTMLButtonElement>}
                onClick={acceptRecommendation}
                disabled={isAccepted}
                className="w-full"
                variant={isAccepted ? "secondary" : "default"}
              >
                {isDone ? "Activated" : isBusy ? "Activating…" : proactiveEngagement.cta}
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Recovered score — a floating side card, same treatment as the
          Customer Journey Map's detail panel: fixed beside the phone so it
          never affects the phone's own centering, with a bottom-card
          fallback below the lg breakpoint. */}
      <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 w-72 hidden lg:block pointer-events-none">
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25 }}
              className={`${CARD} p-5 shadow-lg`}
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                Experience recovered
              </div>
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <span className="text-muted-foreground font-mono text-xl">2.4</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-mono text-brand">
                  <NumberTransition value={scenario.score} format={formatScore} />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed left-1/2 bottom-24 z-30 -translate-x-1/2 w-full max-w-sm px-4 lg:hidden pointer-events-none">
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className={`${CARD} p-5 shadow-lg`}
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                Experience recovered
              </div>
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <span className="text-muted-foreground font-mono text-xl">2.4</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-mono text-brand">
                  <NumberTransition value={scenario.score} format={formatScore} />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
