import type { GameMode, PlayerId, WinningPattern } from "./game";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  p1Name: string;
  p2Name: string;
  winner: PlayerId | "draw";
  mode: GameMode;
  round: number;
  moves: number;
  durationMs: number | null;
  pattern: WinningPattern | null;
}

export interface Analytics {
  totalMoves: number;
  gamesPlayed: number;
  fastestWinMoves: number | null;
  longestGameMoves: number;
  patternCounts: Partial<Record<string, number>>;
  gamesToday: number;
  lastPlayDate: string;
  totalDurationMs: number;
  modeCounts: Record<GameMode, number>;
}
