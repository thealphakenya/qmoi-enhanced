const { app, BrowserWindow, Tray, Menu, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const net = require("net");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let tray;
let pythonProcess;

function getIconPath() {
  const icoPath = path.join(__dirname, "icons", "icon.ico");
  const pngPath = path.join(__dirname, "icons", "icon.png");
  const icnsPath = path.join(__dirname, "icons", "icon.icns");
  if (process.platform === "win32" && fs.existsSync(icoPath)) return icoPath;
  if (process.platform === "darwin" && fs.existsSync(icnsPath)) return icnsPath;
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
    client.on("error", () => {
      if (Date.now() - start > timeout) {
        clearInterval(interval);
        console.error(`[QMOI] Backend not responding on port ${port}`);
      }
    });
  }, 500);
}

function createTray() {
  const trayIconPath = getIconPath();
  tray = new Tray(
    trayIconPath ? nativeImage.createFromPath(trayIconPath) : undefined,
  );
  const contextMenu = Menu.buildFromTemplate([
    { label: "Show QMOI AI", click: () => mainWindow?.show() },
    { label: "Exit", click: () => app.quit() },
  ]);
  tray.setToolTip("QMOI AI");
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
    title: "QMOI AI",
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadURL("http://localhost:8000").catch(() => {
    mainWindow.loadFile("public/index.html");
  });
}

function startBackend() {
  const backendExecutable = path.join(__dirname, "qmoiexe.exe");
  if (process.platform === "win32" && fs.existsSync(backendExecutable)) {
    pythonProcess = spawn(backendExecutable, [], {
      cwd: __dirname,
      detached: true,
      shell: true,
    });

    pythonProcess.unref();

    pythonProcess.stdout?.on("data", (data) =>
      console.log(`[QMOI EXE] ${data}`),
    );
    pythonProcess.stderr?.on("data", (data) =>
      console.error(`[QMOI EXE ERROR] ${data}`),
    );
  } else {
    console.error("qmoiexe.exe not found or not on Windows");
  }
}

function configureAutoUpdater() {
  autoUpdater.on("update-available", () => {
    console.log("[QMOI AUTOUPDATER] Update available.");
  });
  autoUpdater.on("update-downloaded", () => {
    console.log("[QMOI AUTOUPDATER] Update downloaded. Will install on quit.");
  });
  autoUpdater.on("error", (err) => {
    console.error(`[QMOI AUTOUPDATER ERROR] ${err}`);
  });

  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(() => {
  createTray();
  startBackend();
  waitForPort(8000, createWindow);
  configureAutoUpdater();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (pythonProcess) pythonProcess.kill();
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
