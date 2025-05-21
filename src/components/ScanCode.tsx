import React from "react";
import { useGlobalState } from "../GlobalStateProvider";
import { FaTimes, FaQrcode, FaArrowRight, FaArrowDown } from "react-icons/fa";

const ScanCode = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();

  if (!overlayStates.scanQR) return null;

  const handleSelect = (type: "send" | "receive") => {
    toggleOverlay("scanQR");
    if (type === "send") {
      toggleOverlay("sendFundsFlow");
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
            style={{}}
            onClick={() => handleSelect("send")}
          >
            <FaArrowRight style={{ fontSize: 22, color: "#fbe19a" }} />
            Send Funds
          </button>
          <button
            className="scan-action-btn"
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
