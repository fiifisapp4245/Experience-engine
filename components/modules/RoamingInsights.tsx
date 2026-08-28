"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { roamingInsights } from "@/lib/mockData";
import { statusColor, formatScore, type ExperienceStatus } from "@/lib/theme";
import { ModuleHeader } from "@/components/ModuleHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";

const GAUGE_RADIUS = 90;
const GAUGE_ARC_LENGTH = Math.PI * GAUGE_RADIUS;

function gaugeColor(score: number): ExperienceStatus {
  if (score >= 3.75) return "good";
  if (score >= 2.75) return "warning";
  return "poor";
}

export function RoamingInsights() {
  const [actionTaken, setActionTaken] = useState(false);
  const color = statusColor[gaugeColor(roamingInsights.score)];
  const dashOffset = GAUGE_ARC_LENGTH * (1 - roamingInsights.score / 5);

  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={5}
        title="Roaming Insights"
        description={`${roamingInsights.location} — what went wrong, and what the engine recommends doing about it.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          <div className="glow-card p-6 flex flex-col items-center sm:col-span-2">
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
              />
            </svg>
            <div className="-mt-10 flex flex-col items-center">
              <span className="text-4xl font-semibold" style={{ color }}>
                {formatScore(roamingInsights.score)}
              </span>
              <span className="text-sm text-muted-foreground">/5 · {roamingInsights.label}</span>
            </div>
          </div>

          <div className="glow-card p-5 sm:col-span-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
              Key issues
            </div>
            <ul className="space-y-2.5">
              {roamingInsights.issues.map((issue) => (
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

          <div className="glow-card p-5 sm:col-span-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
              Partner network comparison
            </div>
            <div className="flex items-center gap-3">
              {roamingInsights.partners.map((p, i) => (
                <div key={p.name} className="flex-1 flex items-center gap-3">
                  <div className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2.5">
                    <div className="text-sm text-foreground truncate">{p.name}</div>
                    <StatusBadge status={p.status === "Good" ? "good" : "poor"} label={p.status} />
                  </div>
                  {i === 0 && <span className="text-muted-foreground text-sm">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glow-card glow-card-brand p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              AI recommendation
            </span>
          </div>
          <p className="text-sm text-foreground/90 flex-1">{roamingInsights.recommendation}</p>
          <Button
            onClick={() => setActionTaken(true)}
            disabled={actionTaken}
            className="w-full"
            variant={actionTaken ? "secondary" : "default"}
          >
            {actionTaken ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Action taken
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
