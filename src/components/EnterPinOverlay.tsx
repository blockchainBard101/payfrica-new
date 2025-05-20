import React from "react";
import { FaTimes } from "react-icons/fa";

const EnterPinOverlay = ({
  cardName,
  pin,
  setPin,
  pinError,
  onNext,
  onClose,
}) => (
  <div className="overlay-background enter-pin-bg">
    <div className="enter-pin-modal">
      <button className="enter-pin-close-btn" onClick={onClose}>
        <FaTimes />
      </button>
      <div className="enter-pin-title">{cardName}</div>
      <div className="enter-pin-desc">Enter your card PIN to proceed</div>
      <input
        className="enter-pin-input"
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        maxLength={6}
        placeholder="Enter PIN"
      />
      {pinError && <div className="enter-pin-error">{pinError}</div>}
      <button
        className="enter-pin-next-btn"
        onClick={onNext}
        disabled={pin.length !== 4}
      >
        Next
      </button>
    </div>
  </div>
);

export default EnterPinOverlay;
