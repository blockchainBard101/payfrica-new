'use client';
import { useState } from 'react';
import { LuMoveLeft } from 'react-icons/lu';
import { useGlobalState } from '../GlobalStateProvider';
import { BsQrCodeScan } from "react-icons/bs";
import { ProfileDP } from '@/imports';

const SendSuiToWAOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();

    if (!overlayStates.sendSuiToWA) return null;

    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');

    return (
        <div className="overlay-background">
            <div className="enter-amount-overlay">
                <div className="overlay-header">
                    <LuMoveLeft className="back-icon" onClick={() => { toggleOverlay('sendSuiToken'); toggleOverlay('sendSuiToWA') }} />
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
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span style={{ fontFamily: 'InterLight', fontSize: '20px', color: '#666', border: '1px solid #ccc', padding: '.75rem', borderRadius: '5px', minHeight: '100%', marginBottom: '1rem' }}>SUI</span>
                    </div>

                    <div className="amount-options">
                        {['100', '200', '500', '1000'].map((amt) => (
                            <button key={amt} onClick={() => setAmount(amt)}>{amt}</button>
                        ))}
                    </div>
                    <div>
                        <h3 style={{ margin: '2rem 0' }}>Wallet Address</h3>
                        <input
                            type="text"
                            placeholder="Enter address or SuiNS"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                <button className="send-money-button" onClick={() => { toggleOverlay('sending'); toggleOverlay('sendSuiToWA') }}>Send Sui Token</button>
            </div>
        </div>
    );
};

export default SendSuiToWAOverlay;
