'use client'
import React, { useState, useEffect } from 'react';
import { useGlobalState } from '@/GlobalStateProvider';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { SuiLogo } from '@/imports';
import { BsArrowDownSquareFill } from 'react-icons/bs';

const tokens = [
    { symbol: 'SUI', name: 'SUI Token', logo: SuiLogo, rate: 1 },
    { symbol: 'USDC', name: 'USD Coin', logo: SuiLogo, rate: 1000 },
    { symbol: 'NGNC', name: 'Nigeria Stable', logo: SuiLogo, rate: 1000 },
    { symbol: 'NAVX', name: 'NAVI Coin', logo: SuiLogo, rate: 1000 },
    { symbol: 'GHCC', name: 'Gnaha Stable', logo: SuiLogo, rate: 1000 },
    { symbol: 'LOFI', name: 'Lofi The Yeti 😂', logo: SuiLogo, rate: 1000 },
];

const ConvertOverlay = () => {
    const { overlayStates, toggleOverlay, convertData, setConvertData } = useGlobalState();
    const [sellToken, setSellToken] = useState(tokens[0]);
    const [buyToken, setBuyToken] = useState(tokens[1]);
    const [sellAmount, setSellAmount] = useState('');
    const [buyAmount, setBuyAmount] = useState('');

    // Update buy amount when sell amount changes
    useEffect(() => {
        if (!sellAmount || isNaN(sellAmount)) {
            setBuyAmount('');
            return;
        }

        const rate = sellToken.rate / buyToken.rate;
        const result = parseFloat(sellAmount) * rate;
        setBuyAmount(result.toFixed(2));
    }, [sellAmount, sellToken, buyToken]);

    const handleSwitch = () => {
        setSellToken(buyToken);
        setBuyToken(sellToken);
    };

    const handleSellChange = (symbol) => {
        const token = tokens.find((t) => t.symbol === symbol);
        if (token.symbol === buyToken.symbol) {
            handleSwitch();
        } else {
            setSellToken(token);
        }
    };

    const handleBuyChange = (symbol) => {
        const token = tokens.find((t) => t.symbol === symbol);
        if (token.symbol === sellToken.symbol) {
            handleSwitch();
        } else {
            setBuyToken(token);
        }
    };

    const handleContinue = () => {
        setConvertData({
            fromToken: sellToken,
            toToken: buyToken,
            fromAmount: sellAmount,
            toAmount: buyAmount,
        });
        toggleOverlay('convert');
        toggleOverlay('confirmConvert');
    };

    if (!overlayStates.convert) return null;

    return (
        <div className="overlay-background">
            <div className="convert-modal">
                <div className="modal-header">
                    <h2>Convert Tokens</h2>
                    <IoIosCloseCircleOutline className="close-btn" onClick={() => toggleOverlay('convert')} />
                </div>

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
                            <img src={sellToken.logo.src} alt={sellToken.symbol} className="token-icon" />
                            <select value={sellToken.symbol} onChange={(e) => handleSellChange(e.target.value)}>
                                {tokens.map((token) => (
                                    <option key={token.symbol} value={token.symbol}>
                                        {token.symbol}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className='switch-container'>
                    <div className='switch-btn-bg-thin-line'>
                    </div>
                    <BsArrowDownSquareFill className='switch-btn' onClick={handleSwitch} />
                    <div className='switch-btn-bg-thin-line'>
                    </div>
                </div>

                <div className="convert-card">
                    <div className="convert-label">Buy</div>
                    <div className="convert-row">
                        <input type="text" placeholder="0" value={buyAmount} readOnly />
                        <div className="dropdown">
                            <img src={buyToken.logo.src} alt={buyToken.symbol} className="token-icon" />
                            <select value={buyToken.symbol} onChange={(e) => handleBuyChange(e.target.value)}>
                                {tokens.map((token) => (
                                    <option key={token.symbol} value={token.symbol}>
                                        {token.symbol}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    className="convert-btn"
                    disabled={!sellAmount || isNaN(sellAmount) || parseFloat(sellAmount) <= 0}
                    onClick={handleContinue}
                >
                    Continue
                </button>
            </div>
        </div >
    );
};

export default ConvertOverlay;
