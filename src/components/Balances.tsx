// components/BalanceCards.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRealTimeBalances } from "@/hooks/useRealTimeBalance";
import { useCurrentAccount } from "@mysten/dapp-kit";
import BalanceCard from "./BalanceCard";

// Dynamically load only the icons we need
const FaEye       = dynamic(() => import("react-icons/fa").then(m => m.FaEye),       { ssr: false });
const FaEyeSlash  = dynamic(() => import("react-icons/fa").then(m => m.FaEyeSlash),  { ssr: false });
const FaEllipsisV = dynamic(() => import("react-icons/fa").then(m => m.FaEllipsisV), { ssr: false });
const FaPlus      = dynamic(() => import("react-icons/fa").then(m => m.FaPlus),      { ssr: false });

const CARD_CONFIG = [
  { title: "Base Currency",   defaultAmt: "--", actionText: "Fund Wallet",      ActionIcon: FaPlus },
  { title: "All Balances",    defaultAmt: "--", actionText: "Tokens: Sui, USDC", ActionIcon: null   },
  { title: "Savings Balance", defaultAmt: "--", actionText: "View more",         ActionIcon: null   },
  { title: "Card Balance",    defaultAmt: "--", actionText: "Details",           ActionIcon: null   },
];

export default React.memo(function BalanceCards() {
  const { address } = useCurrentAccount();
  const { fundingBalance, portfolioBalance } = useRealTimeBalances(address);
  const [visible, setVisible] = useState<boolean[]>(() => CARD_CONFIG.map(() => true));

  // Build each card’s data, including a per-card loading flag
  const cards = useMemo(() => {
    return CARD_CONFIG.map((cfg, i) => {
      const isBalCard = i === 0 || i === 1;
      const loading    = isBalCard
        ? (i === 0 ? fundingBalance === undefined : portfolioBalance === undefined)
        : false;
      const amountRaw  = isBalCard
        ? (i === 0 ? fundingBalance : portfolioBalance)
        : cfg.defaultAmt;

      return {
        title:        cfg.title,
        amount:       amountRaw ?? cfg.defaultAmt,
        loading,
        visible:      visible[i],
        actionText:   cfg.actionText,
        ActionIcon:   cfg.ActionIcon,
        ToggleIcon:   visible[i] ? FaEye : FaEyeSlash,
        EllipsisIcon: FaEllipsisV,
      };
    });
  }, [fundingBalance, portfolioBalance, visible]);

  const toggle = useCallback((idx: number) => {
    setVisible(v => {
      const copy = [...v];
      copy[idx] = !copy[idx];
      return copy;
    });
  }, []);

  return (
    <div className="balances-container">
      <div className="balance-container">
        <div className="balance-header">
          <h1>Welcome to Payfrica</h1>
          <div className="total-balance"></div>
        </div>
        <div className="cards-wrapper">
          {cards.map((c, idx) => (
            <BalanceCard
              key={idx}
              title={c.title}
              amount={c.amount}
              loading={c.loading}
              visible={c.visible}
              actionText={c.actionText}
              ActionIcon={c.ActionIcon}
              ToggleIcon={c.ToggleIcon}
              EllipsisIcon={c.EllipsisIcon}
              onToggle={() => toggle(idx)}
              onMore={() => {/* open menu */}}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
