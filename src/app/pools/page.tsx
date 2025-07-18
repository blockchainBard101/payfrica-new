"use client";
import { Navigation } from "@/components/Navigations";
import React, { useState, useEffect, useCallback } from "react";
import { FaCoins } from "react-icons/fa";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useTokenExchange } from "@/hooks/useTokenExchange";
import { getUserSuppliedPools } from "@/hooks/suiRpc";
import LogoLoader from "@/components/LogoLoader";
import { AuthGuard } from "@/components/auth-guard";

function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "b";
  else if (num >= 1e6) return (num / 1e6).toFixed(1) + "m";
  else if (num >= 1e3) return (num / 1e3).toFixed(1) + "k";
  return num?.toString();
}

const PoolsPage = () => {
  const account = useCurrentAccount();
  const address = account?.address;

  const [activePool, setActivePool] = useState<any>({});
  const [mode, setMode] = useState("Supply");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [pools, setPools] = useState<any[]>([]);
  const [userSuppliedPools, setUserSuppliedPools] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  const { getAllPools, handleAddtoLiquidity, handleRemoveLiquidity } =
    useTokenExchange();
  const memoizedGetAllPools = useCallback(getAllPools, [getAllPools]);

  useEffect(() => {
    const fetchPools = async () => {
      setLoading(true);
      setError("");
      try {
        const poolData = await memoizedGetAllPools();
        const userPoolsData = await getUserSuppliedPools(address);

        // Create map of user pool IDs for quick lookup
        const userPoolMap = new Map<string, any>();
        userPoolsData.forEach((entry: any) =>
          userPoolMap.set(entry.pool_id, entry.amount_added)
        );

        const userPools: any[] = [];
        const availablePools: any[] = [];

        for (const pool of poolData) {
          if (userPoolMap.has(pool.id)) {
            userPools.push({
              ...pool,
              amountSupplied: Number(userPoolMap.get(pool.id)),
            });
          } else {
            availablePools.push(pool);
          }
        }

        setUserSuppliedPools(userPools);
        setPools(availablePools);
        setActivePool((userPools[0] || availablePools[0]) ?? {});
      } catch (err: any) {
        console.error("Failed fetching pools:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (address) fetchPools();
  }, [address, memoizedGetAllPools]);

  const percentPresets = ["10%", "20%", "50%", "100%"];

  const applyPreset = (pct) => {
    const balance = Number(activePool?.balance || 0);
    const val = ((balance * parseInt(pct, 10)) / 100).toFixed(2);
    setAmount(val);
  };

  const confirmTransaction = async () => {
    setSending(true);
    setSuccess(false);
    setFailed(false);
    try {
      if (mode === "Supply") {
        console.log(activePool.coinType, Number(amount));
        await handleAddtoLiquidity(activePool.coinType, Number(amount));
      }
      if (mode === "Withdraw") {
        await handleRemoveLiquidity(activePool.coinType, Number(amount));
      }
      setSending(false);
      setSuccess(true);
    } catch (err) {
      setSending(false);
      setFailed(true);
    }
  };

  const canWithdraw = userSuppliedPools.some(
    (p) => p.coinName === activePool?.coinName && p.amountSupplied > 0
  );

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
                key={pool.id}
                className={
                  pool.coinName === activePool?.coinName ||
                  pool.symbol === activePool?.coinName
                    ? "active"
                    : ""
                }
                onClick={() => setActivePool(pool)}
              >
                <td>
                  <FaCoins className="token-icon" />{" "}
                  {pool.coinName || pool.symbol}
                </td>
                {isUserSupplied && (
                  <td>{formatNumber(pool.amountSupplied || 0)}</td>
                )}
                <td>{formatNumber(pool.balance)}</td>
                <td>{formatNumber(pool.coinBalance)}</td>
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

  if (loading) return <LogoLoader />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <AuthGuard>
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
            {canWithdraw && (
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
              Token
              <select
                value={activePool?.id || ""}
                onChange={(e) => {
                  const selected = [...userSuppliedPools, ...pools].find(
                    (pool) => pool.id === e.target.value
                  );
                  if (selected) setActivePool(selected);
                }}
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "4px",
                }}
              >
                {[...userSuppliedPools, ...pools].map((pool) => (
                  <option key={pool.id} value={pool.id}>
                    {pool.coinName || pool.symbol}
                  </option>
                ))}
              </select>
              Amount
              <div className="input-with-currency">
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  style={{ appearance: "none", MozAppearance: "textfield" }}
                />
                <span className="currency">
                  {activePool?.coinName || activePool?.symbol}
                </span>
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

          {userSuppliedPools.some(
            (p) => p.coinName === activePool?.coinName
          ) && (
            <div className="details-box">
              <div>
                <span>Amount Supplied</span>
                <strong>
                  {formatNumber(
                    userSuppliedPools.find(
                      (p) => p.coinName === activePool?.coinName
                    )?.amountSupplied || 0
                  )}
                </strong>
              </div>
            </div>
          )}

          <div className="details-box">
            <div>
              <span>Fee</span>
              <strong>0.00</strong>
            </div>
            <div>
              <span>Balance</span>
              <strong>{formatNumber(activePool?.balance)}</strong>
            </div>
            <div>
              <span>TVL</span>
              <strong>{formatNumber(activePool?.coinBalance)}</strong>
            </div>
          </div>

          <button className="confirm-btn" onClick={confirmTransaction}>
            Confirm Transaction
          </button>
        </div>

        {sending && (
          <div className="overlay-background">
            <div className="sending-overlay">
              <LogoLoader />
              <h3>Processing transaction…</h3>
            </div>
          </div>
        )}
        {success && (
          <div className="overlay-background">
            <div className="feedback-overlay">
              <div className="feedback-icon success-icon">✔️</div>
              <div className="feedback-title">Success!</div>
              <div className="feedback-message">
                Your transaction was successful.
              </div>
              <button
                className="feedback-btn"
                onClick={() => setSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {failed && (
          <div className="overlay-background">
            <div className="feedback-overlay">
              <div className="feedback-icon failed-icon">❌</div>
              <div className="feedback-title">Failed</div>
              <div className="feedback-message">
                Transaction failed. Please try again.
              </div>
              <button className="feedback-btn" onClick={() => setFailed(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default PoolsPage;
