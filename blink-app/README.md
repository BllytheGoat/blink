# Blink — Secure P2P File Transfer

A high-end mobile app for secure file transfer powered by **Croc** with a **Vercel-inspired design**.

## Features

- **QR Code Support:** Generate and scan QR codes for instant file transfer setup.
- **Real-Time Progress:** Watch your transfer progress with a beautiful gradient progress bar.
- **Drag & Drop:** Drop files directly into the app.
- **Vercel Design:** Minimalist, high-performance UI based on Vercel's design system.
- **Offline-First:** Uses P2P transfer via Croc — no servers, no accounts.

## Build Instructions

### Prerequisites
- Node.js 20+
- Rust 1.70+
- Android SDK 34+
- Android NDK 27.0+

### Local Build (Desktop)

```bash
cd blink-app
npm install
npm run tauri build
```

### Cloud Build (Android APK via GitHub Actions)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial Blink"
   git remote add origin https://github.com/YOUR_USERNAME/blink.git
   git push -u origin main
   ```

2. **GitHub Actions will automatically compile the APK.**
3. **Download the APK from the Actions tab** in your GitHub repository.

## Project Structure

```
blink/
├── blink-app/
│   ├── src/                # React frontend
│   │   ├── App.tsx         # Main app logic
│   │   ├── styles.css      # Vercel design tokens
│   │   └── lib/croc.ts     # Croc bridge
│   ├── src-tauri/          # Tauri backend
│   │   ├── src/main.rs     # Rust sidecar orchestrator
│   │   └── tauri.conf.json # App config
│   └── package.json
├── .github/workflows/
│   └── build.yml           # Cloud build config
└── README.md
```

## Design System

Uses **DESIGN.md** Vercel tokens:
- **Colors:** `#171717` (ink), `#fafafa` (canvas-soft), gradient accents
- **Typography:** Inter 400/500/600, JetBrains Mono
- **Spacing:** 4px-based system
- **Components:** Minimal, high-contrast, pill-shaped CTAs

## Architecture

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Rust + Tauri v2 (spawns Croc as a sidecar)
- **Binary:** Croc v11.1.1 (ARM64 for Android)
- **State Management:** React hooks + Tauri events

## License

MIT
