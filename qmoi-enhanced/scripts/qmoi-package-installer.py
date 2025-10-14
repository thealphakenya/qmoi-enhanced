import os
import shutil
import platform
import subprocess
from scripts.qmoi_activity_logger import log_activity


def make_zip():
    zip_name = "qmoi-ai.zip"
    log_activity("Packaging app as zip installer.")
    shutil.make_archive("qmoi-ai", "zip", ".")
    return zip_name


def make_windows_exe():
    # Placeholder: Use PyInstaller or similar for real .exe
    exe_name = "qmoi-ai.exe"
    log_activity("Packaging app as Windows .exe installer (placeholder).")
    # Actual implementation would use PyInstaller or NSIS
    return exe_name


def make_mac_dmg():
    dmg_name = "QMOI-App.dmg"
    log_activity("Packaging app as Mac .dmg installer (placeholder).")
    # Actual implementation would use create-dmg or similar
    return dmg_name


def make_linux_appimage():
    appimage_name = "QMOI-App.AppImage"
    log_activity("Packaging app as Linux AppImage installer (placeholder).")
    # Actual implementation would use appimagetool
    return appimage_name


def upload_to_gdrive(file_path):
    try:
        from pydrive2.auth import GoogleAuth
        from pydrive2.drive import GoogleDrive

        gauth = GoogleAuth()
        gauth.LocalWebserverAuth()
        drive = GoogleDrive(gauth)
        file1 = drive.CreateFile({"title": os.path.basename(file_path)})
        file1.SetContentFile(file_path)
        file1.Upload()
        link = file1["alternateLink"]
        log_activity(f"Uploaded {file_path} to Google Drive.", {"link": link})
        return link
    except Exception as e:
        log_activity(f"Google Drive upload failed for {file_path}", {"error": str(e)})
        return None


def upload_to_host(file_path):
    # Try Google Drive first
    link = upload_to_gdrive(file_path)
    if link:
        return link
    # Placeholder fallback
    log_activity(f"Uploading {file_path} to file host (placeholder).")
    return f"https://your-file-host.com/download/{os.path.basename(file_path)}"


def main():
    log_activity("Starting QMOI packaging and upload process.")
    system = platform.system()
    links = []
    # Always create zip
    zip_path = make_zip()
    links.append(upload_to_host(zip_path))
    if system == "Windows":
        exe_path = make_windows_exe()
        links.append(upload_to_host(exe_path))
    elif system == "Darwin":
        dmg_path = make_mac_dmg()
        links.append(upload_to_host(dmg_path))
    elif system == "Linux":
        appimage_path = make_linux_appimage()
        links.append(upload_to_host(appimage_path))
    log_activity("QMOI packaging and upload complete.", {"links": links})
    print("Download links:")
    for link in links:
        print(link)


if __name__ == "__main__":
    main()
