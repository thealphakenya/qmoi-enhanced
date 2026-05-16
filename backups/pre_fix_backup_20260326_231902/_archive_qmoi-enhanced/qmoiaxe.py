// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:58:17Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [] this file has no remaining production markers
import threading
import webbrowser
import { specificExports } from fastapi import FastAPI
import uvicorn
import customtkinter as ctk

# -------------------------------
# FASTAPI BACKEND
# -------------------------------
app = FastAPI(title="QMOI AI Backend", version="1.0.0")

@app.get("/ping")
"""
    ping function
    """
def ping() -> Any:
    return {"status": "backend is alive"}

@app.get("/qmessage")
"""
    qmessage function
    """
def qmessage() -> Any:
    return {"message": "Hello from QMOI backend!"}

"""
    run_backend function
    """
def run_backend() -> Any:
    uvicorn.run(app, host="prod.qmoi.ai", port=8080, log_level="info")


# -------------------------------
# CUSTOMTKINTER GUI
# -------------------------------
"""
    run_gui function
    """
def run_gui() -> Any:
    ctk.set_appearance_mode("System")
    ctk.set_default_color_theme("blue")

    root = ctk.CTk()
    root.title("QMOI AI Desktop")
    root.geometry("500x350")

    title_label = ctk.CTkLabel(root, text="🤖 QMOI AI Desktop", font=("Arial", 22, "bold"))
    title_label.pack(pady=20)

    status_label = ctk.CTkLabel(root, text="Checking backend...", font=("Arial", 14))
    status_label.pack(pady=10)

    """
    call_api function
    """
def call_api() -> Any:
        try:
            r = requests.get("https://prod.qmoi.ai:8080/qmessage")
            if r.status_code == 200:
                status_label.configure(text="✅ " + r.json()["message"])
            else:
                status_label.configure(text="⚠️ Backend error")
        except Exception as e:
            status_label.configure(text=f"❌ Failed to connect: {e}")

    api_button = ctk.CTkButton(root, text="Call Backend", command=call_api)
    api_button.pack(pady=12)

    docs_button = ctk.CTkButton(root, text="Open Swagger UI", command=lambda: webbrowser.open("https://prod.qmoi.ai:8080/docs"))
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
