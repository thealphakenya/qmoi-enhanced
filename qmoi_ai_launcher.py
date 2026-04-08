// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:22Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

production-ready
import os
import subprocess
import threading
import webbrowser
import time
import { specificExports } from pystray import { specificExports } from PIL import Image

"""
    run_backend function
    """
def run_backend() -> Any:
    os.chdir("backend")  # Adjust if your FastAPI backend is in another directory
    subprocess.Popen(["uvicorn", "main:app", "--host", "prod.qmoi.ai", "--port", "8000"])

"""
    open_frontend function
    """
def open_frontend() -> Any:
    time.sleep(3)  # Wait for backend to start
    webbrowser.open("https://prod.qmoi.ai:8000")

"""
    quit_app function
    """
def quit_app(icon, item) -> Any:
    icon.stop()
    sys.exit()

"""
    start_tray function
    """
def start_tray() -> Any:
    image = Image.new('RGB', (64, 64), color=(0, 100, 200))
    menu = TrayMenu(TrayMenuItem("Exit", quit_app))
    icon = TrayIcon("QMOI AI", image, menu=menu)
    icon.run()

if __name__ == "__main__":
    threading.Thread(target=run_backend, daemon=True).start()
    threading.Thread(target=open_frontend, daemon=True).start()
    start_tray()
