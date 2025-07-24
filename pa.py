import os

# Ensure the directory exists
os.makedirs("Qmoi_downloaded_apps/windows/latest", exist_ok=True)

# Create the placeholder EXE file
with open("Qmoi_downloaded_apps/windows/latest/qmoi_ai.exe", "wb") as f:
    f.write(b"This is a placeholder EXE file for testing.")

print("✅ Placeholder EXE created at Qmoi_downloaded_apps/windows/latest/qmoi_ai.exe")
