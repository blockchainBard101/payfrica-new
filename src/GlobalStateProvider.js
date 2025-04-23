"use client";
import { createContext, useState, useEffect, useContext } from "react";

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
  });

  const toggleOverlay = (overlayName = "sendMoney") => {
    console.log({ overlayName });
    setOverlayStates((prevState) => ({
      ...prevState,
      [overlayName]: !prevState?.[overlayName],
    }));
  };

  const closeAllOverlays = () => {
    const allOverlays = Object.keys(overlayStates).reduce((acc, key) => {
      console.log({ key });
      acc[key] = false;
      return acc;
    }, {});
    setOverlayStates(allOverlays);
  };

  const [convertData, setConvertData] = useState({
    fromToken: "",
    toToken: "",
  });

  return (
    <GlobalStateContext.Provider
      value={{
        overlayStates,
        toggleOverlay,
        closeAllOverlays,
        convertData,
        setConvertData,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
