import customtkinter as ctk
import platform
import sys


def main_gui():
    ctk.set_appearance_mode("dark")
    app = ctk.CTk()
    app.geometry("500x300")
    app.title("✅ QMOI AI Launcher")

    label = ctk.CTkLabel(app, text="QMOI AI is running!", font=ctk.CTkFont(size=18))
    label.pack(pady=20)

    info = f"Platform: {platform.system()} ({platform.architecture()[0]})\nPython: {sys.version.split()[0]}"
    label2 = ctk.CTkLabel(app, text=info)
    label2.pack(pady=10)

    app.mainloop()


if __name__ == "__main__":
    main_gui()
