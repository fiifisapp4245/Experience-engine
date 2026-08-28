"use client";

import { motion } from "motion/react";
import { customer, timelineEvents } from "@/lib/mockData";
import { statusColor } from "@/lib/theme";
import { ModuleHeader } from "@/components/ModuleHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Sparkline } from "@/components/Sparkline";

export function ExperienceTimeline() {
  return (
    <div className="h-full flex flex-col">
      <div className="max-w-3xl mx-auto w-full">
        <ModuleHeader
          number={2}
          title="Experience Timeline"
          description={`A day in ${customer.name}'s experience — every notable event, in order, with the engine's read on each one.`}
        />

        <ol className="space-y-3">
          {timelineEvents.map((event, i) => {
            const color = statusColor[event.status];
            const Icon = event.icon;
            return (
              <motion.li
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="glow-card p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full shrink-0"
                      style={{ backgroundColor: `${color}1a` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">{event.time}</span>
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {event.category}
                    </span>
                    <StatusBadge status={event.status} />
                  </div>
                  <h3 className="text-sm md:text-base font-medium text-foreground truncate">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{event.description}</p>
                </div>
                <Sparkline
                  data={event.sparkline}
                  color={color}
                  width={80}
                  height={28}
                  className="shrink-0 self-end sm:self-center"
                />
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
