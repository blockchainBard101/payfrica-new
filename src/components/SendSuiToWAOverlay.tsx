// src/components/SendSuiToWAOverlay.tsx
"use client";

import { useState, useEffect } from "react";
import { LuMoveLeft } from "react-icons/lu";
import { BsQrCodeScan } from "react-icons/bs";
import Image from "next/image";
import { useGlobalState } from "@/GlobalStateProvider";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { usePools, useTokenExchange } from "@/hooks/useTokenExchange";
import { nameExists, getNsAddress } from "@/hooks/registerNsName";

export const SendSuiToWAOverlay = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const isVisible = overlayStates.sendSuiToWA;
  const { address: myAddress } = useCustomWallet();

  // only USDC
  const { pools } = usePools();
  const usdcPool = pools.find((p) => p.coinName === "USDC");
  const coinType = usdcPool?.coinType;

  const { getBalance, sendToAddress, sendToNameService } = useTokenExchange();

  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [balance, setBalance] = useState("0");
  const [loadingBal, setLoadingBal] = useState(false);

  const [nsValid, setNsValid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const [isSending, setIsSending] = useState(false);

  // load USDC balance
  useEffect(() => {
    if (!myAddress || !coinType) return setBalance("0");
    setLoadingBal(true);
    getBalance(coinType)
      .then((b) => setBalance(b))
      .catch(() => setBalance("0"))
      .finally(() => setLoadingBal(false));
  }, [myAddress, coinType, getBalance]);

  // validate NS handles
  useEffect(() => {
    if (!recipient.includes("@")) {
      setNsValid(null);
      setChecking(false);
      return;
    }
    setChecking(true);
    nameExists(recipient)
      .then((exists) => setNsValid(exists))
      .catch(() => setNsValid(false))
      .finally(() => setChecking(false));
  }, [recipient]);

  // Normalize balance (remove commas if any, ensure string)
  const normalizedBalance = (balance || "0").split(",").join("");
  const balNum = Number(parseFloat(normalizedBalance).toFixed(6));
  const amtNum = Number(parseFloat(amount || "0").toFixed(6));
  const insufficient = amtNum > balNum;

  const handleSend = async () => {
    if (!amount || !recipient || !coinType) return;
    setIsSending(true);
    try {
      let success: boolean;
      if (recipient.includes("@")) {
        const response = await sendToNameService(
          coinType,
          Number(amount),
          recipient
        );
        success = response;
      } else {
        const response = await sendToAddress(
          coinType,
          Number(amount),
          recipient
        );
        success = response;
      }
      toggleOverlay("sendSuiToWA");
      toggleOverlay(success ? "sending" : "failed");
      // Clear values after transaction
      setAmount("");
      setRecipient("");
    } catch {
      toggleOverlay("sendSuiToWA");
      toggleOverlay("failed");
    } finally {
      setIsSending(false);
    }
  };

  const canSend =
    !!amount &&
    !!recipient &&
    !!coinType &&
    !isSending &&
    (recipient.includes("@") ? nsValid === true : true);

  if (!isVisible) return null;
  if (!usdcPool)
    return <div className="text-red-500 p-4">USDC pool not found</div>;

  return (
    <div className="overlay-background">
      <div className="enter-amount-overlay">
        <div className="overlay-header">
          <LuMoveLeft
            className="back-icon"
            onClick={() => {
              toggleOverlay("sendSuiToken");
              toggleOverlay("sendSuiToWA");
            }}
          />
          <BsQrCodeScan className="qrcodeicon" />
        </div>

        <div>
          <Image
            src="/Payfrica_Logo_Logo_Deep_red.png"
            alt="Payfrica Logo"
            width={150}
            height={60}
            style={{ marginBottom: 10 }}
          />
        </div>

        <div className="amount-entry">
          <h3>Enter Amount (USDC)</h3>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 5,
                fontSize: 16,
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={() => setAmount(balance)}
              disabled={loadingBal}
              style={{
                marginLeft: 8,
                padding: "10px 12px",
                borderRadius: 5,
                fontSize: 16,
                border: "1px solid #ccc",
                background: "white",
                cursor: loadingBal ? "not-allowed" : "pointer",
                opacity: loadingBal ? 0.5 : 1,
                marginTop: "-15px",
              }}
            >
              Max
            </button>
          </div>

          <div style={{ marginBottom: 16, fontSize: 14, color: "#333" }}>
            {loadingBal ? "Loading balance…" : `Balance: ${balance} USDC`}
          </div>

          {amount &&
            balance &&
            !loadingBal &&
            !isNaN(amtNum) &&
            !isNaN(balNum) &&
            insufficient && (
              <div style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                Insufficient balance
              </div>
            )}

          <h3>Recipient (Address or NS)</h3>
          <input
            type="text"
            placeholder="0x.. or alice@payfrica"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 5,
              fontSize: 16,
              border: "1px solid #ccc",
            }}
          />

          {/* show checking / invalid / valid */}
          {recipient.includes("@") && checking && (
            <small style={{ color: "#666", fontSize: 14 }}>Checking…</small>
          )}
          {recipient.includes("@") && !checking && nsValid === false && (
            <small style={{ color: "red", fontSize: 14 }}>
              Payfrica name does not exist
            </small>
          )}
          {recipient.includes("@") && !checking && nsValid === true && (
            <small style={{ color: "green", fontSize: 14 }}>
              Payfrica name is valid!
            </small>
          )}
        </div>

        <button
          className="send-money-button"
          onClick={handleSend}
          disabled={!canSend}
          style={{
            opacity: canSend ? 1 : 0.5,
            cursor: canSend ? "pointer" : "not-allowed",
            marginTop: 15,
          }}
        >
          {isSending ? "Sending…" : "Send USDC"}
        </button>
      </div>
    </div>
  );
};
