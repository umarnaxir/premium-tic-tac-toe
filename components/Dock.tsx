"use client";

import { useState } from "react";
import styled from "styled-components";
import { GameHistory } from "./GameHistory";
import { GameSettings } from "./GameSettings";
import { MoveHistory } from "./MoveHistory";
import { StatisticsPanel } from "./StatisticsPanel";
import { Panel } from "./ui";

const Shell = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  flex: 1;
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tab = styled.button<{ $active: boolean }>`
  appearance: none;
  border: 0;
  background: ${({ $active, theme }) => ($active ? theme.text : "transparent")};
  color: ${({ $active, theme }) => ($active ? theme.bg : theme.textMuted)};
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Body = styled.div`
  min-height: 220px;
`;

const tabs = [
  { id: "moves", label: "Moves" },
  { id: "history", label: "History" },
  { id: "stats", label: "Statistics" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function Dock() {
  const [tab, setTab] = useState<TabId>("history");

  return (
    <Shell>
      <Tabs role="tablist" aria-label="Dashboard panels">
        {tabs.map((item) => (
          <Tab
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            $active={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </Tab>
        ))}
      </Tabs>
      <Body role="tabpanel">
        {tab === "moves" && <MoveHistory />}
        {tab === "history" && <GameHistory />}
        {tab === "stats" && <StatisticsPanel />}
        {tab === "settings" && <GameSettings />}
      </Body>
    </Shell>
  );
}
