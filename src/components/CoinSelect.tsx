import { FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';

const CoinSelect = ({ label, selected, onChange, options }) => {
    return (
        <div className="coin-select-wrapper">
            <p className="coin-label">{label}</p>
            <div className="coin-select relative">
                <select
                    value={selected}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full"
                >
                    <option value="">Select a token</option>
                    {options.map((coin) => (
                        <option key={coin.symbol} value={coin.symbol}>
                            {coin.symbol}
                        </option>
                    ))}
                </select>
                <FaChevronDown className="dropdown-icon absolute right-2 top-2" />
            </div>

            {selected && (
                <div className="coin-preview flex items-center gap-2 mt-2">
                    <Image
                        src={options.find(c => c.symbol === selected).logo.src}
                        alt={selected}
                        width={20}
                        height={20}
                    />
                    <span>{options.find(c => c.symbol === selected).name}</span>
                </div>
            )}
        </div>
    );
};

export default CoinSelect;
