import threading
import webbrowser
import requests
from fastapi import FastAPI
import uvicorn
import customtkinter as ctk

# -------------------------------
# FASTAPI BACKEND
# -------------------------------
app = FastAPI(title="QMOI AI Backend", version="1.0.0")


@app.get("/ping")
def ping():
    return {"status": "backend is alive"}


@app.get("/qmessage")
def qmessage():
    return {"message": "Hello from QMOI backend!"}


def run_backend():
    uvicorn.run(app, host="127.0.0.1", port=8080, log_level="info")


# -------------------------------
# CUSTOMTKINTER GUI
# -------------------------------
def run_gui():
    ctk.set_appearance_mode("System")
    ctk.set_default_color_theme("blue")

    root = ctk.CTk()
    root.title("QMOI AI Desktop")
    root.geometry("500x350")

    title_label = ctk.CTkLabel(
        root, text="🤖 QMOI AI Desktop", font=("Arial", 22, "bold")
    )
    title_label.pack(pady=20)

    status_label = ctk.CTkLabel(root, text="Checking backend...", font=("Arial", 14))
    status_label.pack(pady=10)

    def call_api():
        try:
            r = requests.get("http://127.0.0.1:8080/qmessage")
            if r.status_code == 200:
                status_label.configure(text="✅ " + r.json()["message"])
            else:
                status_label.configure(text="⚠️ Backend error")
        except Exception as e:
            status_label.configure(text=f"❌ Failed to connect: {e}")

    api_button = ctk.CTkButton(root, text="Call Backend", command=call_api)
    api_button.pack(pady=12)

    docs_button = ctk.CTkButton(
        root,
        text="Open Swagger UI",
        command=lambda: webbrowser.open("http://127.0.0.1:8080/docs"),
    )
    docs_button.pack(pady=12)

    exit_button = ctk.CTkButton(root, text="Exit", command=root.destroy)
    exit_button.pack(pady=30)

    root.mainloop()


# -------------------------------
# MAIN LAUNCH
# -------------------------------
if __name__ == "__main__":
    threading.Thread(target=run_backend, daemon=True).start()
    run_gui()
