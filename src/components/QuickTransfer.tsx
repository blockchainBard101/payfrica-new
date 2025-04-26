import { useState, useEffect } from "react";
import { FaArrowLeft, FaExpand } from "react-icons/fa";
import { useGlobalState } from "@/GlobalStateProvider";

const presets = [100, 200, 500, 1000];

const QuickTransfer: React.FC = () => {
  // 1) Pull in your global overlay state & toggler
  const { overlayStates, toggleOverlay, depositAmount, setDepositAmount } =
    useGlobalState();

  // 2) Component state: amount text plus local currency code
  const [localCurrency, setLocalCurrency] = useState<string>("");

  // 3) Fetch the user's base currency once on mount
  useEffect(() => {
    async function fetchCurrency() {
      // simulate an API call:
      // const res = await fetch('/api/user/currency')
      // const { currency } = await res.json()
      const currency = "NGN";
      setLocalCurrency(currency);
    }
    fetchCurrency();
  }, []);

  // 4) Never call hooks conditionally—so we check overlay flag *after* hooks
  if (!overlayStates.quickTransfer) return null;

  // 5) Handlers
  const handlePreset = (value: number) => {
    setDepositAmount(value.toString());
  };
  const handleNextDepositPage = () => {
    toggleOverlay("quickTransfer"); // close this overlay
    toggleOverlay("confirmDeposit"); // open the next confirmation overlay
    // setDepositData.amount(depositAmount);
  };

  return (
    <div className="overlay-background">
      <div className="enter-deposit-container">
        {/* Header with back + fullscreen icons */}
        <div className="overlay-header">
          <FaArrowLeft
            className="icon"
            onClick={() => {
              toggleOverlay("enterDeposit");
              toggleOverlay("deposit");
              toggleOverlay("quickTransfer");
            }}
          />
          <FaExpand className="icon" />
        </div>

        {/* Card for entering amount */}
        <div className="deposit-entry-card">
          <h3>Enter Amount</h3>

          <div className="input-wrapper">
            <input
              type="number"
              placeholder="0.00"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <span className="currency">{localCurrency}</span>
          </div>

          <div className="preset-buttons">
            {presets.map((p) => (
              <button key={p} onClick={() => handlePreset(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          className="next-btn"
          disabled={!depositAmount || Number(depositAmount) <= 0}
          onClick={handleNextDepositPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuickTransfer;
