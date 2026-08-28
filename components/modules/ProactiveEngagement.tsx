"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Signal, Wifi, BatteryFull } from "lucide-react";
import { proactiveEngagement, customer } from "@/lib/mockData";
import { ModuleHeader } from "@/components/ModuleHeader";
import { Button } from "@/components/ui/button";

export function ProactiveEngagement() {
  const [activated, setActivated] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={6}
        title="Proactive Engagement"
        description={`The engine reaches out to ${customer.name} before she has to complain — and offers a fix in one tap.`}
      />

      <div className="flex-1 flex items-center justify-center py-4">
        <div className="relative w-full max-w-[380px] sm:w-[300px] rounded-[2.25rem] bg-[#14182b] p-2.5 shadow-[0_1px_2px_rgba(20,24,43,0.06),0_16px_32px_-16px_rgba(20,24,43,0.35)]">
          <div className="absolute left-1/2 top-3 -translate-x-1/2 h-1.5 w-16 rounded-full bg-black/40 z-10" />
          <div className="rounded-[1.75rem] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[11px] text-muted-foreground">
              <span>21:12</span>
              <div className="flex items-center gap-1">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <BatteryFull className="h-3 w-3" />
              </div>
            </div>

            <div className="flex items-center gap-2 px-5 py-2 border-b border-border">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground text-xs font-semibold">
                EE
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Experience Engine</div>
                <div className="text-[11px] text-muted-foreground">Proactive support</div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 px-4 py-4 min-h-[340px] sm:min-h-[280px]">
              {proactiveEngagement.messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.25 }}
                  className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-2.5 text-sm text-foreground/90"
                >
                  {msg.text}
                </motion.div>
              ))}

              {activated && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-brand px-3.5 py-2.5 text-sm text-brand-foreground flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> Pass activated
                </motion.div>
              )}
            </div>

            <div className="px-4 pb-5 pt-2">
              <Button
                onClick={() => setActivated(true)}
                disabled={activated}
                className="w-full"
                variant={activated ? "secondary" : "default"}
              >
                {activated ? "Activated" : proactiveEngagement.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
