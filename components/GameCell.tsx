"use client";

import styled, { css } from "styled-components";
import type { CellValue } from "@/types/game";
import { popIn, winGlow } from "./ui";

const CellButton = styled.button<{
  $filled: boolean;
  $win: boolean;
  $dim: boolean;
  $mark: CellValue;
  $focused: boolean;
}>`
  appearance: none;
  aspect-ratio: 1;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $win }) => ($win ? theme.winSoft : theme.surfaceRaised)};
  border-radius: 16px;
  color: ${({ $mark, theme }) =>
    $mark === "X" ? theme.x : $mark === "O" ? theme.o : theme.text};
  display: grid;
  place-items: center;
  padding: 0;
  position: relative;
  overflow: hidden;
  transition:
    transform 160ms ease,
    background 200ms ease,
    border-color 200ms ease,
    opacity 240ms ease;
  opacity: ${({ $dim }) => ($dim ? 0.38 : 1)};
  box-shadow: ${({ theme }) => theme.inset};

  ${({ $win }) =>
    $win &&
    css`
      border-color: transparent;
      animation: ${winGlow} 1400ms ease infinite;
    `}

  ${({ $focused, theme }) =>
    $focused &&
    css`
      border-color: ${theme.borderStrong};
    `}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.borderStrong};
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    cursor: default;
  }

  span {
    font-family: var(--font-display), serif;
    font-size: clamp(28px, 5vw, 56px);
    line-height: 1;
    animation: ${popIn} 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
`;

interface GameCellProps {
  index: number;
  value: CellValue;
  label: string;
  winning: boolean;
  dimmed: boolean;
  focused: boolean;
  disabled: boolean;
  onSelect: (index: number) => void;
}

export function GameCell({
  index,
  value,
  label,
  winning,
  dimmed,
  focused,
  disabled,
  onSelect,
}: GameCellProps) {
  return (
    <CellButton
      type="button"
      $filled={Boolean(value)}
      $win={winning}
      $dim={dimmed}
      $mark={value}
      $focused={focused}
      disabled={disabled}
      aria-label={value ? `${label}, ${value}` : label}
      onClick={() => onSelect(index)}
    >
      {value ? <span>{value}</span> : null}
    </CellButton>
  );
}
