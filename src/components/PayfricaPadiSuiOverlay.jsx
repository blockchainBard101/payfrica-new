'use client'
import { useState, useEffect } from 'react';
import { useGlobalState } from '../GlobalStateProvider';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuMoveLeft } from "react-icons/lu";
import { nameExists } from '@/hooks/registerNsName';

const PayfricaPadiSuiOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();

    if (!overlayStates.payfricaPadiSui) return null;

    const suffix = '@payfrica';
    // Store only the editable part of the tag.
    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(false);

    // Check the full tag (editable part + suffix) whenever the inputValue changes.
    useEffect(() => {
        const checkName = async () => {
            const fullTag = inputValue + suffix;
            const exists = await nameExists(fullTag);
            setIsValid(exists);
        };
        checkName();
    }, [inputValue, suffix]);

    // Button is enabled only if the editable portion has more than 3 characters and contains no spaces.
    const isButtonActive = inputValue.length > 3 && !inputValue.includes(' ');

    return (
        <div className="overlay-background">
            <div 
                className="send-money-overlay" 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '20px', 
                    padding: '20px', 
                    borderRadius: '10px', 
                    width: '90%', 
                    maxWidth: '600px' 
                }}
            >
                <div 
                    className="overlay-header" 
                    style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        width: '100%', 
                        padding: '10px', 
                        alignItems: 'center' 
                    }}
                >
                    <IoIosCloseCircleOutline 
                        className="close-icon" 
                        onClick={() => toggleOverlay('payfricaPadiSui')} 
                    />
                    <LuMoveLeft 
                        className="back-icon" 
                        onClick={() => {
                            toggleOverlay('payfricaPadiSui');
                            toggleOverlay('sendSuiToken');
                        }}
                    />
                </div>
                <h2 style={{ fontFamily: 'LexendExtraBold', fontSize: '30px' }}>
                    Who are you sending to?
                </h2>
                <p style={{ fontFamily: 'InterLight', fontSize: '20px' }}>
                    Make sure the Payfrica tag is valid
                </p>
                {/* Container for the editable input and the non-editable suffix */}
                <div 
                    className="payfrica-tag-wrapper" 
                    style={{ 
                        position: 'relative', 
                        display: 'inline-block', 
                        width: '100%' 
                    }}
                >
                    <input
                        type="text"
                        placeholder="Payfrica Tag"
                        className="payfrica-tag-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{ 
                            width: '100%', 
                            paddingRight: '100px' // add space for the suffix
                        }}
                    />
                    <span 
                        className="payfrica-tag-suffix" 
                        style={{ 
                            position: 'absolute', 
                            right: '10px', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            pointerEvents: 'none', // prevent interaction with the suffix
                            color: '#555'
                        }}
                    >
                        {suffix}
                    </span>
                </div>
                <small 
                    style={{ 
                        alignSelf: 'flex-start', 
                        color: 'red', 
                        marginTop: '-30px', 
                        fontFamily: 'InterLight' 
                    }}
                >
                    *Tag must be at least 4 characters long*
                </small>
                <button
                    className="check-tag-button"
                    disabled={!isButtonActive}
                    style={{ 
                        opacity: isButtonActive ? 1 : 0.5, 
                        cursor: isButtonActive ? 'pointer' : 'not-allowed' 
                    }}
                    onClick={() => {
                        toggleOverlay('payfricaPadiSui');
                        toggleOverlay('enterSuiAmount');
                    }}
                >
                    Check Tag
                </button>
            </div>
        </div>
    );
};

export default PayfricaPadiSuiOverlay;
