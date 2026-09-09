"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { MODE_LABELS } from "@/lib/constants";
import { seriesLeader } from "@/lib/gameLogic";
import { MoreMenu } from "./MoreMenu";
import { SoundToggle } from "./SoundToggle";
import { ThemeToggle } from "./ThemeToggle";
import { fadeUp } from "./ui";

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 2px;
  flex: none;
  animation: ${fadeUp} 520ms ease both;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textMuted};
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Tools = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
  position: relative;
  z-index: 20;
`;

export function GameHeader() {
  const { state } = useGame();
  const mode = MODE_LABELS[state.settings.mode];
  const rule =
    state.settings.mode === "pro"
      ? `${state.settings.proWinLength} in a row`
      : state.settings.mode === "timed"
        ? `${state.settings.timedSeconds}s clocks`
        : "3 in a row";
  const champion = seriesLeader(state.settings.firstTo, state.matchScore);
  const series = champion
    ? `${state.players[champion].name} takes the series`
    : state.settings.firstTo
      ? `First to ${state.settings.firstTo}`
      : state.matchScore.p1 === state.matchScore.p2
        ? "Match tied"
        : state.matchScore.p1 > state.matchScore.p2
          ? `${state.players.p1.name} ahead`
          : `${state.players.p2.name} ahead`;

  return (
    <Bar>
      <Brand>
        <Meta>
          {mode} · Round {state.round} · {rule} · {series}
        </Meta>
      </Brand>
      <Tools>
        <SoundToggle />
        <ThemeToggle />
        <MoreMenu />
      </Tools>
    </Bar>
  );
}
