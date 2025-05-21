import React from "react";

const InvalidCardAlertOverlay = ({ onClose }: { onClose: () => void }) => (
  <div className="overlay-background failed-overlay-background">
    <div className="feedback-overlay animated-failed">
      <div
        className="feedback-icon failed-icon animated-shake"
        style={{ fontSize: 48, color: "#ff4444" }}
      >
        !
      </div>
      <h3 className="feedback-title">Invalid Card</h3>
      <p className="feedback-message">
        This card is not meant for receiving funds. Please scan a valid Payfrica
        receive card.
      </p>
      <button className="feedback-btn" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

export default InvalidCardAlertOverlay;
