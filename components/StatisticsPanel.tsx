"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { MODE_LABELS } from "@/lib/constants";
import { formatDuration } from "@/lib/gameLogic";
import {
  averageMoves,
  drawShare,
  longestCareerStreak,
  mostCommonPattern,
  mostPlayedMode,
} from "@/lib/statistics";
import { Eyebrow, Label, StatGrid, StatItem, StatValue } from "./ui";

const Note = styled.p`
  margin: 12px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.5;
`;

export function StatisticsPanel() {
  const { state } = useGame();
  const { analytics, players } = state;
  const mode = mostPlayedMode(analytics);
  const pattern = mostCommonPattern(analytics);

  return (
    <div>
      <Eyebrow>Atelier stats</Eyebrow>
      <StatGrid>
        <StatItem>
          <Label>Total games</Label>
          <StatValue>{analytics.gamesPlayed}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Today</Label>
          <StatValue>{analytics.gamesToday}</StatValue>
        </StatItem>
        <StatItem>
          <Label>{players.p1.name}</Label>
          <StatValue>{players.p1.wins}</StatValue>
        </StatItem>
        <StatItem>
          <Label>{players.p2.name}</Label>
          <StatValue>{players.p2.wins}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Draws</Label>
          <StatValue>{players.p1.draws}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Draw rate</Label>
          <StatValue>{drawShare(players)}%</StatValue>
        </StatItem>
        <StatItem>
          <Label>Avg moves</Label>
          <StatValue>{averageMoves(analytics)}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Fastest win</Label>
          <StatValue>{analytics.fastestWinMoves ?? "—"}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Longest game</Label>
          <StatValue>{analytics.longestGameMoves || "—"}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Longest streak</Label>
          <StatValue>{longestCareerStreak(players)}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Total time</Label>
          <StatValue>{formatDuration(analytics.totalDurationMs || null)}</StatValue>
        </StatItem>
        <StatItem>
          <Label>Most played</Label>
          <StatValue>{mode ? MODE_LABELS[mode] : "—"}</StatValue>
        </StatItem>
      </StatGrid>
      <Note>
        Most used winning pattern: <strong>{pattern ?? "Awaiting a decisive line"}</strong>
      </Note>
    </div>
  );
}
