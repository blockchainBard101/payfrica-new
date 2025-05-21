import { useRef, useEffect } from "react";
import { useGlobalState } from "@/GlobalStateProvider";
import WebcamCapture from "./WebcamCapture";
import jsQR from "jsqr";

const QRScanner = ({ onDetected, reset }) => {
  const hasDetected = useRef(false);

  useEffect(() => {
    hasDetected.current = false;
  }, [reset]);

  const handleScan = (imageSrc) => {
    if (hasDetected.current) return;
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
          hasDetected.current = true;
          if (onDetected) onDetected(code.data);
        }
      };
    }
  };

  return (
    <div className="scan-qr-frame-outer">
      <div className="scan-qr-frame-inner">
        <WebcamCapture onScan={handleScan} />
        {/* Corner overlays */}
        {/* <span className="corner top-left" />
        <span className="corner top-right" />
        <span className="corner bottom-left" />
        <span className="corner bottom-right" /> */}
      </div>
    </div>
  );
};

export default QRScanner;
