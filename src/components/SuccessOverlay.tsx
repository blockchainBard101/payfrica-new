"use client";
import { useGlobalState } from "../GlobalStateProvider";
import { FaCheckCircle } from "react-icons/fa";

export const SuccessOverlay = () => {
  const { overlayStates, closeAllOverlays } = useGlobalState();

  if (!overlayStates.success) return null;

  return (
    <div className="overlay-background">
      <div className="feedback-overlay animated-success">
        <FaCheckCircle className="feedback-icon success-icon animated-pop" />
        <h3 className="feedback-title">Success!</h3>
        <p className="feedback-message">Your card was created successfully.</p>
        {/* <button className="feedback-btn" onClick={() => closeAllOverlays()}>
          View Receipt
        </button> */}
        <button
          className="feedback-btn secondary"
          onClick={() => closeAllOverlays()}
        >
          Home
        </button>
      </div>
    </div>
  );
};
