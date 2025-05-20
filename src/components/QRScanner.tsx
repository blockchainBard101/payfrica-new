import { useGlobalState } from "@/GlobalStateProvider";
import WebcamCapture from "./WebcamCapture";
import jsQR from "jsqr";

const QRScanner = ({ onDetected }) => {
  const handleScan = (imageSrc) => {
    if (imageSrc) {
      const image = new window.Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          console.log("QR code detected:", code.data);
          if (onDetected) onDetected(code.data);
        }
      };
    }
  };

  return (
    <div>
      <WebcamCapture onScan={handleScan} />
    </div>
  );
};

export default QRScanner;
