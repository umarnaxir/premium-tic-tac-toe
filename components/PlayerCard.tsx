"use client";

import { useState } from "react";
import styled, { css } from "styled-components";
import { useGame } from "@/context/GameContext";
import { initials } from "@/lib/gameLogic";
import { gamesPlayed, winRate } from "@/lib/statistics";
import type { PlayerId } from "@/types/game";
import {
  Button,
  Label,
  Panel,
  StatGrid,
  StatItem,
  StatValue,
  livePulse,
  scorePop,
  turnGlow,
  waitPulse,
  avatarPulse,
  markBob,
} from "./ui";

const Card = styled(Panel)<{ $active: boolean; $mark: "X" | "O"; $id: PlayerId }>`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  height: auto;
  min-height: 0;
  isolation: isolate;
  border-radius: 16px;
  padding: ${({ $id }) => ($id === "p1" ? "14px 28px 14px 14px" : "14px 14px 14px 28px")};
  background: ${({ $mark, theme }) =>
    $mark === "X"
      ? `linear-gradient(165deg, ${theme.xSoft} 0%, ${theme.surface} 48%)`
      : `linear-gradient(165deg, ${theme.oSoft} 0%, ${theme.surface} 48%)`};
  transition:
    border-color 240ms ease,
    transform 240ms ease,
    box-shadow 240ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 36px rgba(28, 25, 20, 0.12);
    border-color: ${({ theme }) => theme.borderStrong};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      border-color: ${theme.borderStrong};
      animation: ${livePulse} 1.8s ease infinite;
    `}

  @media (max-width: 720px) {
    padding: 14px;
    gap: 10px;
  }
`;

const Watermark = styled.span<{ $mark: "X" | "O" }>`
  position: absolute;
  right: 4px;
  bottom: -16px;
  z-index: 0;
  font-family: var(--font-display), serif;
  font-size: 96px;
  line-height: 1;
  pointer-events: none;
  color: ${({ $mark, theme }) => ($mark === "X" ? theme.x : theme.o)};
  opacity: 0.14;
  font-weight: 600;
  transition: transform 420ms ease, opacity 240ms ease;

  ${Card}:hover & {
    transform: scale(1.08) rotate(-6deg);
    opacity: 0.22;
  }
`;

const TurnRail = styled.span<{ $on: boolean; $id: PlayerId; $mark: "X" | "O" }>`
  position: absolute;
  top: 50%;
  ${({ $id }) => ($id === "p1" ? "right: 7px;" : "left: 7px;")}
  z-index: 2;
  writing-mode: vertical-rl;
  transform: translateY(-50%) ${({ $id }) => ($id === "p2" ? "rotate(180deg)" : "none")};
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  color: ${({ $on, $mark, theme }) =>
    $on ? ($mark === "X" ? theme.x : theme.o) : theme.textFaint};
  animation: ${({ $on }) => ($on ? turnGlow : waitPulse)} ${({ $on }) => ($on ? "1.5s" : "2.4s")}
    ease-in-out infinite;
`;

const Head = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const Identity = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  flex: 1;
`;

const Avatar = styled.div<{ $mark: "X" | "O"; $active: boolean }>`
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: ${({ $mark, theme }) => ($mark === "X" ? theme.xSoft : theme.oSoft)};
  color: ${({ $mark, theme }) => ($mark === "X" ? theme.x : theme.o)};
  border: 1px solid
    ${({ $active, $mark, theme }) =>
      $active ? ($mark === "X" ? theme.x : theme.o) : theme.border};
  transition: transform 220ms ease, box-shadow 220ms ease;
  animation: ${({ $active }) => ($active ? avatarPulse : "none")} 1.6s ease infinite;

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

const NameWrap = styled.div`
  min-width: 0;
  flex: 1;
`;

const Name = styled.h2`
  margin: 0;
  font-family: var(--font-display), serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Hint = styled.p`
  margin: 2px 0 0;
  font-size: 11px;
  color: ${({ theme }) => theme.textFaint};
`;

const NameInput = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  background: ${({ theme }) => theme.surfaceRaised};
  color: inherit;
  font-family: var(--font-display), serif;
  font-size: 20px;
  letter-spacing: -0.03em;
  padding: 8px 10px;
  border-radius: 10px;
  outline: none;
`;

const MarkBadge = styled.div<{ $mark: "X" | "O" }>`
  position: relative;
  z-index: 1;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-family: var(--font-display), serif;
  font-size: 26px;
  font-weight: 600;
  line-height: 1;
  background: ${({ $mark, theme }) => ($mark === "X" ? theme.xSoft : theme.oSoft)};
  color: ${({ $mark, theme }) => ($mark === "X" ? theme.x : theme.o)};
  border: 1px solid currentColor;
  transition: transform 220ms ease;

  ${Card}:hover & {
    animation: ${markBob} 700ms ease;
  }
`;

const ScoreRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
`;

const Score = styled.div<{ $pulse: boolean }>`
  font-family: var(--font-display), serif;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1;
  animation: ${({ $pulse }) => ($pulse ? scorePop : "none")} 420ms ease;
`;

const Actions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Stats = styled.div`
  position: relative;
  z-index: 1;

  ${StatGrid} {
    gap: 6px 16px;
  }

  ${Label} {
    font-size: 10px;
  }

  ${StatValue} {
    font-size: 14px;
  }
`;

const Saved = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.accent};
  align-self: center;
`;

export function PlayerCard({ id }: { id: PlayerId }) {
  const { state, setName, clickSound } = useGame();
  const player = state.players[id];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(player.name);
  const [saved, setSaved] = useState(false);
  const active = state.status === "playing" && state.currentTurn === id;
  const pulse = state.status !== "playing" && state.winner === id;

  const startEdit = () => {
    setDraft(player.name);
    setEditing(true);
    setSaved(false);
    clickSound();
  };

  const cancel = () => {
    setDraft(player.name);
    setEditing(false);
  };

  const save = () => {
    setName(id, draft);
    setEditing(false);
    setSaved(true);
    clickSound();
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <Card $active={active} $mark={player.mark} $id={id} aria-label={`${player.name}, ${player.mark}`}>
      <Watermark $mark={player.mark} aria-hidden>
        {player.mark}
      </Watermark>
      <TurnRail $on={active} $id={id} $mark={player.mark}>
        {active ? "Your turn" : "Waiting"}
      </TurnRail>
      <Head>
        <Identity>
          <Avatar $mark={player.mark} $active={active} aria-hidden>
            {initials(player.name)}
          </Avatar>
          <NameWrap>
            {editing ? (
              <NameInput
                value={draft}
                autoFocus
                maxLength={18}
                placeholder={id === "p1" ? "e.g. Umar" : "e.g. Ahmad"}
                aria-label={`Edit ${id === "p1" ? "player one" : "player two"} name`}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") save();
                  if (event.key === "Escape") cancel();
                }}
              />
            ) : (
              <Name>{player.name}</Name>
            )}
            {!editing && <Hint>Change this name anytime</Hint>}
          </NameWrap>
        </Identity>
        <MarkBadge $mark={player.mark} aria-label={`Symbol ${player.mark}`}>
          {player.mark}
        </MarkBadge>
      </Head>

      {editing ? (
        <Actions>
          <Button type="button" $tone="ghost" onClick={cancel}>
            Cancel
          </Button>
          <Button type="button" $tone="primary" onClick={save} disabled={!draft.trim()}>
            Save name
          </Button>
        </Actions>
      ) : (
        <Actions>
          <Button type="button" onClick={startEdit}>
            Edit name
          </Button>
          {saved ? <Saved>Saved</Saved> : null}
        </Actions>
      )}

      <ScoreRow>
        <div>
          <Label>Match score</Label>
          <Score $pulse={pulse} aria-label={`${player.name} match score ${state.matchScore[id]}`}>
            {state.matchScore[id]}
          </Score>
        </div>
      </ScoreRow>

      <Stats>
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
      </Stats>
    </Card>
  );
}
