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
    // Card Overlays
    manageCards: false,
    cardDetails: false,
    confirmCardCreate: false,
    cardTypeSelect: false,
    addFunds: false,
    scanQR: false,
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

  const [cards, setCards] = useState([
    {
      name: "Flexing Card",
      address: "0x1234abcd5678efgh",
      amount: 45567.87,
      expense: 12000.5,
      pin: "1234",
      deadline: "2024-12-31",
      transactions: [
        {
          receiver: "Tesco Market",
          type: "Shopping",
          date: "13 Dec 2020",
          amount: "NGN 2000",
        },
        {
          receiver: "ElectroMen Market",
          type: "Shopping",
          date: "14 Dec 2020",
          amount: "NGN 1000",
        },
        {
          receiver: "Fiorgio Restaurant",
          type: "Food",
          date: "07 Dec 2020",
          amount: "NGN 5000",
        },
        {
          receiver: "John Mathew Kayne",
          type: "Sport",
          date: "06 Dec 2020",
          amount: "NGN 2000",
        },
        {
          receiver: "Ann Marlin",
          type: "Shopping",
          date: "31 Nov 2020",
          amount: "20 USDC",
        },
      ],
      status: true,
    },
    {
      name: "Gift Card",
      address: "0x5678ijkl9012mnop",
      amount: 45567.87,
      expense: 2000,
      pin: "5678",
      deadline: "2025-01-15",
      transactions: [],
      status: true,
    },
    {
      name: "Family Card",
      address: "0x9abcqrst3456uvwx",
      amount: 45567.87,
      expense: 500,
      pin: "4321",
      deadline: "2024-10-10",
      transactions: [],
      status: true,
    },
  ]);
  const [numberOfCardsCreated, setNumberOfCardsCreated] = useState(
    cards.length
  );

  const [cardType, setCardType] = useState("temporary");

  const [cardDetails, setCardDetails] = useState({
    name: "",
    amount: "",
    pin: "",
    verifyPin: "",
    deadline: "",
  });

  const [addFundsCardIdx, setAddFundsCardIdx] = useState(null);

  // Main/base currency balance and transaction history
  const [mainBalance, setMainBalance] = useState(100000); // Example starting balance
  const [mainTransactions, setMainTransactions] = useState([
    {
      receiver: "Initial Deposit",
      type: "Credit",
      date: "01 Jan 2024",
      amount: "NGN 100000",
    },
  ]);

  function formatCurrency(amount, currency = "NGN") {
    return Number(amount).toLocaleString("en-NG", {
      // style: "currency",
      currency,
      minimumFractionDigits: 2,
    });
  }

  function formatWithCommas(amount) {
    return Number(amount).toLocaleString();
  }

  // TODO: Change to the actual user's currency
  const currency = "NGNC";

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
        numberOfCardsCreated,
        setNumberOfCardsCreated,
        setCardType,
        cardType,
        cardDetails,
        setCardDetails,
        currency,
        cards,
        setCards,
        formatCurrency,
        formatWithCommas,
        addFundsCardIdx,
        setAddFundsCardIdx,
        // Add these to context
        mainBalance,
        setMainBalance,
        mainTransactions,
        setMainTransactions,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
