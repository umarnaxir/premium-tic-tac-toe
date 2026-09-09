"use client";

import { useState } from "react";
import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { seriesLeader } from "@/lib/gameLogic";
import { Button } from "./ui";

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  flex: none;
  position: relative;
  z-index: 3;
  margin-top: 4px;

  button {
    width: 100%;
    min-height: 40px;
    padding: 10px 8px;
    font-size: 11px;
    border-radius: 12px;
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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
    swapMarks,
  } = useGame();

  const ended = state.status !== "playing";
  const champion = seriesLeader(state.settings.firstTo, state.matchScore);
  const [copied, setCopied] = useState(false);

  const copyScore = async () => {
    const text = `Xsu · ${state.players.p1.name} ${state.matchScore.p1} — ${state.matchScore.p2} ${state.players.p2.name} · Round ${state.round}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Row>
      <Button type="button" $tone="primary" onClick={nextRound} disabled={!ended || Boolean(champion)}>
        {champion ? "Series complete" : "Next Round"}
      </Button>
      <Button type="button" onClick={requestResetBoard}>
        Reset Board
      </Button>
      <Button type="button" onClick={undo} disabled={state.moves.length === 0}>
        Undo
      </Button>
      <Button type="button" onClick={redo} disabled={state.redoStack.length === 0 || ended}>
        Redo
      </Button>
      <Button type="button" onClick={swapMarks} disabled={state.moves.length > 0}>
        Swap X / O
      </Button>
      <Button type="button" onClick={() => void copyScore()}>
        {copied ? "Copied" : "Copy score"}
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
