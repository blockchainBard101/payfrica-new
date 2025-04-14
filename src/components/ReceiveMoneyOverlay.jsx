'use client';
import React from 'react';
import QRCode from 'react-qr-code';
import { FaArrowLeft, FaInfoCircle, FaCopy, FaShareAlt } from 'react-icons/fa';
import { BsQuestionCircleFill } from "react-icons/bs";
import { useGlobalState } from '@/GlobalStateProvider';
import { toast } from 'react-toastify';

const ReceiveMoneyOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();

    const payTag = '@teamsushi.payfrica';
    const walletAddress = '0x1234567890abcdef';

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Copied to clipboard!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                // transition: Bounce,
            });
        }).catch(() => {
            toast.error('Failed to copy');
        });
    };

    if (!overlayStates.receiveMoney) return null;

    return (
        <div className="overlay-background">
            <div className="receive-money-container">
                <div className="receive-header">
                    <FaArrowLeft className="icon" onClick={() => toggleOverlay('receiveMoney')} />
                    <h2>Receive Money</h2>
                    <BsQuestionCircleFill className="icon" />
                </div>

                <div className="qr-wrapper">
                    <QRCode value={payTag} size={160} bgColor="#FCF5D7" fgColor="#000" />
                </div>

                <div className="info-block">
                    <h2>Payfrica Tag</h2>
                    <div className="copy-box">
                        <p>{payTag}</p>
                        <button onClick={() => copyToClipboard(payTag)}>
                            <FaCopy /> Copy
                        </button>
                    </div>
                </div>

                <div className="info-block">
                    <h2>Wallet Address</h2>
                    <div className="copy-box">
                        <p>{walletAddress}</p>
                        <button onClick={() => copyToClipboard(walletAddress)}>
                            <FaCopy /> Copy
                        </button>
                    </div>
                </div>

                <p className="note">This address can only be used to
                    receive compatible tokens.</p>

                <button className="share-btn" onClick={() => { toggleOverlay('receiveMoney'); toggleOverlay('receiveCard') }}> Share address
                </button>
            </div>
        </div>
    );
};

export default ReceiveMoneyOverlay;
