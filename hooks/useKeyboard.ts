"use client";

import { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { getBoardSize } from "@/lib/gameLogic";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export function useKeyboard() {
  const {
    state,
    place,
    undo,
    redo,
    requestResetBoard,
    requestNewGame,
    toggleTheme,
    focusCell,
    dismissConfirm,
    resolveConfirm,
  } = useGame();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      if (event.key === "Escape") {
        dismissConfirm();
        return;
      }

      if (state.confirm) {
        if (event.key === "Enter" && state.confirm.action.type !== "new-game-choice") {
          event.preventDefault();
          resolveConfirm();
        }
        return;
      }

      const key = event.key.toLowerCase();
      const size = getBoardSize(state.settings.mode);

      if (key >= "1" && key <= "9" && size === 3) {
        event.preventDefault();
        place(Number(key) - 1);
        return;
      }

      if (key === "u") {
        event.preventDefault();
        undo();
        return;
      }

      if (key === "y") {
        event.preventDefault();
        redo();
        return;
      }

      if (key === "r") {
        event.preventDefault();
        requestResetBoard();
        return;
      }

      if (key === "n") {
        event.preventDefault();
        requestNewGame();
        return;
      }

      if (key === "t") {
        event.preventDefault();
        toggleTheme();
        return;
      }

      const max = size * size;
      const current = Math.min(state.focusedIndex, max - 1);

      if (event.key === "ArrowRight") {
        event.preventDefault();
        focusCell((current + 1) % max);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusCell((current - 1 + max) % max);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusCell((current + size) % max);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusCell((current - size + max) % max);
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        if (event.target instanceof HTMLButtonElement) return;
        event.preventDefault();
        place(current);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    dismissConfirm,
    resolveConfirm,
    focusCell,
    place,
    redo,
    requestNewGame,
    requestResetBoard,
    state.confirm,
    state.focusedIndex,
    state.settings.mode,
    toggleTheme,
    undo,
  ]);
}
