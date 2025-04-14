'use client';
import { useState } from 'react';
import { LuMoveLeft } from 'react-icons/lu';
import { useGlobalState } from '../GlobalStateProvider';
import { BsQrCodeScan } from "react-icons/bs";
import { ProfileDP } from '@/imports';

const EnterSuiAmountOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();

    if (!overlayStates.enterSuiAmount) return null;

    const [amount, setAmount] = useState('');

    return (
        <div className="overlay-background">
            <div className="enter-amount-overlay">
                <div className="overlay-header">
                    <LuMoveLeft className="back-icon" onClick={() => { toggleOverlay('payfricaPadiSui'); toggleOverlay('enterSuiAmount') }} />
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
                        type="amount"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <select name="currency" id="currency" style={{ padding: '10px', borderRadius: '5px', fontFamily: 'InterLight', fontSize: '16px', outline: 'none', border: '1px solid #ccc' }}>
                        <option value="USD">SUI</option>
                    </select>
                    <div className="amount-options">
                        {['100', '200', '500', '1000'].map((amt) => (
                            <button key={amt} onClick={() => setAmount(amt)}>{amt}</button>
                        ))}
                    </div>
                </div>

                <button className="send-money-button" onClick={() => { toggleOverlay('sending'); toggleOverlay('enterSuiAmount') }}>Send Sui Token</button>
            </div>
        </div>
    );
};

export default EnterSuiAmountOverlay;
