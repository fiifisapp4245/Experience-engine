"use client";

import { agentDesk, customer } from "@/lib/mockData";
import { formatScore } from "@/lib/theme";
import { ModuleHeader } from "@/components/ModuleHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";

export function AgentDesk() {
  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={3}
        title="Agent Desk — 360° View"
        description={`One pane for the support agent: ${customer.name}'s experience, devices, tickets and what to do next.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glow-card glow-card-brand p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            Experience score
          </div>
          <div className="text-5xl font-semibold text-brand text-glow-brand">
            {formatScore(agentDesk.experienceScore)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">/5 · {agentDesk.experienceLabel}</div>
          <div className="mt-3 text-sm">
            {customer.name} · {customer.segment}
          </div>
        </div>

        <div className="glow-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Devices</div>
          <ul className="space-y-3">
            {agentDesk.devices.map((d) => (
              <li key={d.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="text-foreground font-medium">{d.name}</div>
                  <div className="text-muted-foreground text-xs">{d.type}</div>
                </div>
                <StatusBadge status={d.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="glow-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Recent tickets
          </div>
          <ul className="space-y-3">
            {agentDesk.tickets.map((t) => (
              <li key={t.id} className="text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground font-medium truncate">{t.subject}</span>
                  <Badge variant={t.status === "Open" ? "default" : "secondary"}>
                    {t.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">{t.updated}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glow-card p-5 lg:col-span-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            AI insights
          </div>
          <ul className="space-y-2">
            {agentDesk.aiInsights.map((insight, i) => (
              <li key={i} className="text-sm text-foreground/90 flex gap-2">
                <span className="text-brand">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <div className="glow-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Next best actions
          </div>
          <ol className="space-y-2">
            {agentDesk.nextBestActions.map((action, i) => (
              <li key={i} className="text-sm text-foreground/90 flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-brand">
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
