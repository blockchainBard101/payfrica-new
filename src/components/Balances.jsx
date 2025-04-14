'use client';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaEllipsisV, FaPlus } from 'react-icons/fa';

const balanceData = [
    {
        title: 'Funding Balance',
        amount: '₦45,567.87',
        actionText: 'Fund Wallet',
        actionIcon: <FaPlus />,
        tokens: null
    },
    {
        title: 'Unified Balance',
        amount: '₦45,567.87',
        actionText: 'Tokens: Sui, USDC',
        actionIcon: null,
        tokens: 'Sui, USDC'
    },
    {
        title: 'Savings Balance',
        amount: '₦45,567.87',
        actionText: 'View more',
        actionIcon: null,
        tokens: null
    },
    {
        title: 'Card Balance',
        amount: '₦45,567.87',
        actionText: 'Details',
        actionIcon: null,
        tokens: null
    },
];

const BalanceCards = () => {
    const [showTotalBalance, setShowTotalBalance] = useState(true);
    const [visibleCards, setVisibleCards] = useState(
        balanceData.map(() => true)
    );

    const toggleTotalBalance = () => setShowTotalBalance(!showTotalBalance);

    const toggleCardBalance = (index) => {
        const updatedVisibility = [...visibleCards];
        updatedVisibility[index] = !updatedVisibility[index];
        setVisibleCards(updatedVisibility);
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>{card.title}</span>
                                    <span onClick={() => toggleCardBalance(index)}>
                                        {visibleCards[index] ? <FaEye style={{ cursor: 'pointer' }} /> : <FaEyeSlash style={{ cursor: 'pointer' }} />}
                                    </span>
                                </div>
                                {/* <div> */}
                                {/* <span onClick={() => toggleCardBalance(index)}>
                                    {visibleCards[index] ? <FaEye /> : <FaEyeSlash />}
                                </span> */}
                                {/* </div> */}
                                <FaEllipsisV className="icon" />
                            </div>

                            <div className="card-amount">
                                <h2>{visibleCards[index] ? card.amount : '******'}</h2>
                            </div>

                            <div className="card-footer">
                                {card.actionIcon && <span className="action-icon">{card.actionIcon}</span>}
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
