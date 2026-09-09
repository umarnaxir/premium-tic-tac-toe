"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: ${({ theme }) => theme.textMuted};
  font-size: 13px;
  letter-spacing: 0.04em;
`;

const Score = styled.strong`
  color: ${({ theme }) => theme.text};
  font-family: var(--font-display), serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.03em;
`;

export function MatchScore() {
  const { state } = useGame();
  return (
    <Row aria-label="Match score">
      <span>{state.players.p1.name}</span>
      <Score>
        {state.matchScore.p1} — {state.matchScore.p2}
      </Score>
      <span>{state.players.p2.name}</span>
    </Row>
  );
}
