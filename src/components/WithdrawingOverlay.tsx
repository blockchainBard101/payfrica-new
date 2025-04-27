"use client";
import React from "react";
import { FaHourglassHalf } from "react-icons/fa";
import { useGlobalState } from "@/GlobalStateProvider";

const WithdrawingOverlay: React.FC = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();

  // 1️⃣ hooks above conditionals
  if (!overlayStates.withdrawing) return null;

  return (
    <div className="overlay-background">
      <div className="withdrawing-container">
        <FaHourglassHalf className="hourglass-icon" />
        <h3>Please wait ......</h3>
        <p>Your transaction is being confirmed</p>
        <button
          className="notify-btn"
          onClick={async () => {
            // simulate backend check
            const accepted = await new Promise((r) =>
              setTimeout(() => r(Math.random() > 0.3), 1000)
            );
            toggleOverlay("withdrawing");
            toggleOverlay(accepted ? "success" : "failed");
          }}
        >
          Get notified when your transaction is complete
        </button>
      </div>
    </div>
  );
};

export default WithdrawingOverlay;
