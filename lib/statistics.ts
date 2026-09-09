import type { Analytics, HistoryEntry } from "@/types/history";
import type { Player, PlayersState } from "@/types/player";
import type { GameMode, PlayerId, WinningPattern } from "@/types/game";
import { todayKey } from "./gameLogic";

export function winRate(player: Player): number {
  const played = player.wins + player.losses + player.draws;
  if (played === 0) return 0;
  return Math.round((player.wins / played) * 100);
}

export function gamesPlayed(player: Player): number {
  return player.wins + player.losses + player.draws;
}

export function averageMoves(analytics: Analytics): number {
  if (analytics.gamesPlayed === 0) return 0;
  return Math.round((analytics.totalMoves / analytics.gamesPlayed) * 10) / 10;
}

export function mostCommonPattern(analytics: Analytics): string | null {
  let best: string | null = null;
  let count = 0;
  for (const [pattern, value] of Object.entries(analytics.patternCounts)) {
    if ((value ?? 0) > count) {
      best = pattern;
      count = value ?? 0;
    }
  }
  return best;
}

export function mostPlayedMode(analytics: Analytics): GameMode | null {
  const entries = Object.entries(analytics.modeCounts) as [GameMode, number][];
  const ranked = entries.sort((a, b) => b[1] - a[1]);
  if (!ranked[0] || ranked[0][1] === 0) return null;
  return ranked[0][0];
}

export function longestCareerStreak(players: PlayersState): number {
  return Math.max(players.p1.bestStreak, players.p2.bestStreak);
}

export function applyResultToPlayer(
  player: Player,
  result: "win" | "loss" | "draw",
): Player {
  if (result === "draw") {
    return {
      ...player,
      draws: player.draws + 1,
      currentStreak: 0,
    };
  }

  if (result === "win") {
    const currentStreak = player.currentStreak + 1;
    return {
      ...player,
      wins: player.wins + 1,
      roundsWon: player.roundsWon + 1,
      currentStreak,
      bestStreak: Math.max(player.bestStreak, currentStreak),
    };
  }

  return {
    ...player,
    losses: player.losses + 1,
    currentStreak: 0,
  };
}

export function revertResultOnPlayer(
  player: Player,
  result: "win" | "loss" | "draw",
  previousStreak: number,
  previousBest: number,
): Player {
  if (result === "draw") {
    return {
      ...player,
      draws: Math.max(0, player.draws - 1),
      currentStreak: previousStreak,
    };
  }

  if (result === "win") {
    return {
      ...player,
      wins: Math.max(0, player.wins - 1),
      roundsWon: Math.max(0, player.roundsWon - 1),
      currentStreak: previousStreak,
      bestStreak: previousBest,
    };
  }

  return {
    ...player,
    losses: Math.max(0, player.losses - 1),
    currentStreak: previousStreak,
  };
}

export function applyAnalytics(
  analytics: Analytics,
  entry: Pick<HistoryEntry, "moves" | "durationMs" | "pattern" | "mode" | "winner">,
): Analytics {
  const today = todayKey();
  const gamesToday =
    analytics.lastPlayDate === today ? analytics.gamesToday + 1 : 1;

  const patternCounts = { ...analytics.patternCounts };
  if (entry.pattern) {
    patternCounts[entry.pattern] = (patternCounts[entry.pattern] ?? 0) + 1;
  }

  const fastestWinMoves =
    entry.winner === "draw"
      ? analytics.fastestWinMoves
      : analytics.fastestWinMoves === null
        ? entry.moves
        : Math.min(analytics.fastestWinMoves, entry.moves);

  return {
    totalMoves: analytics.totalMoves + entry.moves,
    gamesPlayed: analytics.gamesPlayed + 1,
    fastestWinMoves,
    longestGameMoves: Math.max(analytics.longestGameMoves, entry.moves),
    patternCounts,
    gamesToday,
    lastPlayDate: today,
    totalDurationMs: analytics.totalDurationMs + (entry.durationMs ?? 0),
    modeCounts: {
      ...analytics.modeCounts,
      [entry.mode]: analytics.modeCounts[entry.mode] + 1,
    },
  };
}

export function revertAnalytics(
  analytics: Analytics,
  entry: HistoryEntry,
): Analytics {
  const patternCounts = { ...analytics.patternCounts };
  if (entry.pattern) {
    const next = (patternCounts[entry.pattern] ?? 1) - 1;
    if (next <= 0) delete patternCounts[entry.pattern];
    else patternCounts[entry.pattern] = next;
  }

  let fastestWinMoves = analytics.fastestWinMoves;
  if (entry.winner !== "draw" && fastestWinMoves === entry.moves) {
    fastestWinMoves = null;
  }

  return {
    totalMoves: Math.max(0, analytics.totalMoves - entry.moves),
    gamesPlayed: Math.max(0, analytics.gamesPlayed - 1),
    fastestWinMoves,
    longestGameMoves:
      analytics.longestGameMoves === entry.moves
        ? 0
        : analytics.longestGameMoves,
    patternCounts,
    gamesToday:
      analytics.lastPlayDate === todayKey()
        ? Math.max(0, analytics.gamesToday - 1)
        : analytics.gamesToday,
    lastPlayDate: analytics.lastPlayDate,
    totalDurationMs: Math.max(0, analytics.totalDurationMs - (entry.durationMs ?? 0)),
    modeCounts: {
      ...analytics.modeCounts,
      [entry.mode]: Math.max(0, analytics.modeCounts[entry.mode] - 1),
    },
  };
}

export function drawShare(players: PlayersState): number {
  const draws = players.p1.draws;
  const total = players.p1.wins + players.p2.wins + draws;
  if (total === 0) return 0;
  return Math.round((draws / total) * 100);
}

export function playerWinShare(players: PlayersState, id: PlayerId): number {
  const total = players.p1.wins + players.p2.wins + players.p1.draws;
  if (total === 0) return 0;
  return Math.round((players[id].wins / total) * 100);
}

export function incrementPattern(
  counts: Partial<Record<string, number>>,
  pattern: WinningPattern,
): Partial<Record<string, number>> {
  return {
    ...counts,
    [pattern]: (counts[pattern] ?? 0) + 1,
  };
}
