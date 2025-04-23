'use client'
import React, { useEffect } from 'react';
import { useGlobalState } from '../GlobalStateProvider';

const SendingOverlay = () => {
    const { overlayStates, toggleOverlay } = useGlobalState();

    useEffect(() => {
        if (overlayStates.sending) {
            setTimeout(() => {
                toggleOverlay('sending');
                toggleOverlay('success'); // Automatically trigger success after animation
            }, 3000); // Animation duration
        }
    }, [overlayStates.sending, toggleOverlay]);

    if (!overlayStates.sending) return null;

    return (
        <div className="overlay-background">
            <div className="sending-overlay">
                <div className="loader"></div>
                <h3>Sending...</h3>
                <p>View transaction</p>
            </div>
        </div>
    );
};

export default SendingOverlay;
