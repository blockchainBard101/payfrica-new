"use client";
import { Navigation } from "@/components/Navigations";
import React, { useState, useMemo } from "react";
import { FaCoins } from "react-icons/fa";

const userSuppliedPools = [
  { symbol: "SUI", wallet: 4.48, APR: 5.06, mc: 800, status: "online" },
  { symbol: "NGNC", wallet: 1200, APR: 4.77, mc: 500, status: "online" },
];

const availablePools = [
  { symbol: "USDC", wallet: 0, APR: 3.21, mc: 650, status: "offline" },
  { symbol: "GHNC", wallet: 0, APR: 6.12, mc: 320, status: "online" },
];

const PoolsPage = () => {
  // Combine both lists for selection logic
  const allPools = useMemo(() => [...userSuppliedPools, ...availablePools], []);
  const [activePool, setActivePool] = useState(allPools[0]);
  const [mode, setMode] = useState("Supply"); // or 'Withdraw'
  const [amount, setAmount] = useState("");

  const percentPresets = ["10%", "20%", "50%", "100%"];

  const applyPreset = (pct) => {
    const val = (((activePool.wallet || 0) * parseInt(pct, 10)) / 100).toFixed(
      2
    );
    setAmount(val);
  };

  const confirmTransaction = () => {
    alert(`${mode} ${amount} ${activePool.symbol}`);
  };

  const renderTable = (title, pools, showStatus) => (
    <div className="pools-list-section">
      <h3>
        {title}{" "}
        {showStatus && (
          <span className={`status-dot ${activePool.status}`}></span>
        )}
      </h3>
      <table className="pools-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Wallet Balance</th>
            <th>APR</th>
            <th>Total MC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool) => (
            <tr
              key={pool.symbol}
              className={pool.symbol === activePool.symbol ? "active" : ""}
              onClick={() => setActivePool(pool)}
            >
              <td>
                <FaCoins className="token-icon" /> {pool.symbol}
              </td>
              <td>{pool.wallet.toLocaleString()}</td>
              <td>{pool.APR.toFixed(2)}%</td>
              <td>${pool.mc.toLocaleString()}M</td>
              <td className="actions-cell">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePool(pool);
                    setMode("Supply");
                  }}
                >
                  Supply
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePool(pool);
                    setMode("Withdraw");
                  }}
                >
                  Withdraw
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <Navigation />
      <div className="pools-page">
        {/* LEFT: Pools Lists */}
        <div className="pools-list-wrapper">
          {renderTable("Your Total Supply", userSuppliedPools, true)}
          {renderTable("Available for Supply", availablePools, false)}
        </div>

        {/* RIGHT: Supply/Withdraw Panel */}
        <div className="supply-panel">
          <h4>
            {mode} {activePool.symbol}
          </h4>

          <div className="tab-buttons">
            <button
              className={mode === "Supply" ? "active" : ""}
              onClick={() => setMode("Supply")}
            >
              Supply
            </button>
            <button
              className={mode === "Withdraw" ? "active" : ""}
              onClick={() => setMode("Withdraw")}
            >
              Withdraw
            </button>
          </div>

          <div className="amount-input">
            <label>
              Amount
              <div className="input-with-currency">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="currency">{activePool.symbol}</span>
              </div>
            </label>
          </div>

          <div className="presets">
            {percentPresets.map((p) => (
              <button key={p} onClick={() => applyPreset(p)}>
                {p}
              </button>
            ))}
          </div>

          <div className="details-box">
            <div>
              <span>APR</span>
              <strong>{activePool.APR.toFixed(2)}%</strong>
            </div>
            <div>
              <span>Fee</span>
              <strong>$0.00</strong>
            </div>
            <div>
              <span>Total MC</span>
              <strong>${activePool.mc.toLocaleString()}M</strong>
            </div>
          </div>

          <button className="confirm-btn" onClick={confirmTransaction}>
            Confirm Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoolsPage;
