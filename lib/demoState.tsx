"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { ModuleId } from "@/lib/mockData";
import type { RoamingStatus } from "@/lib/roamingScenario";

export type Scene = "intro" | "app" | "closing";
export type DemoMode = "interactive" | "guided";
export type IntroStep = "title" | "anna";

type DemoState = {
  scene: Scene;
  introStep: IntroStep;
  activeModule: ModuleId;
  roamingStatus: RoamingStatus;
  demoMode: DemoMode;
};

const INITIAL_STATE: DemoState = {
  scene: "intro",
  introStep: "title",
  activeModule: "journey-map",
  roamingStatus: "degraded",
  demoMode: "interactive",
};

type DemoAction =
  | { type: "SET_SCENE"; scene: Scene }
  | { type: "SET_INTRO_STEP"; step: IntroStep }
  | { type: "SET_ACTIVE_MODULE"; moduleId: ModuleId }
  | { type: "SET_ROAMING_STATUS"; status: RoamingStatus }
  | { type: "SET_DEMO_MODE"; mode: DemoMode }
  | { type: "RESET_ROAMING" };

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "SET_SCENE":
      return { ...state, scene: action.scene };
    case "SET_INTRO_STEP":
      return { ...state, introStep: action.step };
    case "SET_ACTIVE_MODULE":
      return { ...state, activeModule: action.moduleId };
    case "SET_ROAMING_STATUS":
      return { ...state, roamingStatus: action.status };
    case "SET_DEMO_MODE":
      return { ...state, demoMode: action.mode };
    case "RESET_ROAMING":
      return { ...state, roamingStatus: "degraded" };
    default:
      return state;
  }
}

type PlaybackState = {
  stepIndex: number;
  isPaused: boolean;
};

const INITIAL_PLAYBACK: PlaybackState = { stepIndex: 0, isPaused: false };

type PlaybackAction =
  | { type: "SET_STEP"; index: number }
  | { type: "SET_PAUSED"; paused: boolean }
  | { type: "RESET_PLAYBACK" };

function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, stepIndex: action.index };
    case "SET_PAUSED":
      return { ...state, isPaused: action.paused };
    case "RESET_PLAYBACK":
      return INITIAL_PLAYBACK;
    default:
      return state;
  }
}

const DemoStateContext = createContext<DemoState | null>(null);
const DemoDispatchContext = createContext<React.Dispatch<DemoAction> | null>(null);
const PlaybackStateContext = createContext<PlaybackState | null>(null);
const PlaybackDispatchContext = createContext<React.Dispatch<PlaybackAction> | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, INITIAL_STATE);
  const [playback, playbackDispatch] = useReducer(playbackReducer, INITIAL_PLAYBACK);

  return (
    <DemoStateContext.Provider value={state}>
      <DemoDispatchContext.Provider value={dispatch}>
        <PlaybackStateContext.Provider value={playback}>
          <PlaybackDispatchContext.Provider value={playbackDispatch}>
            {children}
          </PlaybackDispatchContext.Provider>
        </PlaybackStateContext.Provider>
      </DemoDispatchContext.Provider>
    </DemoStateContext.Provider>
  );
}

function useDemoStateContext() {
  const ctx = useContext(DemoStateContext);
  if (!ctx) throw new Error("useDemoState must be used within DemoProvider");
  return ctx;
}

function useDemoDispatch() {
  const ctx = useContext(DemoDispatchContext);
  if (!ctx) throw new Error("useDemoActions must be used within DemoProvider");
  return ctx;
}

export function useDemoState() {
  return useDemoStateContext();
}

export function useGuidedPlaybackState() {
  const ctx = useContext(PlaybackStateContext);
  if (!ctx) throw new Error("useGuidedPlaybackState must be used within DemoProvider");
  return ctx;
}

function usePlaybackDispatch() {
  const ctx = useContext(PlaybackDispatchContext);
  if (!ctx) throw new Error("useDemoActions must be used within DemoProvider");
  return ctx;
}

const ACCEPT_TO_RECOVERED_DELAY_MS = 900;

/**
 * Every cross-module transition goes through this hook so components never
 * touch the two reducers (or their action shapes) directly — see plan
 * decision #6. Consumers just call semantic methods.
 */
export function useDemoActions() {
  const dispatch = useDemoDispatch();
  const playbackDispatch = usePlaybackDispatch();

  const setScene = useCallback((scene: Scene) => dispatch({ type: "SET_SCENE", scene }), [dispatch]);

  const setIntroStep = useCallback(
    (step: IntroStep) => dispatch({ type: "SET_INTRO_STEP", step }),
    [dispatch]
  );

  const goToModule = useCallback(
    (moduleId: ModuleId) => dispatch({ type: "SET_ACTIVE_MODULE", moduleId }),
    [dispatch]
  );

  const startInvestigation = useCallback(
    () => dispatch({ type: "SET_ROAMING_STATUS", status: "investigating" }),
    [dispatch]
  );

  const markRecommended = useCallback(
    () => dispatch({ type: "SET_ROAMING_STATUS", status: "recommended" }),
    [dispatch]
  );

  /** Fired from RoamingInsights, Agent Desk, or Proactive Engagement — all three converge on this one transition. */
  const acceptRecommendation = useCallback(() => {
    dispatch({ type: "SET_ROAMING_STATUS", status: "accepted" });
    setTimeout(() => {
      dispatch({ type: "SET_ROAMING_STATUS", status: "recovered" });
    }, ACCEPT_TO_RECOVERED_DELAY_MS);
  }, [dispatch]);

  const stopGuided = useCallback(() => dispatch({ type: "SET_DEMO_MODE", mode: "interactive" }), [dispatch]);

  const startGuided = useCallback(() => {
    dispatch({ type: "RESET_ROAMING" });
    dispatch({ type: "SET_SCENE", scene: "app" });
    dispatch({ type: "SET_ACTIVE_MODULE", moduleId: "journey-map" });
    dispatch({ type: "SET_DEMO_MODE", mode: "guided" });
    playbackDispatch({ type: "RESET_PLAYBACK" });
  }, [dispatch, playbackDispatch]);

  const setGuidedStep = useCallback(
    (index: number) => playbackDispatch({ type: "SET_STEP", index }),
    [playbackDispatch]
  );

  const setGuidedPaused = useCallback(
    (paused: boolean) => playbackDispatch({ type: "SET_PAUSED", paused }),
    [playbackDispatch]
  );

  return useMemo(
    () => ({
      setScene,
      setIntroStep,
      goToModule,
      startInvestigation,
      markRecommended,
      acceptRecommendation,
      startGuided,
      stopGuided,
      setGuidedStep,
      setGuidedPaused,
    }),
    [
      setScene,
      setIntroStep,
      goToModule,
      startInvestigation,
      markRecommended,
      acceptRecommendation,
      startGuided,
      stopGuided,
      setGuidedStep,
      setGuidedPaused,
    ]
  );
}
