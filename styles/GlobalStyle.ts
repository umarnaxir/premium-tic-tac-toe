import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: ${({ theme }) => (theme.name === "dark" ? "dark" : "light")};
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  html {
    background: ${({ theme }) => theme.bg};
  }

  body {
    font-family: var(--font-sans), "Outfit", system-ui, sans-serif;
    background:
      radial-gradient(920px 560px at 8% 12%, ${({ theme }) => theme.oSoft}, transparent 58%),
      radial-gradient(880px 520px at 94% 18%, ${({ theme }) => theme.xSoft}, transparent 56%),
      radial-gradient(720px 420px at 50% 108%, ${({ theme }) => theme.accentSoft}, transparent 52%),
      radial-gradient(640px 380px at 50% -8%, ${({ theme }) => theme.bgAccent}, transparent 62%),
      ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    min-height: 100dvh;
    transition: background 420ms ease, color 420ms ease;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image: ${({ theme }) => theme.grain};
    opacity: 0.55;
    mix-blend-mode: overlay;
    z-index: 0;
  }

  body::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
      linear-gradient(
        180deg,
        transparent 0%,
        ${({ theme }) => (theme.name === "dark" ? "rgba(10, 11, 14, 0.18)" : "rgba(245, 241, 234, 0.12)")} 48%,
        transparent 100%
      );
  }

  #__next,
  body > div:first-child {
    min-height: 100dvh;
  }

  button,
  input {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 3px;
  }

  ::selection {
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.text};
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
