'use client'
import { FaTimes, FaExchangeAlt } from 'react-icons/fa';
import { useGlobalState } from '@/GlobalStateProvider';
import CoinSelect from './CoinSelect';
import { coins } from '@/utils';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const ConvertOverlay = () => {
    const { overlayStates, toggleOverlay, convertData, setConvertData } = useGlobalState();

    const isReady = convertData.fromToken && convertData.toToken;

    const handleContinue = () => {
        toggleOverlay('convert');
        toggleOverlay('confirmConvert');
    };

    if (!overlayStates.convert) return null;

    return (
        <div className="overlay-background">
            <div className="convert-overlay">
                <div className="convert-header">
                    <h3>Convert Tokens 🔁</h3>
                    <IoIosCloseCircleOutline className="close-icon" style={{ color: '#C43E26' }} onClick={() => toggleOverlay('convert')} />
                </div>

                <CoinSelect
                    label="From Token"
                    selected={convertData.fromToken}
                    onChange={(value) => setConvertData({ ...convertData, fromToken: value })}
                    options={coins}
                />

                <FaExchangeAlt className="convert-icon" />

                <CoinSelect
                    label="To Token"
                    selected={convertData.toToken}
                    onChange={(value) => setConvertData({ ...convertData, toToken: value })}
                    options={coins}
                />

                <button
                    className="convert-btn"
                    disabled={!isReady}
                    onClick={handleContinue}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default ConvertOverlay;
