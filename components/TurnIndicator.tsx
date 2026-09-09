"use client";

import styled, { css } from "styled-components";
import { useGame } from "@/context/GameContext";
import { fadeUp } from "./ui";

const Wrap = styled.div<{ $emphasis: boolean }>`
  text-align: center;
  min-height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  animation: ${fadeUp} 480ms ease both;
`;

const Kicker = styled.p`
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textFaint};
`;

const Status = styled.h2<{ $tone: "play" | "win" | "draw" }>`
  margin: 0;
  font-family: var(--font-display), serif;
  font-size: clamp(28px, 3.4vw, 42px);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.05;

  ${({ $tone, theme }) =>
    $tone === "win" &&
    css`
      color: ${theme.accent};
    `}
`;

export function TurnIndicator() {
  const { state } = useGame();
  const current = state.players[state.currentTurn];

  if (state.status === "won" && state.winner) {
    const onTime = state.settings.mode === "timed" && !state.winningLine;
    return (
      <Wrap $emphasis role="status" aria-live="polite">
        <Kicker>{onTime ? "Time expired" : "Match result"}</Kicker>
        <Status $tone="win">🏆 {state.players[state.winner].name} is the Winner!</Status>
      </Wrap>
    );
  }

  if (state.status === "draw") {
    return (
      <Wrap $emphasis role="status" aria-live="polite">
        <Kicker>Match result</Kicker>
        <Status $tone="draw">It&apos;s a Draw!</Status>
      </Wrap>
    );
  }

  return (
    <Wrap $emphasis={false} role="status" aria-live="polite">
      <Kicker>Now playing</Kicker>
      <Status $tone="play">{current.name}&apos;s Turn</Status>
    </Wrap>
  );
}
