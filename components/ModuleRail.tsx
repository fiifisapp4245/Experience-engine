"use client";

import { motion } from "motion/react";
import { modules, type ModuleId } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type ModuleRailProps = {
  active: ModuleId;
  onSelect: (id: ModuleId) => void;
};

export function ModuleRail({ active, onSelect }: ModuleRailProps) {
  return (
    <>
      {/* Desktop / tablet: vertical rail */}
      <nav
        aria-label="Modules"
        className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-border bg-surface/80 backdrop-blur-sm"
      >
        <div className="px-5 pt-6 pb-4">
          <div className="text-sm font-medium tracking-wide text-brand text-glow-brand">
            EXPERIENCE ENGINE
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Live demo — Anna</div>
        </div>
        <ul className="flex-1 px-3 py-2 space-y-1">
          {modules.map((mod) => {
            const isActive = mod.id === active;
            const Icon = mod.icon;
            return (
              <li key={mod.id} className="relative">
                <button
                  type="button"
                  onClick={() => onSelect(mod.id)}
                  aria-current={isActive}
                  className={cn(
                    "relative w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="rail-active"
                      className="absolute inset-0 rounded-lg bg-accent ring-glow-brand"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium shrink-0",
                      isActive ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {mod.number}
                  </span>
                  <Icon className="relative z-10 h-4 w-4 shrink-0" />
                  <span className="relative z-10 text-sm truncate">{mod.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="px-5 py-4 text-[11px] text-muted-foreground border-t border-border">
          ← → to navigate
        </div>
      </nav>

      {/* Mobile: bottom nav */}
      <nav
        aria-label="Modules"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-surface/95 backdrop-blur-sm"
      >
        <ul className="flex">
          {modules.map((mod) => {
            const isActive = mod.id === active;
            const Icon = mod.icon;
            return (
              <li key={mod.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => onSelect(mod.id)}
                  aria-current={isActive}
                  aria-label={mod.label}
                  title={mod.label}
                  className={cn(
                    "relative w-full flex flex-col items-center gap-1 py-3 transition-colors",
                    isActive ? "text-brand" : "text-muted-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="rail-active-mobile"
                      className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-brand"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="h-5 w-5" />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
