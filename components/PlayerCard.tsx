"use client";

import { useState } from "react";
import styled, { css } from "styled-components";
import { useGame } from "@/context/GameContext";
import { gamesPlayed, winRate } from "@/lib/statistics";
import type { PlayerId } from "@/types/game";
import { Eyebrow, Label, Panel, StatGrid, StatItem, StatValue, scorePop } from "./ui";

const Card = styled(Panel)<{ $active: boolean; $side: PlayerId }>`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition:
    border-color 240ms ease,
    transform 240ms ease;

  ${({ $active, theme }) =>
    $active &&
    css`
      border-color: ${theme.borderStrong};
    `}

  &::after {
    content: ${({ $side }) => ($side === "p1" ? '"X"' : '"O"')};
    position: absolute;
    right: -8px;
    bottom: -22px;
    font-family: var(--font-display), serif;
    font-size: 120px;
    line-height: 1;
    opacity: 0.06;
    pointer-events: none;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const NameButton = styled.button`
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  color: inherit;
  text-align: left;
  min-width: 0;
`;

const Name = styled.h2`
  margin: 0;
  font-family: var(--font-display), serif;
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NameInput = styled.input`
  width: 100%;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderStrong};
  background: transparent;
  color: inherit;
  font-family: var(--font-display), serif;
  font-size: 28px;
  letter-spacing: -0.03em;
  padding: 0 0 4px;
  outline: none;
`;

const Mark = styled.span<{ $mark: "X" | "O" }>`
  font-family: var(--font-display), serif;
  font-size: 28px;
  color: ${({ $mark, theme }) => ($mark === "X" ? theme.x : theme.o)};
`;

const Score = styled.div<{ $pulse: boolean }>`
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 32px;
  letter-spacing: -0.04em;
  animation: ${({ $pulse }) => ($pulse ? scorePop : "none")} 420ms ease;
`;

export function PlayerCard({ id }: { id: PlayerId }) {
  const { state, setName } = useGame();
  const player = state.players[id];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(player.name);
  const active = state.status === "playing" && state.currentTurn === id;
  const pulse = state.status !== "playing" && state.winner === id;
  const visibleName = editing ? draft : player.name;

  const commit = () => {
    setName(id, draft);
    setEditing(false);
  };

  return (
    <Card $active={active} $side={id} aria-label={`${player.name}, ${player.mark}`}>
      <Head>
        <div>
          <Eyebrow>{id === "p1" ? "Player One" : "Player Two"}</Eyebrow>
          {editing ? (
            <NameInput
              value={visibleName}
              autoFocus
              maxLength={18}
              aria-label={`Edit ${id === "p1" ? "player one" : "player two"} name`}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commit}
              onKeyDown={(event) => {
                if (event.key === "Enter") commit();
                if (event.key === "Escape") {
                  setDraft(player.name);
                  setEditing(false);
                }
              }}
            />
          ) : (
            <NameButton
              type="button"
              onClick={() => {
                setDraft(player.name);
                setEditing(true);
              }}
            >
              <Name>{visibleName}</Name>
            </NameButton>
          )}
        </div>
        <Mark $mark={player.mark}>{player.mark}</Mark>
      </Head>

      <Score $pulse={pulse} aria-label={`${player.name} match score ${state.matchScore[id]}`}>
        {state.matchScore[id]}
      </Score>

      <StatGrid>
        <StatItem>
          <Label>Wins</Label>
          <StatValue>{player.wins}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Losses</Label>
          <StatValue>{player.losses}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Draws</Label>
          <StatValue>{player.draws}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Win rate</Label>
          <StatValue>{winRate(player)}%</StatValue>
        </StatItem>
        <StatItem>
          <Label>Played</Label>
          <StatValue>{gamesPlayed(player)}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Rounds</Label>
          <StatValue>{player.roundsWon}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Streak</Label>
          <StatValue>{player.currentStreak}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Best</Label>
          <StatValue>{player.bestStreak}</StatValue>
        </StatItem>
      </StatGrid>
    </Card>
  );
}
