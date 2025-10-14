import os
import requests
from qmoi_activity_logger import log_activity

GITHUB_REPO = "thealphakenya/Alpha-Q-ai"
APPIMAGE_NAME = "qmoi ai.AppImage"
MIN_APPIMAGE_SIZE = 1 * 1024 * 1024  # 1MB
RETRY_COUNT = 3
RETRY_DELAY = 5


def ensure_download_dir(platform, version="latest"):
    dir_path = os.path.join("Qmoi_downloaded_apps", platform, version)
    os.makedirs(dir_path, exist_ok=True)
    return dir_path


def is_valid_appimage(path):
    return os.path.exists(path) and os.path.getsize(path) > MIN_APPIMAGE_SIZE


def get_latest_github_release_info():
    api_url = f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest"
    try:
        r = requests.get(api_url, timeout=10)
        r.raise_for_status()
        data = r.json()
        version = data.get("tag_name", "latest")
        for asset in data.get("assets", []):
            if asset["name"].lower() == APPIMAGE_NAME.lower():
                return version, asset["browser_download_url"]
    except Exception as e:
        log_activity("Failed to fetch latest GitHub AppImage URL", {"error": str(e)})
    return None, None


def download_appimage(url, path):
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            log_activity(
                f"Attempt {attempt}: Downloading {APPIMAGE_NAME}", {"url": url}
            )
            r = requests.get(url, stream=True, timeout=30)
            r.raise_for_status()
            with open(path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            if is_valid_appimage(path):
                log_activity(f"Successfully downloaded {APPIMAGE_NAME}", {"path": path})
                print(f"Success: {path}")
                return True
            else:
                log_activity(
                    f"AppImage too small after download",
                    {"size": os.path.getsize(path)},
                )
        except Exception as e:
            log_activity(
                f"Error downloading {APPIMAGE_NAME}",
                {"error": str(e), "attempt": attempt},
            )
            print(f"Error: {e} (attempt {attempt})")
        import time

        time.sleep(RETRY_DELAY)
    return False


# Main logic
version, url = get_latest_github_release_info()
if not url:
    print("Could not find a valid AppImage download URL from GitHub.")
else:
    version_folder = version.lstrip("v") if version else "latest"
    download_dirs = [
        ensure_download_dir("linux", "latest"),
        ensure_download_dir("linux", version_folder),
    ]
    appimage_paths = [os.path.join(d, "qmoi_ai.appimage") for d in download_dirs]
    if download_appimage(url, appimage_paths[0]):
        if appimage_paths[0] != appimage_paths[1]:
            try:
                import shutil

                shutil.copy2(appimage_paths[0], appimage_paths[1])
                log_activity(
                    "Copied AppImage to versioned folder",
                    {"from": appimage_paths[0], "to": appimage_paths[1]},
                )
                print(f"Also saved: {appimage_paths[1]}")
            except Exception as e:
                log_activity(
                    "Failed to copy AppImage to versioned folder", {"error": str(e)}
                )
    else:
        print("Failed to download a valid AppImage after retries.")
