"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUp, Minus, Sparkles } from "lucide-react";
import {
  customer,
  experienceDomains,
  experienceIntelligenceSummary,
  type ExperienceDomainScore,
} from "@/lib/mockData";
import { chartColors, statusColor, formatScore, SCORE_MAX } from "@/lib/theme";
import { useDemoState, useDemoActions } from "@/lib/demoState";
import { ModuleHeader } from "@/components/ModuleHeader";
import { NumberTransition } from "@/components/motion/NumberTransition";
import { ReasoningSequence, type ReasoningStep } from "@/components/motion/ReasoningSequence";

const MAX_RADIUS = 36;
const RING_LEVELS = [25, 50, 75, 100];
const AXIS_COUNT = experienceDomains.length;
const DELTA_NEUTRAL_BAND = 0.1;

// Cards sit on the page's gray canvas (see app/page.tsx) — white, no stroke.
const CARD = "bg-card rounded-[var(--radius-xl)]";

const WHY_BREAKDOWN = [
  { label: "Roaming", percent: 42 },
  { label: "Mobile", percent: 25 },
  { label: "Network", percent: 18 },
  { label: "Device", percent: 10 },
  { label: "Other", percent: 5 },
];

const REASONING_STEPS: ReasoningStep[] = [
  { label: "Packet loss increased on Partner Network A." },
  { label: "Partner A's performance has degraded across this area." },
  { label: "Anna's location matches the affected zone." },
  { label: "Similar customers nearby show the same pattern." },
  { label: "Partner Network B is performing significantly better." },
  { label: "Recommend: switch Anna to Partner Network B.", emphasis: true },
];

function angleFor(index: number) {
  return (index / AXIS_COUNT) * Math.PI * 2 - Math.PI / 2;
}

function pointAt(value: number, index: number) {
  const r = (value / SCORE_MAX) * MAX_RADIUS;
  const angle = angleFor(index);
  return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
}

function ringPath(radiusPercent: number) {
  const r = (radiusPercent / 100) * MAX_RADIUS;
  const points = Array.from({ length: AXIS_COUNT }, (_, i) => {
    const angle = angleFor(i);
    return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`;
  });
  return `M${points.join(" L")} Z`;
}

function seriesPath(domains: ExperienceDomainScore[], key: "now" | "avg30d") {
  const points = domains.map((d, i) => {
    const { x, y } = pointAt(d[key], i);
    return `${x},${y}`;
  });
  return `M${points.join(" L")} Z`;
}

const LABEL_RADIUS = MAX_RADIUS + 10;

const legend = [
  { key: "now", label: "Anna (Now)", color: chartColors.now },
  { key: "avg30d", label: "Anna (30d avg)", color: chartColors.avg30d },
] as const;

export function ExperienceIntelligence() {
  const { roamingStatus } = useDemoState();
  const { startInvestigation, markRecommended } = useDemoActions();
  const hasTriggeredInvestigation = useRef(false);

  useEffect(() => {
    if (roamingStatus === "degraded" && !hasTriggeredInvestigation.current) {
      hasTriggeredInvestigation.current = true;
      startInvestigation();
    }
  }, [roamingStatus, startInvestigation]);

  const isInvestigating = roamingStatus === "investigating";
  const isResolvedOrLater =
    roamingStatus === "recommended" || roamingStatus === "accepted" || roamingStatus === "recovered";

  const domains: ExperienceDomainScore[] = experienceDomains.map((d) =>
    d.domain === "Roaming"
      ? {
          ...d,
          now: roamingStatus === "recovered" ? 4.1 : roamingStatus === "degraded" ? 2.4 : d.now,
        }
      : d
  );

  const overallNow =
    domains.reduce((sum, d) => sum + d.now, 0) / domains.length || experienceIntelligenceSummary.overallNow;

  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={4}
        section="INTELLIGENCE"
        title="Experience Intelligence"
        description={`How ${customer.name}'s experience today compares to her own 30-day baseline, across every domain.`}
      />

      {/* Three columns, two rows — the chart spans both rows so its height
          matches the combined height of the two stacked cards beside it,
          and each row's two cards stretch to match each other, so every
          edge lines up as one seamless grid rather than mismatched columns. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_300px_300px] lg:grid-rows-2 gap-4 items-stretch">
        <div className={`${CARD} p-4 lg:row-span-2 flex flex-col`}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ transformOrigin: "50% 50%" }}
            className="relative w-full max-w-md mx-auto aspect-square flex-1"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
              {RING_LEVELS.map((level) => (
                <path
                  key={level}
                  d={ringPath(level)}
                  fill="none"
                  stroke={chartColors.grid}
                  strokeWidth={0.3}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {domains.map((_, i) => {
                const { x, y } = pointAt(SCORE_MAX, i);
                return (
                  <line
                    key={i}
                    x1={50}
                    y1={50}
                    x2={x}
                    y2={y}
                    stroke={chartColors.grid}
                    strokeWidth={0.3}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              <path
                d={seriesPath(domains, "avg30d")}
                fill={chartColors.avg30d}
                fillOpacity={0.1}
                stroke={chartColors.avg30d}
                strokeWidth={0.6}
                strokeDasharray="2.2 1.6"
                vectorEffect="non-scaling-stroke"
                style={{ transition: "d 0.6s ease" }}
              />
              <path
                d={seriesPath(domains, "now")}
                fill={chartColors.now}
                fillOpacity={0.28}
                stroke={chartColors.now}
                strokeWidth={0.8}
                vectorEffect="non-scaling-stroke"
                style={{ transition: "d 0.6s ease" }}
              />

              {domains.map((d, i) => {
                const { x, y } = pointAt(d.now, i);
                return <circle key={d.domain} cx={x} cy={y} r={1.1} fill={chartColors.now} />;
              })}
            </svg>

            {domains.map((d, i) => {
              const angle = angleFor(i);
              const x = 50 + LABEL_RADIUS * Math.cos(angle);
              const y = 50 + LABEL_RADIUS * Math.sin(angle);
              return (
                <span
                  key={d.domain}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-[11px] md:text-xs text-muted-foreground whitespace-nowrap"
                >
                  {d.domain}
                </span>
              );
            })}
          </motion.div>

          <div className="flex items-center justify-center gap-6 mt-3">
            {legend.map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Row 1 */}
        <div className="bg-brand text-brand-foreground rounded-[var(--radius-xl)] p-5 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-wide text-brand-foreground/80 mb-1">
            Overall experience
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-brand-foreground">
              <NumberTransition value={overallNow} from={0} format={formatScore} durationSec={1.2} />
              <span className="text-base text-brand-foreground/80 font-normal">/5</span>
            </span>
            <span className="text-sm text-brand-foreground/80">
              vs {formatScore(experienceIntelligenceSummary.overallAvg30d)} avg
            </span>
          </div>
          <p className="text-sm text-brand-foreground/90 mt-2">
            {experienceIntelligenceSummary.headline}
          </p>
        </div>

        <div className={`${CARD} p-5`}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            By domain
          </div>
          <ul className="space-y-2">
            {domains.map((d) => {
              const delta = d.now - d.avg30d;
              const Icon =
                delta > DELTA_NEUTRAL_BAND ? ArrowUp : delta < -DELTA_NEUTRAL_BAND ? ArrowDown : Minus;
              const deltaColor =
                delta > DELTA_NEUTRAL_BAND
                  ? chartColors.now
                  : delta < -DELTA_NEUTRAL_BAND
                    ? statusColor.poor
                    : "var(--muted-foreground)";
              return (
                <li key={d.domain} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{d.domain}</span>
                  <span className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-muted-foreground">{formatScore(d.avg30d)}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground">{formatScore(d.now)}</span>
                    <Icon className="h-3 w-3" style={{ color: deltaColor }} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Row 2 */}
        <div className={`${CARD} p-5`}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Why is the score low?
          </div>
          <ul className="space-y-2">
            {WHY_BREAKDOWN.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm">
                <span className="w-16 shrink-0 text-foreground">{item.label}</span>
                <span className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <span
                    className="block h-full rounded-full bg-brand"
                    style={{ width: `${item.percent}%` }}
                  />
                </span>
                <span className="w-9 shrink-0 text-right font-mono text-xs text-muted-foreground">
                  {item.percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${CARD} p-5 flex flex-col`}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-brand" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">AI reasoning</span>
          </div>
          {!isResolvedOrLater && (
            <p className="text-xs font-medium text-poor mb-3">
              72% probability of continued degradation if unaddressed
            </p>
          )}

          {isInvestigating ? (
            <ReasoningSequence
              steps={REASONING_STEPS}
              active={isInvestigating}
              onComplete={markRecommended}
              className="mt-3"
            />
          ) : (
            <div className="flex flex-col mt-3">
              {REASONING_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-start gap-2.5">
                  <div className="flex flex-col items-center pt-0.5 self-stretch">
                    <span
                      className={
                        step.emphasis
                          ? "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground text-[9px] font-medium"
                          : "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-[9px] font-medium"
                      }
                    >
                      {i + 1}
                    </span>
                    {i < REASONING_STEPS.length - 1 && (
                      <span className="w-px flex-1 bg-border mt-1" aria-hidden="true" />
                    )}
                  </div>
                  <p
                    className={
                      step.emphasis
                        ? "text-xs font-semibold text-brand pb-2.5"
                        : "text-xs text-foreground/90 pb-2.5"
                    }
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
