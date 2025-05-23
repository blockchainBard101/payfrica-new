import React from "react";
import { FaTimes } from "react-icons/fa";
import QRScanner from "./QRScanner";

const ScanQrOverlay = ({ onScan, onClose, reset, scanningPaused }) => (
  <div className="overlay-background scan-qr-bg">
    <div className="scan-qr-modal">
      <button className="scan-qr-close-btn" onClick={onClose}>
        <FaTimes />
      </button>
      <div className="scan-qr-title">Scan QR Code</div>
      <div className="scan-qr-desc">
        Point your camera at a Payfrica Card to scan
      </div>
      <div className="scan-qr-frame" style={{ background: "#000" }}>
        {!scanningPaused && <QRScanner onDetected={onScan} reset={reset} />}
      </div>
    </div>
  </div>
);

export default ScanQrOverlay;
