"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { fadeUp } from "./ui";

const Banner = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.accent};
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  animation: ${fadeUp} 400ms ease both;
`;

export function WinnerOverlay() {
  const { state } = useGame();
  if (state.status === "playing") return null;

  const text =
    state.status === "draw"
      ? "Board complete · no decisive line"
      : state.winner
        ? `${state.players[state.winner].name} takes the round`
        : "";

  if (!text) return null;
  return <Banner>{text}</Banner>;
}
