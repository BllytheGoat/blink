import { useState } from "react";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { listen } from "@tauri-apps/api/event";

interface SendViewProps {
  onFilesSelected: (paths: string[]) => void;
  onCancel: () => void;
}

export default function SendView({ onFilesSelected, onCancel }: SendViewProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    // In a web context, we'd use e.dataTransfer.files
    // For Tauri, we listen to the tauri://file-drop event
    const unsubscribe = await listen<string[]>("tauri://file-drop", (e) => {
      setFiles((prev) => [...prev, ...e.payload]);
    });

    return unsubscribe;
  };

  const handleStart = () => {
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  return (
    <div className="view send-view">
      <button className="back-button" onClick={onCancel}>
        ← Back
      </button>

      <h2 className="display-md">Send Files</h2>

      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p className="body-md">Drag files here or tap to browse</p>
      </div>

      <div className="file-list">
        {files.map((f, i) => (
          <div key={i} className="file-item">
            <span className="body-sm">{f.split("/").pop()}</span>
            <button
              className="remove-btn"
              onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        className="button-primary"
        onClick={handleStart}
        disabled={files.length === 0}
      >
        Send {files.length > 0 ? `(${files.length})` : ""}
      </button>
    </div>
  );
}
