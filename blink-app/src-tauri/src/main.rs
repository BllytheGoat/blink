// Blink — Rust bridge that orchestrates the `croc` Go binary as a Tauri sidecar.
// The binary does the actual P2P transfer; this layer spawns it, streams its
// stdout/stderr through Tauri events, and parses the transfer code + progress.

use std::sync::Mutex;
use tauri::{Emitter, Manager};
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tauri_plugin_shell::ShellExt;

struct AppState {
    child: Mutex<Option<CommandChild>>,
}

// croc prints the code to stderr as:  "Code is: XXXX-XXXX"
const CODE_RE: &str = r"Code is:\s*([A-Za-z0-9\-]+)";
// progress lines look like:  "sent 12.3 MB (45%)" or "received 12.3 MB (45%)"
const PROGRESS_RE: &str = r"(?:sent|received)[^\d]*(\d{1,3})%";

#[tauri::command]
fn start_send(app: tauri::AppHandle, paths: Vec<String>) -> Result<(), String> {
    let sidecar = app.shell().sidecar("croc").map_err(|e| e.to_string())?;
    let child = sidecar
        .args(["send", "--code-length", "4"])
        .args(paths)
        .spawn()
        .map_err(|e| e.to_string())?;

    app.state::<AppState>()
        .child
        .lock()
        .unwrap()
        .replace(child);

    spawn_reader(app.clone());
    Ok(())
}

#[tauri::command]
fn start_recv(app: tauri::AppHandle, code: String) -> Result<(), String> {
    let sidecar = app.shell().sidecar("croc").map_err(|e| e.to_string())?;
    let child = sidecar
        .args(["recv", code.trim()])
        .spawn()
        .map_err(|e| e.to_string())?;

    app.state::<AppState>()
        .child
        .lock()
        .unwrap()
        .replace(child);

    spawn_reader(app.clone());
    Ok(())
}

#[tauri::command]
fn cancel_transfer(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(child) = app.state::<AppState>().child.lock().unwrap().take() {
        child.kill().map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn spawn_reader(app: tauri::AppHandle) {
    let state = app.state::<AppState>();
    let child = match state.child.lock().unwrap().take() {
        Some(c) => c,
        None => return,
    };

    let (mut rx, _handle) = child.into_split();
    // keep the child alive in state is no longer needed; _handle drops at end.
    let _ = state; // state borrow released

    tauri::async_runtime::spawn(async move {
        use regex::Regex;
        let code_re = Regex::new(CODE_RE).unwrap();
        let prog_re = Regex::new(PROGRESS_RE).unwrap();

        while let Some(event) = rx.recv().await {
            let bytes = match event {
                CommandEvent::Stdout(b) | CommandEvent::Stderr(b) => b,
                CommandEvent::Terminated(_) => {
                    let _ = app.emit("croc-done", ());
                    break;
                }
                _ => continue,
            };
            let line = String::from_utf8_lossy(&bytes).to_string();

            for l in line.split('\n') {
                let l = l.trim();
                if l.is_empty() {
                    continue;
                }
                app.emit("croc-log", l.to_string()).ok();

                if let Some(cap) = code_re.captures(l) {
                    if let Some(m) = cap.get(1) {
                        app.emit("croc-code", m.as_str().to_string()).ok();
                    }
                }
                if let Some(cap) = prog_re.captures(l) {
                    if let Some(m) = cap.get(1) {
                        if let Ok(pct) = m.as_str().parse::<u32>() {
                            app.emit("croc-progress", pct).ok();
                        }
                    }
                }
            }
        }
    });
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            child: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            start_send,
            start_recv,
            cancel_transfer
        ])
        .run(tauri::generate_context!())
        .expect("error while running Blink");
}
