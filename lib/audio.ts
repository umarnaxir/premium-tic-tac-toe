type SoundName = "move" | "click" | "win" | "draw" | "warn" | "start";

let context: AudioContext | null = null;
let warned = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!context) context = new AudioCtx();
  return context;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  const now = ctx.currentTime;

  switch (name) {
    case "move":
      tone(ctx, 420, now, 0.06, "triangle", 0.035);
      tone(ctx, 620, now + 0.02, 0.05, "sine", 0.02);
      break;
    case "click":
      tone(ctx, 280, now, 0.04, "sine", 0.025);
      break;
    case "win":
      tone(ctx, 523, now, 0.12, "sine", 0.04);
      tone(ctx, 659, now + 0.1, 0.14, "sine", 0.035);
      tone(ctx, 784, now + 0.22, 0.22, "triangle", 0.03);
      break;
    case "draw":
      tone(ctx, 392, now, 0.12, "sine", 0.03);
      tone(ctx, 349, now + 0.12, 0.16, "triangle", 0.025);
      break;
    case "warn":
      if (warned) return;
      warned = true;
      tone(ctx, 880, now, 0.08, "sine", 0.03);
      tone(ctx, 740, now + 0.1, 0.1, "sine", 0.025);
      break;
    case "start":
      tone(ctx, 330, now, 0.08, "triangle", 0.03);
      tone(ctx, 494, now + 0.08, 0.12, "sine", 0.025);
      break;
    default:
      break;
  }
}

export function resetWarnLatch() {
  warned = false;
}

export function armAudio() {
  const ctx = getContext();
  if (ctx && ctx.state === "suspended") {
    void ctx.resume();
  }
}
