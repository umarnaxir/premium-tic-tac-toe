"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { fadeUp } from "./ui";

const Banner = styled.div<{ $visible: boolean }>`
  min-height: 28px;
  text-align: center;
  color: ${({ theme }) => theme.accent};
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  animation: ${fadeUp} 400ms ease both;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;

export function WinnerOverlay() {
  const { state } = useGame();
  if (state.status === "playing") {
    return <Banner $visible={false} aria-hidden />;
  }

  const text =
    state.status === "draw"
      ? "Board complete · no decisive line"
      : state.winner
        ? `${state.players[state.winner].name} takes the round`
        : "";

  return <Banner $visible>{text}</Banner>;
}
