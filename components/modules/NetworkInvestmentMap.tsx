"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { investmentAreas, type InvestmentArea } from "@/lib/mockData";
import { statusColor, type ExperienceStatus } from "@/lib/theme";
import { ModuleHeader } from "@/components/ModuleHeader";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/utils";

const impactStatus: Record<InvestmentArea["impact"], ExperienceStatus> = {
  High: "poor",
  Medium: "warning",
  Low: "good",
};

const ZOOM_BEATS = [
  "ANNA",
  "ONE CUSTOMER",
  "EXPERIENCE SIGNAL",
  "THOUSANDS OF SIGNALS",
  "PATTERNS EMERGE",
];

// Milan Central — Anna's own roaming incident is part of this cluster. The
// zoom-out dot travels from "her" to this marker's real position, reusing
// the map's own percentage coordinate space (see plan decision #10).
const ANNA_AREA_ID = "area-1";

export function NetworkInvestmentMap() {
  const [phase, setPhase] = useState<"intro" | "map">("intro");
  const [beatIndex, setBeatIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(investmentAreas[0]?.id ?? null);
  const selected = investmentAreas.find((a) => a.id === selectedId) ?? null;
  const annaArea = investmentAreas.find((a) => a.id === ANNA_AREA_ID) ?? investmentAreas[0];
  const reducedMotion = useReducedMotion();

  // Beats replace each other one at a time rather than accumulating.
  useEffect(() => {
    if (phase !== "intro") return;
    const isLastBeat = beatIndex >= ZOOM_BEATS.length - 1;
    const delay = reducedMotion ? 60 : isLastBeat ? 500 : 420;
    const timer = setTimeout(() => {
      if (isLastBeat) setPhase("map");
      else setBeatIndex((i) => i + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [phase, beatIndex, reducedMotion]);

  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={7}
        section="SCALE"
        title="Network Investment Map"
        description="Where degraded experience clusters geographically, and where investment is planned in response."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div
          className="relative glow-card aspect-[4/3] overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,24,43,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,24,43,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          <AnimatePresence>
            {phase === "intro" && (
              <motion.div
                key="zoom-intro"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-background/80"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ZOOM_BEATS[beatIndex]}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: reducedMotion ? 0.01 : 0.25 }}
                    className="text-sm md:text-base font-medium tracking-widest text-muted-foreground"
                  >
                    {ZOOM_BEATS[beatIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The "Anna" dot — travels from center to her own cluster, then fades as the aggregate view takes over. */}
          <motion.div
            className="absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
            style={{ boxShadow: "0 0 0 4px rgba(226,0,116,0.18)" }}
            initial={{ left: "50%", top: "50%", opacity: 1 }}
            animate={{
              left: `${annaArea.x}%`,
              top: `${annaArea.y}%`,
              opacity: phase === "map" ? 0 : 1,
            }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "map" ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {investmentAreas.map((area) => {
              const color = statusColor[impactStatus[area.impact]];
              const isSelected = area.id === selectedId;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedId(area.id)}
                  style={{ left: `${area.x}%`, top: `${area.y}%` }}
                  aria-pressed={isSelected}
                  disabled={phase !== "map"}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                >
                  <span
                    className="absolute rounded-full animate-pulse"
                    style={{
                      height: isSelected ? 56 : 40,
                      width: isSelected ? 56 : 40,
                      backgroundColor: `${color}25`,
                    }}
                  />
                  <span
                    className={cn(
                      "relative h-3.5 w-3.5 rounded-full border-2 border-background transition-transform",
                      isSelected && "scale-125"
                    )}
                    style={{ backgroundColor: color, boxShadow: "0 1px 3px rgba(20,24,43,0.25)" }}
                  />
                </button>
              );
            })}

            <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-surface/80 backdrop-blur-sm px-3 py-1.5 text-[11px] text-muted-foreground">
              {(["High", "Medium", "Low"] as const).map((impact) => (
                <span key={impact} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: statusColor[impactStatus[impact]] }}
                  />
                  {impact}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="glow-card p-5 min-h-[220px]">
          <AnimatePresence mode="wait">
            {phase === "intro" ? (
              <div
                key="intro-panel"
                className="flex items-center justify-center h-full text-sm text-muted-foreground text-center px-4"
              >
                What Telekom learns when one customer&rsquo;s experience becomes a pattern.
              </div>
            ) : selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">{selected.name}</h2>
                  <span
                    className="text-xs font-medium rounded-full px-2 py-0.5"
                    style={{
                      color: statusColor[impactStatus[selected.impact]],
                      backgroundColor: `${statusColor[impactStatus[selected.impact]]}1a`,
                    }}
                  >
                    {selected.impact} impact
                  </span>
                </div>
                <div className="text-3xl font-semibold text-foreground mb-1">
                  {selected.customers.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  customers · {selected.poorExperienceCustomers.toLocaleString()} with poor experience
                </div>

                <dl className="space-y-2 text-sm border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Experience gap</dt>
                    <dd className="font-medium text-poor">{selected.experienceGapPercent}%</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Revenue impact</dt>
                    <dd className="font-medium text-foreground">{selected.revenueImpact}</dd>
                  </div>
                </dl>

                <div className="border-t border-border pt-3 mt-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    AI recommendation
                  </div>
                  <p className="text-sm text-foreground/90">{selected.aiRecommendation}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selected.investment}</p>
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
                    Expected impact
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-good">{selected.expectedImpact.scoreDelta} score</span>
                    <span className="text-good">{selected.expectedImpact.churnDelta} churn</span>
                    <span className="text-brand">{selected.expectedImpact.revenue}</span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground mt-4">
                  Illustrative prototype data — not real Telekom figures.
                </p>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Click an area on the map to inspect it.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
