import type {
  BoardSize,
  CellValue,
  GameMode,
  Mark,
  ProWinLength,
  WinningPattern,
  WinResult,
} from "@/types/game";

export function getBoardSize(mode: GameMode): BoardSize {
  return mode === "pro" ? 5 : 3;
}

export function getWinLength(mode: GameMode, proWinLength: ProWinLength): number {
  return mode === "pro" ? proWinLength : 3;
}

export function createEmptyBoard(size: BoardSize): CellValue[] {
  return Array.from({ length: size * size }, () => null);
}

export function isBoardFull(board: CellValue[]): boolean {
  return board.every((cell) => cell !== null);
}

export function cellLabel(index: number, size: BoardSize): string {
  const row = Math.floor(index / size);
  const col = index % size;

  if (size === 3) {
    const rows = ["Top", "Middle", "Bottom"] as const;
    const cols = ["Left", "Center", "Right"] as const;
    if (row === 1 && col === 1) return "Center";
    if (row === 1) return `Middle ${cols[col]}`;
    if (col === 1) return `${rows[row]} Center`;
    return `${rows[row]} ${cols[col]}`;
  }

  return `Row ${row + 1} · Col ${col + 1}`;
}

const CLASSIC_LINES: { line: number[]; pattern: WinningPattern }[] = [
  { line: [0, 1, 2], pattern: "Top Row" },
  { line: [3, 4, 5], pattern: "Middle Row" },
  { line: [6, 7, 8], pattern: "Bottom Row" },
  { line: [0, 3, 6], pattern: "Left Column" },
  { line: [1, 4, 7], pattern: "Middle Column" },
  { line: [2, 5, 8], pattern: "Right Column" },
  { line: [0, 4, 8], pattern: "Main Diagonal" },
  { line: [2, 4, 6], pattern: "Reverse Diagonal" },
];

function classicWinner(board: CellValue[]): WinResult | null {
  for (const { line, pattern } of CLASSIC_LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return { winner: mark, line, pattern };
    }
  }
  return null;
}

function nameProPattern(
  size: BoardSize,
  start: number,
  dr: number,
  dc: number,
): WinningPattern {
  const row = Math.floor(start / size);
  const col = start % size;

  if (dr === 0) {
    const names: WinningPattern[] = ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5"];
    return names[row] ?? "Unknown";
  }
  if (dc === 0) {
    const names: WinningPattern[] = [
      "Column 1",
      "Column 2",
      "Column 3",
      "Column 4",
      "Column 5",
    ];
    return names[col] ?? "Unknown";
  }
  if (dr === 1 && dc === 1 && row === col) return "Main Diagonal";
  if (dr === 1 && dc === -1 && row + col === size - 1) return "Reverse Diagonal";
  return "Diagonal";
}

function proWinner(
  board: CellValue[],
  size: BoardSize,
  winLength: number,
): WinResult | null {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ] as const;

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const start = r * size + c;
      const mark = board[start];
      if (!mark) continue;

      for (const [dr, dc] of directions) {
        const pr = r - dr;
        const pc = c - dc;
        if (pr >= 0 && pr < size && pc >= 0 && pc < size) {
          if (board[pr * size + pc] === mark) continue;
        }

        const line: number[] = [start];
        let nr = r + dr;
        let nc = c + dc;
        while (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          const next = nr * size + nc;
          if (board[next] !== mark) break;
          line.push(next);
          nr += dr;
          nc += dc;
        }

        if (line.length >= winLength) {
          return {
            winner: mark,
            line: line.slice(0, winLength),
            pattern: nameProPattern(size, start, dr, dc),
          };
        }
      }
    }
  }

  return null;
}

export function evaluateBoard(
  board: CellValue[],
  size: BoardSize,
  winLength: number,
): WinResult | null {
  if (size === 3 && winLength === 3) {
    return classicWinner(board);
  }
  return proWinner(board, size, winLength);
}

export function oppositeMark(mark: Mark): Mark {
  return mark === "X" ? "O" : "X";
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatDuration(ms: number | null): string {
  if (ms === null || ms < 0) return "—";
  const total = Math.round(ms / 1000);
  if (total < 60) return `${total}s`;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export function formatHistoryStamp(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp));
}

export function clampName(value: string): string {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  return trimmed.slice(0, 18);
}
