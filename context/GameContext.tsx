"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { ThemeProvider } from "styled-components";
import { armAudio, playSound, resetWarnLatch } from "@/lib/audio";
import {
  createEngineState,
  gameReducer,
  snapshotFromState,
  type EngineState,
} from "@/lib/gameEngine";
import { clampName } from "@/lib/gameLogic";
import { loadSnapshot, saveSnapshot } from "@/lib/storage";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { themes } from "@/styles/theme";
import type { ConfirmRequest, FirstTo, GameMode, PlayerId, StarterMode } from "@/types/game";

interface GameContextValue {
  state: EngineState;
  hydrated: boolean;
  place: (index: number) => void;
  undo: () => void;
  redo: () => void;
  resetBoard: () => void;
  nextRound: () => void;
  requestNewGame: () => void;
  confirmNewGame: (keepHistory: boolean) => void;
  requestResetMatch: () => void;
  requestClearHistory: () => void;
  requestResetBoard: () => void;
  requestModeChange: (mode: GameMode) => void;
  setName: (player: PlayerId, name: string) => void;
  toggleTheme: () => void;
  setSound: (sound: boolean) => void;
  setTimedSeconds: (seconds: 30 | 60 | 90) => void;
  setProWin: (length: 4 | 5) => void;
  setStarter: (starter: StarterMode) => void;
  setFirstTo: (firstTo: FirstTo) => void;
  swapMarks: () => void;
  focusCell: (index: number) => void;
  dismissConfirm: () => void;
  resolveConfirm: () => void;
  clickSound: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createEngineState);
  const hydratedRef = useRef(false);
  const [hydrated, setHydrated] = useReducer(() => true, false);
  const prevStatus = useRef(state.status);
  const prevTurn = useRef(state.currentTurn);

  useEffect(() => {
    const loaded = loadSnapshot();
    dispatch({ type: "HYDRATE", payload: loaded });
    hydratedRef.current = true;
    setHydrated();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    document.documentElement.dataset.theme = state.settings.theme;
    const persist = () => saveSnapshot(snapshotFromState(state));
    const timer = window.setTimeout(persist, 180);
    const onHide = () => persist();
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [state]);

  useEffect(() => {
    if (state.settings.mode !== "timed" || state.status !== "playing") return;
    if (state.roundStartedAt === null) return;

    const interval = window.setInterval(() => {
      dispatch({ type: "TICK", amount: 0.1 });
    }, 100);

    return () => window.clearInterval(interval);
  }, [state.settings.mode, state.status, state.roundStartedAt, state.currentTurn]);

  useEffect(() => {
    if (state.settings.mode === "timed" && state.timers[state.currentTurn] <= 10) {
      playSound("warn", state.settings.sound);
    } else {
      resetWarnLatch();
    }
  }, [state.settings.mode, state.settings.sound, state.timers, state.currentTurn]);

  useEffect(() => {
    if (!hydrated) return;
    if (prevStatus.current !== state.status) {
      if (state.status === "won") playSound("win", state.settings.sound);
      if (state.status === "draw") playSound("draw", state.settings.sound);
      prevStatus.current = state.status;
    }
    if (prevTurn.current !== state.currentTurn && state.status === "playing") {
      prevTurn.current = state.currentTurn;
    }
  }, [hydrated, state.status, state.currentTurn, state.settings.sound]);

  const place = useCallback(
    (index: number) => {
      armAudio();
      if (state.board[index] || state.status !== "playing") return;
      playSound("move", state.settings.sound);
      dispatch({ type: "PLACE", index });
    },
    [state.board, state.status, state.settings.sound],
  );

  const undo = useCallback(() => {
    if (state.moves.length === 0) return;
    playSound("click", state.settings.sound);
    dispatch({ type: "UNDO" });
  }, [state.moves.length, state.settings.sound]);

  const redo = useCallback(() => {
    if (state.redoStack.length === 0 || state.status !== "playing") return;
    playSound("click", state.settings.sound);
    dispatch({ type: "REDO" });
  }, [state.redoStack.length, state.status, state.settings.sound]);

  const resetBoard = useCallback(() => {
    playSound("start", state.settings.sound);
    resetWarnLatch();
    dispatch({ type: "RESET_BOARD" });
  }, [state.settings.sound]);

  const nextRound = useCallback(() => {
    playSound("start", state.settings.sound);
    resetWarnLatch();
    dispatch({ type: "NEXT_ROUND" });
  }, [state.settings.sound]);

  const requestNewGame = useCallback(() => {
    dispatch({
      type: "REQUEST_CONFIRM",
      confirm: {
        title: "Start a new match?",
        message:
          "Begin a fresh match. You can keep career statistics and history, or reset everything except player names.",
        confirmLabel: "Choose",
        tone: "default",
        action: { type: "new-game-choice" },
      },
    });
  }, []);

  const confirmNewGame = useCallback(
    (keepHistory: boolean) => {
      playSound("start", state.settings.sound);
      resetWarnLatch();
      dispatch({ type: "NEW_GAME", keepHistory });
    },
    [state.settings.sound],
  );

  const requestResetMatch = useCallback(() => {
    dispatch({
      type: "REQUEST_CONFIRM",
      confirm: {
        title: "Reset match score?",
        message: "The current board and match score will return to round one. Career statistics stay intact.",
        confirmLabel: "Reset Match",
        tone: "danger",
        action: { type: "reset-match" },
      },
    });
  }, []);

  const requestClearHistory = useCallback(() => {
    dispatch({
      type: "REQUEST_CONFIRM",
      confirm: {
        title: "Clear all match history?",
        message: "This removes saved rounds, analytics, and streaks from the dashboard. This cannot be undone.",
        confirmLabel: "Clear History",
        tone: "danger",
        action: { type: "clear-history" },
      },
    });
  }, []);

  const requestResetBoard = useCallback(() => {
    if (state.moves.length === 0 && state.status === "playing") {
      resetBoard();
      return;
    }
    dispatch({
      type: "REQUEST_CONFIRM",
      confirm: {
        title: "Reset the board?",
        message: "The current round will be discarded. Match scores and history remain.",
        confirmLabel: "Reset Board",
        tone: "default",
        action: { type: "reset-board" },
      },
    });
  }, [resetBoard, state.moves.length, state.status]);

  const requestModeChange = useCallback(
    (mode: GameMode) => {
      if (mode === state.settings.mode) return;
      if (state.moves.length === 0 && state.matchScore.p1 === 0 && state.matchScore.p2 === 0) {
        playSound("start", state.settings.sound);
        dispatch({ type: "SET_MODE", mode });
        return;
      }
      dispatch({
        type: "REQUEST_CONFIRM",
        confirm: {
          title: "Switch game mode?",
          message: "Changing mode starts a new match on a fresh board. Career statistics are kept.",
          confirmLabel: "Switch Mode",
          tone: "default",
          action: { type: "change-mode", mode },
        },
      });
    },
    [state.settings.mode, state.settings.sound, state.moves.length, state.matchScore],
  );

  const setName = useCallback((player: PlayerId, name: string) => {
    const next = clampName(name);
    if (!next) return;
    dispatch({ type: "SET_NAME", player, name: next });
  }, []);

  const toggleTheme = useCallback(() => {
    playSound("click", state.settings.sound);
    dispatch({ type: "SET_THEME" });
  }, [state.settings.sound]);

  const setSound = useCallback((sound: boolean) => {
    dispatch({ type: "SET_SOUND", sound });
    if (sound) playSound("click", true);
  }, []);

  const setTimedSeconds = useCallback((seconds: 30 | 60 | 90) => {
    dispatch({ type: "SET_TIMED_SECONDS", seconds });
  }, []);

  const setProWin = useCallback((length: 4 | 5) => {
    dispatch({ type: "SET_PRO_WIN", length });
  }, []);

  const setStarter = useCallback((starter: StarterMode) => {
    dispatch({ type: "SET_STARTER", starter });
  }, []);

  const setFirstTo = useCallback((firstTo: FirstTo) => {
    dispatch({ type: "SET_FIRST_TO", firstTo });
  }, []);

  const swapMarks = useCallback(() => {
    if (state.moves.length > 0) return;
    playSound("click", state.settings.sound);
    dispatch({ type: "SWAP_MARKS" });
  }, [state.moves.length, state.settings.sound]);

  const focusCell = useCallback((index: number) => {
    dispatch({ type: "FOCUS_CELL", index });
  }, []);

  const dismissConfirm = useCallback(() => {
    dispatch({ type: "DISMISS_CONFIRM" });
  }, []);

  const resolveConfirm = useCallback(() => {
    const confirm = state.confirm;
    if (!confirm) return;
    if (confirm.action.type === "reset-match") {
      playSound("start", state.settings.sound);
      dispatch({ type: "RESET_MATCH" });
      return;
    }
    if (confirm.action.type === "clear-history") {
      playSound("click", state.settings.sound);
      dispatch({ type: "CLEAR_HISTORY" });
      return;
    }
    if (confirm.action.type === "reset-board") {
      resetBoard();
      dispatch({ type: "DISMISS_CONFIRM" });
      return;
    }
    if (confirm.action.type === "change-mode") {
      playSound("start", state.settings.sound);
      dispatch({ type: "SET_MODE", mode: confirm.action.mode });
      return;
    }
    if (confirm.action.type === "new-game") {
      confirmNewGame(confirm.action.keepHistory);
    }
  }, [state.confirm, state.settings.sound, resetBoard, confirmNewGame]);

  const clickSound = useCallback(() => {
    playSound("click", state.settings.sound);
  }, [state.settings.sound]);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      hydrated,
      place,
      undo,
      redo,
      resetBoard,
      nextRound,
      requestNewGame,
      confirmNewGame,
      requestResetMatch,
      requestClearHistory,
      requestResetBoard,
      requestModeChange,
      setName,
      toggleTheme,
      setSound,
      setTimedSeconds,
      setProWin,
      setStarter,
      setFirstTo,
      swapMarks,
      focusCell,
      dismissConfirm,
      resolveConfirm,
      clickSound,
    }),
    [
      state,
      hydrated,
      place,
      undo,
      redo,
      resetBoard,
      nextRound,
      requestNewGame,
      confirmNewGame,
      requestResetMatch,
      requestClearHistory,
      requestResetBoard,
      requestModeChange,
      setName,
      toggleTheme,
      setSound,
      setTimedSeconds,
      setProWin,
      setStarter,
      setFirstTo,
      swapMarks,
      focusCell,
      dismissConfirm,
      resolveConfirm,
      clickSound,
    ],
  );

  return (
    <GameContext.Provider value={value}>
      <ThemeProvider theme={themes[state.settings.theme]}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}

export type { ConfirmRequest };
