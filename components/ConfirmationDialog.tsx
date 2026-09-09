"use client";

import styled from "styled-components";
import { useGame } from "@/context/GameContext";
import { Button } from "./ui";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.overlay};
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 80;
`;

const Card = styled.div`
  width: min(420px, 100%);
  background: ${({ theme }) => theme.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Title = styled.h2`
  margin: 0 0 8px;
  font-family: var(--font-display), serif;
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.03em;
`;

const Copy = styled.p`
  margin: 0 0 20px;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.55;
  font-size: 14px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
`;

export function ConfirmationDialog() {
  const { state, dismissConfirm, resolveConfirm, confirmNewGame } = useGame();
  const confirm = state.confirm;
  if (!confirm) return null;

  const choice = confirm.action.type === "new-game-choice";

  return (
    <Backdrop role="presentation" onClick={dismissConfirm}>
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <Title id="confirm-title">{confirm.title}</Title>
        <Copy>{confirm.message}</Copy>
        <Actions>
          <Button type="button" $tone="ghost" onClick={dismissConfirm} autoFocus>
            Cancel
          </Button>
          {choice ? (
            <>
              <Button type="button" onClick={() => confirmNewGame(true)}>
                Keep History
              </Button>
              <Button type="button" $tone="danger" onClick={() => confirmNewGame(false)}>
                Fresh Start
              </Button>
            </>
          ) : (
            <Button
              type="button"
              $tone={confirm.tone === "danger" ? "danger" : "primary"}
              onClick={resolveConfirm}
            >
              {confirm.confirmLabel}
            </Button>
          )}
        </Actions>
      </Card>
    </Backdrop>
  );
}
