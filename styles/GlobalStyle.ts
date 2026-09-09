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
      radial-gradient(1200px 700px at 12% -10%, ${({ theme }) => theme.bgAccent}, transparent 55%),
      radial-gradient(900px 500px at 100% 0%, ${({ theme }) => theme.accentSoft}, transparent 42%),
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
