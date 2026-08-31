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
  const { scene, activeModule, introStep } = useDemoState();
  const { setScene, setIntroStep, goToModule } = useDemoActions();

  // The page background (e.g. Agent Desk's gray canvas) only updates once
  // the outgoing module has fully exited — swapping it the instant
  // `activeModule` changes would show the still-fading-out old module
  // sitting on the new module's background for a moment.
  const [bgTarget, setBgTarget] = useState(activeModule);

  // The bottom nav is mounted for the whole pitch — intro and closing
  // included — so "back"/"forward" form one continuous loop: intro → every
  // module in order → closing → back to intro (and the reverse).
  const goBack = useCallback(() => {
    if (scene === "intro") {
      // The intro has its own two steps (title → anna) before the app
      // proper — "back" should walk through those first, same as its own
      // internal Back button, rather than jumping straight to closing.
      if (introStep === "anna") {
        setIntroStep("title");
      } else {
        setScene("closing");
      }
      return;
    }
    if (scene === "closing") {
      setScene("app");
      goToModule(modules[modules.length - 1].id);
      return;
    }
    const index = modules.findIndex((m) => m.id === activeModule);
    if (index === 0) {
      setIntroStep("anna");
      setScene("intro");
      return;
    }
    goToModule(modules[index - 1].id);
  }, [scene, introStep, activeModule, goToModule, setIntroStep, setScene]);

  const goForward = useCallback(() => {
    if (scene === "intro") {
      if (introStep === "title") {
        setIntroStep("anna");
      } else {
        setScene("app");
        goToModule(modules[0].id);
      }
      return;
    }
    if (scene === "closing") {
      setIntroStep("title");
      setScene("intro");
      return;
    }
    const index = modules.findIndex((m) => m.id === activeModule);
    if (index === modules.length - 1) {
      setScene("closing");
      return;
    }
    goToModule(modules[index + 1].id);
  }, [scene, introStep, activeModule, goToModule, setIntroStep, setScene]);

  // Picking a module directly from the nav while on the intro/closing
  // screens jumps straight into the app rather than requiring a detour
  // through "Start Experience" first.
  const selectModule = useCallback(
    (id: ModuleId) => {
      if (scene !== "app") setScene("app");
      goToModule(id);
    },
    [scene, goToModule, setScene]
  );

  // Arrow-key navigation mirrors the nav — available on every screen. (A
  // real arrow-key press during guided playback also interrupts it — see
  // the capture-phase listener in GuidedCursor, which fires first.)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goForward();
      if (e.key === "ArrowLeft") goBack();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goBack, goForward]);

  const ActiveModule = moduleComponents[activeModule];

  return (
    <div className="min-h-screen w-full">
      {scene === "app" && (
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
      )}

      {scene === "intro" && <Intro onComplete={() => setScene("app")} />}
      {scene === "closing" && <Closing onReturn={() => setScene("app")} />}

      {scene === "app" && (
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
      )}

      <BottomNav active={activeModule} onSelect={selectModule} onPrev={goBack} onNext={goForward} />
      {scene === "app" && (
        <>
          <GuidedCursor />
          <PresentationControls />
        </>
      )}
    </div>
  );
}
