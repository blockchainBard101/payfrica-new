import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useGlobalState } from "@/GlobalStateProvider";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface AgentDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const MakeDepositOverlay: React.FC = () => {
  const { overlayStates, toggleOverlay, depositData } = useGlobalState();
  const { amount, agentId } = depositData;

  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1) Fetch agent details when overlay opens
  useEffect(() => {
    async function fetchAgentDetails() {
      if (!agentId) return;
      setLoading(true);
      // simulate API call...
      // const res = await fetch(`/api/agent/${agentId}`);
      // const data = await res.json();
      const data = {
        bankName: "Money Bank",
        accountNumber: "3934944030",
        accountName: "Team Sushi",
      };
      setAgent(data);
      setLoading(false);
    }
    fetchAgentDetails();
  }, [agentId]);

  // 2) Hook rules: only bail after hooks
  if (!overlayStates.makeDeposit) return null;

  const handleConfirm = async () => {
    // Optionally disable the button here...
    // simulate API confirmation
    const accepted: boolean = await new Promise((resolve) =>
      setTimeout(() => resolve(Math.random() > 0.3), 1500)
    );

    toggleOverlay("selectAgent");
    toggleOverlay(accepted ? "success" : "failed");
    toggleOverlay("makeDeposit");
  };

  return (
    <div className="overlay-background">
      <div className="confirm-agent-container">
        <IoIosCloseCircleOutline
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            fontSize: "30px",
            cursor: "pointer",
            color: "#c43e26",
          }}
          onClick={() => toggleOverlay("makeDeposit")}
        />
        <h3>Please Deposit</h3>

        <h2>NGN {Number(amount).toLocaleString()}</h2>
        <p>To this account number</p>

        <div className="agent-details-card">
          {loading || !agent ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="row">
                <span>Bank name</span>
                <strong>{agent.bankName}</strong>
              </div>
              <div className="row">
                <span>Account number</span>
                <strong>{agent.accountNumber}</strong>
              </div>
              <div className="row">
                <span>Account name</span>
                <strong>{agent.accountName}</strong>
              </div>
            </>
          )}
        </div>

        <button
          className="confirm-btn"
          onClick={handleConfirm}
          disabled={loading}
        >
          I have made this transfer
        </button>
      </div>
    </div>
  );
};

export default MakeDepositOverlay;
