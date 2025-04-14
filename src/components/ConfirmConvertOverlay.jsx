'use client'
import { useGlobalState } from '@/GlobalStateProvider';
import { toast } from 'react-toastify';
import { MdCancel } from "react-icons/md";
import { IoIosCloseCircleOutline } from 'react-icons/io';

const ConfirmConvertOverlay = () => {
    const { overlayStates, toggleOverlay, convertData, setConvertData } = useGlobalState();

    const handleConvert = () => {
        toggleOverlay('confirmConvert');
        toggleOverlay('sending');
        toast.info('Converting...');

        setTimeout(() => {
            toggleOverlay('sending');
            const success = Math.random() > 0.3;
            toggleOverlay(success ? 'success' : 'failed');
            toast[success ? 'success' : 'error'](`Conversion ${success ? 'successful' : 'failed'}`);
        }, 2000);

        setConvertData({ fromToken: '', toToken: '' });
    };

    if (!overlayStates.confirmConvert) return null;

    return (
        <div className="overlay-background">
            <div className="confirm-convert-overlay">

                <IoIosCloseCircleOutline className="confirm-overlay-close-icon" style={{ color: '#C43E26' }} onClick={() => { toggleOverlay('convert'); toggleOverlay('confirmConvert') }} />
                <h4>You are converting</h4>
                <h2>{convertData.fromToken} to {convertData.toToken}</h2>
                <p>Your Payfrica wallet will receive:</p>

                <div className="convert-summary">
                    <div><span>You receive</span><strong>10000 {convertData.toToken}</strong></div>
                    <div><span>Fee</span><strong>NGN 0.00</strong></div>
                    <div><span>Payment method</span><strong>Payfrica Bridge</strong></div>
                </div>

                <button className="convert-btn" onClick={handleConvert}>
                    Convert
                </button>
            </div>
        </div>
    );
};

export default ConfirmConvertOverlay;
