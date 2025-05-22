import React, { useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onScan }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      onScan(imageSrc);
    }
  }, [onScan]);

  useEffect(() => {
    const timer = setInterval(() => {
      capture();
    }, 500);
    return () => clearInterval(timer);
  }, [capture]);

  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: "environment",
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onClick={() => capture()}
        style={{ width: "100%", borderRadius: "16px" }}
      />
    </div>
  );
};

export default WebcamCapture;
