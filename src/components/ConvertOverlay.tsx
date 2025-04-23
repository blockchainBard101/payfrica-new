'use client'

import React, { useState, useEffect } from 'react'
import { useGlobalState } from '@/GlobalStateProvider'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { BsArrowDownSquareFill } from 'react-icons/bs'
import { SuiLogo } from '@/imports'
import { useCustomWallet } from '@/contexts/CustomWallet'
import { getTokenBalance } from '@/hooks/getCoinBalance'
import Image from 'next/image' // ✅ Import Image from next/image

const tokens = {
  NGNC: {
    CoinId: "0x920dda82ee13d3a75f7842c7797b034f4824d7fae1649e14044a172fc784ca0d::ngnc::NGNC",
    PoolId: "0x5d3cb4beb22f251e54de9580b6530ebbad115f92fd0bccec5190c38f14591684",
    decimals: 6,
    logo: SuiLogo,
    name: "Nigeria Stable",
  },
  GHSC: {
    CoinId: "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::ghsc::GHSC",
    PoolId: "0xBBB…222",
    decimals: 6,
    logo: SuiLogo,
    name: "Ghana Stable",
  },
  USDC: {
    CoinId: "0x920dda82ee13d3a75f7842c7797b034f4824d7fae1649e14044a172fc784ca0d::usdc::USDC",
    PoolId: "0xaae9216964bf12c862ab72c3331490bde1f6afbc5d1f48056496d381803b48ad",
    decimals: 6,
    logo: SuiLogo,
    name: "USD Coin",
  },
  KHSC: {
    CoinId: "0x1e0d95b18fb8dd08f6cf64498df8310f8da4641512e0d9bf57ac67e386affdc4::khsc::KHSC",
    PoolId: "0xDDD…444",
    decimals: 6,
    logo: SuiLogo,
    name: "Kenya Stable",
  },
}

const rates_dollar = {
  NGNC: 1500,
  GHSC: 15.56,
  USDC: 1,
  KHSC: 15.56,
}

export default function ConvertOverlay() {
  const { overlayStates, toggleOverlay, setConvertData } = useGlobalState()
  const { address } = useCustomWallet()
  const tokenKeys = Object.keys(tokens)
  const [sellSymbol, setSellSymbol] = useState('NGNC')
  const [buySymbol, setBuySymbol] = useState('USDC')
  const [sellAmount, setSellAmount] = useState('')
  const [buyAmount, setBuyAmount] = useState('')
  const [sellBalance, setSellBalance] = useState('0.00')
  const [buyBalance, setBuyBalance] = useState('0.00')

  // compute buyAmount
  useEffect(() => {
    const sell = parseFloat(sellAmount)
    if (!sellAmount || isNaN(sell)) {
      setBuyAmount('')
      return
    }
    const rate = rates_dollar[buySymbol] / rates_dollar[sellSymbol]
    setBuyAmount((sell * rate).toFixed(2))
  }, [sellAmount, sellSymbol, buySymbol])

  // fetch balances
  useEffect(() => {
    if (!address) return
    getTokenBalance(address, sellSymbol)
      .then(setSellBalance)
      .catch(() => setSellBalance('0.00'))
  }, [address, sellSymbol])

  useEffect(() => {
    if (!address) return
    getTokenBalance(address, buySymbol)
      .then(setBuyBalance)
      .catch(() => setBuyBalance('0.00'))
  }, [address, buySymbol])

  const handleSwitch = () => {
    setSellSymbol(buySymbol)
    setBuySymbol(sellSymbol)
    setSellAmount(buyAmount)
    setBuyAmount(sellAmount)
  }

  const handleSellChange = (e) => {
    const symbol = e.target.value
    symbol === buySymbol ? handleSwitch() : setSellSymbol(symbol)
  }

  const handleBuyChange = (e) => {
    const symbol = e.target.value
    symbol === sellSymbol ? handleSwitch() : setBuySymbol(symbol)
  }

  const handleContinue = () => {
    setConvertData({
      fromToken: sellSymbol,
      toToken: buySymbol,
      fromAmount: sellAmount,
      toAmount: buyAmount,
    })
    toggleOverlay('convert')
    toggleOverlay('confirmConvert')
  }

  if (!overlayStates.convert) return null

  return (
    <div className="overlay-background">
      <div className="convert-modal">
        <div className="modal-header">
          <h2>Convert Tokens</h2>
          <IoIosCloseCircleOutline
            className="close-btn"
            onClick={() => toggleOverlay('convert')}
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
              onChange={(e) => setSellAmount(e.target.value)}
            />
            <div className="dropdown">
              <Image
                src={tokens[sellSymbol].logo.src}
                alt={sellSymbol}
                width={24}
                height={24}
                className="token-icon"
                loading="lazy"
              />
              <select value={sellSymbol} onChange={handleSellChange}>
                {tokenKeys.map((sym) => (
                  <option key={sym} value={sym}>
                    {sym}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="token-balance">
            Balance: {sellBalance} {sellSymbol}
          </div>
        </div>

        {/* Switch Button */}
        <div className="switch-container">
          <div className="switch-btn-bg-thin-line" />
          <BsArrowDownSquareFill
            className="switch-btn"
            onClick={handleSwitch}
          />
          <div className="switch-btn-bg-thin-line" />
        </div>

        {/* Buy Card */}
        <div className="convert-card">
          <div className="convert-label">Buy</div>
          <div className="convert-row">
            <input
              type="text"
              placeholder="0"
              value={buyAmount}
              readOnly
            />
            <div className="dropdown">
              <Image
                src={tokens[buySymbol].logo.src}
                alt={buySymbol}
                width={24}
                height={24}
                className="token-icon"
                loading="lazy"
              />
              <select value={buySymbol} onChange={handleBuyChange}>
                {tokenKeys.map((sym) => (
                  <option key={sym} value={sym}>
                    {sym}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="token-balance">
            Balance: {buyBalance} {buySymbol}
          </div>
        </div>

        <button
          className="convert-btn"
          disabled={
            !sellAmount ||
            isNaN(parseFloat(sellAmount)) ||
            parseFloat(sellAmount) <= 0
          }
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
