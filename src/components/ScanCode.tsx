import React from "react";
import { useGlobalState } from "../GlobalStateProvider";
import { FaTimes, FaQrcode, FaArrowRight, FaArrowDown } from "react-icons/fa";

const ScanCode = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();

  if (!overlayStates.scanQR) return null;

  const handleSelect = (type: "send" | "receive") => {
    toggleOverlay("scanQR");
    if (type === "send") {
      toggleOverlay("sendMoney");
    } else {
      toggleOverlay("receiveFundsFlow");
    }
  };

  return (
    <div className="overlay-background" style={{ zIndex: 5000 }}>
      <div className="scan-code-modal">
        <button
          className="card-overlay-close-btn"
          onClick={() => toggleOverlay("scanQR")}
        >
          <FaTimes />
        </button>
        <div style={{ marginBottom: 24 }}>
          <FaQrcode style={{ fontSize: 48, color: "#3c53a4" }} />
        </div>
        <h2
          style={{
            fontFamily: "LexendExtraBold",
            color: "#3c53a4",
            marginBottom: 12,
          }}
        >
          Scan QR
        </h2>
        <p style={{ color: "#555", marginBottom: 32 }}>
          What would you like to do?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <button
            className="scan-action-btn"
            style={{
              background: "linear-gradient(90deg, #3c53a4 60%, #fbe19a 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "1.2rem 1rem",
              fontSize: 20,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(60, 83, 164, 0.08)",
              transition: "background 0.2s",
            }}
            onClick={() => handleSelect("send")}
          >
            <FaArrowRight style={{ fontSize: 22, color: "#fbe19a" }} />
            Send Funds
          </button>
          <button
            className="scan-action-btn"
            style={{
              background: "linear-gradient(90deg, #fbe19a 60%, #3c53a4 100%)",
              color: "#3c53a4",
              border: "none",
              borderRadius: 10,
              padding: "1.2rem 1rem",
              fontSize: 20,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(60, 83, 164, 0.08)",
              transition: "background 0.2s",
            }}
            onClick={() => handleSelect("receive")}
          >
            <FaArrowDown style={{ fontSize: 22, color: "#3c53a4" }} />
            Receive Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanCode;
