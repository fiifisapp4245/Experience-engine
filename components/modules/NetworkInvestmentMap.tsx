"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { investmentAreas, type InvestmentArea } from "@/lib/mockData";
import { statusColor, type ExperienceStatus } from "@/lib/theme";
import { ModuleHeader } from "@/components/ModuleHeader";
import { cn } from "@/lib/utils";

const impactStatus: Record<InvestmentArea["impact"], ExperienceStatus> = {
  High: "poor",
  Medium: "warning",
  Low: "good",
};

export function NetworkInvestmentMap() {
  const [selectedId, setSelectedId] = useState<string | null>(investmentAreas[0]?.id ?? null);
  const selected = investmentAreas.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={7}
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
        </div>

        <div className="glow-card p-5 min-h-[220px]">
          <AnimatePresence mode="wait">
            {selected ? (
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
                <div className="text-sm text-muted-foreground mb-4">customers affected</div>
                <div className="border-t border-border pt-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Planned investment
                  </div>
                  <p className="text-sm text-foreground/90">{selected.investment}</p>
                </div>
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
