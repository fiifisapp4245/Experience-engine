/**
 * Design tokens for contexts that can't read Tailwind/CSS variables directly
 * (inline SVG strokes/fills). Source of truth for color values is shared
 * with `app/globals.css` — if you change a hex here, update it there too.
 */

export const colors = {
  background: "#ffffff",
  surface: "#ffffff",
  surfaceRaised: "#ffffff",
  card: "#ffffff",
  border: "rgba(20, 24, 43, 0.10)",
  foreground: "#14182b",
  mutedForeground: "#63697d",
  brand: "#e20074",
  brandForeground: "#ffffff",
  good: "#0f9d68",
  warning: "#b45309",
  poor: "#dc2626",
  info: "#e20074",
} as const;

export const chartColors = {
  now: colors.brand,
  avg30d: "#0f766e",
  grid: "rgba(20, 24, 43, 0.10)",
} as const;

/** Experience scores throughout the app are on a 0–5 scale. */
export const SCORE_MAX = 5;

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export type ExperienceStatus = "good" | "warning" | "poor" | "info";

export const statusColor: Record<ExperienceStatus, string> = {
  good: colors.good,
  warning: colors.warning,
  poor: colors.poor,
  info: colors.info,
};

/** Lighter tints of the good/poor statuses, for solid-fill tiles where the full-strength color reads as too heavy. */
export const statusColorLight: Record<"good" | "poor", string> = {
  good: "#4ade80",
  poor: "#f87171",
};

export const statusLabel: Record<ExperienceStatus, string> = {
  good: "Good",
  warning: "Degraded",
  poor: "Poor",
  info: "Engine action",
};

/**
 * Single shared score→status mapping. Every module that renders a 0–5
 * experience score (Journey Map, Agent Desk, Roaming Insights, Experience
 * Intelligence) must use this instead of a local threshold function, or the
 * same score will render as a different status in different places.
 */
export function statusForScore(score: number): ExperienceStatus {
  if (score >= 3.75) return "good";
  if (score >= 2.75) return "warning";
  return "poor";
}
