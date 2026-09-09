"use client";

import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useGame } from "@/context/GameContext";
import { cellLabel, getBoardSize } from "@/lib/gameLogic";
import { GameCell } from "./GameCell";
import { fadeUp } from "./ui";

const drawLine = keyframes`
  from { stroke-dashoffset: 140; }
  to { stroke-dashoffset: 0; }
`;

const Frame = styled.div<{ $size: number }>`
  position: relative;
  width: min(44vh, 400px, 100%);
  display: grid;
  grid-template-columns: repeat(${({ $size }) => $size}, 1fr);
  gap: ${({ $size }) => ($size === 5 ? "8px" : "10px")};
  padding: 14px;
  border-radius: 28px;
  background: ${({ theme }) => theme.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.border};
  animation: ${fadeUp} 560ms ease both;
`;

const LineSvg = styled.svg`
  position: absolute;
  inset: 14px;
  width: calc(100% - 28px);
  height: calc(100% - 28px);
  pointer-events: none;
  overflow: visible;

  line {
    stroke: ${({ theme }) => theme.accent};
    stroke-width: 4;
    stroke-linecap: round;
    stroke-dasharray: 140;
    animation: ${drawLine} 420ms ease forwards;
  }
`;

function linePoints(line: number[], size: number) {
  const first = line[0];
  const last = line[line.length - 1];
  if (first === undefined || last === undefined) return null;
  const toPct = (index: number) => ({
    x: ((index % size) + 0.5) * (100 / size),
    y: (Math.floor(index / size) + 0.5) * (100 / size),
  });
  return { start: toPct(first), end: toPct(last) };
}

export function GameBoard() {
  const { state, place, focusCell } = useGame();
  const size = getBoardSize(state.settings.mode);
  const ended = state.status !== "playing";
  const frameRef = useRef<HTMLDivElement>(null);
  const points = state.winningLine ? linePoints(state.winningLine, size) : null;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const active = document.activeElement;
    if (
      active &&
      active !== document.body &&
      active !== document.documentElement &&
      !frame.contains(active)
    ) {
      return;
    }
    const node = frame.querySelector<HTMLButtonElement>(
      `button:nth-child(${state.focusedIndex + 1})`,
    );
    node?.focus({ preventScroll: true });
  }, [state.focusedIndex]);

  return (
    <Frame
      ref={frameRef}
      $size={size}
      role="grid"
      aria-label={`${size} by ${size} game board`}
    >
      {state.board.map((value, index) => {
        const winning = Boolean(state.winningLine?.includes(index));
        return (
          <GameCell
            key={`${size}-${index}`}
            index={index}
            value={value}
            label={cellLabel(index, size)}
            winning={winning}
            dimmed={ended && Boolean(state.winningLine) && !winning}
            focused={state.focusedIndex === index}
            disabled={ended || Boolean(value)}
            onSelect={(next) => {
              focusCell(next);
              place(next);
            }}
          />
        );
      })}
      {points && (
        <LineSvg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <line x1={points.start.x} y1={points.start.y} x2={points.end.x} y2={points.end.y} />
        </LineSvg>
      )}
    </Frame>
  );
}
