'use client';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaEllipsisV, FaPlus } from 'react-icons/fa';
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useRealTimeBalances } from '@/hooks/useRealTimeBalances';

const BalanceCards = () => {
  const { address } = useCustomWallet();
  const {
    fundingBalance,
    // unifiedBalance,
    // savingsBalance,
    // cardBalance,
    // tokenBalances,
  } = useRealTimeBalances(address);

  // Example initial values for your card data
  const initialBalanceData = [
    {
      title: 'Base Currency',
      amount: fundingBalance || '₦--',
      actionText: 'Fund Wallet',
      actionIcon: <FaPlus />,
      tokens: null,
    },
    {
      title: 'All Balances',
      amount: '₦45,567.87', // This might be updated similarly
      actionText: 'Tokens: Sui, USDC',
      actionIcon: null,
      tokens: 'Sui, USDC',
    },
    {
      title: 'Savings Balance',
      amount: '₦45,567.87',
      actionText: 'View more',
      actionIcon: null,
      tokens: null,
    },
    {
      title: 'Card Balance',
      amount: '₦45,567.87',
      actionText: 'Details',
      actionIcon: null,
      tokens: null,
    },
  ];

  const [balanceData, setBalanceData] = useState(initialBalanceData);
  const [showTotalBalance, setShowTotalBalance] = useState(true);
  const [visibleCards, setVisibleCards] = useState(
    initialBalanceData.map(() => true)
  );

  // Update balanceData for the Funding Balance whenever fundingBalance changes
  React.useEffect(() => {
    setBalanceData((prevData) => {
      const updated = [...prevData];
      updated[0] = { ...updated[0], amount: fundingBalance || '₦--' };
      return updated;
    });
  }, [fundingBalance]);

  const toggleTotalBalance = () => setShowTotalBalance((prev) => !prev);

  const toggleCardBalance = (index) => {
    setVisibleCards((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className="balances-container">
      <div className="balance-container">
        <div className="balance-header">
          <h1>Welcome to Payfrica</h1>
          <div className="total-balance">
            <span>Total Balance:</span>
            {showTotalBalance ? '1,000,000,000' : '******'}
            <span onClick={toggleTotalBalance} className="eye-icon">
              {showTotalBalance ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        <div className="cards-wrapper">
          {balanceData.map((card, index) => (
            <div key={index} className="balance-card">
              <div className="balance-card-header">
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <span>{card.title}</span>
                  <span onClick={() => toggleCardBalance(index)}>
                    {visibleCards[index] ? (
                      <FaEye style={{ cursor: 'pointer' }} />
                    ) : (
                      <FaEyeSlash style={{ cursor: 'pointer' }} />
                    )}
                  </span>
                </div>
                <FaEllipsisV className="icon" />
              </div>

              <div className="card-amount">
                <h2>{visibleCards[index] ? card.amount : '******'}</h2>
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

export default BalanceCards;
