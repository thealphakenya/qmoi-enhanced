import os
import subprocess
import threading
import webbrowser
import sys
import time
import logging
from pathlib import Path
import urllib.request

# Windows-only optional imports (deferred to runtime)
try:
    if os.name == 'nt':
        import winshell  # type: ignore
        from win32com.client import Dispatch  # type: ignore
        from pystray import Icon as TrayIcon, Menu as TrayMenu, MenuItem as TrayMenuItem  # type: ignore
        from PIL import Image, ImageDraw  # type: ignore
    else:
        # Supply minimal PIL imports if available for icon generation on non-Windows
        try:
            from PIL import Image, ImageDraw  # type: ignore
        except Exception:
            Image = None
            ImageDraw = None
except Exception:
    # Graceful fallback if optional modules are missing
    Image = None
    ImageDraw = None
    TrayIcon = None
    TrayMenu = None
    TrayMenuItem = None
    winshell = None
    Dispatch = None

APP_NAME = "QMOI AI"
EXE_NAME = "qmoiexe.exe"

# Attempt to use provided icon or fallback to a repo-local file
ROOT = Path(__file__).resolve().parents[0]
CUSTOM_ICON = Path(r"D:/applications/Alpha-Q-ai/icon.ico")
ICON_PATH = (CUSTOM_ICON if CUSTOM_ICON.exists() else (ROOT / "auto_qmoi_icon.ico")).resolve()

# Installation directory (either frozen executable or source file location)
INSTALL_DIR = str(Path(sys.executable).parent if getattr(sys, 'frozen', False) else Path(__file__).resolve().parent)
FRONTEND_URL = "http://127.0.0.1:8000"

LOG_DIR = Path(INSTALL_DIR) / '.qmoi_logs'
LOG_DIR.mkdir(parents=True, exist_ok=True)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s',
                    handlers=[logging.FileHandler(LOG_DIR / 'qmoiexe.log'), logging.StreamHandler(sys.stdout)])

def generate_icon():
    try:
        if Image is None or ImageDraw is None:
            logging.info('PIL not available; skipping icon generation')
            return
        if not ICON_PATH.exists():
            logging.info('🛠 Generating fallback icon...')
            icon = Image.new("RGBA", (256, 256), (30, 144, 255, 255))  # DodgerBlue background
            draw = ImageDraw.Draw(icon)
            draw.text((90, 110), "Q", fill=(255, 255, 255, 255))  # Centered "Q"
            icon.save(ICON_PATH, format="ICO")
            logging.info('✅ Icon generated: %s', str(ICON_PATH))
    except Exception as e:
        logging.exception('Failed to generate icon: %s', e)

def run_backend():
    backend_path = Path(INSTALL_DIR) / "backend"
    if not backend_path.exists():
        logging.info('❌ backend/ directory missing, creating...')
        backend_path.mkdir(parents=True, exist_ok=True)

    main_file = backend_path / "main.py"
    if not main_file.exists():
        logging.warning('⚠️ Created minimal FastAPI backend as [PRODUCTION IMPLEMENTATION REQUIRED].')
        main_file.write_text("""# FastAPI backend implementation
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return {'status': 'ready'}
""")

    # Start Uvicorn using the same Python interpreter if available
    try:
        cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]
        logf = open(LOG_DIR / 'uvicorn.log', 'a')
        logging.info('Starting backend: %s', ' '.join(cmd))
        subprocess.Popen(cmd, cwd=str(backend_path), stdout=logf, stderr=logf)
    except Exception as e:
        logging.exception('Failed to start backend uvicorn: %s', e)

def open_frontend():
    logging.info('🌐 Waiting for frontend to be available...')
    for _ in range(40):  # Up to ~20s
        try:
            urllib.request.urlopen(FRONTEND_URL, timeout=1)
            webbrowser.open(FRONTEND_URL)
            logging.info('✅ Frontend launched.')
            return
        except Exception:
            time.sleep(0.5)
    logging.warning('⚠️ Frontend not reachable after timeout.')

def create_desktop_shortcut():
    if os.name != 'nt' or winshell is None or Dispatch is None:
        logging.info('Desktop shortcut creation skipped: Windows-only feature or dependency missing')
        return
    try:
        desktop = winshell.desktop()
        shortcut_path = os.path.join(desktop, f"{APP_NAME}.lnk")
        target = os.path.join(INSTALL_DIR, EXE_NAME)
        if not os.path.exists(shortcut_path):
            shell = Dispatch('WScript.Shell')
            shortcut = shell.CreateShortCut(shortcut_path)
            shortcut.Targetpath = target
            shortcut.WorkingDirectory = INSTALL_DIR
            shortcut.IconLocation = str(ICON_PATH)
            shortcut.save()
            logging.info('🖥️ Desktop shortcut created.')
    except Exception as e:
        logging.exception('Failed to create desktop shortcut: %s', e)

def add_to_startup():
    if os.name != 'nt' or winshell is None or Dispatch is None:
        logging.info('Add to startup skipped: Windows-only feature or dependency missing')
        return
    try:
        startup = winshell.startup()
        shortcut_path = os.path.join(startup, f"{APP_NAME}.lnk")
        target = os.path.join(INSTALL_DIR, EXE_NAME)
        if not os.path.exists(shortcut_path):
            shell = Dispatch('WScript.Shell')
            shortcut = shell.CreateShortCut(shortcut_path)
            shortcut.Targetpath = target
            shortcut.WorkingDirectory = INSTALL_DIR
            shortcut.IconLocation = str(ICON_PATH)
            shortcut.save()
            logging.info('🔁 Added to system startup.')
    except Exception as e:
        logging.exception('Failed to add to startup: %s', e)

def quit_app(icon, item):
    logging.info('🛑 Exiting QMOI...')
    try:
        icon.stop()
    except Exception:
        pass
    sys.exit()

def start_tray():
    if os.name != 'nt' or TrayIcon is None or Image is None:
        logging.info('Tray not available on this platform or pystray/PIL missing; running without tray')
        # Keep process alive while backend runs
        try:
            while True:
                time.sleep(60)
        except KeyboardInterrupt:
            logging.info('Interrupted, exiting')
            sys.exit(0)
    try:
        icon_image = Image.open(str(ICON_PATH)).resize((64, 64))
        icon = TrayIcon(APP_NAME, icon_image, menu=TrayMenu(TrayMenuItem("Exit", quit_app)))
        logging.info('📌 QMOI Tray ready.')
        icon.run()
    except Exception as e:
        logging.exception('Failed to start tray icon: %s', e)
        # fallback: block to keep threads alive
        try:
            while True:
                time.sleep(60)
        except KeyboardInterrupt:
            logging.info('Interrupted, exiting')
            sys.exit(0)

def main():
    generate_icon()
    # Start backend and frontend helper threads
    threading.Thread(target=run_backend, daemon=True).start()
    threading.Thread(target=open_frontend, daemon=True).start()

    # Desktop integration only on Windows and only if dependencies present
    try:
        create_desktop_shortcut()
    except Exception:
        logging.exception('create_desktop_shortcut failed')
    try:
        add_to_startup()
    except Exception:
        logging.exception('add_to_startup failed')

    start_tray()

if __name__ == "__main__":
    main()
