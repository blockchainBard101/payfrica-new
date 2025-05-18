import Temp from "../../public/Temp.png";
import Pin from "../../public/Pin.png";
import Image from "next/image";
import { useGlobalState } from "@/GlobalStateProvider";

interface CardOverlayProps {
  // onClose: () => void;
  // onSelect?: (type: "temporary" | "permanent") => void;
  onTypeSelect?: (type: "temporary" | "permanent") => void;
}

const CardOverlay: React.FC<CardOverlayProps> = ({ onTypeSelect }) => {
  const { overlayStates, toggleOverlay, setCardType } = useGlobalState();

  if (!overlayStates.cardTypeSelect) return null;

  const handleTypeSelect = (type) => {
    setCardType(type);
    toggleOverlay("cardTypeSelect");
    if (onTypeSelect) onTypeSelect(type);
  };

  return (
    <div className="card-overlay-background">
      <div className="card-overlay-modal">
        <button
          className="card-overlay-close-btn"
          onClick={() => {
            toggleOverlay("cardTypeSelect");
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div className="card-overlay-title">Choose card type</div>
        <div className="card-overlay-options">
          <div
            className="card-type-option temporary"
            onClick={() => {
              handleTypeSelect("temporary");
              toggleOverlay("cardDetails");
            }}
          >
            <div className="card-type-label">Temporary</div>
            <div className="card-type-icon">
              <Image src={Temp} alt="Temporary Card Icon" />
            </div>
          </div>
          <div
            className="card-type-option permanent"
            onClick={() => handleTypeSelect("permanent")}
          >
            <div className="card-type-label">Permanent</div>
            <div className="card-type-icon">
              <Image src={Pin} alt="Permanent Card Icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardOverlay;
