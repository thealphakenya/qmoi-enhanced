import os
import requests
from qmoi_activity_logger import log_activity
import time

GITHUB_REPO = "thealphakenya/Alpha-Q-ai"  # Update if repo name changes
APK_NAME = "qmoi ai.apk"
TARGET_DIR = "Qmoi_apps/android"
TARGET_FILE = APK_NAME
MIN_APK_SIZE = 1 * 1024 * 1024  # 1MB
RETRY_COUNT = 3
RETRY_DELAY = 5  # seconds


def ensure_download_dir(platform, version="latest"):
    dir_path = os.path.join("Qmoi_downloaded_apps", platform, version)
    os.makedirs(dir_path, exist_ok=True)
    return dir_path


def is_valid_apk(path):
    return os.path.exists(path) and os.path.getsize(path) > MIN_APK_SIZE


def get_latest_github_release_info():
    api_url = f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest"
    try:
        r = requests.get(api_url, timeout=10)
        r.raise_for_status()
        data = r.json()
        version = data.get("tag_name", "latest")
        for asset in data.get("assets", []):
            if asset["name"].lower() == APK_NAME:
                return version, asset["browser_download_url"]
    except Exception as e:
        log_activity("Failed to fetch latest GitHub APK URL", {"error": str(e)})
    return None, None


def download_apk(url, path):
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            log_activity(f"Attempt {attempt}: Downloading {APK_NAME}", {"url": url})
            r = requests.get(url, stream=True, timeout=30)
            r.raise_for_status()
            with open(path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            if is_valid_apk(path):
                log_activity(f"Successfully downloaded {APK_NAME}", {"path": path})
                print(f"Success: {path}")
                return True
            else:
                log_activity(
                    f"APK too small after download", {"size": os.path.getsize(path)}
                )
        except Exception as e:
            log_activity(
                f"Error downloading {APK_NAME}", {"error": str(e), "attempt": attempt}
            )
            print(f"Error: {e} (attempt {attempt})")
        time.sleep(RETRY_DELAY)
    return False


# Main logic
version, url = get_latest_github_release_info()
if not url:
    print("Could not find a valid APK download URL from GitHub.")
else:
    # Remove 'v' prefix if present for folder naming
    version_folder = version.lstrip("v") if version else "latest"
    # Download to both latest and versioned folders
    download_dirs = [
        ensure_download_dir("android", "latest"),
        ensure_download_dir("android", version_folder),
    ]
    apk_paths = [os.path.join(d, "qmoi_ai.apk") for d in download_dirs]
    # Download to 'latest' first, then copy to versioned if successful
    if download_apk(url, apk_paths[0]):
        # Copy to versioned folder if not the same as latest
        if apk_paths[0] != apk_paths[1]:
            try:
                import shutil

                shutil.copy2(apk_paths[0], apk_paths[1])
                log_activity(
                    "Copied APK to versioned folder",
                    {"from": apk_paths[0], "to": apk_paths[1]},
                )
                print(f"Also saved: {apk_paths[1]}")
            except Exception as e:
                log_activity(
                    "Failed to copy APK to versioned folder", {"error": str(e)}
                )
    else:
        print("Failed to download a valid APK after retries.")
