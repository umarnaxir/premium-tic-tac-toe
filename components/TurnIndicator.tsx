"use client";

import styled, { css } from "styled-components";
import { useGame } from "@/context/GameContext";
import { fadeUp, pulseSoft, markBob } from "./ui";

const Wrap = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  animation: ${fadeUp} 480ms ease both;
`;

const Kicker = styled.p`
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textFaint};
  animation: ${pulseSoft} 2.2s ease infinite;
`;

const Status = styled.h2<{ $tone: "play" | "win" | "draw" }>`
  margin: 0;
  font-family: var(--font-display), serif;
  font-size: clamp(18px, 2.2vw, 28px);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.05;

  ${({ $tone, theme }) =>
    $tone === "win" &&
    css`
      color: ${theme.accent};
    `}

  ${({ $tone, theme }) =>
    $tone === "play" &&
    css`
      color: ${theme.text};
    `}
`;

const MarkHint = styled.span<{ $mark: "X" | "O" }>`
  display: inline-block;
  color: ${({ $mark, theme }) => ($mark === "X" ? theme.x : theme.o)};
  animation: ${markBob} 1.4s ease-in-out infinite;
`;

export function TurnIndicator() {
  const { state } = useGame();
  const current = state.players[state.currentTurn];

  if (state.status === "won" && state.winner) {
    const onTime = state.settings.mode === "timed" && !state.winningLine;
    return (
      <Wrap role="status" aria-live="polite">
        <Kicker>{onTime ? "Time expired" : "Match result"}</Kicker>
        <Status $tone="win">🏆 {state.players[state.winner].name} is the Winner!</Status>
      </Wrap>
    );
  }

  if (state.status === "draw") {
    return (
      <Wrap role="status" aria-live="polite">
        <Kicker>Match result</Kicker>
        <Status $tone="draw">It&apos;s a Draw!</Status>
      </Wrap>
    );
  }

  return (
    <Wrap role="status" aria-live="polite">
      <Kicker>Now playing · {current.mark}</Kicker>
      <Status $tone="play">
        {current.name}&apos;s Turn <MarkHint $mark={current.mark}>{current.mark}</MarkHint>
      </Status>
    </Wrap>
  );
}
