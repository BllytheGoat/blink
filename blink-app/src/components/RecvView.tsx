import { useState, useRef } from "react";

interface RecvViewProps {
  onCodeScanned: (code: string) => void;
  onCancel: () => void;
}

export default function RecvView({ onCodeScanned, onCancel }: RecvViewProps) {
  const [code, setCode] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (e) {
      alert("Camera access denied or not available");
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
      setCameraActive(false);
    }
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text.trim());
    } catch {
      alert("Paste failed. Please enter code manually.");
    }
  };

  const handleReceive = () => {
    if (code.trim().length > 0) {
      onCodeScanned(code.trim());
    }
  };

  return (
    <div className="view recv-view">
      <button className="back-button" onClick={onCancel}>
        ← Back
      </button>

      <h2 className="display-md">Receive Files</h2>

      {!cameraActive ? (
        <>
          <button className="button-primary" onClick={handleStartCamera}>
            📷 Scan QR Code
          </button>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-preview"
          />
          <button className="button-secondary" onClick={handleStopCamera}>
            Close Camera
          </button>
        </>
      )}

      <div className="divider">or</div>

      <input
        type="text"
        className="form-input"
        placeholder="Paste transfer code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button className="button-secondary" onClick={handlePasteCode}>
        Paste from Clipboard
      </button>

      <button
        className="button-primary"
        onClick={handleReceive}
        disabled={code.trim().length === 0}
      >
        Receive
      </button>
    </div>
  );
}
