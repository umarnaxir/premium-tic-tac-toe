import type { GameMode, ProWinLength, ThemeName, TimedSeconds } from "./game";

export interface Settings {
  theme: ThemeName;
  sound: boolean;
  mode: GameMode;
  timedSeconds: TimedSeconds;
  proWinLength: ProWinLength;
}
