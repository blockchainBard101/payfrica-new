import React from "react";
import { FaTimes } from "react-icons/fa";

const MOCK_BALANCES = {
  USDT: 1000,
  NGNC: 5000,
  USDC: 2000,
  BTC: 0.5,
};

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
      <div className="enter-amount-title">Sending to {cardOwner}</div>
      <div className="enter-amount-desc">Enter the amount you want to send</div>
      <div className="qr-amount-token-group">
        <input
          className="qr-amount-input"
          type="text"
          inputMode="decimal"
          pattern="^[0-9]*[.,]?[0-9]*$"
          value={amount}
          onChange={(e) => {
            // Only allow numbers and decimal
            const val = e.target.value.replace(/[^0-9.]/g, "");
            setAmount(val);
          }}
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
      <div
        style={{
          color: "#ffc43a",
          fontSize: 14,
          marginBottom: 4,
          marginTop: -8,
          textAlign: "left",
          width: "100%",
        }}
      >
        Balance: {MOCK_BALANCES[selectedToken]?.toLocaleString() ?? 0}{" "}
        {selectedToken}
      </div>
      {Number(amount) > (MOCK_BALANCES[selectedToken] ?? 0) && (
        <div
          style={{
            color: "#ff4444",
            fontSize: 13,
            marginBottom: 12,
            marginTop: 2,
            textAlign: "left",
            width: "100%",
            fontWeight: 500,
          }}
        >
          Amount exceeds available balance!
        </div>
      )}
      <button
        className="enter-amount-next-btn"
        onClick={onNext}
        disabled={
          !amount ||
          Number(amount) <= 0 ||
          Number(amount) > (MOCK_BALANCES[selectedToken] ?? 0)
        }
      >
        Next
      </button>
    </div>
  </div>
);

export default QRSendAmountOverlay;
