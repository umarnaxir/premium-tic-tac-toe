"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { seriesLeader } from "@/lib/gameLogic";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: min(420px, 100%);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.textMuted};
  font-size: 13px;
  letter-spacing: 0.04em;
  width: 100%;
`;

const Name = styled.span<{ $mark: "X" | "O" }>`
  color: ${({ $mark, theme }) => ($mark === "X" ? theme.x : theme.o)};
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 34%;
  transition: transform 160ms ease, opacity 160ms ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.82;
  }
`;

const Score = styled.strong`
  color: ${({ theme }) => theme.text};
  font-family: var(--font-display), serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.03em;
`;

const Note = styled.p`
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
`;

export function MatchScore() {
  const { state } = useGame();
  const champion = seriesLeader(state.settings.firstTo, state.matchScore);

  return (
    <Wrap>
      <Row aria-label="Match score">
        <Name $mark={state.players.p1.mark}>{state.players.p1.name}</Name>
        <Score>
          {state.matchScore.p1} — {state.matchScore.p2}
        </Score>
        <Name $mark={state.players.p2.mark}>{state.players.p2.name}</Name>
      </Row>
      {champion ? (
        <Note>{state.players[champion].name} wins the series</Note>
      ) : state.settings.firstTo ? (
        <Note>First to {state.settings.firstTo}</Note>
      ) : null}
    </Wrap>
  );
}
