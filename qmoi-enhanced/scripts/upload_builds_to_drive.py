from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
import os

APPS_DIR = "Qmoi_apps"

ga = GoogleAuth()
ga.LocalWebserverAuth()
drive = GoogleDrive(ga)

for root, _, files in os.walk(APPS_DIR):
    for file in files:
        f = drive.CreateFile({'title': file})
        f.SetContentFile(os.path.join(root, file))
        f.Upload()
        print(f"✅ Uploaded: {file}")
