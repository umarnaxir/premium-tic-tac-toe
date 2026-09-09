"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { MODE_LABELS } from "@/lib/constants";
import { longestCareerStreak, mostPlayedMode } from "@/lib/statistics";

const Strip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  padding: 12px 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textMuted};
  font-size: 12px;
  letter-spacing: 0.04em;
`;

const Chip = styled.span`
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
