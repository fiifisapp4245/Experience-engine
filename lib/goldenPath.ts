import type { ModuleId } from "@/lib/mockData";

/**
 * The guided-demo golden path. Two step kinds move the presenter around
 * ("navigate" mounts a module, "act" performs a click on a target already
 * mounted in the current module) — kept distinct because only the active
 * module is ever mounted (see app/page.tsx), so a target in a module that
 * hasn't been navigated to yet doesn't exist in the DOM. "scene" switches
 * the top-level scene (used only for the closing beat).
 */
export type GoldenStep =
  | { kind: "navigate"; module: ModuleId; caption: string; holdMs?: number }
  | { kind: "act"; targetId: string; caption: string; holdMs?: number }
  | { kind: "scene"; scene: "closing"; caption: string; holdMs?: number };

export const DEFAULT_STEP_HOLD_MS = 1800;

export const goldenPath: GoldenStep[] = [
  {
    kind: "navigate",
    module: "journey-map",
    caption: "Anna's world today — one connected experience.",
  },
  {
    kind: "act",
    targetId: "journey-roaming-node",
    caption: "But her roaming experience in Italy is degraded.",
  },
  {
    kind: "navigate",
    module: "experience-timeline",
    caption: "Here's what happened, in order.",
  },
  {
    kind: "navigate",
    module: "agent-desk",
    caption: "The agent doesn't just see an alarm — they see all of Anna.",
  },
  {
    kind: "navigate",
    module: "experience-intelligence",
    caption: "The engine reasons about why.",
    holdMs: 3200,
  },
  {
    kind: "navigate",
    module: "roaming-insights",
    caption: "Partner A vs Partner B, side by side.",
  },
  {
    kind: "navigate",
    module: "proactive-engagement",
    caption: "We don't wait for Anna to complain.",
  },
  {
    kind: "act",
    targetId: "proactive-activate",
    caption: "Anna accepts — and the experience recovers.",
    holdMs: 2400,
  },
  {
    kind: "navigate",
    module: "network-investment-map",
    caption: "Anna is one customer. Let's zoom out.",
    holdMs: 3200,
  },
  {
    kind: "scene",
    scene: "closing",
    caption: "One loop. Better experience. Better business. Better future.",
  },
];
