import React from 'react';
import { useGlobalState } from '@/GlobalStateProvider';
import { FaTimes } from 'react-icons/fa';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const ConfirmConvertOverlay = () => {
    const { overlayStates, toggleOverlay, convertData } = useGlobalState();

    if (!overlayStates.confirmConvert) return null;

    return (
        <div className="overlay-background">
            <div className="confirm-convert-overlay">
                <div className="modal-header">
                    <IoIosCloseCircleOutline className="close-btn" style={{ position: 'absolute', right: '0px', top: '-10px', alignSelf: 'flex-end' }} onClick={() => toggleOverlay('confirmConvert')} />
                    {/* <FaTimes className="close-btn" onClick={() => toggleOverlay('confirmConvert')} /> */}
                </div>

                <h4>You are converting</h4>
                <h2>{convertData.fromToken.symbol} to {convertData.toToken.symbol}</h2>
                <p>Your Payfrica wallet will receive</p>

                <div className="convert-summary">
                    <div><span>You receive</span><strong>{convertData.toAmount} {convertData.toToken.symbol}</strong></div>
                    <div><span>Fee</span><strong>NGN 0.00</strong></div>
                    <div><span>Payment method</span><strong>Payfrica Bridge</strong></div>
                </div>

                <button className="convert-btn">Convert</button>
            </div>
        </div>
    );
};

export default ConfirmConvertOverlay;
