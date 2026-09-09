import {
  DEFAULT_ANALYTICS,
  DEFAULT_P1,
  DEFAULT_P2,
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  STORAGE_VERSION,
} from "./constants";
import { createEmptyBoard, getBoardSize } from "./gameLogic";
import type { Analytics, HistoryEntry } from "@/types/history";
import type { MatchScore, Player, PlayersState } from "@/types/player";
import type {
  CellValue,
  ConfirmRequest,
  FirstTo,
  GameMode,
  GameStatus,
  Move,
  PlayerId,
  ProWinLength,
  StarterMode,
  ThemeName,
  TimedSeconds,
  WinningPattern,
} from "@/types/game";
import type { Settings } from "@/types/settings";

export interface ResultSnapshot {
  entry: HistoryEntry;
  p1Streak: number;
  p1Best: number;
  p2Streak: number;
  p2Best: number;
  matchScore: MatchScore;
}

export interface GameSnapshot {
  version: number;
  settings: Settings;
  players: PlayersState;
  board: CellValue[];
  currentTurn: PlayerId;
  status: GameStatus;
  winner: PlayerId | null;
  winningLine: number[] | null;
  winningPattern: WinningPattern | null;
  round: number;
  matchScore: MatchScore;
  moves: Move[];
  redoStack: Move[];
  timers: { p1: number; p2: number };
  roundStartedAt: number | null;
  history: HistoryEntry[];
  analytics: Analytics;
  lastResult: ResultSnapshot | null;
  focusedIndex: number;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseTheme(value: unknown): ThemeName {
  return value === "light" ? "light" : "dark";
}

function parseMode(value: unknown): GameMode {
  if (value === "pro" || value === "timed" || value === "classic") return value;
  return "classic";
}

function parseTimed(value: unknown): TimedSeconds {
  if (value === 30 || value === 60 || value === 90) return value;
  return 60;
}

function parseProWin(value: unknown): ProWinLength {
  return value === 5 ? 5 : 4;
}

function parsePlayer(value: unknown, fallback: Player): Player {
  if (!isObject(value)) return fallback;
  const name = asString(value.name, fallback.name).trim().slice(0, 18);
  return {
    id: fallback.id,
    name: name || fallback.name,
    mark: value.mark === "O" || value.mark === "X" ? value.mark : fallback.mark,
    wins: Math.max(0, asNumber(value.wins, 0)),
    losses: Math.max(0, asNumber(value.losses, 0)),
    draws: Math.max(0, asNumber(value.draws, 0)),
    currentStreak: Math.max(0, asNumber(value.currentStreak, 0)),
    bestStreak: Math.max(0, asNumber(value.bestStreak, 0)),
    roundsWon: Math.max(0, asNumber(value.roundsWon, 0)),
  };
}

function parseStarter(value: unknown): StarterMode {
  if (value === "p2" || value === "alternate" || value === "p1") return value;
  return "p1";
}

function parseFirstTo(value: unknown): FirstTo {
  if (value === 3 || value === 5 || value === 7 || value === 0) return value;
  return 0;
}

function parseSettings(value: unknown): Settings {
  if (!isObject(value)) return { ...DEFAULT_SETTINGS };
  return {
    theme: parseTheme(value.theme),
    sound: asBoolean(value.sound, true),
    mode: parseMode(value.mode),
    timedSeconds: parseTimed(value.timedSeconds),
    proWinLength: parseProWin(value.proWinLength),
    starter: parseStarter(value.starter),
    firstTo: parseFirstTo(value.firstTo),
  };
}

function parseHistory(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isObject)
    .slice(0, 80)
    .map((entry, index) => {
      const winner =
        entry.winner === "p1" || entry.winner === "p2" || entry.winner === "draw"
          ? entry.winner
          : "draw";
      return {
        id: asString(entry.id, `legacy-${index}`),
        timestamp: asNumber(entry.timestamp, Date.now()),
        p1Name: asString(entry.p1Name, "Player 1"),
        p2Name: asString(entry.p2Name, "Player 2"),
        winner,
        mode: parseMode(entry.mode),
        round: Math.max(1, asNumber(entry.round, 1)),
        moves: Math.max(0, asNumber(entry.moves, 0)),
        durationMs:
          typeof entry.durationMs === "number" ? entry.durationMs : null,
        pattern: typeof entry.pattern === "string" ? (entry.pattern as WinningPattern) : null,
      };
    });
}

function parseAnalytics(value: unknown): Analytics {
  if (!isObject(value)) return { ...DEFAULT_ANALYTICS };
  const modeCounts = isObject(value.modeCounts) ? value.modeCounts : {};
  const patternCounts = isObject(value.patternCounts) ? value.patternCounts : {};
  const cleanedPatterns: Partial<Record<string, number>> = {};
  for (const [key, count] of Object.entries(patternCounts)) {
    if (typeof count === "number" && count > 0) cleanedPatterns[key] = count;
  }
  return {
    totalMoves: Math.max(0, asNumber(value.totalMoves, 0)),
    gamesPlayed: Math.max(0, asNumber(value.gamesPlayed, 0)),
    fastestWinMoves:
      typeof value.fastestWinMoves === "number" ? value.fastestWinMoves : null,
    longestGameMoves: Math.max(0, asNumber(value.longestGameMoves, 0)),
    patternCounts: cleanedPatterns,
    gamesToday: Math.max(0, asNumber(value.gamesToday, 0)),
    lastPlayDate: asString(value.lastPlayDate, ""),
    totalDurationMs: Math.max(0, asNumber(value.totalDurationMs, 0)),
    modeCounts: {
      classic: Math.max(0, asNumber(modeCounts.classic, 0)),
      pro: Math.max(0, asNumber(modeCounts.pro, 0)),
      timed: Math.max(0, asNumber(modeCounts.timed, 0)),
    },
  };
}

function parseMoves(value: unknown): Move[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isObject).map((move) => ({
    index: asNumber(move.index, 0),
    player: move.player === "p2" ? "p2" : "p1",
    mark: move.mark === "O" ? "O" : "X",
    label: asString(move.label, ""),
  }));
}

function parseBoard(value: unknown, size: 3 | 5): CellValue[] {
  const empty = createEmptyBoard(size);
  if (!Array.isArray(value) || value.length !== size * size) return empty;
  return value.map((cell) => (cell === "X" || cell === "O" ? cell : null));
}

export function createInitialSnapshot(): GameSnapshot {
  return {
    version: STORAGE_VERSION,
    settings: { ...DEFAULT_SETTINGS },
    players: {
      p1: { ...DEFAULT_P1 },
      p2: { ...DEFAULT_P2 },
    },
    board: createEmptyBoard(3),
    currentTurn: "p1",
    status: "playing",
    winner: null,
    winningLine: null,
    winningPattern: null,
    round: 1,
    matchScore: { p1: 0, p2: 0 },
    moves: [],
    redoStack: [],
    timers: { p1: DEFAULT_SETTINGS.timedSeconds, p2: DEFAULT_SETTINGS.timedSeconds },
    roundStartedAt: null,
    history: [],
    analytics: { ...DEFAULT_ANALYTICS, modeCounts: { ...DEFAULT_ANALYTICS.modeCounts } },
    lastResult: null,
    focusedIndex: 0,
  };
}

export function sanitizeSnapshot(raw: unknown): GameSnapshot {
  const fallback = createInitialSnapshot();
  if (!isObject(raw)) return fallback;

  const settings = parseSettings(raw.settings);
  const size = getBoardSize(settings.mode);
  const players = {
    p1: parsePlayer(isObject(raw.players) ? raw.players.p1 : null, DEFAULT_P1),
    p2: parsePlayer(isObject(raw.players) ? raw.players.p2 : null, DEFAULT_P2),
  };

  const status =
    raw.status === "won" || raw.status === "draw" || raw.status === "playing"
      ? raw.status
      : "playing";

  const matchScore = isObject(raw.matchScore)
    ? {
        p1: Math.max(0, asNumber(raw.matchScore.p1, 0)),
        p2: Math.max(0, asNumber(raw.matchScore.p2, 0)),
      }
    : { p1: 0, p2: 0 };

  const timers = isObject(raw.timers)
    ? {
        p1: Math.max(0, asNumber(raw.timers.p1, settings.timedSeconds)),
        p2: Math.max(0, asNumber(raw.timers.p2, settings.timedSeconds)),
      }
    : { p1: settings.timedSeconds, p2: settings.timedSeconds };

  return {
    version: STORAGE_VERSION,
    settings,
    players,
    board: parseBoard(raw.board, size),
    currentTurn: raw.currentTurn === "p2" ? "p2" : "p1",
    status,
    winner: raw.winner === "p1" || raw.winner === "p2" ? raw.winner : null,
    winningLine: Array.isArray(raw.winningLine)
      ? raw.winningLine.filter((n): n is number => typeof n === "number")
      : null,
    winningPattern:
      typeof raw.winningPattern === "string"
        ? (raw.winningPattern as WinningPattern)
        : null,
    round: Math.max(1, asNumber(raw.round, 1)),
    matchScore,
    moves: parseMoves(raw.moves),
    redoStack: parseMoves(raw.redoStack),
    timers,
    roundStartedAt:
      typeof raw.roundStartedAt === "number" ? raw.roundStartedAt : null,
    history: parseHistory(raw.history),
    analytics: parseAnalytics(raw.analytics),
    lastResult: isObject(raw.lastResult) && isObject(raw.lastResult.entry)
      ? {
          entry: parseHistory([raw.lastResult.entry])[0]!,
          p1Streak: asNumber(raw.lastResult.p1Streak, players.p1.currentStreak),
          p1Best: asNumber(raw.lastResult.p1Best, players.p1.bestStreak),
          p2Streak: asNumber(raw.lastResult.p2Streak, players.p2.currentStreak),
          p2Best: asNumber(raw.lastResult.p2Best, players.p2.bestStreak),
          matchScore: isObject(raw.lastResult.matchScore)
            ? {
                p1: asNumber(raw.lastResult.matchScore.p1, matchScore.p1),
                p2: asNumber(raw.lastResult.matchScore.p2, matchScore.p2),
              }
            : matchScore,
        }
      : null,
    focusedIndex: Math.max(0, asNumber(raw.focusedIndex, 0)),
  };
}

export function loadSnapshot(): GameSnapshot {
  if (typeof window === "undefined") return createInitialSnapshot();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialSnapshot();
    return sanitizeSnapshot(JSON.parse(raw));
  } catch {
    return createInitialSnapshot();
  }
}

export function saveSnapshot(snapshot: GameSnapshot) {
  if (typeof window === "undefined") return;
  try {
    const persistable: GameSnapshot = { ...snapshot };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch {
    // Quota or private mode — keep the session in memory only.
  }
}

export function peekTheme(): ThemeName {
  if (typeof window === "undefined") return DEFAULT_SETTINGS.theme;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS.theme;
    const parsed: unknown = JSON.parse(raw);
    if (isObject(parsed) && isObject(parsed.settings)) {
      return parseTheme(parsed.settings.theme);
    }
  } catch {
    return DEFAULT_SETTINGS.theme;
  }
  return DEFAULT_SETTINGS.theme;
}

export type { ConfirmRequest };
