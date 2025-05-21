import React from "react";
import { FaArrowRight } from "react-icons/fa";

const QRConfirmSendOverlay = ({
  cardOwner,
  amount,
  selectedToken,
  tokens,
  setSelectedToken,
  onConfirm,
  onClose,
}) => (
  <div className="overlay-background confirm-tx-bg">
    <div className="confirm-tx-modal">
      <div className="confirm-tx-title">Confirm Send</div>
      <div className="confirm-tx-row">
        <span>Recipient</span>
        <span>{cardOwner}</span>
      </div>
      <div className="confirm-tx-row">
        <span>Amount</span>
        <span>
          {Number(amount).toLocaleString()} {selectedToken}
        </span>
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

export default QRConfirmSendOverlay;
