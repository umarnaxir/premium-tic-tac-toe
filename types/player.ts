import type { Mark, PlayerId } from "./game";

export interface Player {
  id: PlayerId;
  name: string;
  mark: Mark;
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  roundsWon: number;
}

export interface PlayersState {
  p1: Player;
  p2: Player;
}

export interface MatchScore {
  p1: number;
  p2: number;
}
