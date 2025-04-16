'use client';
import { useState, useEffect } from 'react';
import { LuMoveLeft } from 'react-icons/lu';
import { useGlobalState } from '../GlobalStateProvider';
import { BsQrCodeScan } from 'react-icons/bs';
import { ProfileDP, PayfricaNavLogo } from '@/imports';
import { nameExists } from '@/hooks/registerNsName';
import { getTokenBalance } from '@/hooks/getCoinBalance'; // Import your balance script
import { useCustomWallet } from "@/contexts/CustomWallet";

const EnterAmountOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();
    if (!overlayStates.enterAmount) return null;
    const { address } = useCustomWallet();
    const [amount, setAmount] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tagExists, setTagExists] = useState(null);

    // New state variables for currency and balance
    const [currency, setCurrency] = useState('NGNC');
    const [balance, setBalance] = useState(null);
    const [loadingBalance, setLoadingBalance] = useState(false);

    const suffix = '@payfrica';

    // Validate tag via nameExists when the editable tag part is longer than 4 characters.
    useEffect(() => {
        if (tagInput.trim().length > 4) {
            const fullTag = tagInput + suffix;
            nameExists(fullTag).then((exists) => {
                setTagExists(exists);
            });
        } else {
            setTagExists(null);
        }
    }, [tagInput, suffix]);

    // When the selected currency changes, fetch the corresponding balance.
    useEffect(() => {
        async function fetchBalance() {
            setLoadingBalance(true);
            try {
                const bal = await getTokenBalance(address, currency);
                // console.log(bal);
                setBalance(bal);
            } catch (err) {
                console.error(err);
                setBalance(null);
            } finally {
                setLoadingBalance(false);
            }
        }
        fetchBalance();
    }, [currency]);

    // Editable tag is valid if more than 3 characters and no spaces.
    const isTagValid = tagInput.trim().length > 3 && !tagInput.includes(' ');
    const isAmountValid = amount && parseFloat(amount) > 0;
    const isSendActive = isTagValid && isAmountValid;

    // Determine tag validation message and its color.
    let tagMessage = "*Tag must be at least 4 characters long*";
    let tagMessageColor = "#555"; // default gray

    if (tagInput.trim().length > 4) {
        if (tagExists) {
            tagMessage = "Valid Payfrica Tag";
            tagMessageColor = "green";
        } else {
            tagMessage = "Tag Does not exist";
            tagMessageColor = "red";
        }
    }

    return (
        <div className="overlay-background">
            <div className="enter-amount-overlay">
                <div className="overlay-header">
                    <LuMoveLeft 
                        className="back-icon" 
                        onClick={() => { 
                            toggleOverlay('payfricaPadi'); 
                            toggleOverlay('enterAmount'); 
                        }} 
                    />
                    <BsQrCodeScan className="qrcodeicon" />
                </div>

                <div className="recipient-info">
                    <img src={PayfricaNavLogo.src}  alt="" />
                    {/* <div>
                        <h3>Payfica</h3>
                        <p>@payfrica</p>
                    </div> */}
                </div>
                
                {/* Payfrica Tag Input Section */}
                <div className="payfrica-tag-section" style={{ margin: '20px 0' }}>
                    <h3 style={{ color: "#333" }}>Enter Recipient Tag</h3>
                    <div 
                        className="payfrica-tag-wrapper" 
                        style={{ position: 'relative', width: '100%' }}
                    >
                        <input
                            type="text"
                            placeholder="Recipient Tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: '5px', 
                                fontFamily: 'InterLight', 
                                fontSize: '16px', 
                                outline: 'none', 
                                border: '1px solid #ccc',
                                paddingRight: '100px' // leave space for suffix display
                            }}
                        />
                        <span 
                            className="payfrica-tag-suffix" 
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                pointerEvents: 'none',
                                color: '#555'
                            }}
                        >
                            {suffix}
                        </span>
                    </div>
                    <small 
                        style={{ 
                            display: 'block', 
                            marginTop: '5px', 
                            fontFamily: 'InterLight', 
                            color: tagMessageColor 
                        }}
                    >
                        {tagMessage}
                    </small>
                </div>

                {/* Amount Entry Section */}
                <div className="amount-entry">
                    <h3 style={{ color: "#333" }}>Enter Amount</h3>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            borderRadius: '5px', 
                            fontFamily: 'InterLight', 
                            fontSize: '16px', 
                            outline: 'none', 
                            border: '1px solid #ccc'
                        }}
                    />
                    <select 
                        name="currency" 
                        id="currency" 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ 
                            padding: '10px', 
                            borderRadius: '5px', 
                            fontFamily: 'InterLight', 
                            fontSize: '16px', 
                            outline: 'none', 
                            border: '1px solid #ccc',
                            marginTop: '10px'
                        }}
                    >
                        {/* <option value="USD">USDC</option> */}
                        <option value="NGN">NGNC</option>
                        <option value="GHS">GHSC</option>
                        <option value="KES">KESC</option>
                        <option value="ZAR">ZARC</option>
                    </select>
                    <div style={{ marginTop: '5px', fontFamily: 'InterLight', fontSize: '14px', color: '#333' }}>
                        {loadingBalance ? "Loading balance..." : `Balance: ${balance !== null ? balance : '0'}`}
                    </div>
                    <div className="amount-options" style={{ marginTop: '10px' }}>
                        {['100', '200', '500', '1000'].map((amt) => (
                            <button 
                                key={amt} 
                                onClick={() => setAmount(amt)}
                                style={{ marginRight: '5px' }}
                            >
                                {amt}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    className="send-money-button" 
                    disabled={!isSendActive}
                    style={{ 
                        opacity: isSendActive ? 1 : 0.5, 
                        cursor: isSendActive ? 'pointer' : 'not-allowed',
                        marginTop: '15px'
                    }}
                    onClick={() => { 
                        // Optionally, combine the tag with suffix:
                        // const fullTag = tagInput + suffix;
                        toggleOverlay('sending'); 
                        toggleOverlay('enterAmount');
                    }}
                >
                    Send Money
                </button>
            </div>
        </div>
    );
};

export default EnterAmountOverlay;
