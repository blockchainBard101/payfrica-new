import React from "react";
import { FaTimes } from "react-icons/fa";

const EnterPinOverlay = ({
  cardName,
  pin,
  setPin,
  pinError,
  amount,
  setAmount,
  cardBalance,
  onNext,
  onClose,
}) => {
  const amountTooHigh = !!amount && Number(amount) > Number(cardBalance);

  return (
    <div className="overlay-background enter-pin-bg">
      <div className="enter-pin-modal">
        <button className="enter-pin-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="enter-pin-title">{cardName}</div>
        <div className="enter-pin-desc">
          Enter your card PIN and amount to proceed
        </div>
        <input
          className="enter-pin-input"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={6}
          placeholder="Enter PIN"
        />
        {pinError && (
          <div
            className="enter-pin-error"
            style={{ color: "#ff4444", fontSize: 13 }}
          >
            {pinError}
          </div>
        )}
        <input
          className="enter-pin-input"
          type="text"
          inputMode="decimal"
          pattern="^[0-9]*[.,]?[0-9]*$"
          value={amount}
          onChange={(e) => {
            // Only allow numbers and decimal
            const val = e.target.value.replace(/[^0-9.]/g, "");
            setAmount(val);
          }}
          placeholder="Enter Amount"
          style={{ marginBottom: 8 }}
        />
        {amountTooHigh && (
          <div
            className="enter-pin-error"
            style={{ color: "#ff4444", fontSize: 13 }}
          >
            Amount exceeds card balance (₦{Number(cardBalance).toLocaleString()}
            )
          </div>
        )}
        <button
          className="enter-pin-next-btn"
          onClick={onNext}
          disabled={
            pin.length !== 4 || !amount || Number(amount) <= 0 || amountTooHigh
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EnterPinOverlay;
