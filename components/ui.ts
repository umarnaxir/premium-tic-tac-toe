import styled, { css, keyframes } from "styled-components";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const popIn = keyframes`
  from { opacity: 0; transform: scale(0.72); }
  to { opacity: 1; transform: scale(1); }
`;

export const pulseSoft = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
`;

export const livePulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(196, 164, 106, 0.0); }
  50% { box-shadow: 0 0 0 6px rgba(196, 164, 106, 0.18); }
`;

export const ghostIn = keyframes`
  from { opacity: 0; transform: scale(0.86); }
  to { opacity: 0.28; transform: scale(1); }
`;

export const scorePop = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.12); }
  100% { transform: scale(1); }
`;

export const winGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(196, 164, 106, 0); }
  50% { box-shadow: 0 0 0 6px rgba(196, 164, 106, 0.16); }
`;

export const warnPulse = keyframes`
  0%, 100% { color: inherit; }
  50% { color: #C97A6C; }
`;

export const turnGlow = keyframes`
  0%, 100% {
    opacity: 1;
    text-shadow: 0 0 0 transparent;
    letter-spacing: 0.22em;
  }
  50% {
    opacity: 0.62;
    text-shadow: 0 0 14px currentColor;
    letter-spacing: 0.32em;
  }
`;

export const waitPulse = keyframes`
  0%, 100% { opacity: 0.38; }
  50% { opacity: 0.82; }
`;

export const markBob = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-2px) rotate(-6deg); }
`;

export const shineSweep = keyframes`
  0% { transform: translateX(-120%) rotate(12deg); }
  100% { transform: translateX(220%) rotate(12deg); }
`;

export const avatarPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
`;

export const Panel = styled.section`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow}, ${({ theme }) => theme.inset};
  border-radius: 16px;
  padding: 14px;
  min-width: 0;
`;

export const Eyebrow = styled.p`
  margin: 0 0 4px;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textFaint};
  font-weight: 560;
`;

export const Label = styled.span`
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`;

export const buttonBase = css`
  appearance: none;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceRaised};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition:
    transform 180ms ease,
    background 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease;
  min-height: 34px;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.borderStrong};
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(28, 25, 20, 0.12);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }
`;

export const Button = styled.button<{ $tone?: "primary" | "ghost" | "danger" }>`
  ${buttonBase};

  ${({ $tone, theme }) =>
    $tone === "primary" &&
    css`
      background: ${theme.accent};
      color: ${theme.accentText};
      border-color: transparent;
      font-weight: 650;

      &:hover:not(:disabled) {
        filter: brightness(1.06);
        box-shadow: 0 8px 20px rgba(184, 154, 106, 0.32);
      }
    `}

  ${({ $tone }) =>
    $tone === "ghost" &&
    css`
      background: transparent;
    `}

  ${({ $tone, theme }) =>
    $tone === "danger" &&
    css`
      color: ${theme.danger};
      background: ${theme.dangerSoft};
      border-color: transparent;
    `}
`;

export const IconButton = styled.button`
  ${buttonBase};
  width: 34px;
  height: 34px;
  min-height: 34px;
  padding: 0;
  display: grid;
  place-items: center;
  border-radius: 10px;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.06);
  }
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StatValue = styled.strong`
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 550;
  color: ${({ theme }) => theme.text};
`;

export const EmptyState = styled.div`
  padding: 22px 8px;
  text-align: center;
  color: ${({ theme }) => theme.textMuted};

  strong {
    display: block;
    color: ${({ theme }) => theme.text};
    font-family: var(--font-display), serif;
    font-size: 20px;
    font-weight: 480;
    margin-bottom: 6px;
  }

  p {
    margin: 0;
    font-size: 13px;
  }
`;

export const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const Pill = styled.button<{ $active?: boolean }>`
  ${buttonBase};
  min-height: 28px;
  padding: 4px 8px;
  border-radius: 12px;
  background: ${({ $active, theme }) => ($active ? theme.text : theme.surfaceMuted)};
  color: ${({ $active, theme }) => ($active ? theme.bg : theme.textMuted)};
  border-color: transparent;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.03);
  }
`;
