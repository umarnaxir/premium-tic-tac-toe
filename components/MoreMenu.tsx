"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { GameHistory } from "./GameHistory";
import { GameSettings } from "./GameSettings";
import { HowToPlay } from "./HowToPlay";
import { MoveHistory } from "./MoveHistory";
import { StatisticsPanel } from "./StatisticsPanel";
import { Button, IconButton } from "./ui";

const Trigger = styled(IconButton)<{ $open: boolean }>`
  font-size: 16px;
  letter-spacing: 1px;
  background: ${({ $open, theme }) => ($open ? theme.text : theme.surfaceRaised)};
  color: ${({ $open, theme }) => ($open ? theme.bg : theme.text)};
  transition: transform 180ms ease, background 180ms ease, color 180ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.08);
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: ${({ theme }) =>
    theme.name === "dark" ? "rgba(6, 7, 10, 0.88)" : "rgba(28, 25, 20, 0.62)"};
  display: grid;
  place-items: center;
  padding: 20px;
`;

const Dialog = styled.div`
  position: relative;
  z-index: 10001;
  width: min(980px, 96vw);
  height: min(86vh, 820px);
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.borderStrong};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  isolation: isolate;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h2`
  margin: 0;
  font-family: var(--font-display), serif;
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 500;
  letter-spacing: -0.03em;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  padding: 14px 20px 0;

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  appearance: none;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.borderStrong : theme.border)};
  background: ${({ $active, theme }) => ($active ? theme.text : theme.surfaceRaised)};
  color: ${({ $active, theme }) => ($active ? theme.bg : theme.text)};
  border-radius: 6px;
  min-height: 44px;
  padding: 10px 8px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 650;
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 20px 22px 24px;
  font-size: 15px;
  line-height: 1.55;
`;

const tabs = [
  { id: "guide", label: "Guide" },
  { id: "moves", label: "Moves" },
  { id: "history", label: "History" },
  { id: "stats", label: "Statistics" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function MoreMenu() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("guide");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Trigger
        type="button"
        $open={open}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open menu"
        title="More"
        onClick={() => setOpen(true)}
      >
        ⋯
      </Trigger>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <Backdrop role="presentation" onClick={() => setOpen(false)}>
            <Dialog
              role="dialog"
              aria-modal="true"
              aria-labelledby="more-menu-title"
              onClick={(event) => event.stopPropagation()}
            >
              <Head>
                <Title id="more-menu-title">Game menu</Title>
                <Button type="button" $tone="ghost" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </Head>
              <Tabs>
                {tabs.map((item) => (
                  <Tab
                    key={item.id}
                    type="button"
                    $active={tab === item.id}
                    onClick={() => setTab(item.id)}
                  >
                    {item.label}
                  </Tab>
                ))}
              </Tabs>
              <Body>
                {tab === "guide" && <HowToPlay />}
                {tab === "moves" && <MoveHistory />}
                {tab === "history" && <GameHistory />}
                {tab === "stats" && <StatisticsPanel />}
                {tab === "settings" && <GameSettings />}
              </Body>
            </Dialog>
          </Backdrop>,
          document.body,
        )}
    </>
  );
}
