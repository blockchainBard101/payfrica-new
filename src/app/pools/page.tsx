"use client";
import { Navigation } from "@/components/Navigations";
import React, { useState, useMemo, useEffect } from "react";
import { FaCoins } from "react-icons/fa";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useTokenExchange } from "@/hooks/useTokenExchange";

function formatNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'b'; // Billions
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'm'; // Millions
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'k';
  }
  return num as unknown as string;
}

const userSuppliedPools = [
  { coinName: "SUI", amountSupplied: 100, balance: 4.48, coinBalance: 800 },
  { coinName: "NGNC", ammountSupplied: 100, balance: 1200, coinBalance: 500 },
];

const availablePools = [
  { symbol: "USDC", wallet: 0,  mc: 650 },
  { symbol: "GHNC", wallet: 0, mc: 320 },
];

const PoolsPage = () => {
  // Combine both lists for selection logic
  const { address } = useCurrentAccount() || {};
  const [activePool, setActivePool] = useState<any>({});
  const [mode, setMode] = useState("Supply");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [pools, setPools] = useState([]);
  const { getAllPools } = useTokenExchange();

  useEffect(() => {
    const fetchPools = async () => {
      setLoading(true);
      setError("");
      try {
        const poolData = await getAllPools();
        console.log(poolData);
        setPools(poolData);
        setActivePool(poolData[0]); 
      } catch (err: any) {
        console.error("Failed fetching pools:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (address) fetchPools();
  }, [address, getAllPools]);

  console.log(loading, error, pools);

  if (loading) return <div>Loading pools…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  console.log(address)
  const percentPresets = ["10%", "20%", "50%", "100%"];

  const applyPreset = (pct) => {
    const val = (((activePool.wallet || 0) * parseInt(pct, 10)) / 100).toFixed(
      2
    );
    setAmount(val);
  };

  const confirmTransaction = () => {
    alert(`${mode} ${amount} ${activePool.coinName}`);
  };

 const renderTable = (title, pools) => {
  const isUserSupplied = title === "Pools Supplied";

  return (
    <div className="pools-list-section">
      <h3>{title}</h3>
      <table className="pools-table">
        <thead>
          <tr>
            <th>Token</th>
            {isUserSupplied && <th>Amount Supplied</th>}
            <th>Wallet Balance</th>
            <th>TVL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool) => (
            <tr
              key={pool.coinName || pool.symbol}
              className={
                pool.coinName === activePool?.coinName ||
                pool.symbol === activePool?.coinName
                  ? "active"
                  : ""
              }
              onClick={() => setActivePool(pool)}
            >
              <td>
                <FaCoins className="token-icon" /> {pool.coinName || pool.symbol}
              </td>
              {isUserSupplied && (
                <td>{formatNumber(pool.amountSupplied || 0)}</td>
              )}
              <td>{formatNumber(pool.balance || pool.wallet)}</td>
              <td>{formatNumber(pool.coinBalance || pool.mc)}</td>
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
                {isUserSupplied && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePool(pool);
                      setMode("Withdraw");
                    }}
                  >
                    Withdraw
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


  return (
    <div>
      <Navigation />
      <div className="pools-page">

        <div className="pools-list-wrapper">
          {renderTable("Pools Supplied", userSuppliedPools)}
          {renderTable("Available for Supply", pools)}
        </div>

        <div className="supply-panel">
  <h4>
    {mode} {activePool?.coinName || activePool?.symbol}
  </h4>

  <div className="tab-buttons">
    <button
      className={mode === "Supply" ? "active" : ""}
      onClick={() => setMode("Supply")}
    >
      Supply
    </button>

    {/* Show Withdraw only if activePool is in userSuppliedPools */}
    {userSuppliedPools.some(p => p.coinName === activePool?.coinName) && (
      <button
        className={mode === "Withdraw" ? "active" : ""}
        onClick={() => setMode("Withdraw")}
      >
        Withdraw
      </button>
    )}
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
        <span className="currency">{activePool?.coinName || activePool?.symbol}</span>
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

  {/* Show Amount Supplied if the pool is user-supplied */}
  {userSuppliedPools.some(p => p.coinName === activePool?.coinName) && (
    <div className="details-box">
      <div>
        <span>Amount Supplied</span>
        <strong>
          {
            formatNumber(
              userSuppliedPools.find(p => p.coinName === activePool?.coinName)?.amountSupplied || 0
            )
          }
        </strong>
      </div>
    </div>
  )}

  <div className="details-box">
    <div>
      <span>Fee</span>
      <strong>$0.00</strong>
    </div>
    <div>
      <span>TVL</span>
      <strong>{formatNumber(activePool?.coinBalance || activePool?.mc)}</strong>
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