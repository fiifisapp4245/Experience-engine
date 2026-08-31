"use client";

import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { modules, type ModuleId, type ModuleGroup, type ModuleMeta } from "@/lib/mockData";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type BottomNavProps = {
  active: ModuleId;
  onSelect: (id: ModuleId) => void;
  onPrev: () => void;
  onNext: () => void;
};

const GROUP_LABEL: Record<ModuleGroup, string> = {
  UNDERSTAND: "Understand",
  INTELLIGENCE: "Intelligence",
  ACT: "Act",
  SCALE: "Scale",
};

// Consecutive modules sharing a group are visually clustered — a
// rail-rendering concern only. Nav order and keyboard cycling
// (app/page.tsx's goToOffset) stay flat/numeric regardless.
const groupedModules: { group: ModuleGroup; items: ModuleMeta[] }[] = modules.reduce<
  { group: ModuleGroup; items: ModuleMeta[] }[]
>((acc, mod) => {
  const last = acc[acc.length - 1];
  if (last && last.group === mod.group) {
    last.items.push(mod);
  } else {
    acc.push({ group: mod.group, items: [mod] });
  }
  return acc;
}, []);

export function BottomNav({ active, onSelect, onPrev, onNext }: BottomNavProps) {
  return (
    <nav
      aria-label="Modules"
      className="fixed bottom-6 inset-x-0 z-40 flex items-center justify-center gap-3 px-4 pointer-events-none"
    >
      <Tooltip>
        <TooltipTrigger
          onClick={onPrev}
          aria-label="Previous module"
          delay={100}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full glow-card shadow-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent side="top">Previous</TooltipContent>
      </Tooltip>

      <div className="flex items-end gap-4 md:gap-6 rounded-full glow-card px-4 md:px-6 py-2.5 shadow-lg pointer-events-auto">
        {groupedModules.map(({ group, items }, groupIndex) => (
          <div key={group} className="flex items-end gap-4 md:gap-6">
            {groupIndex > 0 && <span className="self-stretch w-px bg-border" aria-hidden="true" />}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-0.5 md:gap-1">
                {items.map((mod) => {
                  const isActive = mod.id === active;
                  const Icon = mod.icon;
                  return (
                    <Tooltip key={mod.id}>
                      <TooltipTrigger
                        onClick={() => onSelect(mod.id)}
                        aria-current={isActive}
                        aria-label={mod.label}
                        className="relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full transition-colors"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="bottom-nav-active"
                            className="absolute inset-0 rounded-full bg-accent"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}
                        <Icon
                          className={cn(
                            "relative z-10 h-5 w-5",
                            isActive ? "text-brand" : "text-muted-foreground"
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top">{mod.label}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                {GROUP_LABEL[group]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Tooltip>
        <TooltipTrigger
          onClick={onNext}
          aria-label="Next module"
          delay={100}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full glow-card shadow-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent side="top">Next</TooltipContent>
      </Tooltip>
    </nav>
  );
}
