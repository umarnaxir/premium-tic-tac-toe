"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { IconButton } from "./ui";

const Button = styled(IconButton)`
  font-size: 15px;
`;

export function ThemeToggle() {
  const { state, toggleTheme } = useGame();
  const dark = state.settings.theme === "dark";

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle theme (T)"
    >
      {dark ? "☀" : "☽"}
    </Button>
  );
}
