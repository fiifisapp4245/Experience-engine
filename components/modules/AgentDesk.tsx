"use client";

import { motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { agentDesk, customer, journeyTouchpoints } from "@/lib/mockData";
import { formatScore } from "@/lib/theme";
import { getRoamingScenario } from "@/lib/roamingScenario";
import { useDemoState, useDemoActions } from "@/lib/demoState";
import { ModuleHeader } from "@/components/ModuleHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { NumberTransition } from "@/components/motion/NumberTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Cards sit on the page's gray canvas (see app/page.tsx) rather than using a
// stroke — the gray/white contrast alone delineates each card.
const CARD = "bg-card rounded-[var(--radius-xl)]";

// Tiles reveal in three batches matching the grid's own rows: the first
// three (score, services, devices), then the next two (tickets, insights),
// then the last two (next best action, other suggestions).
const ROW_DELAY = [0, 0.25, 0.5];

function Tile({ row, className, children }: { row: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: ROW_DELAY[row], ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AgentDesk() {
  const { roamingStatus } = useDemoState();
  const { acceptRecommendation, goToModule } = useDemoActions();
  const scenario = getRoamingScenario(roamingStatus);

  const isBusy = roamingStatus === "accepted";
  const isDone = roamingStatus === "recovered";

  const services = journeyTouchpoints.map((tp) =>
    tp.id === "roaming" ? { id: tp.id, label: tp.label, status: scenario.experienceStatus } : tp
  );

  const ticket = agentDesk.tickets.find((t) => t.id === "tkt-2");
  const otherTickets = agentDesk.tickets.filter((t) => t.id !== "tkt-2");

  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={3}
        section="UNDERSTAND"
        title="Agent Desk — 360° View"
        description={`One pane for the support agent: ${customer.name}'s experience, devices, tickets and what to do next.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Tile row={0} className="bg-brand text-brand-foreground rounded-[var(--radius-xl)] p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-wide text-brand-foreground/80 mb-2">
            Experience score
          </div>
          <div className="text-5xl font-semibold text-brand-foreground">
            <NumberTransition value={agentDesk.experienceScore} from={0} format={formatScore} durationSec={1.4} />
          </div>
          <div className="text-sm text-brand-foreground/80 mt-1">
            /5 · {agentDesk.experienceLabel}
          </div>
          <div className="mt-3 text-sm text-brand-foreground">
            {customer.fullName} · {customer.age} · {customer.city}
          </div>
        </Tile>

        <Tile row={0} className={`${CARD} p-5`}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Services</div>
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{s.label}</span>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </Tile>

        <Tile row={0} className={`${CARD} p-5`}>
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
        </Tile>

        <Tile row={1} className={`${CARD} p-5`}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Recent tickets
          </div>
          <ul className="space-y-3">
            {ticket && (
              <li className="text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground font-medium truncate">{ticket.subject}</span>
                  <Badge variant={scenario.ticketStatus === "Open" ? "default" : "secondary"}>
                    {scenario.ticketStatus}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">{ticket.updated}</div>
              </li>
            )}
            {otherTickets.map((t) => (
              <li key={t.id} className="text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground font-medium truncate">{t.subject}</span>
                  <Badge variant="secondary">{t.status}</Badge>
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">{t.updated}</div>
              </li>
            ))}
          </ul>
        </Tile>

        <Tile row={1} className={`${CARD} p-5 lg:col-span-2`}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            AI insights
          </div>
          <ul className="space-y-2">
            <li className="text-sm text-foreground/90 flex gap-2">
              <span className="text-brand">•</span>
              {scenario.aiInsight}
            </li>
            {agentDesk.aiInsights.slice(1).map((insight, i) => (
              <li key={i} className="text-sm text-foreground/90 flex gap-2">
                <span className="text-brand">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </Tile>

        <Tile row={2} className={`${CARD} p-5 lg:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4`}>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Next best action
            </div>
            <p className="text-sm font-medium text-foreground">
              {scenario.recommendation ?? scenario.headline}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isDone
                ? `Recovered — now ${formatScore(scenario.score)} / 5`
                : `Expected improvement: ${formatScore(scenario.score)} → 4.1 / 5`}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={() => goToModule("experience-intelligence")}>
              View reasoning
            </Button>
            <Button
              onClick={acceptRecommendation}
              disabled={isBusy || isDone}
              variant={isDone ? "secondary" : "default"}
            >
              {isDone ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Applied
                </>
              ) : isBusy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Applying…
                </>
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </Tile>

        <Tile row={2} className={`${CARD} p-5`}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Other suggestions
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
        </Tile>
      </div>
    </div>
  );
}
