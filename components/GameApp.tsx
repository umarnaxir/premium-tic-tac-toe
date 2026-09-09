"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { useKeyboard } from "@/hooks/useKeyboard";
import { AnalyticsStrip } from "./AnalyticsStrip";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { Dock } from "./Dock";
import { GameBoard } from "./GameBoard";
import { GameControls } from "./GameControls";
import { GameHeader } from "./GameHeader";
import { MatchScore } from "./MatchScore";
import { PlayerCard } from "./PlayerCard";
import { TimerPair } from "./Timer";
import { TurnIndicator } from "./TurnIndicator";
import { WinnerOverlay } from "./WinnerOverlay";
import { fadeUp } from "./ui";

const Shell = styled.main`
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 720px) {
    padding: 12px 12px 18px;
  }
`;

const Stage = styled.div`
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(320px, 520px) minmax(240px, 1fr);
  gap: 16px;
  align-items: stretch;
  animation: ${fadeUp} 600ms ease both;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "board board"
      "p1 p2";
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "board"
      "p1"
      "p2";
  }
`;

const Side = styled.div<{ $area?: string }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;

  @media (max-width: 1100px) {
    grid-area: ${({ $area }) => $area};
  }
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-width: 0;

  @media (max-width: 1100px) {
    grid-area: board;
  }
`;

const ScreenReader = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

export function GameApp() {
  const { hydrated, state } = useGame();
  useKeyboard();

  const live =
    state.status === "won" && state.winner
      ? `${state.players[state.winner].name} wins the round`
      : state.status === "draw"
        ? "The round is a draw"
        : `${state.players[state.currentTurn].name}'s turn`;

  if (!hydrated) {
    return (
      <Shell>
        <GameHeader />
      </Shell>
    );
  }

  return (
    <Shell>
      <ScreenReader role="status" aria-live="polite">
        {live}
      </ScreenReader>
      <GameHeader />
      <Stage>
        <Side $area="p1">
          <PlayerCard id="p1" />
        </Side>
        <Center>
          <TurnIndicator />
          <MatchScore />
          <TimerPair />
          <GameBoard />
          <WinnerOverlay />
          <GameControls />
        </Center>
        <Side $area="p2">
          <PlayerCard id="p2" />
        </Side>
      </Stage>
      <AnalyticsStrip />
      <Dock />
      <ConfirmationDialog />
    </Shell>
  );
}
