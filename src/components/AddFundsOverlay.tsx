import React, { useState, useMemo } from "react";
import { useGlobalState } from "@/GlobalStateProvider";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useRealTimeBalances } from "@/hooks/useRealTimeBalance";

const presets = [100, 200, 500, 1000];

const AddFundsOverlay = () => {
  const {
    overlayStates,
    toggleOverlay,
    addFundsCardIdx,
    setAddFundsCardIdx,
    cards,
    setCards,
    formatWithCommas,
  } = useGlobalState();
  const { address } = useCustomWallet();
  const { fundingBalance } = useRealTimeBalances(address);

  const [amount, setAmount] = useState("");
  const card = cards[addFundsCardIdx];

  //   As you don't wanna gimme any NGNC, you can uncomment this later
  // Parse base balance as number
  //   const baseBalance = useMemo(() => {
  //     if (!fundingBalance) return 0;
  //     return Number(fundingBalance.replace(/[^0-9.]/g, ""));
  //   }, [fundingBalance]);

  // I gift myself 1B NGNC, you can comment this out later
  const baseBalance = 1000000000;

  const amt = Number(amount);

  const insufficient = amt > baseBalance;

  const handleAddFunds = () => {
    if (!card || insufficient || amt <= 0) return;
    // Simulate async operation
    setTimeout(() => {
      // Simulate success or failure (50/50 chance)
      const isSuccess = Math.random() > 0.5;

      if (isSuccess) {
        // Update card balance
        setCards((prev) =>
          prev.map((c, i) =>
            i === addFundsCardIdx
              ? {
                  ...c,
                  amount: Number(c.amount) + amt,
                  transactions: [
                    ...(c.transactions || []),
                    {
                      receiver: "Self",
                      type: "Deposit",
                      date: new Date().toLocaleDateString(),
                      amount: `NGN ${formatWithCommas(amt)}`,
                    },
                  ],
                }
              : c
          )
        );
        setAmount("");
        setAddFundsCardIdx(null);
        toggleOverlay("addFunds");
        toggleOverlay("success"); // Show success overlay
      } else {
        setAddFundsCardIdx(null);
        toggleOverlay("addFunds");
        toggleOverlay("failed"); // Show failed overlay
      }
    }, 1200); // Simulate network delay
  };

  if (!overlayStates.addFunds || addFundsCardIdx === null) return null;

  return (
    <div className="overlay-background">
      <div className="enter-deposit-container">
        <div className="overlay-header">
          <h2>Add Funds to Card</h2>
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
            onClick={() => {
              setAddFundsCardIdx(null);
              toggleOverlay("addFunds");
            }}
          />
        </div>
        <div className="deposit-entry-card">
          <h3>Enter Amount</h3>
          <div className="input-wrapper">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="currency">NGN</span>
          </div>
          <div className="preset-buttons">
            {presets.map((p) => (
              <button key={p} onClick={() => setAmount(p.toString())}>
                {p}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 8,
              color: insufficient ? "#c43e26" : "#3c53a4",
            }}
          >
            Balance: NGN {formatWithCommas(baseBalance)}
            {insufficient && (
              <span style={{ marginLeft: 8 }}>Insufficient balance</span>
            )}
          </div>
        </div>
        <button
          className="next-btn"
          disabled={insufficient || !amt}
          onClick={handleAddFunds}
        >
          Add Funds
        </button>
      </div>
    </div>
  );
};

export default AddFundsOverlay;
