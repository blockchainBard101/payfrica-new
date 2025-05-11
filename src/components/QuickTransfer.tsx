// src/components/QuickTransfer.tsx
"use client";

import React, { useMemo } from "react";
import { FaArrowLeft, FaExpand } from "react-icons/fa";
import { useGlobalState } from "@/GlobalStateProvider";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useUserDetails } from "@/hooks/useTokenExchange";

const presets = [100, 200, 500, 1000];

const QuickTransfer = () => {
  const { overlayStates, toggleOverlay, depositData, setDepositData } =
    useGlobalState();
  const { address } = useCustomWallet();  
  const userDetails = useUserDetails(address);

  // derive your local‐currency code (e.g. NGNC) from whatever's on the user
  const localCurrency = useMemo(() => {
    return (
      userDetails?.details.country?.baseToken?.symbol ?? // e.g. "NGNC"
      userDetails?.details.country?.currencySymbol ??   // fallback to a symbol like "₦"
      ""
    );
  }, [userDetails]);

  if (!overlayStates.quickTransfer) return null;

  const amt = depositData.amount;

  const handlePreset = (value: number) =>
    setDepositData((d) => ({ ...d, amount: value.toString() }));

  const handleTransferNext = () => {
    setDepositData((d) => ({ ...d, method: "Quick Transfer" }));
    toggleOverlay("quickTransfer");
    toggleOverlay("confirmDeposit");
  };

  return (
    <div className="overlay-background">
      <div className="enter-deposit-container">
        {/* header */}
        <div className="overlay-header">
          <FaArrowLeft
            className="icon"
            onClick={() => toggleOverlay("quickTransfer")}
          />
          <FaExpand className="icon" />
        </div>

        <div className="deposit-entry-card">
          <h3>Enter Amount</h3>
          <div className="input-wrapper">
            <input
              type="number"
              placeholder="0.00"
              value={amt}
              onChange={(e) =>
                setDepositData((d) => ({ ...d, amount: e.target.value }))
              }
            />
            <span className="currency">{localCurrency}</span>
          </div>

          <div className="preset-buttons">
            {presets.map((p) => (
              <button key={p} onClick={() => handlePreset(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          className="next-btn"
          disabled={!amt || Number(amt) <= 0}
          onClick={handleTransferNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuickTransfer;
