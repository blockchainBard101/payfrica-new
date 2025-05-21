import React from "react";
import { FaTimes } from "react-icons/fa";

const QRSendAmountOverlay = ({
  cardOwner,
  amount,
  setAmount,
  tokens,
  selectedToken,
  setSelectedToken,
  onNext,
  onClose,
}) => (
  <div className="overlay-background enter-amount-bg">
    <div className="enter-amount-modal">
      <button className="enter-amount-close-btn" onClick={onClose}>
        <FaTimes />
      </button>
      <div className="enter-amount-title">Send to {cardOwner}</div>
      <div className="enter-amount-desc">Enter the amount you want to send</div>
      <div className="qr-amount-token-group">
        <input
          className="qr-amount-input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={1}
          placeholder="Enter Amount"
        />
        <select
          className="qr-token-select"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
        >
          {tokens.map((t) => (
            <option key={t.symbol} value={t.symbol}>
              {t.symbol}
            </option>
          ))}
        </select>
      </div>
      <button
        className="enter-amount-next-btn"
        onClick={onNext}
        disabled={!amount || Number(amount) <= 0}
      >
        Next
      </button>
    </div>
  </div>
);

export default QRSendAmountOverlay;
