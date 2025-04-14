'use client';
import { useState } from 'react';
import { LuMoveLeft } from 'react-icons/lu';
import { useGlobalState } from '../GlobalStateProvider';
import { BsQrCodeScan } from "react-icons/bs";
import { ProfileDP } from '@/imports';

const EnterAmountOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();

    if (!overlayStates.enterAmount) return null;

    const [amount, setAmount] = useState('');

    return (
        <div className="overlay-background">
            <div className="enter-amount-overlay">
                <div className="overlay-header">
                    <LuMoveLeft className="back-icon" onClick={() => { toggleOverlay('payfricaPadi'); toggleOverlay('enterAmount') }} />
                    <BsQrCodeScan className="qrcodeicon" />
                </div>

                <div className="recipient-info">
                    <img src={ProfileDP.src} className='profile-picture' alt="Profile Picture" />
                    <div>
                        <h3>Team Sushi</h3>
                        <p>@teamsushi</p>
                    </div>
                </div>

                <div className="amount-entry">
                    <h3>Enter Amount</h3>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <select name="currency" id="currency" style={{ padding: '10px', borderRadius: '5px', fontFamily: 'InterLight', fontSize: '16px', outline: 'none', border: '1px solid #ccc' }}>
                        <option value="USD">USDC</option>
                        <option value="NGN">NGNC</option>
                        <option value="GHS">GHSC</option>
                        <option value="KES">KESC</option>
                        <option value="ZAR">ZARC</option>
                    </select>
                    <div className="amount-options">
                        {['100', '200', '500', '1000'].map((amt) => (
                            <button key={amt} onClick={() => setAmount(amt)}>{amt}</button>
                        ))}
                    </div>
                </div>

                <button className="send-money-button" onClick={() => { toggleOverlay('sending'); toggleOverlay('enterAmount') }}>Send Money</button>
            </div>
        </div>
    );
};

export default EnterAmountOverlay;
