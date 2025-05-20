import React, { useState } from "react";
import { useGlobalState } from "../GlobalStateProvider";
import { FaTimes } from "react-icons/fa";

interface RemoveFundsOverlayProps {
  cardIdx: number;
  onClose: () => void;
}

const RemoveFundsOverlay: React.FC<RemoveFundsOverlayProps> = ({
  cardIdx,
  onClose,
}) => {
  const {
    cards,
    setCards,
    mainBalance,
    setMainBalance,
    mainTransactions,
    setMainTransactions,
    formatWithCommas,
  } = useGlobalState();
  const card = cards[cardIdx];
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!card) return null;

  const handleRemove = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (amt > card.amount) {
      setError("Amount exceeds card balance");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      // 1. Deduct from card
      setCards((prev) =>
        prev.map((c, i) =>
          i === cardIdx
            ? {
                ...c,
                amount: c.amount - amt,
                transactions: [
                  {
                    receiver: "Main Wallet",
                    type: "Debit",
                    date: new Date().toLocaleDateString(),
                    amount: `NGN ${formatWithCommas(amt)}`,
                  },
                  ...c.transactions,
                ],
              }
            : c
        )
      );
      // 2. Add to main balance
      setMainBalance((prev) => prev + amt);
      // 3. Add to main transaction history
      setMainTransactions((prev) => [
        {
          receiver: card.name,
          type: "Credit",
          date: new Date().toLocaleDateString(),
          amount: `NGN ${formatWithCommas(amt)}`,
        },
        ...prev,
      ]);
      setLoading(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="overlay-background" style={{ zIndex: 4000 }}>
      <form
        className="card-overlay-modal"
        style={{
          minWidth: 320,
          maxWidth: 400,
          padding: 32,
          position: "relative",
        }}
        onSubmit={handleRemove}
      >
        <button
          type="button"
          className="card-overlay-close-btn"
          onClick={onClose}
          disabled={loading}
        >
          <FaTimes />
        </button>
        <div className="card-overlay-title">Remove Funds from {card.name}</div>
        <div style={{ marginBottom: 16 }}>
          Card Balance: <b>₦{formatWithCommas(card.amount)}</b>
        </div>
        <label>
          Amount to Remove
          <input
            required
            type="number"
            min={1}
            max={card.amount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="temp-card-input"
            disabled={loading}
          />
        </label>
        {error && <div style={{ color: "#c43e26", marginTop: 8 }}>{error}</div>}
        <button
          className="temp-card-next-btn"
          type="submit"
          disabled={loading}
          style={{ marginTop: 20 }}
        >
          {loading ? "Processing..." : "Remove Funds"}
        </button>
      </form>
    </div>
  );
};

export default RemoveFundsOverlay;
