"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { customer, journeyTouchpoints } from "@/lib/mockData";
import { statusColor, formatScore } from "@/lib/theme";
import { ModuleHeader } from "@/components/ModuleHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

const RADIUS_PERCENT = 40;

function nodePosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + RADIUS_PERCENT * Math.cos(angle),
    y: 50 + RADIUS_PERCENT * Math.sin(angle),
  };
}

export function JourneyMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = journeyTouchpoints.find((t) => t.id === selectedId) ?? null;

  const avgScore = formatScore(
    journeyTouchpoints.reduce((sum, t) => sum + t.score, 0) / journeyTouchpoints.length
  );

  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={1}
        title="Customer Journey Map"
        description={`Every touchpoint in ${customer.name}'s experience, unified around one view. Click a node to inspect it.`}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        {/* Radial diagram */}
        <div className="relative w-full max-w-2xl mx-auto aspect-square">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
            {journeyTouchpoints.map((tp, i) => {
              const { x, y } = nodePosition(i, journeyTouchpoints.length);
              const isSelected = tp.id === selectedId;
              return (
                <line
                  key={tp.id}
                  x1={50}
                  y1={50}
                  x2={x}
                  y2={y}
                  stroke={isSelected ? statusColor[tp.status] : "var(--border)"}
                  strokeWidth={isSelected ? 0.6 : 0.4}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* Center — Anna */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative flex flex-col items-center justify-center h-28 w-28 md:h-32 md:w-32 rounded-full glow-card glow-card-brand text-center">
              <span className="text-2xl md:text-3xl font-semibold text-brand text-glow-brand">
                {avgScore}
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                {customer.name} · /5
              </span>
            </div>
          </div>

          {/* Touchpoint nodes */}
          {journeyTouchpoints.map((tp, i) => {
            const { x, y } = nodePosition(i, journeyTouchpoints.length);
            const isSelected = tp.id === selectedId;
            const color = statusColor[tp.status];
            const Icon = tp.icon;
            return (
              <button
                key={tp.id}
                type="button"
                onClick={() => setSelectedId(isSelected ? null : tp.id)}
                aria-pressed={isSelected}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1.5 group"
              >
                <span
                  className={cn(
                    "flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full glow-card transition-transform group-hover:scale-105",
                    isSelected && "scale-110"
                  )}
                  style={{
                    borderColor: `${color}88`,
                    boxShadow: isSelected ? `0 0 0 2px ${color}` : undefined,
                  }}
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6" style={{ color }} />
                </span>
                <span className="text-[11px] md:text-xs font-medium text-foreground whitespace-nowrap">
                  {tp.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="glow-card p-5 lg:sticky lg:top-6 min-h-[280px]">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <selected.icon
                      className="h-5 w-5"
                      style={{ color: statusColor[selected.status] }}
                    />
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
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col items-center justify-center h-full text-center py-10"
              >
                <div className="text-4xl font-semibold text-brand text-glow-brand mb-1">
                  {avgScore}
                  <span className="text-base text-muted-foreground font-normal"> /5</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-[220px]">
                  {customer.name}&rsquo;s overall experience score across all touchpoints. Click a
                  node to see detail.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
