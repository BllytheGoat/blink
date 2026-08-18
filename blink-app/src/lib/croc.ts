import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

export interface CrocEventHandlers {
  onLog?: (line: string) => void;
  onProgress?: (pct: number) => void;
  onDone?: () => void;
}

/** Spawn `croc send` for the given file paths. Returns the generated transfer code. */
export async function startSend(paths: string[]): Promise<string> {
  return await invoke<string>("send_file", { paths });
}

/** Spawn `croc recv` for a scanned / pasted code. */
export async function startRecv(code: string): Promise<void> {
  return await invoke<void>("recv_file", { code });
}

/** Kill the running sidecar. */
export async function cancelTransfer(): Promise<void> {
  return await invoke<void>("cancel_transfer");
}

/** Wire the Rust-side events to UI callbacks. Returns an unbind function. */
export async function bindCrocEvents(h: CrocEventHandlers): Promise<UnlistenFn> {
  const unLog = await listen<string>("croc-log", (e) => h.onLog?.(e.payload));
  const unProg = await listen<number>("croc-progress", (e) =>
    h.onProgress?.(e.payload)
  );
  const unDone = await listen<string>("croc-done", () => h.onDone?.());
  return () => {
    unLog();
    unProg();
    unDone();
  };
}
