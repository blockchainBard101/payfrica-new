import React from "react";
import { FaBolt, FaCreditCard } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useGlobalState } from "@/GlobalStateProvider";

/**
 * We type our component as a React Functional Component:
 * React.FC implicitly types props.children for us.
 */
const DepositTypeOverlay: React.FC = () => {
  // pull in our global context (typed elsewhere)
  const { overlayStates, toggleOverlay } = useGlobalState();

  // If deposit overlay flag is false, render nothing.
  if (!overlayStates.deposit) {
    return null;
  }

  /**
   * Handler for clicking "Quick Transfer".
   * We annotate it returns void (no value).
   */
  const handleQuickTransfer = (): void => {
    toggleOverlay("deposit"); // close this modal
    toggleOverlay("quickTransfer"); // open the next flow
  };

  return (
    <div className="overlay-background">
      <div className="deposit-type-container">
        <div className="deposit-header">
          <h3>How would you like to make deposit?</h3>
          <IoIosCloseCircleOutline
            style={{ cursor: "pointer", color: "#bf8555", fontSize: "30px" }}
            onClick={() => toggleOverlay("deposit")}
          />
        </div>

        <div className="deposit-option" onClick={handleQuickTransfer}>
          <div className="option-icon">
            <FaBolt />
          </div>
          <div className="option-content">
            <h4>Quick Transfer</h4>
            <p>Fund your Payfrica Wallet instantly with your bank</p>
            <div className="badges">
              <span className="badge">Zero fees</span>
              <span className="badge">Few minutes</span>
            </div>
          </div>
        </div>

        <div className="deposit-option disabled">
          <div className="option-icon">
            <FaCreditCard />
          </div>
          <div className="option-content">
            <h4>
              Card Deposits <span className="coming-soon">(Coming soon)</span>
            </h4>
            <p>Fund your Payfrica Wallet with your bank card</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DepositTypeOverlay };
