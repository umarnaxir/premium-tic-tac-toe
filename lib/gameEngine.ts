import type { ConfirmRequest, FirstTo, GameMode, PlayerId, StarterMode } from "@/types/game";
import { DEFAULT_ANALYTICS, DEFAULT_P1, DEFAULT_P2 } from "./constants";
import {
  cellLabel,
  createEmptyBoard,
  createId,
  evaluateBoard,
  getBoardSize,
  getWinLength,
} from "./gameLogic";
import {
  applyAnalytics,
  applyResultToPlayer,
  revertAnalytics,
  revertResultOnPlayer,
} from "./statistics";
import type { GameSnapshot, ResultSnapshot } from "./storage";
import { createInitialSnapshot } from "./storage";

export type GameAction =
  | { type: "HYDRATE"; payload: GameSnapshot }
  | { type: "PLACE"; index: number }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET_BOARD" }
  | { type: "NEXT_ROUND" }
  | { type: "NEW_GAME"; keepHistory: boolean }
  | { type: "RESET_MATCH" }
  | { type: "CLEAR_HISTORY" }
  | { type: "SET_NAME"; player: PlayerId; name: string }
  | { type: "SET_THEME" }
  | { type: "SET_SOUND"; sound: boolean }
  | { type: "SET_MODE"; mode: GameMode }
  | { type: "SET_TIMED_SECONDS"; seconds: 30 | 60 | 90 }
  | { type: "SET_PRO_WIN"; length: 4 | 5 }
  | { type: "SET_STARTER"; starter: StarterMode }
  | { type: "SET_FIRST_TO"; firstTo: FirstTo }
  | { type: "SWAP_MARKS" }
  | { type: "TICK"; amount: number }
  | { type: "TIMEOUT" }
  | { type: "FOCUS_CELL"; index: number }
  | { type: "REQUEST_CONFIRM"; confirm: ConfirmRequest }
  | { type: "DISMISS_CONFIRM" };

export interface UiState {
  confirm: ConfirmRequest | null;
}

export interface EngineState extends GameSnapshot {
  confirm: ConfirmRequest | null;
}

export function createEngineState(): EngineState {
  return { ...createInitialSnapshot(), confirm: null };
}

function nextStarter(state: EngineState, incrementRound: boolean): PlayerId {
  const starter = state.settings.starter;
  if (starter === "p2") return "p2";
  if (starter === "alternate") {
    const round = incrementRound ? state.round + 1 : state.round;
    return round % 2 === 1 ? "p1" : "p2";
  }
  return "p1";
}

function freshBoard(state: EngineState, incrementRound: boolean): EngineState {
  const size = getBoardSize(state.settings.mode);
  return {
    ...state,
    board: createEmptyBoard(size),
    currentTurn: nextStarter(state, incrementRound),
    status: "playing",
    winner: null,
    winningLine: null,
    winningPattern: null,
    moves: [],
    redoStack: [],
    timers: {
      p1: state.settings.timedSeconds,
      p2: state.settings.timedSeconds,
    },
    roundStartedAt: null,
    lastResult: null,
    focusedIndex: 0,
    round: incrementRound ? state.round + 1 : state.round,
    confirm: null,
  };
}

function conclude(
  state: EngineState,
  winner: PlayerId | "draw",
  line: number[] | null,
  pattern: ResultSnapshot["entry"]["pattern"],
): EngineState {
  if (state.status !== "playing") return state;

  const durationMs = state.roundStartedAt
    ? Date.now() - state.roundStartedAt
    : null;

  const entry = {
    id: createId(),
    timestamp: Date.now(),
    p1Name: state.players.p1.name,
    p2Name: state.players.p2.name,
    winner,
    mode: state.settings.mode,
    round: state.round,
    moves: state.moves.length,
    durationMs,
    pattern,
  };

  const snapshot: ResultSnapshot = {
    entry,
    p1Streak: state.players.p1.currentStreak,
    p1Best: state.players.p1.bestStreak,
    p2Streak: state.players.p2.currentStreak,
    p2Best: state.players.p2.bestStreak,
    matchScore: { ...state.matchScore },
  };

  let players = state.players;
  let matchScore = { ...state.matchScore };

  if (winner === "draw") {
    players = {
      p1: applyResultToPlayer(state.players.p1, "draw"),
      p2: applyResultToPlayer(state.players.p2, "draw"),
    };
  } else {
    const loser: PlayerId = winner === "p1" ? "p2" : "p1";
    players = {
      ...state.players,
      [winner]: applyResultToPlayer(state.players[winner], "win"),
      [loser]: applyResultToPlayer(state.players[loser], "loss"),
    };
    matchScore = {
      ...matchScore,
      [winner]: matchScore[winner] + 1,
    };
  }

  return {
    ...state,
    status: winner === "draw" ? "draw" : "won",
    winner: winner === "draw" ? null : winner,
    winningLine: line,
    winningPattern: pattern,
    players,
    matchScore,
    history: [entry, ...state.history].slice(0, 80),
    analytics: applyAnalytics(state.analytics, entry),
    lastResult: snapshot,
  };
}

function undoCompleted(state: EngineState): EngineState {
  const result = state.lastResult;
  if (!result) return state;

  const winner = result.entry.winner;
  let players = state.players;
  if (winner === "draw") {
    players = {
      p1: revertResultOnPlayer(
        state.players.p1,
        "draw",
        result.p1Streak,
        result.p1Best,
      ),
      p2: revertResultOnPlayer(
        state.players.p2,
        "draw",
        result.p2Streak,
        result.p2Best,
      ),
    };
  } else {
    const loser: PlayerId = winner === "p1" ? "p2" : "p1";
    players = {
      ...state.players,
      [winner]: revertResultOnPlayer(
        state.players[winner],
        "win",
        winner === "p1" ? result.p1Streak : result.p2Streak,
        winner === "p1" ? result.p1Best : result.p2Best,
      ),
      [loser]: revertResultOnPlayer(
        state.players[loser],
        "loss",
        loser === "p1" ? result.p1Streak : result.p2Streak,
        loser === "p1" ? result.p1Best : result.p2Best,
      ),
    };
  }

  return {
    ...state,
    players,
    matchScore: result.matchScore,
    history: state.history.filter((item) => item.id !== result.entry.id),
    analytics: revertAnalytics(state.analytics, result.entry),
    lastResult: null,
    status: "playing",
    winner: null,
    winningLine: null,
    winningPattern: null,
  };
}

function placeMark(state: EngineState, index: number): EngineState {
  if (state.status !== "playing") return state;
  if (index < 0 || index >= state.board.length) return state;
  if (state.board[index]) return state;

  const player = state.currentTurn;
  const mark = state.players[player].mark;
  const size = getBoardSize(state.settings.mode);
  const board = state.board.slice();
  board[index] = mark;

  const move = {
    index,
    player,
    mark,
    label: cellLabel(index, size),
  };

  const next: EngineState = {
    ...state,
    board,
    moves: [...state.moves, move],
    redoStack: [],
    currentTurn: player === "p1" ? "p2" : "p1",
    roundStartedAt: state.roundStartedAt ?? Date.now(),
    focusedIndex: index,
  };

  const win = evaluateBoard(
    board,
    size,
    getWinLength(state.settings.mode, state.settings.proWinLength),
  );

  if (win) {
    const winner: PlayerId =
      win.winner === state.players.p1.mark ? "p1" : "p2";
    return conclude(next, winner, win.line, win.pattern);
  }

  if (board.every(Boolean)) {
    return conclude(next, "draw", null, null);
  }

  return next;
}

function undo(state: EngineState): EngineState {
  if (state.moves.length === 0) return state;

  const working = state.status !== "playing" ? undoCompleted(state) : state;
  const moves = working.moves.slice();
  const last = moves.pop();
  if (!last) return working;

  const board = working.board.slice();
  board[last.index] = null;

  return {
    ...working,
    board,
    moves,
    redoStack: [last, ...working.redoStack],
    currentTurn: last.player,
    focusedIndex: last.index,
  };
}

function redo(state: EngineState): EngineState {
  if (state.status !== "playing" || state.redoStack.length === 0) return state;
  const [next, ...rest] = state.redoStack;
  if (!next) return state;
  const placed = placeMark({ ...state, redoStack: [] }, next.index);
  return { ...placed, redoStack: rest };
}

export function gameReducer(state: EngineState, action: GameAction): EngineState {
  switch (action.type) {
    case "HYDRATE":
      return { ...action.payload, confirm: null };

    case "PLACE":
      return placeMark(state, action.index);

    case "UNDO":
      return undo(state);

    case "REDO":
      return redo(state);

    case "RESET_BOARD":
      return freshBoard(state, false);

    case "NEXT_ROUND":
      return freshBoard(state, true);

    case "NEW_GAME": {
      const size = getBoardSize(state.settings.mode);
      return {
        ...state,
        board: createEmptyBoard(size),
        currentTurn: nextStarter(state, false),
        status: "playing",
        winner: null,
        winningLine: null,
        winningPattern: null,
        round: 1,
        matchScore: { p1: 0, p2: 0 },
        moves: [],
        redoStack: [],
        timers: {
          p1: state.settings.timedSeconds,
          p2: state.settings.timedSeconds,
        },
        roundStartedAt: null,
        lastResult: null,
        focusedIndex: 0,
        confirm: null,
        history: action.keepHistory ? state.history : [],
        analytics: action.keepHistory
          ? state.analytics
          : {
              ...DEFAULT_ANALYTICS,
              modeCounts: { classic: 0, pro: 0, timed: 0 },
            },
        players: action.keepHistory
          ? state.players
          : {
              p1: {
                ...DEFAULT_P1,
                name: state.players.p1.name,
                mark: state.players.p1.mark,
              },
              p2: {
                ...DEFAULT_P2,
                name: state.players.p2.name,
                mark: state.players.p2.mark,
              },
            },
      };
    }

    case "RESET_MATCH":
      return {
        ...freshBoard(state, false),
        round: 1,
        matchScore: { p1: 0, p2: 0 },
      };

    case "CLEAR_HISTORY":
      return {
        ...state,
        history: [],
        analytics: {
          ...DEFAULT_ANALYTICS,
          modeCounts: { classic: 0, pro: 0, timed: 0 },
        },
        players: {
          p1: {
            ...DEFAULT_P1,
            name: state.players.p1.name,
            mark: state.players.p1.mark,
          },
          p2: {
            ...DEFAULT_P2,
            name: state.players.p2.name,
            mark: state.players.p2.mark,
          },
        },
        confirm: null,
      };

    case "SET_NAME":
      return {
        ...state,
        players: {
          ...state.players,
          [action.player]: {
            ...state.players[action.player],
            name: action.name || state.players[action.player].name,
          },
        },
      };

    case "SET_THEME":
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: state.settings.theme === "dark" ? "light" : "dark",
        },
      };

    case "SET_SOUND":
      return {
        ...state,
        settings: { ...state.settings, sound: action.sound },
      };

    case "SET_MODE": {
      const next = {
        ...state,
        settings: { ...state.settings, mode: action.mode },
      };
      return {
        ...freshBoard(next, false),
        round: 1,
        matchScore: { p1: 0, p2: 0 },
      };
    }

    case "SET_TIMED_SECONDS":
      return {
        ...state,
        settings: { ...state.settings, timedSeconds: action.seconds },
        timers:
          state.status === "playing" && state.moves.length === 0
            ? { p1: action.seconds, p2: action.seconds }
            : state.timers,
      };

    case "SET_PRO_WIN":
      return {
        ...state,
        settings: { ...state.settings, proWinLength: action.length },
      };

    case "SET_STARTER":
      return {
        ...state,
        settings: { ...state.settings, starter: action.starter },
        currentTurn:
          state.moves.length === 0 && state.status === "playing"
            ? action.starter === "p2"
              ? "p2"
              : action.starter === "alternate"
                ? state.round % 2 === 1
                  ? "p1"
                  : "p2"
                : "p1"
            : state.currentTurn,
      };

    case "SET_FIRST_TO":
      return {
        ...state,
        settings: { ...state.settings, firstTo: action.firstTo },
      };

    case "SWAP_MARKS": {
      if (state.moves.length > 0) return state;
      return {
        ...state,
        players: {
          p1: { ...state.players.p1, mark: state.players.p2.mark },
          p2: { ...state.players.p2, mark: state.players.p1.mark },
        },
      };
    }

    case "TICK": {
      if (state.settings.mode !== "timed" || state.status !== "playing") {
        return state;
      }
      if (state.roundStartedAt === null) return state;
      const current = state.currentTurn;
      const nextValue = Math.max(0, state.timers[current] - action.amount);
      const next = {
        ...state,
        timers: { ...state.timers, [current]: nextValue },
      };
      if (nextValue <= 0) {
        const winner: PlayerId = current === "p1" ? "p2" : "p1";
        return conclude(next, winner, null, null);
      }
      return next;
    }

    case "TIMEOUT": {
      if (state.settings.mode !== "timed" || state.status !== "playing") {
        return state;
      }
      const winner: PlayerId = state.currentTurn === "p1" ? "p2" : "p1";
      return conclude(
        {
          ...state,
          timers: { ...state.timers, [state.currentTurn]: 0 },
        },
        winner,
        null,
        null,
      );
    }

    case "FOCUS_CELL":
      return { ...state, focusedIndex: action.index };

    case "REQUEST_CONFIRM":
      return { ...state, confirm: action.confirm };

    case "DISMISS_CONFIRM":
      return { ...state, confirm: null };

    default:
      return state;
  }
}

export function snapshotFromState(state: EngineState): GameSnapshot {
  return {
    version: state.version,
    settings: state.settings,
    players: state.players,
    board: state.board,
    currentTurn: state.currentTurn,
    status: state.status,
    winner: state.winner,
    winningLine: state.winningLine,
    winningPattern: state.winningPattern,
    round: state.round,
    matchScore: state.matchScore,
    moves: state.moves,
    redoStack: state.redoStack,
    timers: state.timers,
    roundStartedAt: state.roundStartedAt,
    history: state.history,
    analytics: state.analytics,
    lastResult: state.lastResult,
    focusedIndex: state.focusedIndex,
  };
}
