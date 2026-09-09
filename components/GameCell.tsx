"use client";

import styled, { css } from "styled-components";
import type { CellValue, Mark } from "@/types/game";
import { popIn, shineSweep, winGlow } from "./ui";

const CellButton = styled.button<{
  $filled: boolean;
  $win: boolean;
  $dim: boolean;
  $mark: CellValue;
  $focused: boolean;
  $preview: Mark | null;
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
    transform 180ms ease,
    background 200ms ease,
    border-color 200ms ease,
    opacity 240ms ease,
    box-shadow 200ms ease;
  opacity: ${({ $dim }) => ($dim ? 0.38 : 1)};
  box-shadow: ${({ theme }) => theme.inset};

  &::before {
    content: "";
    position: absolute;
    inset: -20%;
    width: 40%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.28),
      transparent
    );
    transform: translateX(-120%) rotate(12deg);
    pointer-events: none;
  }

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
    transform: translateY(-4px) scale(1.04);
    border-color: ${({ theme }) => theme.borderStrong};
    background: ${({ theme }) => theme.surface};
    box-shadow: 0 10px 22px rgba(28, 25, 20, 0.12);

    &::before {
      animation: ${shineSweep} 620ms ease;
    }

    &::after {
      opacity: 0.38;
      transform: scale(1.04);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    cursor: default;
  }

  &::after {
    content: ${({ $preview, $filled }) =>
      !$filled && $preview ? `"${$preview}"` : '""'};
    position: absolute;
    font-family: var(--font-display), serif;
    font-size: clamp(28px, 5vw, 56px);
    opacity: 0;
    transform: scale(0.92);
    color: ${({ $preview, theme }) =>
      $preview === "X" ? theme.x : $preview === "O" ? theme.o : theme.textMuted};
    pointer-events: none;
    transition: opacity 160ms ease, transform 160ms ease;
  }

  &:hover:not(:disabled)::after {
    opacity: 0.32;
  }

  span {
    font-family: var(--font-display), serif;
    font-size: clamp(32px, 6vw, 64px);
    font-weight: 560;
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
  preview: Mark | null;
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
  preview,
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
      $preview={preview}
      disabled={disabled}
      aria-label={value ? `${label}, ${value}` : `${label}, empty`}
      onClick={() => onSelect(index)}
    >
      {value ? <span>{value}</span> : null}
    </CellButton>
  );
}
