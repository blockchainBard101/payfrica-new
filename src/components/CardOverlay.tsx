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
      <div className="card-type-modal">
        <button
          className="card-type-close-btn"
          onClick={() => toggleOverlay("cardTypeSelect")}
          aria-label="Close"
        >
          ×
        </button>
        <div className="card-type-title">Choose card type</div>
        <div className="card-type-options">
          <div
            className="card-type-option"
            onClick={() => {
              handleTypeSelect("temporary");
              toggleOverlay("cardDetails");
            }}
          >
            <div className="card-type-tab">Temporary</div>
            <div className="card-type-box">
              <Image
                src={Temp}
                alt="Temporary Card Icon"
                width={48}
                height={48}
              />
            </div>
          </div>
          <div
            className="card-type-option"
            onClick={() => {
              handleTypeSelect("permanent");
              toggleOverlay("cardDetails");
            }}
          >
            <div className="card-type-tab">Permanent</div>
            <div className="card-type-box">
              <Image
                src={Pin}
                alt="Permanent Card Icon"
                width={48}
                height={48}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardOverlay;
