"use client";

import styled from "styled-components";
import { fadeUp } from "./ui";

const Bar = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 2px 2px 0;
  flex: none;
  animation: ${fadeUp} 700ms ease both;
`;

const Credit = styled.a`
  color: ${({ theme }) => theme.textMuted};
  text-decoration: none;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color 180ms ease, transform 180ms ease;

  strong {
    color: ${({ theme }) => theme.text};
    font-family: var(--font-display), serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.02em;
    text-transform: none;
    margin-left: 6px;
    transition: color 180ms ease;
  }

  &:hover {
    color: ${({ theme }) => theme.accent};
    transform: translateY(-1px);

    strong {
      color: ${({ theme }) => theme.accent};
    }
  }
`;

export function GameFooter() {
  return (
    <Bar>
      <Credit
        href="https://umarnazir.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Built by <strong>Umar Nazir</strong>
      </Credit>
    </Bar>
  );
}
