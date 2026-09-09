export type PlayerId = "p1" | "p2";
export type Mark = "X" | "O";
export type CellValue = Mark | null;
export type GameMode = "classic" | "pro" | "timed";
export type GameStatus = "playing" | "won" | "draw";
export type ThemeName = "light" | "dark";
export type TimedSeconds = 30 | 60 | 90;
export type ProWinLength = 4 | 5;
export type BoardSize = 3 | 5;

export type WinningPattern =
  | "Top Row"
  | "Middle Row"
  | "Bottom Row"
  | "Left Column"
  | "Middle Column"
  | "Right Column"
  | "Main Diagonal"
  | "Reverse Diagonal"
  | "Row 1"
  | "Row 2"
  | "Row 3"
  | "Row 4"
  | "Row 5"
  | "Column 1"
  | "Column 2"
  | "Column 3"
  | "Column 4"
  | "Column 5"
  | "Diagonal"
  | "Unknown";

export interface Move {
  index: number;
  player: PlayerId;
  mark: Mark;
  label: string;
}

export interface WinResult {
  winner: Mark;
  line: number[];
  pattern: WinningPattern;
}

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel: string;
  tone: "default" | "danger";
  action:
    | { type: "new-game"; keepHistory: boolean }
    | { type: "new-game-choice" }
    | { type: "reset-match" }
    | { type: "clear-history" }
    | { type: "reset-board" }
    | { type: "change-mode"; mode: GameMode };
}
