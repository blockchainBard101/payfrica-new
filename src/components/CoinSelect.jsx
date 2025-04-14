import { FaChevronDown } from 'react-icons/fa';

const CoinSelect = ({ label, selected, onChange, options }) => {
    return (
        <div className="coin-select-wrapper">
            <p className="coin-label">{label}</p>
            <div className="coin-select">
                <select
                    value={selected}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="">Select a token</option>
                    {options.map((coin) => (
                        <div>
                            <option key={coin.symbol} value={coin.symbol}>
                                {coin.symbol}
                            </option>
                            {/* <img src={coin.logo.src} alt="" /> */}
                        </div>
                    ))}
                </select>
                <FaChevronDown className="dropdown-icon" />
            </div>

            {selected && (
                <div className="coin-preview">
                    <img
                        src={options.find(c => c.symbol === selected).logo.src}
                        alt={selected}
                    />
                    <span>{options.find(c => c.symbol === selected).name}</span>
                </div>
            )}
        </div>
    );
};

export default CoinSelect;
