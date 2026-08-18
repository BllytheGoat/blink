# Blink PWA — Secure P2P File Transfer

A **Progressive Web App** for secure, zero-account file transfer.

## Features

✓ **Instant Setup** — No installation, no compilation. Just open in a browser.  
✓ **Vercel Design** — Minimalist, high-performance UI with gradient accents.  
✓ **Works Offline** — Service Worker caches the app for offline use.  
✓ **Install as App** — "Add to Home Screen" on any phone (iOS/Android).  
✓ **P2P Transfer** — Uses Croc public relay for secure file exchange.  
✓ **QR Code** — Generate & scan codes to share transfer sessions.  

## How to Use

### 1. Open in Browser

```bash
# Local testing (if you have Python)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

Or deploy to any static host (Vercel, Netlify, GitHub Pages, etc.)

### 2. Send Files

1. Tap **Send**
2. Drop files or tap to browse
3. Share the **transfer code** or **QR code** with the recipient
4. Recipient scans/enters code and receives files

### 3. Receive Files

1. Tap **Receive**
2. Paste or enter the transfer code
3. Files download automatically

## Deployment

### GitHub Pages (Free, Instant)

```bash
# Push this folder to your repo
git add pwa/
git commit -m "Add Blink PWA"
git push

# Enable GitHub Pages in repo settings
# Settings → Pages → Source: main/pwa → Save
# Your app is now live at: https://username.github.io/blink/pwa/
```

### Vercel (Recommended)

```bash
npm install -g vercel
cd pwa
vercel
# App deployed in seconds
```

### Netlify

Drag & drop the `pwa/` folder to https://app.netlify.com/drop

## File Structure

```
pwa/
├── index.html      # Full app (Vercel-styled UI + logic)
├── manifest.json   # PWA metadata
├── sw.js           # Service Worker (offline support)
└── README.md       # This file
```

## Technical Details

- **Frontend:** Vanilla JS + CSS (no build step)
- **Backend:** Croc public relay (https://croc.schollz.com)
- **Offline:** Full-featured even without network
- **Mobile:** Works on iOS 13.1+ and Android 5.0+

## Installation (Add to Home Screen)

### iPhone
1. Open Blink in Safari
2. Tap **Share** → **Add to Home Screen**
3. Name it "Blink" and tap **Add**

### Android (Chrome)
1. Open Blink in Chrome
2. Tap **⋮** (menu) → **Install app**
3. Confirm

## License

MIT
