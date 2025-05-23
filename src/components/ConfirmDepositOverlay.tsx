// src/components/ConfirmDepositOverlay.tsx
"use client";

import React, { useEffect, useState } from "react";
import { LuMoveLeft } from "react-icons/lu";
import { useGlobalState } from "@/GlobalStateProvider";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useUserDetails, useTokenExchange } from "@/hooks/useTokenExchange";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function ConfirmDepositOverlay() {
  const { overlayStates, toggleOverlay, depositData, setDepositData } =
    useGlobalState();
  const { amount, method } = depositData;
  const { address } = useCustomWallet();

  // pull in the user so we can get their baseToken / currency
  const userDetails = useUserDetails(address);
  // console.log(userDetails);
  // bring in the on-chain deposit request handler
  const { handleDepositRequest } = useTokenExchange();

  const coinType = userDetails?.details?.country?.baseToken?.coinType ?? "";
  const stripped = coinType.replace(/^0x/, "");

  // const [isLoading, setisLoading] = useState(false);

  const decimals = userDetails?.details?.country?.baseToken?.decimals ?? 0;
  const humanAmt = Number(amount);
  const minimalAmt = Math.floor(humanAmt * 10 ** decimals);

  const params = new URLSearchParams({
    coinType: stripped,
    amount: minimalAmt.toString(),
  });

  const {
    isLoading,
    data: agent,
    error,
  } = useQuery({
    queryKey: ["get-best-deposit", coinType, amount, stripped, userDetails],
    queryFn: async () =>
      (
        await axios.get<{
          id: string;
          accountNumber: string;
          comment: string;
          name: string;
          bank: string;
        }>(`${API_BASE}/agent/best-deposit-agent?${params}`)
      ).data,
    enabled: Boolean(stripped && amount > 0),
  });

  console.log({ isLoading, agent, error });

  if (!overlayStates.confirmDeposit) return null;

  const fee = (Number(amount) * 0.005).toFixed(2);
  const total = (Number(amount) + Number(fee)).toFixed(2);
  const symbol = userDetails?.details?.country?.currencySymbol ?? "";
  const handleNext = async () => {
    if (!agent) return;
    try {
      toggleOverlay("confirmDeposit");
      toggleOverlay("withdrawing");
      await handleDepositRequest(agent.id, minimalAmt, agent.comment, coinType);
      toggleOverlay("withdrawing");
    } catch (e) {
      console.error("Deposit on-chain failed", e);
      toggleOverlay("withdrawing");
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
            {isLoading ? (
              "Loading…"
            ) : agent?.id ? (
              <Link
                target="__blank"
                href={`https://testnet.suivision.xyz/object/${agent.id}`}
              >
                {agent?.id.slice(0, 6) + "..." + agent?.id.slice(-4)}
              </Link>
            ) : (
              "—"
            )}
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
          {/* <div>
            <span>Total charged</span>
            <strong>
              {symbol} {total}
            </strong>
          </div> */}
          {agent?.comment && (
            <div>
              <span>Comment</span>
              <strong>{agent.comment}</strong>
            </div>
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
  );
}
