"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { Button } from "./ui";

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  width: min(520px, 100%);
`;

export function GameControls() {
  const {
    state,
    undo,
    redo,
    nextRound,
    requestNewGame,
    requestResetMatch,
    requestResetBoard,
  } = useGame();

  const ended = state.status !== "playing";

  return (
    <Row>
      <Button type="button" $tone="primary" onClick={nextRound} disabled={!ended}>
        Next Round
      </Button>
      <Button type="button" onClick={requestResetBoard}>
        Reset Board
      </Button>
      <Button type="button" onClick={undo} disabled={state.moves.length === 0}>
        Undo
      </Button>
      <Button
        type="button"
        onClick={redo}
        disabled={state.redoStack.length === 0 || ended}
      >
        Redo
      </Button>
      <Button type="button" onClick={requestNewGame}>
        New Game
      </Button>
      <Button type="button" $tone="ghost" onClick={requestResetMatch}>
        Reset Match
      </Button>
    </Row>
  );
}
