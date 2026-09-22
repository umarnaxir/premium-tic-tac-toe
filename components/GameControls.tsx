"use client";

import { useState } from "react";
import styled, { css } from "styled-components";
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
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    margin-top: 0;
    padding: 8px 10px;
    border-radius: 22px;
    background: ${({ theme }) => theme.surface};
    border: 1px solid ${({ theme }) => theme.border};
    box-shadow: ${({ theme }) => theme.shadow};

    button {
      flex: 1 1 0;
      width: auto;
      min-width: 0;
      max-width: 48px;
      min-height: 42px;
      height: 42px;
      padding: 0;
      border-radius: 50%;
      font-size: 16px;
      letter-spacing: 0;
      text-transform: none;
      transition:
        transform 160ms ease,
        background 160ms ease,
        box-shadow 160ms ease,
        opacity 160ms ease;

      &:active:not(:disabled) {
        transform: scale(0.9);
      }
    }
  }
`;

const Label = styled.span`
  @media (max-width: 720px) {
    display: none;
  }
`;

const Glyph = styled.span`
  display: none;
  line-height: 1;

  @media (max-width: 720px) {
    display: inline;
  }
`;

const PhoneHide = styled.span`
  display: contents;

  @media (max-width: 720px) {
    display: none;
  }
`;

const Control = styled(Button)<{ $pulse?: boolean }>`
  ${({ $pulse, theme }) =>
    $pulse &&
    css`
      @media (max-width: 720px) {
        box-shadow: 0 0 0 3px ${theme.accentSoft};
        animation: none;
      }
    `}
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
  const nextReady = ended && !champion;

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
      <Control
        type="button"
        $tone="primary"
        $pulse={nextReady}
        onClick={nextRound}
        disabled={!ended || Boolean(champion)}
        aria-label={champion ? "Series complete" : "Next Round"}
        title={champion ? "Series complete" : "Next Round"}
      >
        <Glyph aria-hidden>{champion ? "★" : "▶"}</Glyph>
        <Label>{champion ? "Series complete" : "Next Round"}</Label>
      </Control>
      <Button type="button" onClick={requestResetBoard} aria-label="Reset Board" title="Reset Board">
        <Glyph aria-hidden>↺</Glyph>
        <Label>Reset Board</Label>
      </Button>
      <Button
        type="button"
        onClick={undo}
        disabled={state.moves.length === 0}
        aria-label="Undo"
        title="Undo"
      >
        <Glyph aria-hidden>↶</Glyph>
        <Label>Undo</Label>
      </Button>
      <Button
        type="button"
        onClick={redo}
        disabled={state.redoStack.length === 0 || ended}
        aria-label="Redo"
        title="Redo"
      >
        <Glyph aria-hidden>↷</Glyph>
        <Label>Redo</Label>
      </Button>
      <Button
        type="button"
        onClick={swapMarks}
        disabled={state.moves.length > 0}
        aria-label="Swap X / O"
        title="Swap X / O"
      >
        <Glyph aria-hidden>⇄</Glyph>
        <Label>Swap X / O</Label>
      </Button>
      <PhoneHide>
        <Button
          type="button"
          onClick={() => void copyScore()}
          aria-label={copied ? "Copied" : "Copy score"}
          title={copied ? "Copied" : "Copy score"}
        >
          <Glyph aria-hidden>{copied ? "✓" : "⎘"}</Glyph>
          <Label>{copied ? "Copied" : "Copy score"}</Label>
        </Button>
        <Button type="button" onClick={requestNewGame} aria-label="New Game" title="New Game">
          <Glyph aria-hidden>＋</Glyph>
          <Label>New Game</Label>
        </Button>
      </PhoneHide>
      <Button
        type="button"
        $tone="ghost"
        onClick={requestResetMatch}
        aria-label="Reset Match"
        title="Reset Match"
      >
        <Glyph aria-hidden>×</Glyph>
        <Label>Reset Match</Label>
      </Button>
    </Row>
  );
}
