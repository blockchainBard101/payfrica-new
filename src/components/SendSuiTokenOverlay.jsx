'use client'
import { useGlobalState } from '../GlobalStateProvider';
import { FaTimes } from 'react-icons/fa';
import { FaPaperPlane, FaGlobeAfrica, FaTint } from 'react-icons/fa';
import { IoIosCloseCircleOutline } from "react-icons/io";

const SendSuiTokenOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();

    if (!overlayStates.sendSuiToken) return null;

    return (
        <div className="overlay-background">
            <div className="send-money-overlay">
                <div className="overlay-header">
                    <h2>Send Sui Tokens</h2>
                    <IoIosCloseCircleOutline className="close-icon" onClick={() => toggleOverlay('sendSuiToken')} />
                </div>
                <div className="overlay-options">
                    <div className="option" onClick={() => { toggleOverlay('payfricaPadiSui'); toggleOverlay('sendSuiToken') }}>
                        <FaPaperPlane />
                        <div>
                            <h3>To Payfrica Padi</h3>
                            <p>Send Sui tokens to Payfrica User</p>
                        </div>
                    </div>
                    <div className="option" onClick={() => { toggleOverlay('sendSuiToWA'); toggleOverlay('sendSuiToken') }}>
                        <FaTint />
                        <div>
                            <h3>Send Sui Tokens to Wallet Address</h3>
                            <p>Send Sui Tokens to Wallet/Exchange</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendSuiTokenOverlay;
