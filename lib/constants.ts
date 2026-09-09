import type { Analytics } from "@/types/history";
import type { Settings } from "@/types/settings";
import type { Player } from "@/types/player";
import type { GameMode, TimedSeconds } from "@/types/game";

export const STORAGE_KEY = "arena.v1";
export const STORAGE_VERSION = 1;

export const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  sound: true,
  mode: "classic",
  timedSeconds: 60,
  proWinLength: 4,
};

export const DEFAULT_P1: Player = {
  id: "p1",
  name: "Player 1",
  mark: "X",
  wins: 0,
  losses: 0,
  draws: 0,
  currentStreak: 0,
  bestStreak: 0,
  roundsWon: 0,
};

export const DEFAULT_P2: Player = {
  id: "p2",
  name: "Player 2",
  mark: "O",
  wins: 0,
  losses: 0,
  draws: 0,
  currentStreak: 0,
  bestStreak: 0,
  roundsWon: 0,
};

export const DEFAULT_ANALYTICS: Analytics = {
  totalMoves: 0,
  gamesPlayed: 0,
  fastestWinMoves: null,
  longestGameMoves: 0,
  patternCounts: {},
  gamesToday: 0,
  lastPlayDate: "",
  totalDurationMs: 0,
  modeCounts: { classic: 0, pro: 0, timed: 0 },
};

export const MODE_LABELS: Record<GameMode, string> = {
  classic: "Classic",
  pro: "Pro",
  timed: "Timed",
};

export const TIMED_OPTIONS: TimedSeconds[] = [30, 60, 90];

export const KEYBOARD_HINTS = [
  { key: "1–9", label: "Place mark" },
  { key: "U", label: "Undo" },
  { key: "Y", label: "Redo" },
  { key: "R", label: "Reset board" },
  { key: "N", label: "New game" },
  { key: "T", label: "Theme" },
] as const;
