'use client'
import React from 'react';
import { FaRegMoneyBillAlt, FaCreditCard, FaMoneyCheckAlt } from 'react-icons/fa';
import { BsSendFill } from "react-icons/bs";
import { MdOutlineCallReceived } from "react-icons/md";
import { SiConvertio } from "react-icons/si";
import { useGlobalState } from '../GlobalStateProvider';

const quickActions = [
    { name: "Send Money", icon: <BsSendFill />, command: 'sendMoney' },
    { name: "Receive Money", icon: <MdOutlineCallReceived />, command: 'receiveMoney' },
    { name: "Deposit", icon: <FaMoneyCheckAlt />, command: 'deposit' },
    { name: "Withdraw", icon: <FaRegMoneyBillAlt />, command: 'withdraw' },
    { name: "Convert", icon: <SiConvertio />, command: 'convert' },
    { name: "Manage Cards", icon: <FaCreditCard />, command: 'manageCards' },
];

const QuickActions = () => {
    const { toggleOverlay } = useGlobalState();

    return (
        <div className="quick-actions-container">
            <h2>Quick Actions</h2>
            <div className="quick-actions-wrapper">
                {quickActions.map((action, index) => (
                    <div key={index} className="quick-action-card" onClick={() => toggleOverlay(action.command)}>
                        <div className="quick-action-icon">{action.icon}</div>
                        <p className='quick-action-name'>{action.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;