import React, { useState } from "react";
import { useGlobalState } from "../GlobalStateProvider";
import ScanQrOverlay from "./ScanQrOverlay";
import EnterPinOverlay from "./EnterPinOverlay";
import ConfirmTransactionOverlay from "./ConfirmTransactionOverlay";

const MOCK_CARD = {
  name: "Flexing Card",
  pin: "1234",
  owner: "John Doe",
};

const MOCK_AMOUNT = 10000;

const ReceiveFundsFlowOverlay = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const [step, setStep] = useState<"scan" | "pin" | "confirm" | "done">("scan");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);

  if (!overlayStates.receiveFundsFlow) return null;

  // Step 1: Scan QR
  if (step === "scan") {
    return (
      <ScanQrOverlay
        onScan={(data) => {
          setScannedData(data);
          setStep("pin");
        }}
        onClose={() => toggleOverlay("receiveFundsFlow")}
      />
    );
  }

  // Step 2: Enter PIN
  if (step === "pin") {
    return (
      <EnterPinOverlay
        cardName={MOCK_CARD.name}
        pin={pin}
        setPin={setPin}
        pinError={pinError}
        onClose={() => toggleOverlay("receiveFundsFlow")}
        onNext={() => {
          if (pin === MOCK_CARD.pin) {
            setPinError("");
            setStep("confirm");
            console.log("PIN entered:", pin);
            console.log("Scanned QR Data:", scannedData);
          } else {
            setPinError("Incorrect PIN");
          }
        }}
      />
    );
  }

  // Step 3: Confirm Transaction
  if (step === "confirm") {
    return (
      <ConfirmTransactionOverlay
        owner={MOCK_CARD.owner}
        amount={MOCK_AMOUNT}
        cardName={MOCK_CARD.name}
        onClose={() => toggleOverlay("receiveFundsFlow")}
        onConfirm={() => {
          // Simulate success/failure
          const isSuccess = Math.random() > 0.5;
          setSuccess(isSuccess);
          setStep("done");
        }}
      />
    );
  }

  // Step 4: Success/Failed
  if (step === "done") {
    setTimeout(() => {
      toggleOverlay("receiveFundsFlow");
    }, 2000);
    return success ? (
      <div className="success-overlay-background">
        <div className="feedback-overlay">
          <div className="feedback-icon success-icon">✔️</div>
          <div className="feedback-title">Success!</div>
        </div>
      </div>
    ) : (
      <div className="failed-overlay-background">
        <div className="feedback-overlay">
          <div className="feedback-icon failed-icon">❌</div>
          <div className="feedback-title">Failed!</div>
        </div>
      </div>
    );
  }

  return null;
};

export default ReceiveFundsFlowOverlay;
