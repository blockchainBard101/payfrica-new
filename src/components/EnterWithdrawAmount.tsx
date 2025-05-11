"use client";
import React, { useMemo, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useGlobalState } from "@/GlobalStateProvider";
import { useUserDetails } from "@/hooks/useTokenExchange";
import { useCustomWallet } from "@/contexts/CustomWallet";

const presets = [100, 200, 500, 1000];

const EnterWithdrawAmount = () => {
  const { overlayStates, toggleOverlay, withdrawData, setWithdrawData } =
    useGlobalState();
  const { address } = useCustomWallet();
  const userDetails = useUserDetails(address);

  // console.log(userDetails);
  const localCurrency = useMemo(() => {
    return (  
      userDetails?.details.country?.baseToken?.symbol ?? // e.g. "NGNC"
      userDetails?.details.country?.currencySymbol ??   // fallback to a symbol like "₦"
      ""
    );
  }, [userDetails]);

  // keep hooks above any early returns
  if (!overlayStates.withdraw) return null;

  // preset button sets depositData.amount
  const handlePreset = (value) => {
    setWithdrawData((d) => ({ ...d, amount: value.toString() }));
  };

  // on Next: store method + close/open overlays
  const handleWithdrawalNext = () => {
    setWithdrawData((d) => ({ ...d, method: "Quick Transfer" }));
    toggleOverlay("withdraw");
    toggleOverlay("confirmWithdraw");
  };

  const amt = withdrawData.amount;

  return (
    <div className="overlay-background">
      <div className="enter-deposit-container">
        {/* header */}
        <div className="overlay-header">
          <h2>Withdraw Money</h2>
          <IoIosCloseCircleOutline
            style={{
              color: "#bf8555",
              fontSize: "30px",
              cursor: "pointer",
              position: "absolute",
              right: "20px",
              top: "0px",
              marginBottom: "20px",
            }}
            onClick={() => toggleOverlay("withdraw")}
          />
        </div>

        <div className="deposit-entry-card">
          <h3>Enter Amount</h3>
          <div className="input-wrapper">
            <input
              type="number"
              placeholder="0.00"
              value={amt}
              onChange={(e) =>
                setWithdrawData((d) => ({ ...d, amount: e.target.value }))
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
          onClick={handleWithdrawalNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EnterWithdrawAmount;
