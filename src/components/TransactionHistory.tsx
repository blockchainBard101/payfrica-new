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

const dummyTransactions = [
    {
        id: '1',
        transactionId: 'TXN-001',
        type: 'SEND',
        interactedWith: 'George Junior',
        date: '2023-04-12T15:05:00Z',
        status: 'Completed',
        fees: 0.65,
        outgoingAsset: 'USD',
        outgoingAmount: 50,
        incomingAsset: null,
        incomingAmount: null,
        userId: 'user-1',
    },
    {
        id: '2',
        transactionId: 'TXN-002',
        type: 'RECEIVE',
        interactedWith: 'Obami Wisdom',
        date: '2023-06-09T13:43:00Z',
        status: 'Failed',
        fees: 2.5,
        outgoingAsset: null,
        outgoingAmount: null,
        incomingAsset: 'USD',
        incomingAmount: 250,
        userId: 'user-1',
    },
    {
        id: '3',
        transactionId: 'TXN-003',
        type: 'SEND',
        interactedWith: 'Michael Obe',
        date: '2023-07-13T11:10:00Z',
        status: 'Completed',
        fees: 15.5,
        outgoingAsset: 'USD',
        outgoingAmount: 1200,
        incomingAsset: null,
        incomingAmount: null,
        userId: 'user-2',
    },
    {
        id: '4',
        transactionId: 'TXN-004',
        type: 'SEND',
        interactedWith: 'Ochai Benedict',
        date: '2023-03-02T22:21:00Z',
        status: 'Pending',
        fees: 1.85,
        outgoingAsset: 'USD',
        outgoingAmount: 100,
        incomingAsset: null,
        incomingAmount: null,
        userId: 'user-3',
    },
    {
        id: '5',
        transactionId: 'TXN-005',
        type: 'RECEIVE',
        interactedWith: 'Thompson Ogoyi',
        date: '2023-03-02T22:21:00Z',
        status: 'Completed',
        fees: 3.0,
        outgoingAsset: null,
        outgoingAmount: null,
        incomingAsset: 'USD',
        incomingAmount: 350,
        userId: 'user-2',
    },
    {
        id: '6',
        transactionId: 'TXN-006',
        type: 'CONVERT',
        interactedWith: 'Swap USDC/NGNC',
        date: '2023-08-01T12:00:00Z',
        status: 'Completed',
        fees: 0.75,
        outgoingAsset: 'USDC',
        outgoingAmount: 100,
        incomingAsset: 'NGNC',
        incomingAmount: 10000,
        userId: 'user-4',
    },
]

const formatDate = iso =>
    new Date(iso).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    })

// const transactionData = []

const TransactionHistory = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTransactions = dummyTransactions.filter(txn =>
        (txn.interactedWith || txn.transactionId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )

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
                                {['Tx ID', 'Counterparty', 'Type', 'Date', 'Amount', 'Fee', 'Status', 'Action'].map((h, i) => (
                                    <th
                                        key={i}
                                        style={{
                                            fontWeight: 600,
                                            color: '#333',
                                            textAlign: i >= 5 ? 'center' : 'left'
                                        }}
                                    >{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(txn => {
                                const isConvert = txn.type === 'CONVERT'

                                // For non-convert: choose one amount
                                const nonConvertValue = txn.incomingAmount != null
                                    ? { text: `+${txn.incomingAmount.toLocaleString()} ${txn.incomingAsset}`, color: '#027a48' }
                                    : txn.outgoingAmount != null
                                        ? { text: `-${txn.outgoingAmount.toLocaleString()} ${txn.outgoingAsset}`, color: '#b91c1c' }
                                        : { text: '-', color: '#000' }

                                // Status button styling
                                let statusStyle: React.CSSProperties = {
                                    border: 'none',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 500
                                }
                                if (txn.status === 'Completed') {
                                    statusStyle = { ...statusStyle, backgroundColor: '#e6ffed', color: '#027a48' }
                                } else if (txn.status === 'Pending') {
                                    statusStyle = { ...statusStyle, backgroundColor: '#fff7e6', color: '#d97706' }
                                } else {
                                    statusStyle = { ...statusStyle, backgroundColor: '#ffe3e3', color: '#b91c1c' }
                                }

                                return (
                                    <tr key={txn.id}>
                                        <td>{txn.transactionId}</td>
                                        <td>{txn.interactedWith}</td>
                                        <td>{txn.type}</td>
                                        <td>{formatDate(txn.date)}</td>
                                        <td>
                                            {isConvert ? (
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ marginBottom: '4px', color: '#b91c1c' }}>
                                                        -{txn.outgoingAmount.toLocaleString()} {txn.outgoingAsset}
                                                    </span>
                                                    <span style={{ color: '#027a48' }}>
                                                        +{txn.incomingAmount.toLocaleString()} {txn.incomingAsset}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span style={{ color: nonConvertValue.color }}>
                                                    {nonConvertValue.text}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {txn.fees}
                                        </td>
                                        <td style={{ textAlign: 'center' }} className='status'>
                                            <button style={statusStyle}>{txn.status}</button>
                                        </td>
                                        <td style={{ textAlign: 'center', cursor: 'pointer' }}>
                                            <FaEllipsisV />
                                        </td>
                                    </tr>
                                )
                            })}
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