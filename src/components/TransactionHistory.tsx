"use client";
import React, { useEffect, useState } from "react";
import { FaSearch, FaEllipsisV, FaCalendarAlt } from "react-icons/fa";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { LuCircleArrowOutUpRight } from "react-icons/lu";

interface Transaction {
  id: string;
  transactionId: string;
  type: string;
  interactedWith?: string;
  date: string;
  status: string;
  fees: number;
  outgoingAsset?: string;
  outgoingAmount?: number;
  incomingAsset?: string;
  incomingAmount?: number;
  // ...any other fields your API returns
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

export const TransactionHistory = () => {
  const { address } = useCurrentAccount() || {};
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    if (!address) return;

    let intervalId: NodeJS.Timeout;

    const fetchTransactions = () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      fetch(`${baseUrl}/users/${address}/transactions`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const payload = await res.json();
          setTransactions(payload.transactions);
        })
        .catch((err) => {
          console.error("Failed fetching transactions:", err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    };

    fetchTransactions(); // Fetch immediately on mount
    intervalId = setInterval(fetchTransactions, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, [address]);

  // filter client-side
  const filtered = transactions.filter((txn) => {
    const matchesSearch = (txn.interactedWith || txn.transactionId || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const txnDate = new Date(txn.date);
    const afterStart = !startDate || txnDate >= new Date(startDate);
    const beforeEnd = !endDate || txnDate <= new Date(endDate + "T23:59:59");

    return matchesSearch && afterStart && beforeEnd;
  });
  // console.log(transactions);

  if (loading) return <div>Loading transactions…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

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
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <span style={{ margin: "0 4px" }}>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                {[
                  "Counterparty",
                  "Type",
                  "Date",
                  "Amount",
                  "Fee",
                  "View Txn",
                  "Status",
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      fontWeight: 600,
                      color: "#333",
                      textAlign: i >= 5 ? "center" : "left",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => {
                const isConvert = txn.type === "SWAP";
                const nonConvertValue =
                  txn.incomingAmount != null
                    ? {
                        text: `+${txn.incomingAmount.toLocaleString()} ${
                          txn.incomingAsset
                        }`,
                        color: "#027a48",
                      }
                    : txn.outgoingAmount != null
                    ? {
                        text: `-${txn.outgoingAmount.toLocaleString()} ${
                          txn.outgoingAsset
                        }`,
                        color: "#b91c1c",
                      }
                    : { text: "-", color: "#000" };

                let statusStyle: React.CSSProperties = {
                  border: "none",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 500,
                };
                if (txn.status === "SUCCESS" || txn.status === "Completed") {
                  statusStyle = {
                    ...statusStyle,
                    backgroundColor: "#e6ffed",
                    color: "#027a48",
                  };
                } else if (txn.status === "PENDING") {
                  statusStyle = {
                    ...statusStyle,
                    backgroundColor: "#fff7e6",
                    color: "#d97706",
                  };
                } else {
                  statusStyle = {
                    ...statusStyle,
                    backgroundColor: "#ffe3e3",
                    color: "#b91c1c",
                  };
                }

                return (
                  <tr key={txn.id}>
                    <td>{txn.interactedWith}</td>
                    <td>{txn.type}</td>
                    <td>{formatDate(txn.date)}</td>
                    <td>
                      {isConvert ? (
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            style={{ marginBottom: "4px", color: "#027a48" }}
                          >
                            +{txn.outgoingAmount?.toLocaleString()}{" "}
                            {txn.outgoingAsset}
                          </span>
                          <span style={{ color: "#b91c1c" }}>
                            -{txn.incomingAmount?.toLocaleString()}{" "}
                            {txn.incomingAsset}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: nonConvertValue.color }}>
                          {nonConvertValue.text}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>{txn.fees}</td>
                    <td style={{ textAlign: "center" }}>
                      <a
                        href={
                          txn.transactionId.startsWith("0x")
                            ? `https://testnet.suivision.xyz/object/${txn.transactionId}`
                            : `https://testnet.suivision.xyz/txblock/${txn.transactionId}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#1976d2",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                        }}
                        title="View on Sui Vision"
                      >
                        <LuCircleArrowOutUpRight />
                      </a>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button style={statusStyle}>{txn.status}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-transactions">
          <p>
            Ready for your first transaction? Your history will appear here once
            you begin to use Payfrica
          </p>
          <button className="get-started-button">Get Started</button>
          <div className="dashed-line" />
        </div>
      )}
    </div>
  );
};
