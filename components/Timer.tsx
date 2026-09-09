"use client";

import styled, { css } from "styled-components";
import { useGame } from "@/context/GameContext";
import { formatClock } from "@/lib/gameLogic";
import type { PlayerId } from "@/types/game";
import { warnPulse } from "./ui";

const Wrap = styled.div<{ $low: boolean; $active: boolean }>`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 2px 0;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 13px;
  color: ${({ theme }) => theme.textMuted};

  strong {
    font-size: 18px;
    color: ${({ theme }) => theme.text};
    ${({ $low, $active }) =>
      $low &&
      $active &&
      css`
        animation: ${warnPulse} 900ms ease infinite;
      `}
  }
`;

export function Timer({ id }: { id: PlayerId }) {
  const { state } = useGame();
  if (state.settings.mode !== "timed") return null;

  const remaining = state.timers[id];
  const active = state.status === "playing" && state.currentTurn === id && state.roundStartedAt !== null;

  return (
    <Wrap $low={remaining <= 10} $active={active} aria-live={active ? "polite" : "off"}>
      <span>{state.players[id].name}</span>
      <strong>{formatClock(remaining)}</strong>
    </Wrap>
  );
}

const Pair = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: min(420px, 100%);
`;

const Caption = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textFaint};
`;

export function TimerPair() {
  const { state } = useGame();
  if (state.settings.mode !== "timed") return null;
  return (
    <Pair>
      <Timer id="p1" />
      <Timer id="p2" />
      {state.roundStartedAt === null && state.status === "playing" && (
        <Caption>Clocks start after the opening mark</Caption>
      )}
    </Pair>
  );
}
