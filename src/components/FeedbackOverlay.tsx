'use client';
import { useGlobalState } from '../GlobalStateProvider';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const FeedbackOverlay = ({ type }) => {
    const { overlayStates, toggleOverlay, closeAllOverlays } = useGlobalState();

    if (!overlayStates[type]) return null;

    return (
        <div className="overlay-background">
            <div className="feedback-overlay">
                {type === 'success' ? (
                    <>
                        <FaCheckCircle className="feedback-icon success-icon" />
                        <h3>Success</h3>
                        <button onClick={() => toggleOverlay('success')}>View Receipt</button>
                    </>
                ) : (
                    <>
                        <FaTimesCircle className="feedback-icon failed-icon" />
                        <h3>Failed</h3>
                        <button onClick={() => toggleOverlay('failed')}>Retry</button>
                    </>
                )}
                <button onClick={closeAllOverlays}>Home</button>
            </div>
        </div>
    );
};

export default FeedbackOverlay;
