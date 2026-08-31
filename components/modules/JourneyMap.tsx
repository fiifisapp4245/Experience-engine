"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { customer, journeyTouchpoints, type JourneyTouchpoint } from "@/lib/mockData";
import { formatScore } from "@/lib/theme";
import { useDemoState } from "@/lib/demoState";
import { getRoamingScenario } from "@/lib/roamingScenario";
import { useGuidedTarget } from "@/lib/guidedTargetRegistry";
import { ModuleHeader } from "@/components/ModuleHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { PulseIndicator } from "@/components/motion/PulseIndicator";

const RADIUS_PERCENT = 40;
const ANNA_ID = "anna";

function nodePosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + RADIUS_PERCENT * Math.cos(angle),
    y: 50 + RADIUS_PERCENT * Math.sin(angle),
  };
}

export function JourneyMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { roamingStatus } = useDemoState();
  const roamingNodeRef = useGuidedTarget("journey-roaming-node");

  const touchpoints: JourneyTouchpoint[] = useMemo(() => {
    const scenario = getRoamingScenario(roamingStatus);
    return journeyTouchpoints.map((tp) => {
      if (tp.id !== "roaming") return tp;
      return {
        ...tp,
        score: scenario.score,
        status: scenario.experienceStatus,
        summary: scenario.journeySummary,
        metrics: [
          { label: "Location", value: "Milan, Italy" },
          { label: "Latency", value: `${scenario.latencyMs} ms` },
          { label: "Packet loss", value: `${scenario.packetLossPercent}%` },
        ],
      };
    });
  }, [roamingStatus]);

  const selected = touchpoints.find((t) => t.id === selectedId) ?? null;
  const isAnnaSelected = selectedId === ANNA_ID;
  const isRoamingDegraded =
    roamingStatus === "degraded" || roamingStatus === "investigating" || roamingStatus === "recommended";

  const avgScore = formatScore(
    touchpoints.reduce((sum, t) => sum + t.score, 0) / touchpoints.length
  );

  const toggleSelect = (id: string) => setSelectedId((current) => (current === id ? null : id));

  const detailContent = selected ? (
    <>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <img src={selected.iconSrc} alt="" className="h-8 w-8 rounded-full" />
          <h2 className="text-lg font-semibold">{selected.label}</h2>
        </div>
        <StatusBadge status={selected.status} />
      </div>
      <div className="text-3xl font-semibold text-foreground mb-1">
        {formatScore(selected.score)}
        <span className="text-sm text-muted-foreground font-normal"> /5</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{selected.summary}</p>
      <dl className="space-y-2">
        {selected.metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between text-sm border-t border-border pt-2 first:border-t-0 first:pt-0"
          >
            <dt className="text-muted-foreground">{m.label}</dt>
            <dd className="font-medium text-foreground">{m.value}</dd>
          </div>
        ))}
      </dl>
    </>
  ) : (
    <div className="text-center">
      <div className="text-4xl font-semibold text-brand mb-1">
        {avgScore}
        <span className="text-base text-muted-foreground font-normal"> /5</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {customer.name}&rsquo;s overall experience score across every touchpoint.
      </p>
    </div>
  );

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <ModuleHeader
        number={1}
        section="UNDERSTAND"
        align="center"
        title="Customer Journey Map"
        description={`Every touchpoint in ${customer.name}'s experience, unified around one view. Click a node to inspect it.`}
      />

      {/* Radial diagram */}
      <div className="relative w-full max-w-lg aspect-square">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          {touchpoints.map((tp, i) => {
            const { x, y } = nodePosition(i, touchpoints.length);
            const isHighlighted = isAnnaSelected || selectedId === tp.id;
            return (
              <line
                key={tp.id}
                x1={50}
                y1={50}
                x2={x}
                y2={y}
                stroke={isHighlighted ? tp.color : "var(--border)"}
                strokeWidth={isHighlighted ? 0.6 : 0.4}
                strokeDasharray={isHighlighted ? undefined : "2 2"}
                vectorEffect="non-scaling-stroke"
                style={{ transition: "stroke 0.15s ease" }}
              />
            );
          })}
        </svg>

        {/* Center — Anna */}
        <button
          type="button"
          onClick={() => toggleSelect(ANNA_ID)}
          aria-pressed={isAnnaSelected}
          aria-label={`${customer.fullName} — overall experience`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <span
            className="relative block h-32 w-32 md:h-36 md:w-36 rounded-full overflow-hidden ring-1 ring-border transition-transform hover:scale-105"
            style={{ boxShadow: isAnnaSelected ? "0 0 0 3px var(--background), 0 0 0 5px var(--brand)" : undefined }}
          >
            <img src="/anna.png" alt="" className="h-full w-full object-cover" />
          </span>
        </button>

        {/* Touchpoint nodes */}
        {touchpoints.map((tp, i) => {
          const { x, y } = nodePosition(i, touchpoints.length);
          const isSelected = selectedId === tp.id;
          const isRoaming = tp.id === "roaming";
          return (
            <button
              key={tp.id}
              type="button"
              ref={isRoaming ? (roamingNodeRef as React.Ref<HTMLButtonElement>) : undefined}
              onClick={() => toggleSelect(tp.id)}
              aria-pressed={isSelected}
              aria-label={tp.label}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 group"
            >
              <span
                className="relative flex h-16 w-16 md:h-[72px] md:w-[72px] items-center justify-center rounded-full transition-transform group-hover:scale-105"
                style={{
                  boxShadow: isSelected
                    ? `0 0 0 3px var(--background), 0 0 0 5px ${tp.color}`
                    : undefined,
                }}
              >
                {isRoaming && isRoamingDegraded && (
                  <PulseIndicator color="#dc2626" size={8} className="absolute -top-0.5 -right-0.5 z-10" />
                )}
                <img src={tp.iconSrc} alt="" className="h-full w-full rounded-full" />
              </span>
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                {tp.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Click detail — a floating overlay, not part of the page flow, so it
          never affects the diagram's centering. On desktop widths (lg+) the
          diagram has open space on either side, so it appears as a side
          card; below that it falls back to a bottom card instead of being
          lost entirely (this tool is desktop-first — see Responsiveness). */}
      <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 w-80 hidden lg:block pointer-events-none">
        <AnimatePresence mode="wait">
          {(selected || isAnnaSelected) && (
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="glow-card p-5 shadow-lg"
            >
              {detailContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed left-1/2 bottom-24 z-30 -translate-x-1/2 w-full max-w-sm px-4 lg:hidden pointer-events-none">
        <AnimatePresence mode="wait">
          {(selected || isAnnaSelected) && (
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="glow-card p-5 shadow-lg"
            >
              {detailContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
