import requests, os, subprocess, sys

REPO = "thealphakenya/qmoi_ai"
LOCAL_VERSION = "1.0.0"
BINARY_PATH = os.path.abspath(sys.executable)

def get_latest_version():
    api = f"https://api.github.com/repos/{REPO}/releases/latest"
    r = requests.get(api, timeout=5)
    return r.json()["tag_name"], r.json()["assets"][0]["browser_download_url"]

def update_if_needed():
    latest_ver, download_url = get_latest_version()
    if latest_ver > LOCAL_VERSION:
        print(f"[update] New version found: {latest_ver}. Downloading...")
        r = requests.get(download_url)
        with open("qmoi_update.exe", "wb") as f:
            f.write(r.content)
        print("[update] Restarting into new version...")
        os.startfile("qmoi_update.exe")
        sys.exit()
    else:
        print("[update] Already up to date.")

if __name__ == "__main__":
    update_if_needed()
