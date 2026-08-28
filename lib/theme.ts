/**
 * Design tokens for contexts that can't read Tailwind/CSS variables directly
 * (inline SVG strokes/fills). Source of truth for color values is shared
 * with `app/globals.css` — if you change a hex here, update it there too.
 */

export const colors = {
  background: "#f5f6fa",
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

export const statusLabel: Record<ExperienceStatus, string> = {
  good: "Good",
  warning: "Degraded",
  poor: "Poor",
  info: "Engine action",
};
