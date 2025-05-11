"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FaEye, FaEyeSlash, FaEllipsisV, FaPlus } from "react-icons/fa";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useRealTimeBalances } from "@/hooks/useRealTimeBalance";

export const BalanceCards = () => {
  const { address } = useCustomWallet();
  const { fundingBalance, portfolioBalance } = useRealTimeBalances(address);

  // 1. Compute real total balance:
  const totalBalance = useMemo(() => {
    // strip out any non‐numeric, then parse
    const fundNum = parseFloat(
      (fundingBalance || "0").replace(/[^0-9.-]+/g, "")
    );
    const portNum = parseFloat(
      (portfolioBalance || "0").replace(/[^0-9.-]+/g, "")
    );
    return (fundNum + portNum).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  }, [fundingBalance, portfolioBalance]);

  // 2. Set up your cards with proper defaults (use ₦-- for both):
  const initialBalanceData = [
    {
      title: "Base Currency",
      amount: fundingBalance || "--",
      actionText: "Fund Wallet",
      actionIcon: <FaPlus />,
      tokens: null,
    },
    {
      title: "All Balances",
      amount: portfolioBalance || "--",
      actionText: "Tokens: Sui, USDC",
      actionIcon: null,
      tokens: "Sui, USDC",
    },
    {
      title: "Savings Balance",
      amount: "--",
      actionText: "View more",
      actionIcon: null,
      tokens: null,
    },
    {
      title: "Card Balance",
      amount: "--",
      actionText: "Details",
      actionIcon: null,
      tokens: null,
    },
  ];

  const [balanceData, setBalanceData] = useState(initialBalanceData);
  const [visibleCards, setVisibleCards] = useState(
    initialBalanceData.map(() => true)
  );

  // 3. Update both fundingBalance (index 0) AND portfolioBalance (index 1)
  useEffect(() => {
    setBalanceData((prev) => {
      const updated = prev.map((card, idx) => {
        if (idx === 0) {
          return { ...card, amount: fundingBalance || "₦--" };
        }
        if (idx === 1) {
          return { ...card, amount: portfolioBalance || "₦--" };
        }
        return card;
      });
      return updated;
    });
  }, [fundingBalance, portfolioBalance]);

  const toggleCardBalance = (idx) =>
    setVisibleCards((vis) => vis.map((v, i) => (i === idx ? !v : v)));

  return (
    <div className="balances-container">
      <div className="balance-container">
        <div className="balance-header">
          <h1>Welcome to Payfrica</h1>
          <div className="total-balance">
          </div>
        </div>

        <div className="cards-wrapper">
          {balanceData.map((card, index) => (
            <div key={index} className="balance-card">
              <div className="balance-card-header">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span>{card.title}</span>
                  <span onClick={() => toggleCardBalance(index)}>
                    {visibleCards[index] ? (
                      <FaEye style={{ cursor: "pointer" }} />
                    ) : (
                      <FaEyeSlash style={{ cursor: "pointer" }} />
                    )}
                  </span>
                </div>
                <FaEllipsisV className="icon" />
              </div>

              <div className="card-amount">
                <h2>{visibleCards[index] ? card.amount : "******"}</h2>
              </div>

              <div className="card-footer">
                {card.actionIcon && (
                  <span className="action-icon">{card.actionIcon}</span>
                )}
                <span>{card.actionText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
