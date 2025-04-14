'use client'
import React, { useState } from 'react';
import { FaSearch, FaEllipsisV, FaCalendarAlt } from 'react-icons/fa';

const transactionData = [
    { name: "George Junior", type: "Money transfer", date: "April 12, 2023", time: "03:05pm", amount: "$50", fee: "$0.65", status: "Completed" },
    { name: "Obami Wisdom", type: "Receive", date: "June 09, 2023", time: "01:43pm", amount: "$250", fee: "$2.50", status: "Failed" },
    { name: "Michael Obe", type: "Money Transfer", date: "July 13, 2023", time: "11:10am", amount: "$1,200", fee: "$15.50", status: "Completed" },
    { name: "Ochai Benedict", type: "Money Transfer", date: "March 02, 2023", time: "10:21pm", amount: "$100", fee: "$1.85", status: "Pending" },
    { name: "Thompson Ogoyi", type: "Receive", date: "March 02, 2023", time: "10:21pm", amount: "$350", fee: "$3.00", status: "Completed" },
];

// const transactionData = []

const TransactionHistory = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTransactions = transactionData.filter(txn =>
        txn.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="transaction-history-container">
            <div className="transaction-header">
                <h2>Recent Transactions</h2>
                <div className="transaction-controls">
                    <div className="search-bar">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search transactions"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="date-range">
                        <FaCalendarAlt />
                        <input type="text" placeholder="01 Jan - 03 Mar" />
                    </div>
                </div>
            </div>

            {filteredTransactions.length > 0 ? (
                <div className="transaction-table-wrapper">
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Transaction</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Fee</th>
                                <th style={{ textAlign: "center" }}>Status</th>
                                <th style={{ textAlign: "center" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((txn, index) => (
                                <tr key={index}>
                                    <td>{txn.name}</td>
                                    <td>{txn.type}</td>
                                    <td>{txn.date} {txn.time}</td>
                                    <td>{txn.amount}</td>
                                    <td>{txn.fee}</td>
                                    <td style={{ textAlign: "center" }} className={`status ${txn.status.toLowerCase()}`}>
                                        <button>{txn.status}</button></td>
                                    <td style={{ cursor: "pointer", textAlign: "center" }}><FaEllipsisV /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="no-transactions">
                    <p>Ready for your first transaction? Your history will appear here once you begin to use Payfrica</p>
                    <button className="get-started-button">Get Started</button>
                    <div className="dashed-line"></div>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;
