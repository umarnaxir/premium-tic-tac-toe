"use client";

import styled from "styled-components";
import { Eyebrow } from "./ui";

const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 10px;
  align-items: start;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};

  b {
    font-family: var(--font-mono), ui-monospace, monospace;
    color: ${({ theme }) => theme.accent};
  }

  strong {
    color: ${({ theme }) => theme.text};
    font-weight: 600;
  }
`;

const steps = [
  {
    n: "01",
    title: "Name both players",
    copy: "Open a player card, tap Edit name, type the new name, then Save. Names stay after refresh.",
  },
  {
    n: "02",
    title: "Pick a mode",
    copy: "Classic is 3×3, Pro is 5×5, Timed adds personal clocks. All stay on this same screen.",
  },
  {
    n: "03",
    title: "Place a mark",
    copy: "Tap a cell or use keys 1–9. Hover a cell to preview the current symbol before you commit.",
  },
  {
    n: "04",
    title: "Finish the round",
    copy: "Three in a row wins Classic. After a result, tap Next Round to keep the match score going.",
  },
];

export function HowToPlay() {
  return (
    <div>
      <Eyebrow>How to play</Eyebrow>
      <List>
        {steps.map((step) => (
          <Item key={step.n}>
            <b>{step.n}</b>
            <span>
              <strong>{step.title}</strong>
              <br />
              {step.copy}
            </span>
          </Item>
        ))}
      </List>
    </div>
  );
}
