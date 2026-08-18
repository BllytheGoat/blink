import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { startSend, startRecv, bindCrocEvents, cancelTransfer } from "./lib/croc";
import QRCode from "qrcode.react";
import SendView from "./components/SendView";
import RecvView from "./components/RecvView";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState<"idle" | "send" | "recv">("idle");
  const [transferCode, setTransferCode] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const unsubscribe = bindCrocEvents({
      onLog: (line) => setLogs((prev) => [...prev.slice(-9), line]),
      onProgress: (pct) => setProgress(pct),
      onDone: () => {
        setIsDone(true);
        setTimeout(() => {
          setMode("idle");
          setTransferCode("");
          setProgress(0);
          setLogs([]);
          setIsDone(false);
        }, 2000);
      },
    });

    return () => {
      unsubscribe.then((fn) => fn());
    };
  }, []);

  const handleSendFile = async (paths: string[]) => {
    setMode("send");
    setProgress(0);
    setLogs([]);
    setIsDone(false);
    try {
      const code = await startSend(paths);
      setTransferCode(code);
    } catch (e) {
      setLogs([(e as Error).message]);
    }
  };

  const handleRecvCode = async (code: string) => {
    setMode("recv");
    setProgress(0);
    setLogs([]);
    setIsDone(false);
    try {
      await startRecv(code);
    } catch (e) {
      setLogs([(e as Error).message]);
    }
  };

  const handleCancel = async () => {
    await cancelTransfer();
    setMode("idle");
    setTransferCode("");
    setProgress(0);
    setLogs([]);
    setIsDone(false);
  };

  return (
    <div className="app">
      {mode === "idle" && (
        <div className="idle-screen">
          <div className="hero">
            <h1 className="display-xl">Blink</h1>
            <p className="body-lg">
              Secure, P2P file transfer. No accounts. No limits.
            </p>
          </div>

          <div className="cta-row">
            <button
              className="button-primary"
              onClick={() => setMode("send")}
            >
              Send
            </button>
            <button
              className="button-secondary"
              onClick={() => setMode("recv")}
            >
              Receive
            </button>
          </div>
        </div>
      )}

      {mode === "send" && (
        <SendView onFilesSelected={handleSendFile} onCancel={handleCancel} />
      )}

      {mode === "recv" && (
        <RecvView onCodeScanned={handleRecvCode} onCancel={handleCancel} />
      )}

      {(mode === "send" || mode === "recv") && (
        <div className="transfer-overlay">
          <div className="transfer-card">
            {transferCode && (
              <div className="qr-section">
                <p className="caption-mono">Transfer Code</p>
                <QRCode
                  value={transferCode}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <p className="code-display">{transferCode}</p>
              </div>
            )}

            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="progress-text">{progress}%</p>
            </div>

            <div className="logs">
              {logs.map((log, i) => (
                <p key={i} className="log-line">
                  {log}
                </p>
              ))}
            </div>

            {isDone && <p className="done-message">✓ Transfer Complete</p>}

            {!isDone && (
              <button className="button-secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
