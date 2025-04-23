'use client'
import { useState } from 'react';
import { useGlobalState } from '../GlobalStateProvider';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuMoveLeft } from "react-icons/lu";

const PayfricaPadiOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();
    const [inputValue, setInputValue] = useState('');

    if (!overlayStates.payfricaPadi) return null;

    const isButtonActive = inputValue.startsWith('@') && inputValue.length > 3 && !inputValue.includes(' ');

    return (
        <div className="overlay-background">
            <div className="send-money-overlay" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '600px' }}>
                <div className="overlay-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px', alignItems: 'center' }}>
                    <IoIosCloseCircleOutline className="close-icon" onClick={() => toggleOverlay('payfricaPadi')} />
                    <LuMoveLeft className="back-icon" onClick={() => { toggleOverlay('payfricaPadi'); toggleOverlay('sendMoney') }} />
                </div>
                <h2 style={{ fontFamily: 'LexendExtraBold', fontSize: '30px' }}>Who are you sending to?</h2>
                <p style={{ fontFamily: 'InterLight', fontSize: '20px' }}>Make sure the Payfrica tag is valid</p>
                <input
                    type="text"
                    placeholder="Payfrica Tag"
                    className="payfrica-tag-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <small style={{ alignSelf: 'flex-start', color: 'red', marginTop: '-30px', fontFamily: 'InterLight' }}>*Tag must start with @ and be at least 4 characters long*</small>
                <button
                    className="check-tag-button"
                    disabled={!isButtonActive}
                    style={{ opacity: isButtonActive ? 1 : 0.5, cursor: isButtonActive ? 'pointer' : 'not-allowed' }}
                    onClick={() => {
                        toggleOverlay('payfricaPadi');
                        toggleOverlay('enterAmount');
                    }}
                >
                    Check Tag
                </button>
            </div>
        </div>
    );
};

export default PayfricaPadiOverlay;
