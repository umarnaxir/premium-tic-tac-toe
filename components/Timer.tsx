"use client";

import styled, { css } from "styled-components";
import { useGame } from "@/context/GameContext";
import { formatClock } from "@/lib/gameLogic";
import type { PlayerId } from "@/types/game";
import { livePulse, warnPulse } from "./ui";

const Chip = styled.div<{ $mark: "X" | "O"; $low: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 148px;
  padding: 8px 14px;
  border-radius: 12px;
  background: ${({ $mark, theme }) => ($mark === "X" ? theme.xSoft : theme.oSoft)};
  color: ${({ $mark, theme }) => ($mark === "X" ? theme.x : theme.o)};
  font-size: 12px;
  font-weight: 550;
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(28, 25, 20, 0.08);
  }

  ${({ $active }) =>
    $active &&
    css`
      animation: ${livePulse} 1.8s ease infinite;
    `}

  strong {
    font-family: var(--font-mono), ui-monospace, monospace;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: inherit;
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
  const player = state.players[id];
  const active =
    state.status === "playing" && state.currentTurn === id && state.roundStartedAt !== null;

  return (
    <Chip
      $mark={player.mark}
      $low={remaining <= 10}
      $active={active}
      aria-live={active ? "polite" : "off"}
    >
      <span>{player.name}</span>
      <strong>{formatClock(remaining)}</strong>
    </Chip>
  );
}

const Pair = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px 12px;
  width: min(420px, 100%);
`;

const Caption = styled.p`
  flex-basis: 100%;
  margin: 0;
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.12em;
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
