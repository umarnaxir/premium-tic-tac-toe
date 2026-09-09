"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { KEYBOARD_HINTS, MODE_LABELS, TIMED_OPTIONS } from "@/lib/constants";
import type { GameMode } from "@/types/game";
import { Button, Eyebrow, Label, Pill, PillRow } from "./ui";

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Hint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textMuted};
  font-size: 12px;
  line-height: 1.5;
`;

const Keys = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};

  b {
    color: ${({ theme }) => theme.text};
    font-family: var(--font-mono), ui-monospace, monospace;
    font-weight: 550;
    margin-right: 6px;
  }
`;

export function GameSettings() {
  const {
    state,
    requestModeChange,
    setTimedSeconds,
    setProWin,
    requestClearHistory,
    clickSound,
  } = useGame();

  return (
    <Stack>
      <Group>
        <Eyebrow>Mode</Eyebrow>
        <PillRow>
          {(Object.keys(MODE_LABELS) as GameMode[]).map((mode) => (
            <Pill
              key={mode}
              type="button"
              $active={state.settings.mode === mode}
              onClick={() => requestModeChange(mode)}
            >
              {MODE_LABELS[mode]}
            </Pill>
          ))}
        </PillRow>
        <Hint>
          Classic is 3×3. Pro is 5×5. Timed uses Classic rules with personal clocks.
        </Hint>
      </Group>

      {state.settings.mode === "timed" && (
        <Group>
          <Label>Clock</Label>
          <PillRow>
            {TIMED_OPTIONS.map((seconds) => (
              <Pill
                key={seconds}
                type="button"
                $active={state.settings.timedSeconds === seconds}
                onClick={() => {
                  clickSound();
                  setTimedSeconds(seconds);
                }}
              >
                {seconds}s
              </Pill>
            ))}
          </PillRow>
        </Group>
      )}

      {state.settings.mode === "pro" && (
        <Group>
          <Label>Win length</Label>
          <PillRow>
            {([4, 5] as const).map((length) => (
              <Pill
                key={length}
                type="button"
                $active={state.settings.proWinLength === length}
                onClick={() => {
                  clickSound();
                  setProWin(length);
                }}
              >
                {length} in a row
              </Pill>
            ))}
          </PillRow>
        </Group>
      )}

      <Group>
        <Eyebrow>Keyboard</Eyebrow>
        <Keys>
          {KEYBOARD_HINTS.map((hint) => (
            <li key={hint.key}>
              <b>{hint.key}</b>
              {hint.label}
            </li>
          ))}
        </Keys>
      </Group>

      <Button type="button" $tone="danger" onClick={requestClearHistory}>
        Clear History
      </Button>
    </Stack>
  );
}
