// src/components/ConvertOverlay.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGlobalState } from "@/GlobalStateProvider";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BsArrowDownSquareFill } from "react-icons/bs";
import { useTokenExchange, usePools } from "@/hooks/useTokenExchange";
import Image from "next/image";

export function ConvertOverlay() {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const { handleConvert, getBalance } = useTokenExchange();
  const { pools, poolMap } = usePools();

  // Local UI state hooks (always run in same order)
  const [sellSymbol, setSellSymbol] = useState<string>(pools[0]?.coinType || "");
  const [buySymbol, setBuySymbol] = useState<string>(pools[1]?.coinType || "");
  const [sellAmount, setSellAmount] = useState<string>("");
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [sellBalance, setSellBalance] = useState<string>("0.00");
  const [buyBalance, setBuyBalance] = useState<string>("0.00");

  // Generate list of coin-type keys
  const symbols = useMemo(() => pools.map(p => p.coinType), [pools]);

  // Compute buy amount
  useEffect(() => {
    const amt = parseFloat(sellAmount);
    if (!sellAmount || isNaN(amt) || amt <= 0) {
      setBuyAmount("");
      return;
    }
    const a = poolMap.get(sellSymbol);
    const b = poolMap.get(buySymbol);
    if (a && b) {
      const rate = b.ratesDollar / a.ratesDollar;
      setBuyAmount((amt * rate).toFixed(2));
    }
  }, [sellAmount, sellSymbol, buySymbol, poolMap]);

  // Fetch balances
  useEffect(() => {
    if (!sellSymbol) return;
    getBalance(sellSymbol)
      .then(setSellBalance)
      .catch(() => setSellBalance("0.00"));
  }, [sellSymbol, getBalance]);

  useEffect(() => {
    if (!buySymbol) return;
    getBalance(buySymbol)
      .then(setBuyBalance)
      .catch(() => setBuyBalance("0.00"));
  }, [buySymbol, getBalance]);

  const handleSwitch = useCallback(() => {
    setSellSymbol(prev => buySymbol);
    setBuySymbol(prev => sellSymbol);
    setSellAmount(buyAmount);
    setBuyAmount(sellAmount);
  }, [sellAmount, buyAmount, sellSymbol, buySymbol]);

  const handleSellChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const sym = e.target.value;
    if (sym === buySymbol) handleSwitch();
    else setSellSymbol(sym);
  }, [buySymbol, handleSwitch]);

  const handleBuyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const sym = e.target.value;
    if (sym === sellSymbol) handleSwitch();
    else setBuySymbol(sym);
  }, [sellSymbol, handleSwitch]);

  const onConvert = useCallback(async () => {
    const amt = parseFloat(sellAmount);
    if (!sellAmount || isNaN(amt) || amt <= 0) return;
    try {
      await handleConvert(sellSymbol, buySymbol, amt);
    } catch (e) {
      console.error("Convert failed", e);
    } finally {
      toggleOverlay("convert");
    }
  }, [sellAmount, sellSymbol, buySymbol, handleConvert, toggleOverlay]);

  if (!overlayStates.convert) return null;

  return (
    <div className="overlay-background">
      <div className="convert-modal">
        <div className="modal-header">
          <h2>Convert Tokens</h2>
          <IoIosCloseCircleOutline
            className="close-btn"
            onClick={() => toggleOverlay("convert")}
          />
        </div>

        {/* Sell Card */}
        <div className="convert-card">
          <div className="convert-label">Sell</div>
          <div className="convert-row">
            <input
              type="number"
              placeholder="0"
              value={sellAmount}
              onChange={e => setSellAmount(e.target.value)}
            />
            <div className="dropdown">
              <Image
                src={`/icons/${poolMap.get(sellSymbol)?.coinName || sellSymbol}.png`}
                alt={poolMap.get(sellSymbol)?.coinName || sellSymbol}
                width={24}
                height={24}
                className="token-icon"
              />
              <select value={sellSymbol} onChange={handleSellChange}>
                {symbols.map(sym => (
                  <option key={sym} value={sym}>
                    {poolMap.get(sym)?.coinName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="token-balance">
            Balance: {sellBalance} {poolMap.get(sellSymbol)?.coinName}
          </div>
        </div>

        {/* Switch Button */}
        <div className="switch-container">
          <div className="switch-btn-bg-thin-line" />
          <BsArrowDownSquareFill className="switch-btn" onClick={handleSwitch} />
          <div className="switch-btn-bg-thin-line" />
        </div>

        {/* Buy Card */}
        <div className="convert-card">
          <div className="convert-label">Buy</div>
          <div className="convert-row">
            <input type="text" placeholder="0" value={buyAmount} readOnly />
            <div className="dropdown">
              <Image
                src={`/icons/${poolMap.get(buySymbol)?.coinName || buySymbol}.png`}
                alt={poolMap.get(buySymbol)?.coinName || buySymbol}
                width={24}
                height={24}
                className="token-icon"
              />
              <select value={buySymbol} onChange={handleBuyChange}>
                {symbols.map(sym => (
                  <option key={sym} value={sym}>
                    {poolMap.get(sym)?.coinName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="token-balance">
            Balance: {buyBalance} {poolMap.get(buySymbol)?.coinName}
          </div>
        </div>

        <button
          className="convert-btn"
          disabled={!sellAmount || isNaN(parseFloat(sellAmount)) || parseFloat(sellAmount) <= 0}
          onClick={onConvert}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
