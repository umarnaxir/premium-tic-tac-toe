"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { MODE_LABELS } from "@/lib/constants";
import { SoundToggle } from "./SoundToggle";
import { ThemeToggle } from "./ThemeToggle";
import { fadeUp } from "./ui";

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 2px 4px;
  animation: ${fadeUp} 520ms ease both;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-display), serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 480;
  letter-spacing: -0.03em;
  line-height: 1;
`;

const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textMuted};
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Tools = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

  return (
    <Bar>
      <Brand>
        <Title>Arena</Title>
        <Meta>
          {mode} · Round {state.round} · {rule}
        </Meta>
      </Brand>
      <Tools>
        <SoundToggle />
        <ThemeToggle />
      </Tools>
    </Bar>
  );
}
