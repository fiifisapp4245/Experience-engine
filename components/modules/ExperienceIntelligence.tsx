"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import {
  customer,
  experienceDomains,
  experienceIntelligenceSummary,
} from "@/lib/mockData";
import { chartColors, statusColor, formatScore, SCORE_MAX } from "@/lib/theme";
import { ModuleHeader } from "@/components/ModuleHeader";

const MAX_RADIUS = 36;
const RING_LEVELS = [25, 50, 75, 100];
const AXIS_COUNT = experienceDomains.length;
const DELTA_NEUTRAL_BAND = 0.1;

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

function seriesPath(key: "now" | "avg30d") {
  const points = experienceDomains.map((d, i) => {
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
  return (
    <div className="h-full flex flex-col">
      <ModuleHeader
        number={4}
        title="Experience Intelligence"
        description={`How ${customer.name}'s experience today compares to her own 30-day baseline, across every domain.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="glow-card p-4 md:p-6">
          <div className="relative w-full max-w-lg mx-auto aspect-square">
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
              {experienceDomains.map((_, i) => {
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
                d={seriesPath("avg30d")}
                fill={chartColors.avg30d}
                fillOpacity={0.1}
                stroke={chartColors.avg30d}
                strokeWidth={0.6}
                strokeDasharray="2.2 1.6"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={seriesPath("now")}
                fill={chartColors.now}
                fillOpacity={0.28}
                stroke={chartColors.now}
                strokeWidth={0.8}
                vectorEffect="non-scaling-stroke"
              />

              {experienceDomains.map((d, i) => {
                const { x, y } = pointAt(d.now, i);
                return (
                  <circle key={d.domain} cx={x} cy={y} r={1.1} fill={chartColors.now} />
                );
              })}
            </svg>

            {experienceDomains.map((d, i) => {
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
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            {legend.map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glow-card glow-card-brand p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Overall experience
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-brand text-glow-brand">
                {formatScore(experienceIntelligenceSummary.overallNow)}
                <span className="text-base text-muted-foreground font-normal">/5</span>
              </span>
              <span className="text-sm text-muted-foreground">
                vs {formatScore(experienceIntelligenceSummary.overallAvg30d)} avg
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {experienceIntelligenceSummary.headline}
            </p>
          </div>

          <div className="glow-card p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
              By domain
            </div>
            <ul className="space-y-2.5">
              {experienceDomains.map((d) => {
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
        </div>
      </div>
    </div>
  );
}
