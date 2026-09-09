"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { EmptyState, Eyebrow } from "./ui";

const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 240px;
  overflow: auto;
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 10px;
  align-items: baseline;
  font-size: 13px;
  color: ${({ theme }) => theme.textMuted};

  b {
    font-family: var(--font-mono), ui-monospace, monospace;
    color: ${({ theme }) => theme.textFaint};
    font-weight: 500;
  }

  strong {
    color: ${({ theme }) => theme.text};
    font-weight: 550;
  }
`;

export function MoveHistory() {
  const { state } = useGame();

  return (
    <div>
      <Eyebrow>This round</Eyebrow>
      {state.moves.length === 0 ? (
        <EmptyState>
          <strong>No moves yet</strong>
          <p>The first mark opens the round.</p>
        </EmptyState>
      ) : (
        <List>
          {state.moves.map((move, index) => (
            <Item key={`${move.index}-${index}`}>
              <b>{index + 1}</b>
              <span>
                <strong>{state.players[move.player].name}</strong>
              </span>
              <span>{move.label}</span>
            </Item>
          ))}
        </List>
      )}
    </div>
  );
}
