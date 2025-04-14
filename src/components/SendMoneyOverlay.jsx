'use client'
import { useGlobalState } from '../GlobalStateProvider';
import { FaTimes } from 'react-icons/fa';
import { FaPaperPlane, FaGlobeAfrica, FaTint } from 'react-icons/fa';
import { IoIosCloseCircleOutline } from "react-icons/io";

const SendMoneyOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();

    if (!overlayStates.sendMoney) return null;

    return (
        <div className="overlay-background">
            <div className="send-money-overlay">
                <div className="overlay-header">
                    <h2>Send Money</h2>
                    <IoIosCloseCircleOutline className="close-icon" onClick={() => toggleOverlay('sendMoney')} />
                </div>
                <div className="overlay-options">
                    <div className="option" onClick={() => { toggleOverlay('payfricaPadi'); toggleOverlay('sendMoney') }}>
                        <FaPaperPlane />
                        <div>
                            <h3>To Payfrica Padi</h3>
                            <p>Send money to anyone using Payfrica fast and cheap</p>
                        </div>
                    </div>
                    <div className="option" style={{ cursor: 'not-allowed' }}>
                        <FaGlobeAfrica />
                        <div>
                            <h3>To Other African Countries</h3>
                            <p>Distance is not a barrier, send money across borders</p>
                            <span>Coming Soon</span>
                        </div>
                    </div>
                    <div className="option" onClick={() => { toggleOverlay('sendSuiToken'); toggleOverlay('sendMoney') }}>
                        <FaTint />
                        <div>
                            <h3>Send Sui Token</h3>
                            <p>Send Sui tokens to anyone: Wallet, Payfrica, Exchange</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMoneyOverlay;
