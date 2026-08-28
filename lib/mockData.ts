import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Clock,
  Headset,
  Radar,
  Plane,
  MessageSquare,
  MapPin,
  Wifi,
  Tv,
  Smartphone,
  Receipt,
  PhoneCall,
} from "lucide-react";
import type { ExperienceStatus } from "@/lib/theme";

// ---------------------------------------------------------------------------
// Customer
// ---------------------------------------------------------------------------

export const customer = {
  name: "Anna",
  initials: "A",
  segment: "MagentaEINS Premium",
  tenureYears: 4,
} as const;

// ---------------------------------------------------------------------------
// Module rail
// ---------------------------------------------------------------------------

export type ModuleId =
  | "journey-map"
  | "experience-timeline"
  | "agent-desk"
  | "experience-intelligence"
  | "roaming-insights"
  | "proactive-engagement"
  | "network-investment-map";

export type ModuleMeta = {
  id: ModuleId;
  number: number;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

export const modules: ModuleMeta[] = [
  { id: "journey-map", number: 1, label: "Customer Journey Map", shortLabel: "Journey", icon: Compass },
  { id: "experience-timeline", number: 2, label: "Experience Timeline", shortLabel: "Timeline", icon: Clock },
  { id: "agent-desk", number: 3, label: "Agent Desk — 360° View", shortLabel: "Agent Desk", icon: Headset },
  { id: "experience-intelligence", number: 4, label: "Experience Intelligence", shortLabel: "Intelligence", icon: Radar },
  { id: "roaming-insights", number: 5, label: "Roaming Insights", shortLabel: "Roaming", icon: Plane },
  { id: "proactive-engagement", number: 6, label: "Proactive Engagement", shortLabel: "Engagement", icon: MessageSquare },
  { id: "network-investment-map", number: 7, label: "Network Investment Map", shortLabel: "Investment", icon: MapPin },
];

// ---------------------------------------------------------------------------
// Module 1 — Customer Journey Map
// ---------------------------------------------------------------------------

export type JourneyTouchpoint = {
  id: string;
  label: string;
  icon: LucideIcon;
  status: ExperienceStatus;
  score: number;
  summary: string;
  metrics: { label: string; value: string }[];
};

export const journeyTouchpoints: JourneyTouchpoint[] = [
  {
    id: "home-wifi",
    label: "Home WiFi",
    icon: Wifi,
    status: "warning",
    score: 3.7,
    summary: "Slight signal degradation in the evening — likely channel congestion.",
    metrics: [
      { label: "Avg. speed", value: "180 Mbps" },
      { label: "Latency", value: "22 ms" },
      { label: "Uptime (30d)", value: "99.4%" },
    ],
  },
  {
    id: "magenta-tv",
    label: "MagentaTV",
    icon: Tv,
    status: "good",
    score: 4.6,
    summary: "Stable streaming quality, no buffering events this week.",
    metrics: [
      { label: "Buffering events", value: "0" },
      { label: "Stream quality", value: "4K stable" },
      { label: "Avg. session", value: "1h 42m" },
    ],
  },
  {
    id: "service",
    label: "Service",
    icon: Headset,
    status: "warning",
    score: 3.4,
    summary: "One open ticket from a billing question, resolved same day.",
    metrics: [
      { label: "Open tickets", value: "0" },
      { label: "Last contact", value: "Today, 13:45" },
      { label: "CSAT", value: "4/5" },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    status: "good",
    score: 4.7,
    summary: "Excellent network experience across all recent sessions.",
    metrics: [
      { label: "Avg. speed", value: "312 Mbps" },
      { label: "Call quality", value: "Excellent" },
      { label: "Coverage", value: "5G — strong" },
    ],
  },
  {
    id: "tariff-billing",
    label: "Tariff & Billing",
    icon: Receipt,
    status: "info",
    score: 4.3,
    summary: "Anna switched to a new tariff today — engine flagged it as a fit upgrade.",
    metrics: [
      { label: "Current plan", value: "MagentaEINS Premium" },
      { label: "Changed", value: "Today, 17:20" },
      { label: "Billing status", value: "Up to date" },
    ],
  },
  {
    id: "roaming",
    label: "Roaming",
    icon: Plane,
    status: "poor",
    score: 2.4,
    summary: "Poor experience in Italy last night — high latency and packet loss.",
    metrics: [
      { label: "Location", value: "Milan, Italy" },
      { label: "Latency", value: "310 ms" },
      { label: "Packet loss", value: "6.2%" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Module 2 — Experience Timeline
// ---------------------------------------------------------------------------

export type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  category: string;
  status: ExperienceStatus;
  description: string;
  icon: LucideIcon;
  sparkline: number[];
};

export const timelineEvents: TimelineEvent[] = [
  {
    id: "evt-1",
    time: "07:45",
    title: "Back home — great experience",
    category: "Home WiFi",
    status: "good",
    description: "Seamless handover from mobile to home WiFi, full bandwidth restored.",
    icon: Wifi,
    sparkline: [3.1, 3.4, 3.5, 3.8, 4.0, 4.4, 4.6],
  },
  {
    id: "evt-2",
    time: "08:15",
    title: "Home WiFi — slight degradation",
    category: "Home WiFi",
    status: "warning",
    description: "Brief dip in throughput during peak morning usage window.",
    icon: Wifi,
    sparkline: [4.4, 4.2, 4.0, 3.7, 3.8, 3.9, 3.7],
  },
  {
    id: "evt-3",
    time: "10:30",
    title: "Mobile network — great experience",
    category: "Mobile",
    status: "good",
    description: "Strong 5G signal throughout commute, no drops.",
    icon: Smartphone,
    sparkline: [4.0, 4.2, 4.4, 4.5, 4.7, 4.7, 4.7],
  },
  {
    id: "evt-4",
    time: "13:45",
    title: "Service call",
    category: "Service",
    status: "warning",
    description: "Anna called about a billing question. Resolved in one interaction.",
    icon: Headset,
    sparkline: [3.5, 3.4, 3.3, 3.4, 3.5, 3.5, 3.4],
  },
  {
    id: "evt-5",
    time: "17:20",
    title: "Tariff change",
    category: "Tariff & Billing",
    status: "info",
    description: "Engine proactively recommended and applied a better-fit tariff.",
    icon: Receipt,
    sparkline: [3.8, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3],
  },
  {
    id: "evt-6",
    time: "21:10",
    title: "Roaming Italy — poor experience",
    category: "Roaming",
    status: "poor",
    description: "High latency and packet loss detected on partner network in Milan.",
    icon: Plane,
    sparkline: [3.6, 3.3, 2.9, 2.6, 2.5, 2.3, 2.4],
  },
  {
    id: "evt-7",
    time: "22:30",
    title: "Proactive support",
    category: "Roaming",
    status: "info",
    description: "Engine detected the degradation and triggered outreach before Anna complained.",
    icon: PhoneCall,
    sparkline: [2.4, 2.5, 2.8, 3.0, 3.2, 3.3, 3.4],
  },
];

// ---------------------------------------------------------------------------
// Module 3 — Agent Desk (360° View) — stub content
// ---------------------------------------------------------------------------

export const agentDesk = {
  experienceScore: 4.1,
  experienceLabel: "Good",
  customer,
  devices: [
    { id: "dev-1", name: "iPhone 15 Pro", type: "Mobile", status: "good" as ExperienceStatus },
    { id: "dev-2", name: "Speedport Pro+", type: "Home WiFi", status: "warning" as ExperienceStatus },
    { id: "dev-3", name: "MagentaTV Stick", type: "TV", status: "good" as ExperienceStatus },
  ],
  tickets: [
    { id: "tkt-1", subject: "Billing question — tariff change", status: "Resolved", updated: "Today, 13:52" },
    { id: "tkt-2", subject: "Roaming quality — Italy", status: "Open", updated: "Today, 22:31" },
  ],
  aiInsights: [
    "Anna's roaming experience dropped sharply last night in Milan — likely partner network congestion.",
    "Home WiFi shows a recurring evening dip — router firmware may be outdated.",
  ],
  nextBestActions: [
    "Offer a complimentary roaming data pass for the remainder of the trip.",
    "Schedule a proactive check-in call after Anna returns from Italy.",
    "Send a firmware update prompt for the home router.",
  ],
} as const;

// ---------------------------------------------------------------------------
// Module 4 — Experience Intelligence
// ---------------------------------------------------------------------------

export type ExperienceDomainScore = {
  domain: string;
  now: number;
  avg30d: number;
};

export const experienceDomains: ExperienceDomainScore[] = [
  { domain: "Mobile Data", now: 4.7, avg30d: 4.4 },
  { domain: "Roaming", now: 2.4, avg30d: 3.6 },
  { domain: "Home WiFi", now: 3.7, avg30d: 4.1 },
  { domain: "TV", now: 4.6, avg30d: 4.5 },
  { domain: "Service", now: 3.4, avg30d: 3.8 },
  { domain: "Voice", now: 4.5, avg30d: 4.3 },
];

export const experienceIntelligenceSummary = {
  overallNow: 3.9,
  overallAvg30d: 4.1,
  headline: "Roaming is the outlier — everything else tracks close to Anna's 30-day baseline.",
} as const;

// ---------------------------------------------------------------------------
// Module 5 — Roaming Insights — stub content
// ---------------------------------------------------------------------------

export const roamingInsights = {
  score: 2.4,
  label: "Poor",
  location: "Milan, Italy",
  issues: [
    { label: "Latency", value: "310 ms", status: "poor" as ExperienceStatus },
    { label: "Packet loss", value: "6.2%", status: "poor" as ExperienceStatus },
    { label: "Throughput", value: "4.1 Mbps", status: "warning" as ExperienceStatus },
  ],
  partners: [
    { name: "Partner Network A", status: "Poor" as const },
    { name: "Partner Network B", status: "Good" as const },
  ],
  recommendation:
    "Switch Anna to Partner Network B and offer a complimentary roaming data pass to offset the degraded session.",
} as const;

// ---------------------------------------------------------------------------
// Module 6 — Proactive Engagement — stub content
// ---------------------------------------------------------------------------

export const proactiveEngagement = {
  contactName: "Anna",
  messages: [
    {
      id: "msg-1",
      from: "system" as const,
      text: "Hi Anna, we noticed your connection in Milan has been unstable tonight.",
    },
    {
      id: "msg-2",
      from: "system" as const,
      text: "We'd like to switch you to a better-performing partner network and cover the difference — no action needed from you.",
    },
    {
      id: "msg-3",
      from: "system" as const,
      text: "Want us to also activate a free 1GB roaming pass for the rest of your trip?",
    },
  ],
  cta: "Activate Pass",
} as const;

// ---------------------------------------------------------------------------
// Module 7 — Network Investment Map — stub content
// ---------------------------------------------------------------------------

export type InvestmentArea = {
  id: string;
  name: string;
  impact: "High" | "Medium" | "Low";
  customers: number;
  investment: string;
  x: number;
  y: number;
};

export const investmentAreas: InvestmentArea[] = [
  { id: "area-1", name: "Milan Central", impact: "High", customers: 18400, investment: "€2.4M — small cell density upgrade", x: 32, y: 38 },
  { id: "area-2", name: "Munich South", impact: "Medium", customers: 9200, investment: "€850K — backhaul capacity increase", x: 58, y: 55 },
  { id: "area-3", name: "Hamburg Port", impact: "Low", customers: 3100, investment: "Monitoring only — no action planned", x: 74, y: 22 },
  { id: "area-4", name: "Berlin East", impact: "High", customers: 15600, investment: "€1.9M — new macro sites", x: 46, y: 70 },
];
