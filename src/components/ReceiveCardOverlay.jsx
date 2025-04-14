'use client';
import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { FaArrowLeft } from 'react-icons/fa';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { toPng } from 'html-to-image';
import { useGlobalState } from '@/GlobalStateProvider';
import { PayfricaCardBg, PayfricaNavLogo } from '@/imports';
import PayfricaCardHeadImg from '@/assets/images/PayfricaCardHeadImg.jpg';

const ReceiveCardOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();
    const cardRef = useRef(null);

    const qrValue = '@teamsushi.payfrica';
    const payfricaID = '56y5437894hghf5';

    const downloadCard = () => {
        if (cardRef.current) {
            toPng(cardRef.current).then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'payfrica-card.png';
                link.href = dataUrl;
                link.click();
            });
        }
    };

    if (!overlayStates.receiveCard) return null;

    return (
        <div className="overlay-background">
            <div className="card-overlay-container">
                {/* Header */}
                <div className="card-overlay-header">
                    <FaArrowLeft className="icon" onClick={() => { toggleOverlay('receiveCard'); toggleOverlay('receiveMoney') }} />
                    <h2>Receive Money</h2>
                    <BsQuestionCircleFill className="icon" />
                </div>

                {/* Title */}
                <div className="card-title">
                    <h1>Your Payfrica Card</h1>
                    <p>Save to your device or print to receive assets offline</p>
                </div>

                {/* Card Display */}
                <div className="card-preview">
                    {/* Front of the card */}
                    <div className="pay-card front" ref={cardRef}>
                        {/* <div className="payfrica-card-header">
                            <img src={PayfricaNavLogo.src} alt="Payfrica Logo" />
                            <span>Accepted</span>
                        </div> */}
                        <div>
                            <img src={PayfricaCardHeadImg.src} alt="" style={{ width: '100%', marginBottom: '0px' }} />
                            <div style={{ width: '100%', backgroundColor: '#3C53A4', height: '10px', marginTop: '-5px' }}></div>
                        </div>
                        <div className="card-body">
                            <div className="qr-container">
                                <QRCode value={qrValue} size={150} />
                                <div className="qr-corners">
                                    <span className="corner tl" />
                                    <span className="corner tr" />
                                    <span className="corner bl" />
                                    <span className="corner br" />
                                </div>
                            </div>
                            <p className="tagline">No Network, No Wahala</p>
                            <p className="pay-id">Payfrica ID: {payfricaID}</p>
                        </div>
                    </div>

                    {/* Back of the card (desktop only) */}
                    <div className="pay-card back">
                        <img src={PayfricaCardBg.src} alt="Back of card" />
                    </div>
                </div>

                {/* Download Button */}
                <button
                    className="save-btn"
                    onClick={() => {
                        downloadCard();
                        setTimeout(() => toggleOverlay('receiveCard'), 1000); // Delay to ensure download completes
                    }}
                >
                    Save to Device
                </button>
            </div>
        </div>
    );
};

export default ReceiveCardOverlay;
