import os, subprocess, threading, webbrowser, sys, time, winshell
from win32com.client import Dispatch
from pystray import Icon as TrayIcon, Menu as TrayMenu, MenuItem as TrayMenuItem
from PIL import Image, ImageDraw

APP_NAME = "QMOI AI"
EXE_NAME = "qmoi ai.exe"
ICON_PATH = os.path.join(os.getcwd(), "qmoi_ai_icon.ico")
INSTALL_DIR = os.path.dirname(os.path.abspath(sys.executable if getattr(sys, 'frozen', False) else __file__))
FRONTEND_URL = "http://127.0.0.1:8000"

def generate_icon():
    if not os.path.exists(ICON_PATH):
        icon = Image.new("RGBA", (256, 256), (0, 102, 204, 255))
        draw = ImageDraw.Draw(icon)
        draw.text((110, 110), "Q", fill=(255, 255, 255, 255))
        icon.save(ICON_PATH, format="ICO")

def run_backend():
    os.chdir(os.path.join(INSTALL_DIR, "backend"))
    subprocess.Popen(["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"])

def open_frontend():
    time.sleep(5)
    webbrowser.open(FRONTEND_URL)

def create_desktop_shortcut():
    desktop = winshell.desktop()
    path = os.path.join(desktop, f"{APP_NAME}.lnk")
    target = os.path.join(INSTALL_DIR, EXE_NAME)
    if not os.path.exists(path):
        shell = Dispatch('WScript.Shell')
        shortcut = shell.CreateShortCut(path)
        shortcut.Targetpath = target
        shortcut.WorkingDirectory = INSTALL_DIR
        shortcut.IconLocation = ICON_PATH
        shortcut.save()

def add_to_startup():
    startup = winshell.startup()
    shortcut_path = os.path.join(startup, f"{APP_NAME}.lnk")
    target = os.path.join(INSTALL_DIR, EXE_NAME)
    if not os.path.exists(shortcut_path):
        shell = Dispatch("WScript.Shell")
        shortcut = shell.CreateShortCut(shortcut_path)
        shortcut.Targetpath = target
        shortcut.WorkingDirectory = INSTALL_DIR
        shortcut.IconLocation = ICON_PATH
        shortcut.save()

def quit_app(icon, item):
    icon.stop()
    sys.exit()

def start_tray():
    icon_image = Image.open(ICON_PATH).resize((64, 64))
    icon = TrayIcon(APP_NAME, icon_image, menu=TrayMenu(TrayMenuItem("Exit", quit_app)))
    icon.run()

def main():
    generate_icon()
    threading.Thread(target=run_backend, daemon=True).start()
    threading.Thread(target=open_frontend, daemon=True).start()
    create_desktop_shortcut()
    add_to_startup()
    start_tray()

if __name__ == "__main__":
    main()
