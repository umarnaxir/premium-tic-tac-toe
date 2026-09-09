import type {
  FirstTo,
  GameMode,
  ProWinLength,
  StarterMode,
  ThemeName,
  TimedSeconds,
} from "./game";

export interface Settings {
  theme: ThemeName;
  sound: boolean;
  mode: GameMode;
  timedSeconds: TimedSeconds;
  proWinLength: ProWinLength;
  starter: StarterMode;
  firstTo: FirstTo;
}
