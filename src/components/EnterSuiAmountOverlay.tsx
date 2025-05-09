// src/components/EnterSuiAmountOverlay.tsx
"use client";

import { useState, useEffect } from "react";
import { LuMoveLeft } from "react-icons/lu";
import { BsQrCodeScan } from "react-icons/bs";
import Image from "next/image";
import { useGlobalState } from "@/GlobalStateProvider";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { nameExists, getNsAddress } from "@/hooks/registerNsName";
import { usePools, useTokenExchange } from "@/hooks/useTokenExchange";

export const EnterSuiAmountOverlay = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const isVisible = overlayStates.enterSuiAmount;

  const { address: myAddress } = useCustomWallet();
  const { pools } = usePools();
  const { getBalance, sendToAddress, sendToNameService } = useTokenExchange();

  // find USDC pool
  const usdc = pools.find((p) => p.coinName === "USDC");
  const coinType = usdc?.coinType;

  const [amount, setAmount] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [nsValid, setNsValid] = useState<boolean | null>(null);

  const [balance, setBalance] = useState("0");
  const [loadingBal, setLoadingBal] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const suffix = "@payfrica";

  // load USDC balance
  useEffect(() => {
    if (!myAddress || !coinType) return;
    setLoadingBal(true);
    getBalance(coinType)
      .then((b) => setBalance(b))
      .catch(() => setBalance("0"))
      .finally(() => setLoadingBal(false));
  }, [myAddress, coinType, getBalance]);

  // validate Payfrica tag
  useEffect(() => {
    const trimmed = tagInput.trim();
    if (trimmed.length < 4) {
      setNsValid(null);
      setChecking(false);
      return;
    }
    setChecking(true);
    const full = `${trimmed}${suffix}`;
    nameExists(full)
      .then((exists) => setNsValid(exists))
      .catch(() => setNsValid(false))
      .finally(() => setChecking(false));
  }, [tagInput]);

  const fullTag = `${tagInput.trim()}${suffix}`;
  const isAmountValid = !!amount && parseFloat(amount) > 0;
  const isTagValid = tagInput.trim().length >= 4 && !tagInput.includes(" ");
  const canSend =
    !!coinType &&
    isAmountValid &&
    (tagInput.includes("@") // we never include @ in input, so always treat as NS
      ? nsValid === true
      : isTagValid);

  const handleSend = async () => {
    if (!coinType || !isAmountValid) return;
    setIsSending(true);
    try {
      let success: boolean;
      // always treat as name service
      const response = await sendToNameService(coinType, Number(amount), fullTag);
      success = response?.effects?.status?.status === "success"; // Adjusted based on typical Sui response structure
      toggleOverlay("enterSuiAmount");
      toggleOverlay(success ? "sending" : "failed");
    } catch {
      toggleOverlay("enterSuiAmount");
      toggleOverlay("failed");
    } finally {
      setIsSending(false);
    }
  };

  if (!isVisible) return null;
  if (!usdc) return <div className="p-4 text-red-500">USDC not available</div>;

  return (
    <div className="overlay-background">
      <div className="enter-amount-overlay">
        <div className="overlay-header">
          <LuMoveLeft
            className="back-icon"
            onClick={() => {
              // toggleOverlay("payfricaPadiSui");
              toggleOverlay("enterSuiAmount");
            }}
          />
          <BsQrCodeScan className="qrcodeicon" />
        </div>

        <div className="recipient-info">
          <Image
            src="/PayfricaNavLogo.png"
            alt="Payfrica Logo"
            width={40}
            height={40}
          />
        </div>

        <div className="payfrica-tag-section" style={{ margin: "20px 0" }}>
          <h3 style={{ color: "#333" }}>Recipient Payfrica Tag</h3>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              placeholder="alice"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 100px 10px 10px",
                borderRadius: 5,
                fontSize: 16,
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#555",
                pointerEvents: "none",
              }}
            >
              {suffix}
            </span>
          </div>
          {checking && (
            <small style={{ color: "#666", display: "block", marginTop: 4 }}>
              Checking…
            </small>
          )}
          {!checking && nsValid === false && (
            <small style={{ color: "red", display: "block", marginTop: 4 }}>
              Payfrica name does not exist
            </small>
          )}
          {!checking && nsValid === true && (
            <small style={{ color: "green", display: "block", marginTop: 4 }}>
              Payfrica name is valid!
            </small>
          )}
        </div>

        <div className="amount-entry">
          <h3 style={{ color: "#333" }}>Enter Amount (USDC)</h3>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 5,
              fontSize: 16,
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <div
            style={{ marginTop: 8, fontSize: 14, color: "#333" }}
          >
            {loadingBal
              ? "Loading balance…"
              : `Balance: ${balance} USDC`}
          </div>
          <div style={{ marginTop: 10 }}>
            {["10", "50", "100", balance].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                disabled={amt === balance && loadingBal}
                style={{ marginRight: 8 }}
              >
                {amt === balance ? "Max" : amt}
              </button>
            ))}
          </div>
        </div>

        <button
          className="send-money-button"
          onClick={handleSend}
          disabled={!canSend || isSending}
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
