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
        <p>Your Withdrawal is being confirmed, You'll be credited soon</p>
        <button
          className="notify-btn"
          onClick={async () => {
            
            toggleOverlay("withdrawing");
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default WithdrawingOverlay;
