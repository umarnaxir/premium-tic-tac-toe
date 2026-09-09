"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { MODE_LABELS } from "@/lib/constants";
import { longestCareerStreak, mostPlayedMode } from "@/lib/statistics";

const Strip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  padding: 10px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textMuted};
  font-size: 11px;
  flex: none;
  position: relative;
  z-index: 3;
  letter-spacing: 0.04em;
  transition: border-color 180ms ease, box-shadow 180ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.borderStrong};
    box-shadow: 0 8px 20px rgba(28, 25, 20, 0.06);
  }

  @media (max-width: 720px) {
    gap: 6px 10px;
    padding: 8px 10px;
  }
`;

const Chip = styled.span`
  padding: 4px 8px;
  border-radius: 8px;
  transition: transform 160ms ease, background 160ms ease, color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.surfaceMuted};
    color: ${({ theme }) => theme.text};
  }

  strong {
    color: ${({ theme }) => theme.text};
    font-weight: 560;
    margin-right: 6px;
  }
`;

export function AnalyticsStrip() {
  const { state } = useGame();
  const mode = mostPlayedMode(state.analytics);

  return (
    <Strip aria-label="Match statistics">
      <Chip>
        <strong>{state.analytics.gamesPlayed}</strong>Total games
      </Chip>
      <Chip>
        <strong>{state.players.p1.wins}</strong>
        {state.players.p1.name}
      </Chip>
      <Chip>
        <strong>{state.players.p2.wins}</strong>
        {state.players.p2.name}
      </Chip>
      <Chip>
        <strong>{state.players.p1.draws}</strong>Draws
      </Chip>
      <Chip>
        <strong>{longestCareerStreak(state.players)}</strong>Longest streak
      </Chip>
      <Chip>
        <strong>{mode ? MODE_LABELS[mode] : "—"}</strong>Most played
      </Chip>
    </Strip>
  );
}
