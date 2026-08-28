"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ModuleRail } from "@/components/ModuleRail";
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
  const [active, setActive] = useState<ModuleId>("journey-map");

  const goToOffset = useCallback((offset: number) => {
    setActive((current) => {
      const index = modules.findIndex((m) => m.id === current);
      const nextIndex = (index + offset + modules.length) % modules.length;
      return modules[nextIndex].id;
    });
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goToOffset(1);
      if (e.key === "ArrowLeft") goToOffset(-1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToOffset]);

  const ActiveModule = moduleComponents[active];

  return (
    <div className="flex min-h-screen w-full">
      <ModuleRail active={active} onSelect={setActive} />
      <main className="flex-1 min-w-0 overflow-y-auto px-4 md:px-8 lg:px-10 py-6 md:py-10 pb-24 md:pb-10">
        <div className="mx-auto w-full max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
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
    </div>
  );
}
