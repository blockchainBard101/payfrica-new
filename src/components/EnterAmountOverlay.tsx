// src/components/EnterAmountOverlay.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { LuMoveLeft } from "react-icons/lu";
import { BsQrCodeScan } from "react-icons/bs";
import Image from "next/image";
import { useGlobalState } from "@/GlobalStateProvider";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { nameExists } from "@/hooks/registerNsName";
import { usePools, useTokenExchange } from "@/hooks/useTokenExchange";

export const EnterAmountOverlay = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const isVisible = overlayStates.enterAmount;
  const { address } = useCustomWallet();

  const { pools } = usePools();
  const { getBalance, sendToAddress, sendToNameService } = useTokenExchange();

  // 1️⃣ only tokens except USDC
  const tokenOptions = useMemo(
    () => pools.filter((p) => p.coinName !== "USDC"),
    [pools]
  );
  const [currency, setCurrency] = useState(tokenOptions[0]?.coinType ?? "NGNC");

  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [loadingBal, setLoadingBal] = useState(false);

  // 2️⃣ Payfrica‐name lookup
  const suffix = "@payfrica";
  const [tagInput, setTagInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [tagExists, setTagExists] = useState<boolean | null>(null);

  const [isSending, setIsSending] = useState(false);

  // fetch on‐chain balance
  useEffect(() => {
    if (!address || !currency) {
      setBalance(null);
      return;
    }
    setLoadingBal(true);
    getBalance(currency)
      .then((b) => setBalance(b))
      .catch(() => setBalance(null))
      .finally(() => setLoadingBal(false));
  }, [address, currency, getBalance]);

  // debounced name check
  useEffect(() => {
    const name = tagInput.trim();
    if (name.length < 4) {
      setTagExists(null);
      setChecking(false);
      return;
    }
    setChecking(true);
    nameExists(name + suffix)
      .then((ok) => setTagExists(ok))
      .catch(() => setTagExists(false))
      .finally(() => setChecking(false));
  }, [tagInput]);

  const fullTag = tagInput.trim().endsWith(suffix)
    ? tagInput.trim()
    : tagInput.trim() + suffix;

  const isTagValid = tagInput.trim().length >= 4 && /\S/.test(tagInput);
  const isAmountValid = parseFloat(amount) > 0;
  const canSend =
    !!currency &&
    isTagValid &&
    isAmountValid &&
    tagExists === true &&
    !isSending;

  const handleSendMoney = async () => {
    if (!canSend) return;
    setIsSending(true);

    try {
      let ok: boolean;
      if (fullTag.includes(suffix)) {
        const response = await sendToNameService(
          currency,
          Number(amount),
          fullTag
        );
        ok = response;
      } else {
        const response = await sendToAddress(currency, Number(amount), fullTag);
        ok = response;
      }
      toggleOverlay("enterAmount");
      toggleOverlay(ok ? "sending" : "failed");
    } catch {
      toggleOverlay("failed");
    } finally {
      setIsSending(false);
    }
  };

  const normalize = (val) => Number(Number(val).toFixed(6));
  const normalizedBalance = String(balance || "0")
    .split(",")
    .join("");
  const bal = parseFloat(normalizedBalance);
  const amt = parseFloat(amount || "0");

  const balFixed = Number(bal.toFixed(6));
  const amtFixed = Number(amt.toFixed(6));

  const insufficient = amt > Number(normalizedBalance);

  if (!isVisible) return null;
  if (tokenOptions.length === 0)
    return <div className="p-4 text-red-500">No tokens to send.</div>;

  return (
    <div className="overlay-background">
      <div className="enter-amount-overlay">
        <div className="overlay-header">
          <LuMoveLeft
            className="back-icon"
            onClick={() => toggleOverlay("enterAmount")}
          />
          <BsQrCodeScan className="qrcodeicon" />
        </div>

        {/* Recipient Tag */}
        <div className="payfrica-tag-section" style={{ margin: "20px 0" }}>
          <h3>Recipient Tag</h3>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="4our0ero4our"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                paddingRight: 80,
                fontSize: 16,
                fontFamily: "LexendLight",
                margin: "10px 0 10px 0",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#555",
                pointerEvents: "none",
              }}
            >
              {suffix}
            </span>
          </div>
          {checking && <small style={{ color: "#666" }}>Checking…</small>}
          {!checking && tagExists === false && (
            <small style={{ color: "red" }}>Name does not exist</small>
          )}
          {!checking && tagExists === true && (
            <small style={{ color: "green" }}>Name is valid!</small>
          )}
        </div>

        {/* Amount & Token */}
        <div className="amount-entry">
          <h3>Amount & Token</h3>
          <div
            className="amount-entry-container"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, "");
                setAmount(val);
              }}
              style={{
                flex: 1,
                minWidth: "0", // ✅ important to allow shrinking
                padding: 10,
                fontSize: 16,
              }}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                flexBasis: "40%",
                minWidth: "120px", // ✅ prevent too-narrow on wrap
                fontSize: 16,
                padding: "10px",
              }}
            >
              {tokenOptions.map((t) => (
                <option key={t.coinType} value={t.coinType}>
                  {t.coinName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: 14, color: "#333" }}>
            {loadingBal
              ? "Loading balance…"
              : `Balance: ${normalizedBalance} ${tokenOptions.find((t) => t.coinType === currency)?.coinName
              }`}
          </div>
          <div className="amount-entry-buttons">
            {["10", "50", "100"].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                style={{ marginRight: 8 }}
              >
                {v}
              </button>
            ))}
            <button
              onClick={() => {
                if (normalizedBalance) setAmount(normalizedBalance);
              }}
              style={{ marginRight: 8 }}
            >
              Max
            </button>
          </div>
          {/* Insufficient balance error */}
          {amount &&
            normalizedBalance &&
            !loadingBal &&
            !isNaN(amtFixed) &&
            !isNaN(balFixed) &&
            insufficient && (
              <div style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                Insufficient balance
              </div>
            )}
        </div>

        {/* Send */}
        <button
          className="send-money-button"
          onClick={handleSendMoney}
          disabled={!canSend}
          style={{
            marginTop: 20,
            opacity: canSend ? 1 : 0.5,
            cursor: canSend ? "pointer" : "not-allowed",
          }}
        >
          {isSending
            ? "Sending…"
            : `Send ${tokenOptions.find((t) => t.coinType === currency)?.coinName
            }`}
        </button>
      </div>
    </div>
  );
};
