import React, { useState } from "react";
import { useGlobalState } from "@/GlobalStateProvider";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// interface TempCardDetailsProps {
//   amount: number | string;
//   currency?: string;
//   (): () => void;
//   onNext: (details: {
//     name: string;
//     amount: string;
//     pin: string;
//     deadline: string;
//   }) => void;
// }

const CardDetails = () => {
  const [name, setName] = useState("");
  const [amt, setAmt] = useState("");
  const [pin, setPin] = useState("");
  const [verifyPin, setVerifyPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [deadline, setDeadline] = useState("");

  const {
    overlayStates,
    toggleOverlay,
    cardType,
    cardDetails,
    setCardDetails,
    currency,
    formatCurrency,
  } = useGlobalState();

  const pinsMatch = pin === verifyPin;

  const submitCardDetails = () => {
    setCardDetails({ name, amount: amt, pin, deadline });
    toggleOverlay("cardDetails");
    toggleOverlay("confirmCardCreate");
  };

  if (!overlayStates.cardDetails) return null;

  return (
    <div className="card-overlay-background">
      <div className="card-overlay-modal card-details-modal">
        <button
          className="card-overlay-close-btn"
          onClick={() => {
            toggleOverlay("cardDetails");
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div style={{ textAlign: "center", marginBottom: 16, marginTop: 8 }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>
            You are Creating a Payfrica Card with
          </div>
          <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 4 }}>
            {formatCurrency(cardDetails.amount)} {currency}
          </div>
          <div style={{ fontSize: 16, marginBottom: 8 }}>
            Fil the infomation below to continue
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 12,
              marginTop: 8,
              fontFamily: "LexendExtraBold",
            }}
          >
            {cardType === "temporary" ? "Temporary Card" : "Permanent Card"}
          </div>
        </div>
        <form
          style={{
            background: "#FFF6D9",
            borderRadius: 6,
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
            padding: 24,
            margin: "0 auto 24px auto",
            width: "100%",
            maxWidth: 400,
            border: "1.5px solid #ccc",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!pinsMatch) return;
            submitCardDetails();
          }}
        >
          <label style={{ fontWeight: 500, fontSize: 15 }}>
            Name
            <input
              className="temp-card-input"
              type="text"
              placeholder="e.g transport"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setCardDetails({ ...cardDetails, name: e.target.value });
              }}
              required
            />
          </label>
          <label style={{ fontWeight: 500, fontSize: 15 }}>
            Amount
            <input
              className="temp-card-input"
              type="number"
              placeholder="e.g 100000 NGNC"
              value={amt}
              onChange={(e) => {
                setAmt(e.target.value);
                setCardDetails({ ...cardDetails, amount: e.target.value });
              }}
              required
            />
          </label>
          <label style={{ fontWeight: 500, fontSize: 15 }}>
            Pin
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                className="temp-card-input"
                type={showPin ? "text" : "password"}
                placeholder="e.g I love my Sui  Wallet"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setCardDetails({ ...cardDetails, pin: e.target.value });
                }}
                required
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPin((v) => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#3c53a4",
                  fontSize: 18,
                }}
                tabIndex={-1}
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
          <label style={{ fontWeight: 500, fontSize: 15 }}>
            Verify Pin
            <input
              className="temp-card-input"
              type={showPin ? "text" : "password"}
              placeholder="Re-enter your pin"
              value={verifyPin}
              onChange={(e) => setVerifyPin(e.target.value)}
              required
              style={{
                borderColor:
                  verifyPin.length > 0 && !pinsMatch ? "#c43e26" : undefined,
              }}
            />
            {verifyPin.length > 0 && !pinsMatch && (
              <span style={{ color: "#c43e26", fontSize: 13 }}>
                Pins do not match
              </span>
            )}
          </label>
          <label style={{ fontWeight: 500, fontSize: 15 }}>
            Deadline
            <input
              className="temp-card-input"
              type="date"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                setCardDetails({ ...cardDetails, deadline: e.target.value });
              }}
              required
              style={{ color: deadline ? "#232323" : "#bdbdbd" }}
            />
          </label>
          <button
            type="submit"
            className="temp-card-next-btn"
            style={{
              marginTop: 24,
              width: "100%",
              background: "#3c53a4",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 0",
              fontSize: 18,
              fontWeight: 500,
              cursor: "pointer",
              opacity: pinsMatch ? 1 : 0.6,
            }}
            disabled={!pinsMatch}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardDetails;
