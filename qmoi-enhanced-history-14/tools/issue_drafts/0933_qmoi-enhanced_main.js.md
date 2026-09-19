---
title: "Issue draft for qmoi-enhanced/main.js"
generated: 2025-11-08T16:06:38.800197Z
---

# Review needed: qmoi-enhanced/main.js

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:42.040985Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:42.040985Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:42.040985Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const net = require('net');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let tray;
let pythonProcess;

function getIconPath() {
  const icoPath = path.join(__dirname, 'icons', 'icon.ico');
  const pngPath = path.join(__dirname, 'icons', 'icon.png');
  const icnsPath = path.join(__dirname, 'icons', 'icon.icns');
  if (process.platform === 'win32' && fs.existsSync(icoPath)) return icoPath;
  if (process.platform === 'darwin' && fs.existsSync(icnsPath)) return icnsPath;
  if (fs.existsSync(pngPath)) return pngPath;
  return null;
}

function waitForPort(port, callback, timeout = 20000) {
  const start = Date.now();
  const interval = setInterval(() => {
    const client = net.createConnection({ port }, () => {
      clearInterval(interval);
      client.end();
      callback();
    });
    client.on('error', () => {
      if (Date.now() - start > timeout) {
        clearInterval(interval);
        console.error(`[QMOI] Backend not responding on port ${port}`);
      }
    });
  }, 500);
}

function createTray() {
  const trayIconPath = getIconPath();
  tray = new Tray(trayIconPath ? nativeImage.createFromPath(trayIconPath) : undefined);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show QMOI AI', click: () => mainWindow?.show() },
    { label: 'Exit', click: () => app.quit() },
  ]);
  tray.setToolTip('QMOI AI');
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  const iconPath = getIconPath();
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath ? nativeImage.createFromPath(iconPath) : undefined,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'QMOI AI',
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL('http://localhost:8000').catch(() => {
    mainWindow.loa
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
