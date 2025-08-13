import os
import subprocess
import threading
import sys
import time
import winshell
import webbrowser
import urllib.request
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pystray import Icon as TrayIcon, Menu as TrayMenu, MenuItem as TrayMenuItem
from PIL import Image, ImageDraw, ImageFont
from win32com.client import Dispatch
import customtkinter as ctk
import uvicorn

APP_NAME = "QMOI AI"
EXE_NAME = "qmoiexe.exe"
FRONTEND_URL = "http://127.0.0.1:8000"
INSTALL_DIR = os.path.dirname(os.path.abspath(sys.executable if getattr(sys, 'frozen', False) else __file__))
CUSTOM_ICON = os.path.join(INSTALL_DIR, "public", "icon.ico")
ICON_PATH = CUSTOM_ICON if os.path.exists(CUSTOM_ICON) else os.path.join(INSTALL_DIR, "auto_qmoi_icon.ico")

# ---------------- FASTAPI BACKEND -------------------
app = FastAPI()

STATIC_DIR = os.path.join(INSTALL_DIR, "app", "out", "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
async def serve_index():
    index_path = os.path.join(INSTALL_DIR, "app", "out", "index.html")
    return FileResponse(index_path) if os.path.exists(index_path) else {"error": "Frontend not found"}

@app.get("/health")
def health():
    return {"status": "ready"}

def run_backend():
    threading.Thread(
        target=lambda: uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning"),
        daemon=True
    ).start()

def wait_for_backend(timeout_seconds: int = 10):
    for _ in range(timeout_seconds * 2):
        try:
            urllib.request.urlopen(f"{FRONTEND_URL}/health", timeout=1)
            return True
        except:
            time.sleep(0.5)
    return False

# ---------------- UI + INTEGRATIONS -------------------
def generate_icon():
    if not os.path.exists(ICON_PATH):
        try:
            icon = Image.new("RGBA", (256, 256), (30, 144, 255, 255))
            draw = ImageDraw.Draw(icon)
            try:
                font = ImageFont.truetype("arial.ttf", 128)
            except:
                font = ImageFont.load_default()
            draw.text((80, 70), "Q", fill=(255, 255, 255, 255), font=font)
            icon.save(ICON_PATH, format="ICO")
        except Exception as e:
            print(f"⚠️ Failed to generate icon: {e}")

def create_shortcut(name, path, folder):
    try:
        shortcut_path = os.path.join(folder, f"{name}.lnk")
        if not os.path.exists(shortcut_path):
            shell = Dispatch("WScript.Shell")
            shortcut = shell.CreateShortCut(shortcut_path)
            shortcut.Targetpath = path
            shortcut.WorkingDirectory = INSTALL_DIR
            shortcut.IconLocation = ICON_PATH
            shortcut.save()
            print(f"✅ Created shortcut at {shortcut_path}")
    except Exception as e:
        print(f"⚠️ Failed to create shortcut: {e}")

def create_desktop_shortcut():
    if os.path.exists(os.path.join(INSTALL_DIR, EXE_NAME)):
        create_shortcut(APP_NAME, os.path.join(INSTALL_DIR, EXE_NAME), winshell.desktop())

def add_to_startup():
    if os.path.exists(os.path.join(INSTALL_DIR, EXE_NAME)):
        create_shortcut(APP_NAME, os.path.join(INSTALL_DIR, EXE_NAME), winshell.startup())

def load_ui():
    ctk.set_appearance_mode("dark")
    app_ui = ctk.CTk()
    app_ui.geometry("1024x600")
    app_ui.title(APP_NAME)

    label = ctk.CTkLabel(app_ui, text="Welcome to QMOI Alpha AI!", font=("Segoe UI", 28))
    label.pack(pady=30)

    status_label = ctk.CTkLabel(app_ui, text="🟡 Starting backend...", font=("Segoe UI", 16))
    status_label.pack(pady=10)
    app_ui.update_idletasks()

    if wait_for_backend():
        status_label.configure(text="🟢 Backend ready at http://127.0.0.1:8000")
        browser_link = ctk.CTkTextbox(app_ui, width=950, height=400)
        browser_link.insert("0.0", f"Open this in browser manually:\n{FRONTEND_URL}")
        browser_link.configure(state="disabled")
        browser_link.pack(pady=10)
    else:
        status_label.configure(text="🔴 Backend failed to start.")

    open_browser_btn = ctk.CTkButton(app_ui, text="Open in Browser", command=lambda: webbrowser.open(FRONTEND_URL))
    open_browser_btn.pack(pady=20)

    # Optional: platform-specific UI adjustments
    try:
        subprocess.run([sys.executable, "scripts/platform-ui-adapter.py", "--platform=windows"], check=False)
    except:
        print("⚠️ UI adaptation script failed or missing.")

    app_ui.mainloop()

def quit_app(icon, item):
    icon.stop()
    os._exit(0)

def open_ui(icon, item):
    threading.Thread(target=load_ui, daemon=True).start()

def start_tray():
    try:
        icon_image = Image.open(ICON_PATH).resize((64, 64))
    except:
        icon_image = Image.new("RGB", (64, 64), color=(30, 144, 255))
    tray_menu = TrayMenu(
        TrayMenuItem("Open UI", open_ui),
        TrayMenuItem("Exit", quit_app)
    )
    icon = TrayIcon(APP_NAME, icon_image, menu=tray_menu)
    icon.run()

# ---------------- MAIN -------------------
def main():
    generate_icon()
    run_backend()
    threading.Thread(target=start_tray, daemon=True).start()
    create_desktop_shortcut()
    add_to_startup()
    load_ui()

if __name__ == "__main__":
    main()
