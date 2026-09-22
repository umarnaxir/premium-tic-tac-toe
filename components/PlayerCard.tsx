"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
    padding: 12px 14px;
    gap: 8px;

    &:hover {
      transform: none;
    }
  }
`;

const Watermark = styled.span<{ $mark: "X" | "O"; $id: PlayerId }>`
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

  @media (max-width: 720px) {
    ${({ $id }) => ($id === "p2" ? "left: 4px; right: auto;" : "")}
    font-size: 72px;
    bottom: 2px;
    opacity: 0.1;
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

  @media (max-width: 720px) {
    display: none;
  }
`;

const Head = styled.div<{ $id: PlayerId }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 720px) {
    align-items: center;
    flex-direction: ${({ $id }) => ($id === "p2" ? "row-reverse" : "row")};
  }
`;

const Identity = styled.div<{ $id: PlayerId }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  flex: 1;

  @media (max-width: 720px) {
    align-items: center;
    flex-direction: ${({ $id }) => ($id === "p2" ? "row-reverse" : "row")};
    text-align: ${({ $id }) => ($id === "p2" ? "right" : "left")};
  }
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

  @media (max-width: 720px) {
    display: none;
  }
`;

const EditOrb = styled.button<{ $mark: "X" | "O"; $active: boolean }>`
  display: none;
  appearance: none;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 50%;
  place-items: center;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  background: ${({ $mark, theme }) => ($mark === "X" ? theme.xSoft : theme.oSoft)};
  color: ${({ $mark, theme }) => ($mark === "X" ? theme.x : theme.o)};
  border: 1.5px solid
    ${({ $active, $mark, theme }) =>
      $active ? ($mark === "X" ? theme.x : theme.o) : theme.borderStrong};
  transition: transform 180ms ease, box-shadow 180ms ease;
  animation: ${({ $active }) => ($active ? avatarPulse : "none")} 1.6s ease infinite;

  &:hover {
    transform: scale(1.06);
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: 720px) {
    display: grid;
    width: 28px;
    height: 28px;
    font-size: 12px;
    border-width: 1px;
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

  @media (max-width: 720px) {
    font-size: clamp(22px, 7vw, 28px);
    line-height: 1.05;
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    overflow-wrap: anywhere;
  }
`;

const Hint = styled.p`
  margin: 2px 0 0;
  font-size: 11px;
  color: ${({ theme }) => theme.textFaint};

  @media (max-width: 720px) {
    display: none;
  }
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

  @media (max-width: 720px) {
    width: 28px;
    height: 28px;
    font-size: 17px;
    border-radius: 8px;
  }
`;

const ScoreRow = styled.div<{ $id: PlayerId }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;

  @media (max-width: 720px) {
    justify-content: ${({ $id }) => ($id === "p2" ? "flex-end" : "flex-start")};
    text-align: ${({ $id }) => ($id === "p2" ? "right" : "left")};
  }
`;

const Score = styled.div<{ $pulse: boolean }>`
  font-family: var(--font-display), serif;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1;
  animation: ${({ $pulse }) => ($pulse ? scorePop : "none")} 420ms ease;

  @media (max-width: 720px) {
    font-size: 28px;
  }
`;

const Actions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 720px) {
    display: none;
  }
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

  @media (max-width: 720px) {
    display: none;
  }
`;

const Saved = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.accent};
  align-self: center;
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: ${({ theme }) =>
    theme.name === "dark" ? "rgba(6, 7, 10, 0.88)" : "rgba(28, 25, 20, 0.62)"};
  display: grid;
  place-items: end center;
  padding: 0;
  overscroll-behavior: contain;

  @media (min-width: 721px) {
    place-items: center;
    padding: 24px;
  }
`;

const Sheet = styled.div`
  width: min(440px, 100%);
  max-height: min(88dvh, 720px);
  background: ${({ theme }) => theme.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px 20px 0 0;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 18px 18px calc(18px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: auto;
  overscroll-behavior: contain;

  @media (min-width: 721px) {
    border-radius: 16px;
    padding: 22px;
  }
`;

const MobileSheetClose = styled.button`
  display: none;

  @media (max-width: 720px) {
    appearance: none;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: ${({ theme }) => theme.surfaceMuted};
    color: ${({ theme }) => theme.text};
    font-size: 20px;
    line-height: 1;
    position: absolute;
    top: 4px;
    right: 0;
  }
`;

const SheetHead = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const SheetTitle = styled.h2`
  margin: 0;
  font-family: var(--font-display), serif;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.03em;
`;

const SheetMark = styled.span<{ $mark: "X" | "O" }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-family: var(--font-display), serif;
  font-size: 22px;
  font-weight: 600;
  background: ${({ $mark, theme }) => ($mark === "X" ? theme.xSoft : theme.oSoft)};
  color: ${({ $mark, theme }) => ($mark === "X" ? theme.x : theme.o)};
  border: 1px solid currentColor;

  @media (max-width: 720px) {
    margin-right: 42px;
  }
`;

const SheetActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
`;

const SheetStats = styled.div`
  ${StatGrid} {
    gap: 8px 14px;
  }
`;

function PlayerStats({ id }: { id: PlayerId }) {
  const { state } = useGame();
  const player = state.players[id];

  return (
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
  );
}

export function PlayerCard({ id }: { id: PlayerId }) {
  const { state, setName, clickSound } = useGame();
  const player = state.players[id];
  const [editing, setEditing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState(player.name);
  const [saved, setSaved] = useState(false);
  const sheetInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const active = state.status === "playing" && state.currentTurn === id;
  const pulse = state.status !== "playing" && state.winner === id;

  useEffect(() => {
    if (!sheetOpen) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusInput = window.requestAnimationFrame(() => sheetInputRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(focusInput);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus();
    };
  }, [sheetOpen]);

  const startEdit = () => {
    setDraft(player.name);
    setEditing(true);
    setSaved(false);
    clickSound();
  };

  const openSheet = () => {
    setDraft(player.name);
    setSaved(false);
    setSheetOpen(true);
    clickSound();
  };

  const closeSheet = () => {
    setDraft(player.name);
    setSheetOpen(false);
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

  const saveSheet = () => {
    setName(id, draft);
    setSaved(true);
    clickSound();
    window.setTimeout(() => {
      setSaved(false);
      setSheetOpen(false);
    }, 700);
  };

  return (
    <Card $active={active} $mark={player.mark} $id={id} aria-label={`${player.name}, ${player.mark}`}>
      <Watermark $mark={player.mark} $id={id} aria-hidden>
        {player.mark}
      </Watermark>
      <TurnRail $on={active} $id={id} $mark={player.mark}>
        {active ? "Your turn" : "Waiting"}
      </TurnRail>
      <Head $id={id}>
        <Identity $id={id}>
          <Avatar $mark={player.mark} $active={active} aria-hidden>
            {initials(player.name)}
          </Avatar>
          <EditOrb
            type="button"
            $mark={player.mark}
            $active={active}
            onClick={openSheet}
            aria-label={`Edit ${player.name}`}
            title="Edit player"
          >
            ✎
          </EditOrb>
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

      <ScoreRow $id={id}>
        <div>
          <Label>Match score</Label>
          <Score $pulse={pulse} aria-label={`${player.name} match score ${state.matchScore[id]}`}>
            {state.matchScore[id]}
          </Score>
        </div>
      </ScoreRow>

      <Stats>
        <PlayerStats id={id} />
      </Stats>

      {sheetOpen
        ? createPortal(
            <Backdrop role="presentation" onClick={closeSheet}>
              <Sheet
                role="dialog"
                aria-modal="true"
                aria-labelledby={`player-sheet-${id}`}
                onClick={(event) => event.stopPropagation()}
              >
                <SheetHead>
                  <SheetTitle id={`player-sheet-${id}`}>{player.name}</SheetTitle>
                  <SheetMark $mark={player.mark} aria-hidden>
                    {player.mark}
                  </SheetMark>
                  <MobileSheetClose type="button" onClick={closeSheet} aria-label="Close player editor">
                    ×
                  </MobileSheetClose>
                </SheetHead>

                <div>
                  <Label>Player name</Label>
                  <NameInput
                    ref={sheetInputRef}
                    value={draft}
                    maxLength={18}
                    placeholder={id === "p1" ? "e.g. Umar" : "e.g. Ahmad"}
                    aria-label={`Edit ${id === "p1" ? "player one" : "player two"} name`}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && draft.trim()) saveSheet();
                      if (event.key === "Escape") closeSheet();
                    }}
                  />
                </div>

                <SheetActions>
                  <Button type="button" $tone="ghost" onClick={closeSheet}>
                    Cancel
                  </Button>
                  <Button type="button" $tone="primary" onClick={saveSheet} disabled={!draft.trim()}>
                    {saved ? "Saved" : "Save name"}
                  </Button>
                </SheetActions>

                <SheetStats>
                  <Label>Match score · {state.matchScore[id]}</Label>
                  <PlayerStats id={id} />
                </SheetStats>
              </Sheet>
            </Backdrop>,
            document.body,
          )
        : null}
    </Card>
  );
}
