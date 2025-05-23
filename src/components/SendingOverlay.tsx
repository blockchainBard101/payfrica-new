"use client";
import React, { useEffect } from "react";
import { useGlobalState } from "../GlobalStateProvider";
import Loading from "@/components/Loading";

export const SendingOverlay = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();

  useEffect(() => {
    if (overlayStates.sending) {
      setTimeout(() => {
        toggleOverlay("sending");
        toggleOverlay("success"); // Automatically trigger success after animation
      }, 500); // Animation duration
    }
  }, [overlayStates.sending, toggleOverlay]);

  if (!overlayStates.sending) return null;

  return (
    <div className="overlay-background">
      <div className="sending-overlay">
        <Loading />
        <h3>Sending...</h3>
        <p>View transaction</p>
      </div>
    </div>
  );
};
