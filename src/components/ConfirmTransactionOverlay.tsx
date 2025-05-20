import React from "react";
import { FaArrowRight } from "react-icons/fa";

const ConfirmTransactionOverlay = ({
  owner,
  amount,
  cardName,
  onConfirm,
  onClose,
}) => (
  <div className="overlay-background confirm-tx-bg">
    <div className="confirm-tx-modal">
      <div className="confirm-tx-title">Confirm Transaction</div>
      <div className="confirm-tx-row">
        <span>Receiving from</span>
        <span>{owner}</span>
      </div>
      <div className="confirm-tx-row">
        <span>Card</span>
        <span>{cardName}</span>
      </div>
      <div className="confirm-tx-row">
        <span>Amount</span>
        <span>{amount.toLocaleString()} (ten)</span>
      </div>
      <button className="confirm-tx-btn" onClick={onConfirm}>
        Confirm <FaArrowRight />
      </button>
      <button className="confirm-tx-cancel" onClick={onClose}>
        Cancel
      </button>
    </div>
  </div>
);

export default ConfirmTransactionOverlay;
