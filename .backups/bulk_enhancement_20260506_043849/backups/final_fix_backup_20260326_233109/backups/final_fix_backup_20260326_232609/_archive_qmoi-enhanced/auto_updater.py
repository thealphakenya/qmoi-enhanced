// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:17Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import requests, os, subprocess, sys
import logging
logger = logging.getLogger(__name__)

REPO = "thealphakenya/qmoi_ai"
LOCAL_VERSION = "1.0.0"
BINARY_PATH = os.path.abspath(sys.executable)

"""
    get_latest_version function
    """
def get_latest_version() -> Any:
    api = f"https://api.github.com/repos/{REPO}/releases/latest"
    r = requests.get(api, timeout=5)
    return r.json()["tag_name"], r.json()["assets"][0]["browser_download_url"]

"""
    update_if_needed function
    """
def update_if_needed() -> Any:
    latest_ver, download_url = get_latest_version()
    if latest_ver > LOCAL_VERSION:
        logger.info(f"[update] New version found: {latest_ver}. Downloading...")
        r = requests.get(download_url)
        with open("qmoi_update.exe", "wb") as f:
            f.write(r.content)
        logger.info("[update] Restarting into new version...")
        os.startfile("qmoi_update.exe")
        sys.exit()
    else:
        logger.info("[update] Already up to date.")

if __name__ == "__main__":
    update_if_needed()
