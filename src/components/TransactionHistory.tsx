"use client";
import React, { useEffect, useState } from "react";
import { FaSearch, FaEllipsisV, FaCalendarAlt } from "react-icons/fa";
import { useCurrentAccount } from "@mysten/dapp-kit";

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

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    setError("");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    fetch(`${baseUrl}/users/${address}/transactions`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        // your controller returns { user, transactions }
        setTransactions(payload.transactions);
      })
      .catch((err) => {
        console.error("Failed fetching transactions:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [address]);

  // filter client-side
  const filtered = transactions.filter((txn) =>
    (txn.interactedWith || txn.transactionId || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
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
            <input type="text" placeholder="01 Jan - 03 Mar" />
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                {[
                  "Tx ID",
                  "Counterparty",
                  "Type",
                  "Date",
                  "Amount",
                  "Fee",
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
                      text: `+${txn.incomingAmount.toLocaleString()} ${txn.incomingAsset
                        }`,
                      color: "#027a48",
                    }
                    : txn.outgoingAmount != null
                      ? {
                        text: `-${txn.outgoingAmount.toLocaleString()} ${txn.outgoingAsset
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
                    <td>
                      {txn.transactionId.startsWith("0x") ? (
                        <a
                          href={`https://testnet.suivision.xyz/object/${txn.transactionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'blue', textDecoration: 'underline' }}
                        >
                          {txn.transactionId.slice(0, 6)}...{txn.transactionId.slice(-4)}
                        </a>
                      ) : (
                        <a
                          href={`https://testnet.suivision.xyz/txblock/${txn.transactionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'blue', textDecoration: 'underline' }}
                        >
                          {txn.transactionId.slice(0, 6)}...{txn.transactionId.slice(-4)}
                        </a>
                      )}
                    </td>

                    <td>{txn.interactedWith}</td>
                    <td>{txn.type}</td>
                    <td>{formatDate(txn.date)}</td>
                    <td>
                      {isConvert ? (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span
                            style={{ marginBottom: "4px", color: "#b91c1c" }}
                          >
                            -{txn.outgoingAmount?.toLocaleString()}{" "}
                            {txn.outgoingAsset}
                          </span>
                          <span style={{ color: "#027a48" }}>
                            +{txn.incomingAmount?.toLocaleString()}{" "}
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
