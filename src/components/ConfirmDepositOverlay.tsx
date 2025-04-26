"use client";
import { useEffect } from "react";
import { useGlobalState } from "@/GlobalStateProvider";
import { LuMoveLeft } from "react-icons/lu";

const ConfirmDepositOverlay: React.FC = () => {
  const { overlayStates, toggleOverlay, depositData, setDepositData } =
    useGlobalState();

  // 1) Fetch an agent ID when this overlay mounts
  useEffect(() => {
    async function fetchAgent() {
      // simulate API call
      // const res = await fetch(`/api/agent?method=${depositData.method}`);
      // const { agentId } = await res.json();
      const agentId = "AGT-12345XYZ";
      setDepositData((d) => ({ ...d, agentId }));
    }
    fetchAgent();
  }, [depositData.method, setDepositData]);

  // 2) Only render when confirmDeposit is true
  if (!overlayStates.confirmDeposit) return null;

  const { amount, method, agentId } = depositData;

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
            toggleOverlay("confirmDeposit");
            toggleOverlay("quickTransfer");
          }}
        />

        <h4>You are Depositing</h4>
        <h2>NGN {Number(amount).toLocaleString()}</h2>
        <p>
          Your wallet will receive{" "}
          <span style={{ color: "#c43e26" }}>
            NGNC {Number(amount).toLocaleString()}
          </span>
        </p>

        <div className="confirm-summary">
          <div>
            <span>You receive</span>
            <strong>NGN {Number(amount).toLocaleString()}</strong>
          </div>
          <div>
            <span>Fee</span>
            <strong>NGN 0.00</strong>
          </div>
          <div>
            <span>Payment method</span>
            {/* <strong>{method}</strong> */}
            <strong>Quick Transfer</strong>
          </div>
          <div>
            <span>Agent ID</span>
            <strong>{agentId ?? "Loading…"}</strong>
          </div>
        </div>

        <button
          className="next-btn"
          onClick={() => {
            toggleOverlay("confirmDeposit");
            toggleOverlay("makeDeposit");
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ConfirmDepositOverlay;
