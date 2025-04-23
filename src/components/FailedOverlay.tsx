"use client";
import { useGlobalState } from "../GlobalStateProvider";
import { FaTimesCircle } from "react-icons/fa";

export const FailedOverlay = () => {
  const { overlayStates, toggleOverlay, closeAllOverlays } = useGlobalState();

  if (!overlayStates.failed) return null;

  return (
    <div className="overlay-background">
      <div className="feedback-overlay">
        <FaTimesCircle className="feedback-icon failed-icon" />
        <h3>Failed</h3>
        <button onClick={() => toggleOverlay("failed")}>Retry</button>
        <button onClick={() => closeAllOverlays()}>Home</button>
      </div>
    </div>
  );
};
