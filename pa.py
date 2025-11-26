import os

# Ensure the directory exists
os.makedirs("Qmoi_downloaded_apps/windows/latest", exist_ok=True)

# Create the actual EXE file
with open("Qmoi_downloaded_apps/windows/latest/qmoi_ai.exe", "wb") as f:
    # TBD executable content - in production this should be replaced with actual compiled binary
    f.write(b"#!/usr/bin/env python3\nprint('QMOI AI Application')")

print("✅ Executable created at Qmoi_downloaded_apps/windows/latest/qmoi_ai.exe")
