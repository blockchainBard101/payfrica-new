import React, { useState } from "react";
import { SuccessOverlay } from "./SuccessOverlay";
import { FailedOverlay } from "./FailedOverlay";
import { useGlobalState } from "@/GlobalStateProvider";

// interface ConfirmCardCreateProps {
//   cardName: string;
//   cardAmount: string;
//   cardFee: string;
//   paymentMethod: string;
//   paymentMethod2?: string;
//   currency: string;
//   onClose: () => void;
//   onSuccess?: () => void;
//   onFailure?: () => void;
// }

const ConfirmCardCreate = () => {
  const {
    overlayStates,
    toggleOverlay,
    cardDetails,
    currency,
    formatCurrency,
  } = useGlobalState();
  const [status, setStatus] = useState<"idle" | "success" | "failed">("idle");

  const handleCreateCard = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulate random success or failure
      const isSuccess = Math.random() > 0.5;
      if (isSuccess) {
        toggleOverlay("success");
        toggleOverlay("confirmCardCreate");
        // setStatus("success");
        // if (onSuccess) onSuccess();
      } else {
        toggleOverlay("failed");
        toggleOverlay("confirmCardCreate");
        throw new Error("Simulated failure");
      }
    } catch (e) {
      //   setStatus("failed");
      toggleOverlay("failed");
      toggleOverlay("confirmCardCreate");
      // if (onFailure) onFailure();
    }
  };

  if (!overlayStates.confirmCardCreate) return null;
  //   if (status === "success") return <SuccessOverlay />;
  //   if (status === "failed") return <FailedOverlay />;

  return (
    <div className="card-overlay-background">
      <div className="confirm-card-modal confirm-card-overlay-modal">
        <button
          className="card-overlay-close-btn"
          onClick={() => toggleOverlay("confirmCardCreate")}
          aria-label="Close"
        >
          ×
        </button>
        <div className="confirm-card-header">
          <div className="confirm-card-title">
            You are Creating a Payfrica Card with
          </div>
          <div className="confirm-card-currency">
            {formatCurrency(cardDetails.amount)} {currency}
          </div>
          <div className="confirm-card-desc">
            Confirm the infomation below to create card...
          </div>
        </div>
        <div className="confirm-card-details">
          <div className="confirm-card-row">
            <span className="confirm-card-label">Card&apos;s Name</span>
            <span className="confirm-card-value">{cardDetails.name}</span>
          </div>
          <div className="confirm-card-row">
            <span className="confirm-card-label">Fee</span>
            <span className="confirm-card-value">
              {formatCurrency(cardDetails.amount * (1 / 100))}
            </span>
          </div>
          <div className="confirm-card-row">
            <span className="confirm-card-label">Payment method</span>
            <span className="confirm-card-value">Payfrica Wallet</span>
          </div>
          {/* {paymentMethod2 && (
            <div className="confirm-card-row">
              <span className="confirm-card-label">Payment method</span>
              <span className="confirm-card-value">
                {cardDetails.paymentMethod2}
              </span>
            </div>
          )} */}
        </div>
        <button className="confirm-card-btn" onClick={handleCreateCard}>
          Create Card
        </button>
      </div>
    </div>
  );
};

export default ConfirmCardCreate;
