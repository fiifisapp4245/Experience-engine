import type { ExperienceStatus } from "@/lib/theme";
import { statusForScore } from "@/lib/theme";

/**
 * The resolution arc of Anna's roaming incident. This is the one piece of
 * state genuinely shared across modules (Journey Map, Agent Desk, Experience
 * Intelligence, Roaming Insights, Proactive Engagement all render some facet
 * of it). Anna's story starts mid-crisis (matches the existing Experience
 * Timeline, which already has her degraded from 21:10) — "investigating"
 * through "recovered" is the arc the engine walks her through.
 */
export type RoamingStatus =
  | "degraded"
  | "investigating"
  | "recommended"
  | "accepted"
  | "recovered";

export type RoamingScenario = {
  status: RoamingStatus;
  score: number;
  experienceStatus: ExperienceStatus;
  activePartner: "A" | "B";
  headline: string;
  summary: string;
  journeySummary: string;
  latencyMs: number;
  packetLossPercent: number;
  throughputMbps: number;
  aiInsight: string;
  recommendation: string | null;
  ticketStatus: "Open" | "Resolved";
};

const DEGRADED_METRICS = { latencyMs: 310, packetLossPercent: 6.2, throughputMbps: 4.1 };
const RECOVERED_METRICS = { latencyMs: 45, packetLossPercent: 0.3, throughputMbps: 38 };

const SCENARIOS: Record<RoamingStatus, RoamingScenario> = {
  degraded: {
    status: "degraded",
    score: 2.4,
    experienceStatus: statusForScore(2.4),
    activePartner: "A",
    headline: "Roaming experience degraded",
    summary: "High latency and packet loss on Partner Network A in Milan.",
    journeySummary: "Poor experience in Italy — high latency and packet loss on the current roaming partner.",
    ...DEGRADED_METRICS,
    aiInsight: "Packet loss has spiked on Partner A in Anna's current area.",
    recommendation: null,
    ticketStatus: "Open",
  },
  investigating: {
    status: "investigating",
    score: 2.4,
    experienceStatus: statusForScore(2.4),
    activePartner: "A",
    headline: "Analysing Anna's roaming experience",
    summary: "Correlating network telemetry with Anna's location, device, and similar customers nearby.",
    journeySummary: "Poor experience in Italy — the engine is investigating the cause.",
    ...DEGRADED_METRICS,
    aiInsight: "Correlating network telemetry with Anna's location, device, and nearby customers.",
    recommendation: null,
    ticketStatus: "Open",
  },
  recommended: {
    status: "recommended",
    score: 2.4,
    experienceStatus: statusForScore(2.4),
    activePartner: "A",
    headline: "Recommendation ready",
    summary: "Partner Network B is performing significantly better for nearby customers.",
    journeySummary: "Poor experience in Italy — an alternative network has been identified.",
    ...DEGRADED_METRICS,
    aiInsight: "Partner Network B is performing significantly better for nearby customers.",
    recommendation: "Switch Anna to Partner Network B.",
    ticketStatus: "Open",
  },
  accepted: {
    status: "accepted",
    score: 2.4,
    experienceStatus: statusForScore(2.4),
    activePartner: "A",
    headline: "Switching to Partner Network B…",
    summary: "Applying the recommended action now.",
    journeySummary: "Switching Anna to a better-performing roaming partner.",
    ...DEGRADED_METRICS,
    aiInsight: "Applying the recommended action.",
    recommendation: "Switch Anna to Partner Network B.",
    ticketStatus: "Open",
  },
  recovered: {
    status: "recovered",
    score: 4.1,
    experienceStatus: statusForScore(4.1),
    activePartner: "B",
    headline: "Experience recovered",
    summary: "Switched to Partner Network B — latency and packet loss are back to normal.",
    journeySummary: "Recovered — switched to Partner Network B after proactive engagement.",
    ...RECOVERED_METRICS,
    aiInsight: "Partner Network B resolved the degradation. Experience score recovered from 2.4 to 4.1.",
    recommendation: null,
    ticketStatus: "Resolved",
  },
};

export function getRoamingScenario(status: RoamingStatus): RoamingScenario {
  return SCENARIOS[status];
}

/** Static baseline performance of each roaming partner, independent of Anna's own current status. */
export const roamingPartners = [
  { id: "A", name: "Partner Network A", score: 2.4 },
  { id: "B", name: "Partner Network B", score: 4.5 },
] as const;
