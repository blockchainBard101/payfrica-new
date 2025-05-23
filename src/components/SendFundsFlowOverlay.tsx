import { useState, useEffect, useRef } from "react";
import { useGlobalState } from "../GlobalStateProvider";
import ScanQrOverlay from "./ScanQrOverlay";
import { SuccessOverlay } from "./SuccessOverlay";
import { FailedOverlay } from "./FailedOverlay";

// New overlays:
import QRSendAmountOverlay from "./QRSendAmountOverlay";
import QRConfirmSendOverlay from "./QRConfirmSendOverlay";
import InvalidCardAlertOverlay from "./InvalidCardAlertOverlay";

const mockedTokens = [
  { symbol: "USDT" },
  { symbol: "NGNC" },
  { symbol: "USDC" },
  { symbol: "BTC" },
];

const SendFundsFlowOverlay = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const [step, setStep] = useState<"scan" | "amount" | "confirm" | "done">(
    "scan"
  );
  const [amount, setAmount] = useState("");
  const [scannedData, setScannedData] = useState<any | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [showInvalidCardAlert, setShowInvalidCardAlert] = useState(false);
  const [resetScannerKey, setResetScannerKey] = useState(0);
  const [selectedToken, setSelectedToken] = useState(mockedTokens[0].symbol);
  const prevOpen = useRef(false);

  useEffect(() => {
    if (prevOpen.current && !overlayStates.sendFundsFlow) {
      // Only reset when overlay is closed
      setStep("scan");
      setAmount("");
      setScannedData(null);
      setSuccess(null);
      setShowInvalidCardAlert(false);
      setResetScannerKey(0);
    }
    prevOpen.current = overlayStates.sendFundsFlow;
  }, [overlayStates.sendFundsFlow]);

  // Reset all state and close overlay
  const handleClose = () => {
    toggleOverlay("sendFundsFlow");
  };

  if (!overlayStates.sendFundsFlow) return null;

  // Step 1: Scan QR
  if (step === "scan") {
    return (
      <>
        <ScanQrOverlay
          scanningPaused={false}
          onScan={(data: string) => {
            let wallet = null;
            // Accept plain wallet address or JSON with wallet field
            try {
              // Try JSON parse
              const parsed = JSON.parse(data);
              console.log("Send Card QR Data (parsed):", parsed);
              if (
                parsed &&
                typeof parsed.wallet === "string" &&
                /^0x[a-fA-F0-9]{40,64}$/.test(parsed.wallet.trim())
              ) {
                wallet = parsed.wallet.trim();
              }
            } catch (e) {
              // If not JSON, check if it's a plain wallet address
              if (
                typeof data === "string" &&
                /^0x[a-fA-F0-9]{40,64}$/.test(data.trim())
              ) {
                wallet = data.trim();
              }
            }
            if (wallet) {
              setScannedData(wallet);
              setStep("amount");
            } else {
              setShowInvalidCardAlert(true);
            }
          }}
          onClose={handleClose}
          reset={resetScannerKey}
        />
        {showInvalidCardAlert && (
          <InvalidCardAlertOverlay
            onClose={() => {
              setShowInvalidCardAlert(false);
              setResetScannerKey((k) => k + 1);
            }}
          />
        )}
      </>
    );
  }

  // Step 2: Enter Amount
  if (step === "amount") {
    return (
      <QRSendAmountOverlay
        cardOwner={scannedData?.owner || "Unknown"}
        amount={amount}
        setAmount={setAmount}
        tokens={mockedTokens}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        onClose={handleClose}
        onNext={() => {
          if (!amount || Number(amount) <= 0) return;
          setStep("confirm");
        }}
      />
    );
  }

  // Step 3: Confirm Send
  if (step === "confirm") {
    return (
      <QRConfirmSendOverlay
        cardOwner={scannedData?.owner || "Unknown"}
        amount={amount}
        selectedToken={selectedToken}
        tokens={mockedTokens}
        setSelectedToken={setSelectedToken}
        onClose={handleClose}
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
    if (success) {
      toggleOverlay("success");
      // return <SuccessOverlay />;
    } else {
      toggleOverlay("failed");
      // return <FailedOverlay onClose={handleClose} />;
    }
  }

  return null;
};

export default SendFundsFlowOverlay;
