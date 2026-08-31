"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/BottomNav";
import { PresentationControls } from "@/components/PresentationControls";
import { GuidedCursor } from "@/components/motion/GuidedCursor";
import { Intro } from "@/components/scenes/Intro";
import { Closing } from "@/components/scenes/Closing";
import { DemoProvider, useDemoState, useDemoActions } from "@/lib/demoState";
import { modules, type ModuleId } from "@/lib/mockData";
import { JourneyMap } from "@/components/modules/JourneyMap";
import { ExperienceTimeline } from "@/components/modules/ExperienceTimeline";
import { AgentDesk } from "@/components/modules/AgentDesk";
import { ExperienceIntelligence } from "@/components/modules/ExperienceIntelligence";
import { RoamingInsights } from "@/components/modules/RoamingInsights";
import { ProactiveEngagement } from "@/components/modules/ProactiveEngagement";
import { NetworkInvestmentMap } from "@/components/modules/NetworkInvestmentMap";

const moduleComponents: Record<ModuleId, React.ComponentType> = {
  "journey-map": JourneyMap,
  "experience-timeline": ExperienceTimeline,
  "agent-desk": AgentDesk,
  "experience-intelligence": ExperienceIntelligence,
  "roaming-insights": RoamingInsights,
  "proactive-engagement": ProactiveEngagement,
  "network-investment-map": NetworkInvestmentMap,
};

export default function Home() {
  return (
    <DemoProvider>
      <HomeShell />
    </DemoProvider>
  );
}

function HomeShell() {
  const { scene, activeModule } = useDemoState();
  const { setScene, setIntroStep, goToModule } = useDemoActions();

  // The page background (e.g. Agent Desk's gray canvas) only updates once
  // the outgoing module has fully exited — swapping it the instant
  // `activeModule` changes would show the still-fading-out old module
  // sitting on the new module's background for a moment.
  const [bgTarget, setBgTarget] = useState(activeModule);

  // Stepping "back" off the first module returns to the Meet Anna intro
  // step (the true previous screen in the pitch), rather than wrapping
  // around to the last module.
  const goBack = useCallback(() => {
    const index = modules.findIndex((m) => m.id === activeModule);
    if (index === 0) {
      setIntroStep("anna");
      setScene("intro");
      return;
    }
    goToModule(modules[index - 1].id);
  }, [activeModule, goToModule, setIntroStep, setScene]);

  const goForward = useCallback(() => {
    const index = modules.findIndex((m) => m.id === activeModule);
    const nextIndex = (index + 1) % modules.length;
    goToModule(modules[nextIndex].id);
  }, [activeModule, goToModule]);

  // Arrow-key navigation only applies once inside the app shell. (A real
  // arrow-key press during guided playback also interrupts it — see the
  // capture-phase listener in GuidedCursor, which fires first.)
  useEffect(() => {
    if (scene !== "app") return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goForward();
      if (e.key === "ArrowLeft") goBack();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scene, goBack, goForward]);

  if (scene === "intro") {
    return <Intro onComplete={() => setScene("app")} />;
  }

  if (scene === "closing") {
    return <Closing onReturn={() => setScene("app")} />;
  }

  const ActiveModule = moduleComponents[activeModule];

  return (
    <div className="min-h-screen w-full">
      <button
        type="button"
        onClick={() => {
          setIntroStep("title");
          setScene("intro");
        }}
        title="Return to the opening screen"
        className="fixed top-4 left-4 md:top-6 md:left-6 z-30 text-sm font-medium tracking-wide text-brand hover:opacity-80 transition-opacity"
      >
        EXPERIENCE ENGINE
      </button>

      <main
        className={cn(
          "min-h-screen overflow-y-auto px-4 md:px-8 lg:px-10 pt-12 md:pt-14 pb-32",
          (bgTarget === "agent-desk" ||
            bgTarget === "experience-intelligence" ||
            bgTarget === "roaming-insights" ||
            bgTarget === "proactive-engagement") &&
            "bg-muted"
        )}
      >
        <div className="mx-auto w-full max-w-6xl">
          <AnimatePresence mode="wait" onExitComplete={() => setBgTarget(activeModule)}>
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <ActiveModule />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <BottomNav active={activeModule} onSelect={goToModule} onPrev={goBack} onNext={goForward} />
      <GuidedCursor />
      <PresentationControls />
    </div>
  );
}
