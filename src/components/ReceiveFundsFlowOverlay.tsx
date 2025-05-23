import React, { useState } from "react";
import { useGlobalState } from "../GlobalStateProvider";
import ScanQrOverlay from "./ScanQrOverlay";
import EnterPinOverlay from "./EnterPinOverlay";
import ConfirmTransactionOverlay from "./ConfirmTransactionOverlay";
import { SuccessOverlay } from "./SuccessOverlay";
import { FailedOverlay } from "./FailedOverlay";
import InvalidCardAlertOverlay from "./InvalidCardAlertOverlay";

// const MOCK_AMOUNT = 10000;

const ReceiveFundsFlowOverlay = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const [step, setStep] = useState<"scan" | "pin" | "confirm" | "done">("scan");
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState("");
  const [pinError, setPinError] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<any | null>(null);
  const [showInvalidCardAlert, setShowInvalidCardAlert] = useState(false);
  const [scanningPaused, setScanningPaused] = useState(false);
  const [resetScannerKey, setResetScannerKey] = useState(0);

  // Reset all state when overlay is closed
  const handleClose = () => {
    setStep("scan");
    setPin("");
    setAmount("");
    setPinError("");
    setSuccess(null);
    setScannedData(null);
    toggleOverlay("receiveFundsFlow");
  };

  if (!overlayStates.receiveFundsFlow) return null;

  // Step 1: Scan QR
  if (step === "scan") {
    return (
      <>
        <ScanQrOverlay
          onScan={(data: string) => {
            let parsed: any = null;
            try {
              parsed = JSON.parse(data);
            } catch (e) {
              setShowInvalidCardAlert(true);
              setScanningPaused(true);
              return;
            }
            if (
              parsed
              //  &&
              // parsed.type === "receive"
              // &&
              // typeof parsed.wallet === "string" &&
              // /^0x[a-fA-F0-9]{40,64}$/.test(parsed.wallet.trim())
            ) {
              setScannedData(parsed);
              setStep("pin");
            } else {
              setShowInvalidCardAlert(true);
              setScanningPaused(true);
            }
          }}
          onClose={handleClose}
          reset={resetScannerKey}
          scanningPaused={scanningPaused}
        />
      </>
    );
  }

  // Step 2: Enter PIN and Amount
  if (step === "pin") {
    return (
      <EnterPinOverlay
        cardName={scannedData?.name || ""}
        pin={pin}
        setPin={setPin}
        pinError={pinError}
        amount={amount}
        setAmount={setAmount}
        cardBalance={scannedData?.amount || 0}
        onClose={handleClose}
        onNext={() => {
          if (pin === scannedData?.pin) {
            setPinError("");
            setStep("confirm");
            console.log("PIN entered:", pin);
            console.log("Scanned QR Data:", scannedData);
            console.log("Amount entered:", amount);
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
        owner={scannedData?.owner || "Unknown"}
        amount={amount}
        cardName={scannedData?.name || ""}
        onClose={handleClose}
        onConfirm={() => {
          const isSuccess = Math.random() > 0.5;
          setSuccess(isSuccess);
          setStep("done");
        }}
      />
    );
  }

  // Step 4: Success/Failed
  if (step === "done") {
    if (success === true) {
      toggleOverlay("success");
    } else if (success === false) {
      toggleOverlay("failed");
    }
    handleClose();
    return null;
  }

  {
    showInvalidCardAlert && (
      <InvalidCardAlertOverlay
        onClose={() => {
          setShowInvalidCardAlert(false);
          setScanningPaused(false);
          setResetScannerKey((k) => k + 1);
        }}
      />
    );
  }

  return null;
};

export default ReceiveFundsFlowOverlay;
