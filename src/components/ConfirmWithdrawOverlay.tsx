import React, { useEffect, useState } from "react";
import { LuMoveLeft } from "react-icons/lu";
import { useGlobalState } from "@/GlobalStateProvider";

const ConfirmWithdrawOverlay = () => {
  const { overlayStates, toggleOverlay, withdrawData, setWithdrawData } =
    useGlobalState();

  const { amount, method, agentId } = withdrawData;
  const [loadingAgent, setLoadingAgent] = useState(true);

  // fetch agentId once
  useEffect(() => {
    async function fetchAgent() {
      // simulate API
      const id = "AGT-12345XYZ";
      setWithdrawData((d) => ({ ...d, agentId: id }));
      setLoadingAgent(false);
    }
    fetchAgent();
  }, [setWithdrawData]);

  if (!overlayStates.confirmWithdraw) return null;

  // mock gas fee: 0.5%
  const fee = (Number(amount) * 0.005).toFixed(2);
  const total = (Number(amount) + Number(fee)).toFixed(2);

  const handleConfirmDeposit = async () => {
    // simulate backend check
    const accepted = await new Promise((r) =>
      setTimeout(() => r(Math.random() > 0.3), 1000)
    );
    toggleOverlay("confirmWithdraw");
    toggleOverlay(accepted ? "withdrawing" : "failed");
  };

  return (
    <div className="overlay-background">
      <div className="confirm-deposit-container">
        <LuMoveLeft
          style={{
            position: "absolute",
            left: "30px",
            top: "20px",
            fontSize: "30px",
            // marginBottom: "40px",
            cursor: "pointer",
            color: "#bf8555",
          }}
          onClick={() => {
            toggleOverlay("confirmWithdraw");
            toggleOverlay("withdraw");
          }}
        />

        <h4>You are Withdrawing</h4>
        <h2>NGN {Number(amount).toLocaleString()}</h2>
        <p>
          Your bank account will receive NGN {Number(amount).toLocaleString()}
        </p>

        <div className="confirm-summary">
          <div>
            <span>You receive</span>
            <strong>NGN {Number(amount).toLocaleString()}</strong>
          </div>
          <div>
            <span>Payment method</span>
            <strong>{method}</strong>
          </div>
          <div>
            <span>Agent ID</span>
            <strong>{loadingAgent ? "Loading…" : agentId}</strong>
          </div>
          <div>
            <span>Total charged</span>
            <strong>NGN {total}</strong>
          </div>
        </div>

        <button
          className="next-btn"
          disabled={loadingAgent}
          onClick={handleConfirmDeposit}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmWithdrawOverlay;
