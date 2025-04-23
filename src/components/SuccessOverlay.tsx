'use client'
import { useGlobalState } from '../GlobalStateProvider';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessOverlay = () => {
    const { overlayStates, toggleOverlay, closeAllOverlays } = useGlobalState();

    if (!overlayStates.success) return null;

    return (
        <div className="overlay-background">
            <div className="feedback-overlay">
                <FaCheckCircle className="feedback-icon success-icon" />
                <h3>Success</h3>
                <button onClick={() => closeAllOverlays()}>View Receipt</button>
                <button onClick={() => closeAllOverlays()}>Home</button>
            </div>
        </div>
    );
};

export default SuccessOverlay;
