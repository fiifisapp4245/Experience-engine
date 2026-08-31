"use client";

import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { roamingInsights } from "@/lib/mockData";
import { statusColor, statusForScore, formatScore } from "@/lib/theme";
import { getRoamingScenario, roamingPartners } from "@/lib/roamingScenario";
import { useDemoState, useDemoActions } from "@/lib/demoState";
import { useGuidedTarget } from "@/lib/guidedTargetRegistry";
import { ModuleHeader } from "@/components/ModuleHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { NumberTransition } from "@/components/motion/NumberTransition";
import { Button } from "@/components/ui/button";

const GAUGE_RADIUS = 90;
const GAUGE_ARC_LENGTH = Math.PI * GAUGE_RADIUS;

// Cards sit on the page's gray canvas (see app/page.tsx) — white, no stroke.
const CARD = "bg-card rounded-[var(--radius-xl)]";

export function RoamingInsights() {
  const { roamingStatus } = useDemoState();
  const { acceptRecommendation } = useDemoActions();
  const takeActionRef = useGuidedTarget("roaming-take-action");

  const scenario = getRoamingScenario(roamingStatus);
  const color = statusColor[scenario.experienceStatus];
  const dashOffset = GAUGE_ARC_LENGTH * (1 - scenario.score / 5);
  const isBusy = roamingStatus === "accepted";
  const isDone = roamingStatus === "recovered";

  const issues = [
    { label: "Latency", value: `${scenario.latencyMs} ms`, status: isDone ? "good" : "poor" } as const,
    { label: "Packet loss", value: `${scenario.packetLossPercent}%`, status: isDone ? "good" : "poor" } as const,
    { label: "Throughput", value: `${scenario.throughputMbps} Mbps`, status: isDone ? "good" : "warning" } as const,
  ];

  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={5}
        section="INTELLIGENCE"
        title="Roaming Insights"
        description={`${roamingInsights.location} — what went wrong, and what the engine recommends doing about it.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4 items-stretch max-w-3xl w-full mx-auto">
        {/* Row 1 */}
        <div className={`${CARD} p-6 flex flex-col items-center justify-center`}>
          <svg viewBox="0 0 200 120" className="w-full max-w-xs">
            <path
              d="M10,110 A90,90 0 0 1 190,110"
              fill="none"
              stroke="var(--border)"
              strokeWidth={14}
              strokeLinecap="round"
            />
            <path
              d="M10,110 A90,90 0 0 1 190,110"
              fill="none"
              stroke={color}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={GAUGE_ARC_LENGTH}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease" }}
            />
          </svg>
          <div className="-mt-10 flex flex-col items-center">
            <span className="text-4xl font-semibold" style={{ color }}>
              <NumberTransition value={scenario.score} from={0} format={formatScore} durationSec={1.2} />
            </span>
            <span className="text-sm text-muted-foreground">
              /5 · {isDone ? "Good" : "Poor"}
            </span>
          </div>
        </div>

        <div className={`${CARD} p-5 flex flex-col`}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Partner network comparison
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {roamingPartners.map((p) => {
              const isCurrent = scenario.activePartner === p.id;
              const tileColor = statusColor[statusForScore(p.score)];
              return (
                <div
                  key={p.id}
                  className="rounded-[var(--radius-lg)] p-4 flex flex-col justify-center"
                  style={{ backgroundColor: `${tileColor}1a` }}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: tileColor }}>
                    {isCurrent ? "Current" : "Alternative"}
                  </span>
                  <span className="text-sm font-medium mt-1 text-foreground">{p.name}</span>
                  <span className="text-2xl font-semibold mt-1" style={{ color: tileColor }}>
                    <NumberTransition value={p.score} from={0} format={formatScore} durationSec={1.2} />
                    <span className="text-sm font-normal text-muted-foreground">/5</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2 */}
        <div className={`${CARD} p-5`}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Key issues
          </div>
          <ul className="space-y-2.5">
            {issues.map((issue) => (
              <li key={issue.label} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{issue.label}</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{issue.value}</span>
                  <StatusBadge status={issue.status} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-brand text-brand-foreground rounded-[var(--radius-xl)] p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-foreground/80" />
            <span className="text-xs uppercase tracking-wide text-brand-foreground/80">
              AI recommendation
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-brand-foreground">{scenario.headline}</p>
            <p className="text-sm text-brand-foreground/80 mt-1">{scenario.summary}</p>
          </div>
          <Button
            ref={takeActionRef as React.Ref<HTMLButtonElement>}
            onClick={acceptRecommendation}
            disabled={isBusy || isDone}
            className="w-full bg-white text-brand hover:bg-white/90 disabled:opacity-60"
          >
            {isDone ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Action taken
              </>
            ) : isBusy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Switching…
              </>
            ) : (
              "Take Action"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
