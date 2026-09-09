"use client";

import { GameProvider } from "@/context/GameContext";
import { StyledComponentsRegistry } from "@/styles/registry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <GameProvider>{children}</GameProvider>
    </StyledComponentsRegistry>
  );
}
