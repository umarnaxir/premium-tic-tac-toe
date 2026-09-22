"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import {
  FIRST_TO_OPTIONS,
  KEYBOARD_HINTS,
  MODE_LABELS,
  STARTER_LABELS,
  TIMED_OPTIONS,
} from "@/lib/constants";
import type { FirstTo, GameMode, StarterMode } from "@/types/game";
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

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export function GameSettings() {
  const {
    state,
    requestModeChange,
    setTimedSeconds,
    setProWin,
    setStarter,
    setFirstTo,
    swapMarks,
    requestClearHistory,
    requestNewGame,
    requestResetMatch,
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
        <Label>Who starts</Label>
        <PillRow>
          {(Object.keys(STARTER_LABELS) as StarterMode[]).map((starter) => (
            <Pill
              key={starter}
              type="button"
              $active={state.settings.starter === starter}
              onClick={() => {
                clickSound();
                setStarter(starter);
              }}
            >
              {starter === "p1"
                ? state.players.p1.name
                : starter === "p2"
                  ? state.players.p2.name
                  : "Alternate"}
            </Pill>
          ))}
        </PillRow>
      </Group>

      <Group>
        <Label>Series</Label>
        <PillRow>
          {FIRST_TO_OPTIONS.map((value: FirstTo) => (
            <Pill
              key={value}
              type="button"
              $active={state.settings.firstTo === value}
              onClick={() => {
                clickSound();
                setFirstTo(value);
              }}
            >
              {value === 0 ? "Unlimited" : `First to ${value}`}
            </Pill>
          ))}
        </PillRow>
      </Group>

      <Button type="button" onClick={swapMarks} disabled={state.moves.length > 0}>
        Swap X and O
      </Button>
      <Hint>Marks can be swapped before the first move of a round.</Hint>

      <Group>
        <Eyebrow>Match</Eyebrow>
        <PillRow>
          <Button type="button" $tone="primary" onClick={requestNewGame}>
            New Game
          </Button>
          <Button type="button" $tone="ghost" onClick={requestResetMatch}>
            Reset Match
          </Button>
        </PillRow>
        <Hint>New Game and full match resets live here on phone.</Hint>
      </Group>

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
