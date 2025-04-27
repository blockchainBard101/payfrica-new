"use client";
import React, { createContext, useState, useContext } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [overlayStates, setOverlayStates] = useState({
    sendMoney: false,
    receiveMoney: false,
    sendSuiToken: false,
    deposit: false,
    withdraw: false,
    convert: false,
    manageCards: false,
    payfricaPadi: false,
    payfricaPadiSui: false,
    enterAmount: false,
    enterSuiAmount: false,
    sendSuiToWA: false,
    sending: false,
    success: false,
    failed: false,
    // Receive Money Overlays
    receiveMoney: false,
    receiveCard: false,
    // Convert Tokens Overlays
    confirmConvert: false,
    convert: false,
    //This is only for testing.
    default: false,
    // Deposit Overlays
    quickTransfer: false,
    confirmDeposit: false,
    makeDeposit: false,
    // Withdraw Overlays
    EnterWithdrawAmount: false,
    confirmWithdraw: false,
    withdrawing: false,
  });

  // SINGLE SOURCE OF TRUTH for deposit
  const [depositData, setDepositData] = useState({
    amount: "", // e.g. "30000"
    method: "", // e.g. "Quick Transfer"
    agentId: undefined,
  });

  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    method: "",
    agentId: undefined,
  });

  const toggleOverlay = (name) => {
    setOverlayStates((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const closeAllOverlays = () => {
    const all = Object.keys(overlayStates).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setOverlayStates(all);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        overlayStates,
        toggleOverlay,
        closeAllOverlays,
        depositData,
        setDepositData,
        withdrawData,
        setWithdrawData,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
