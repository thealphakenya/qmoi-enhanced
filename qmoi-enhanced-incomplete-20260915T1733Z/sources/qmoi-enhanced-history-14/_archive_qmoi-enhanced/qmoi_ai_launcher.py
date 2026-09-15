import os
import subprocess
import threading
import webbrowser
import time
import sys
from pystray import Icon as TrayIcon, Menu as TrayMenu, MenuItem as TrayMenuItem
from PIL import Image

def run_backend():
    os.chdir("backend")  # Adjust if your FastAPI backend is in another directory
    subprocess.Popen(["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"])

def open_frontend():
    time.sleep(3)  # Wait for backend to start
    webbrowser.open("http://127.0.0.1:8000")

def quit_app(icon, item):
    icon.stop()
    sys.exit()

def start_tray():
    image = Image.new('RGB', (64, 64), color=(0, 100, 200))
    menu = TrayMenu(TrayMenuItem("Exit", quit_app))
    icon = TrayIcon("QMOI AI", image, menu=menu)
    icon.run()

if __name__ == "__main__":
    threading.Thread(target=run_backend, daemon=True).start()
    threading.Thread(target=open_frontend, daemon=True).start()
    start_tray()
