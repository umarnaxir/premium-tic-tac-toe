"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { useKeyboard } from "@/hooks/useKeyboard";
import { AnalyticsStrip } from "./AnalyticsStrip";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { GameBoard } from "./GameBoard";
import { GameControls } from "./GameControls";
import { GameFooter } from "./GameFooter";
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
  height: 100dvh;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 36px 40px 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;

  @media (max-width: 720px) {
    height: auto;
    min-height: 100dvh;
    padding: 24px 12px 16px;
    gap: 10px;
    overflow: auto;
  }
`;

const Stage = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 380px) minmax(0, 1fr) minmax(300px, 380px);
  gap: 12px;
  align-items: start;
  justify-items: stretch;
  flex: 1;
  min-height: 0;
  animation: ${fadeUp} 600ms ease both;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "board board"
      "p1 p2";
    gap: 16px;
    flex: none;
    align-items: start;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "board"
      "p1"
      "p2";
    gap: 12px;
  }
`;

const Side = styled.div<{ $area?: string }>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: auto;
  padding: 0 6px;

  @media (max-width: 1100px) {
    grid-area: ${({ $area }) => $area};
    height: auto;
    max-width: 420px;
    justify-self: center;
    width: 100%;
    padding: 0 8px;
  }
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;

  @media (max-width: 1100px) {
    grid-area: board;
    height: auto;
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
        <GameFooter />
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
        </Center>
        <Side $area="p2">
          <PlayerCard id="p2" />
        </Side>
      </Stage>
      <GameControls />
      <AnalyticsStrip />
      <GameFooter />
      <ConfirmationDialog />
    </Shell>
  );
}
