"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { MODE_LABELS } from "@/lib/constants";
import { formatDuration, formatHistoryStamp } from "@/lib/gameLogic";
import { EmptyState, Eyebrow } from "./ui";

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: min(52vh, 480px);
  overflow: auto;
`;

const Item = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:first-child {
    padding-top: 0;
  }
`;

const When = styled.p`
  margin: 0 0 4px;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textFaint};
`;

const Versus = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const Result = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.accent};
`;

const Meta = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
`;

export function GameHistory() {
  const { state } = useGame();

  return (
    <div>
      <Eyebrow>Match history</Eyebrow>
      {state.history.length === 0 ? (
        <EmptyState>
          <strong>No Matches Yet</strong>
          <p>Your battles will appear here.</p>
        </EmptyState>
      ) : (
        <List>
          {state.history.map((entry) => {
            const winnerName =
              entry.winner === "draw"
                ? null
                : entry.winner === "p1"
                  ? entry.p1Name
                  : entry.p2Name;
            return (
              <Item key={entry.id}>
                <When>{formatHistoryStamp(entry.timestamp)}</When>
                <Versus>
                  {entry.p1Name} vs {entry.p2Name}
                </Versus>
                <Result>
                  {winnerName ? `🏆 ${winnerName} Won` : "Draw"}
                </Result>
                <Meta>
                  {MODE_LABELS[entry.mode]} · Round {entry.round} · Moves {entry.moves}
                  {entry.durationMs ? ` · ${formatDuration(entry.durationMs)}` : ""}
                  {entry.pattern ? ` · ${entry.pattern}` : ""}
                </Meta>
              </Item>
            );
          })}
        </List>
      )}
    </div>
  );
}
