"use client";
import { useGlobalState } from "../GlobalStateProvider";
import { FaTimesCircle } from "react-icons/fa";

export const FailedOverlay = () => {
  const { overlayStates, toggleOverlay, closeAllOverlays } = useGlobalState();

  if (!overlayStates.failed) return null;

  return (
    <div className="overlay-background failed-overlay-background">
      <div className="feedback-overlay animated-failed">
        <FaTimesCircle className="feedback-icon failed-icon animated-shake" />
        <h3 className="feedback-title">Failed</h3>
        <p className="feedback-message">
          Something went wrong. Please try again.
        </p>
        <button
          className="feedback-btn"
          onClick={() => toggleOverlay("failed")}
        >
          Retry
        </button>
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
