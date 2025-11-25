# NOTE: 3 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import os

# Ensure the directory exists
os.makedirs("Qmoi_downloaded_apps/windows/latest", exist_ok=True)

# Create a placeholder EXE file for testing (replace with real build artifact in production)
with open("Qmoi_downloaded_apps/windows/latest/qmoi_ai.exe", "wb") as f:
    f.write(b"This is a placeholder EXE file for testing.")

print("✅ Placeholder EXE created at Qmoi_downloaded_apps/windows/latest/qmoi_ai.exe")
