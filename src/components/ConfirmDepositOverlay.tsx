// src/components/ConfirmDepositOverlay.tsx
"use client";

import React, { useEffect, useState } from "react";
import { LuMoveLeft } from "react-icons/lu";
import { useGlobalState } from "@/GlobalStateProvider";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useUserDetails, useTokenExchange } from "@/hooks/useTokenExchange";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function ConfirmDepositOverlay() {
  const { overlayStates, toggleOverlay, depositData, setDepositData } =
    useGlobalState();
  const { amount, method } = depositData;
  const { address } = useCustomWallet();

  // pull in the user so we can get their baseToken / currency
  const userDetails = useUserDetails(address);
  // bring in the on-chain deposit request handler
  const { handleDepositRequest } = useTokenExchange();

  // derive coinType (on-chain) and stripped version for your agent API
  const coinType = userDetails?.country?.baseToken?.coinType ?? "";
  const stripped = coinType.replace(/^0x/, "");

  // local state for the selected agent
  const [agent, setAgent] = useState<{
    id: string;
    accountNumber: string;
    bank: string;
    name: string;
    comment: string;
  } | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(false);

  // fetch best‐deposit‐agent whenever coinType or amount changes
  useEffect(() => {
    if (!coinType || !amount) return;

    setLoadingAgent(true);
    // compute minimal units using the same decimals
    const decimals = userDetails?.country?.baseToken?.decimals ?? 0;
    const humanAmt = Number(amount);
    const minimalAmt = Math.floor(humanAmt * 10 ** decimals);

    const params = new URLSearchParams({
      coinType: stripped,
      amount: minimalAmt.toString(),
    });

    fetch(`${API_BASE}/agent/best-deposit-agent?${params}`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data) {
          setAgent(data);
          setDepositData((d) => ({ ...d, agentId: data.id }));
        } else {
          setAgent(null);
          setDepositData((d) => ({ ...d, agentId: undefined }));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch deposit agent", err);
        setAgent(null);
      })
      .finally(() => setLoadingAgent(false));
  }, [coinType, amount, stripped, userDetails, setDepositData]);

  if (!overlayStates.confirmDeposit) return null;

  const fee = (Number(amount) * 0.005).toFixed(2);
  const total = (Number(amount) + Number(fee)).toFixed(2);
  const symbol = userDetails?.country?.currencySymbol ?? "";

  const handleNext = async () => {
    if (!agent) return;
    // re-compute minimal units
    const decimals = userDetails?.country?.baseToken?.decimals ?? 0;
    const humanAmt = Number(amount);
    const minimalAmt = Math.floor(humanAmt * 10 ** decimals);

    try {
      await handleDepositRequest(
        agent.id,
        minimalAmt,
        agent.comment,
        coinType
      );
      toggleOverlay("confirmDeposit");
      toggleOverlay("success");
    } catch (e) {
      console.error("Deposit on-chain failed", e);
      toggleOverlay("confirmDeposit");
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
            toggleOverlay("confirmDeposit");
            toggleOverlay("quickTransfer");
          }}
        />

        <h4>You are Depositing</h4>
        <h2>
          {symbol} {Number(amount).toLocaleString()}
        </h2>
        <p>
          Your wallet will receive {symbol} {Number(amount).toLocaleString()}
        </p>

        <div className="confirm-summary">
          <div>
            <span>You receive</span>
            <strong>
              {symbol} {Number(amount).toLocaleString()}
            </strong>
          </div>
          <div>
            <span>Payment method</span>
            <strong>{method}</strong>
          </div>
          <div>
            <span>Agent ID</span>
            <strong>{loadingAgent ? "Loading…" : agent?.id ?? "—"}</strong>
          </div>
          <div>
            <span>Agent Name</span>
            <strong>{agent?.name ?? "—"}</strong>
          </div>
          <div>
            <span>Bank</span>
            <strong>{agent?.bank ?? "—"}</strong>
          </div>
          <div>
            <span>Account #</span>
            <strong>{agent?.accountNumber ?? "—"}</strong>
          </div>
          <div>
            <span>Total charged</span>
            <strong>
              {symbol} {total}
            </strong>
          </div>
          {agent?.comment && (
            <div>
              <span>Note</span>
              <strong>{agent.comment}</strong>
            </div>
          )}
        </div>

        <button
          className="next-btn"
          disabled={loadingAgent || !agent}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
