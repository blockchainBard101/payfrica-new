// src/components/ConfirmWithdrawOverlay.tsx
"use client";

import React from "react";
import { LuMoveLeft } from "react-icons/lu";
import { useGlobalState } from "@/GlobalStateProvider";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useUserDetails, useTokenExchange } from "@/hooks/useTokenExchange";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Agent = {
  id: string;
};

export default function ConfirmWithdrawOverlay() {
  const { overlayStates, toggleOverlay, withdrawData } = useGlobalState();
  const { amount, method } = withdrawData;
  const { address } = useCustomWallet();
  const userDetails = useUserDetails(address);
  const { handleWithdrawalRequest } = useTokenExchange();

  // derive on-chain coin info
  const coinType = userDetails?.details?.country?.baseToken?.coinType ?? "";
  const stripped = coinType.replace(/^0x/, "");
  const decimals = userDetails?.details?.country?.baseToken?.decimals ?? 0;
  const humanAmt = Number(amount);
  const minimalAmt = Math.floor(humanAmt * 10 ** decimals);

  // build query params and fetch best withdrawal agent
  const params = new URLSearchParams({
    coinType: stripped,
    amount: minimalAmt.toString(),
  });

  const { isLoading, data: agent, error } = useQuery<
    Agent,
    Error
  >({
    queryKey: ["get-best-withdraw", coinType, minimalAmt],
    queryFn: () =>
      axios
        .get<Agent>(`${API_BASE}/agent/best-withdraw-agent?${params}`)
        .then((res) => res.data),
    enabled: Boolean(stripped && minimalAmt > 0),
  });

  if (!overlayStates.confirmWithdraw) return null;

  // compute fees & totals
  const fee = (humanAmt * 0.005).toFixed(2);
  const total = (humanAmt + Number(fee)).toFixed(2);
  const symbol = userDetails?.details?.country?.currencySymbol ?? "";

  const handleNext = async () => {
    if (!agent) return;
    try {
      await handleWithdrawalRequest(
        coinType,
        minimalAmt,
        agent.id,
      );
      toggleOverlay("confirmWithdraw");
      toggleOverlay("withdrawing");
    } catch (e) {
      console.error("Withdraw on-chain failed", e);
      toggleOverlay("confirmWithdraw");
      toggleOverlay("failed");
    }
  };

  return (
    <div className="overlay-background">
      <div className="confirm-deposit-container">
        <LuMoveLeft
          style={{
            position: "absolute",
            left: 30,
            top: 20,
            fontSize: 30,
            cursor: "pointer",
            color: "#bf8555",
          }}
          onClick={() => {
            toggleOverlay("confirmWithdraw");
            toggleOverlay("withdraw");
          }}
        />

        <h4>You are Withdrawing</h4>
        <h2>
          {symbol} {humanAmt.toLocaleString()}
        </h2>
        <p>
          Your bank account will receive {symbol} {humanAmt.toLocaleString()}
        </p>

        <div className="confirm-summary">
          <div>
            <span>You receive</span>
            <strong>
              {symbol} {humanAmt.toLocaleString()}
            </strong>
          </div>
          <div>
            <span>Payment method</span>
            <strong>{method}</strong>
          </div>
          <div>
            <span>Agent ID</span>
            {isLoading ? (
              "Loading…"
            ) : agent?.id ? (
              <Link
                target="__blank"
                href={`https://testnet.suivision.xyz/object/${agent.id}`}
              >
                {agent.id.slice(0, 6) + "..." + agent.id.slice(-4)}
              </Link>
            ) : (
              "—"
            )}
          </div>
          <button
            className="next-btn"
            disabled={isLoading || !agent}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
