"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { IconButton } from "./ui";

const Button = styled(IconButton)<{ $on: boolean }>`
  font-size: 14px;
  opacity: ${({ $on }) => ($on ? 1 : 0.45)};
  transition:
    transform 180ms ease,
    opacity 180ms ease,
    box-shadow 180ms ease;

  &:hover:not(:disabled) {
    opacity: 1;
    transform: translateY(-2px) rotate(-8deg) scale(1.08);
  }
`;

export function SoundToggle() {
  const { state, setSound } = useGame();
  const on = state.settings.sound;

  return (
    <Button
      type="button"
      $on={on}
      onClick={() => setSound(!on)}
      aria-pressed={on}
      aria-label={on ? "Mute sounds" : "Enable sounds"}
      title="Toggle sound"
    >
      ♪
    </Button>
  );
}
