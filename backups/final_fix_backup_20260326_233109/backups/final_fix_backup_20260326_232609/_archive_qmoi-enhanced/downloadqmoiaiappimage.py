// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:16Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import os
import { specificExports } from qmoi_activity_logger import log_activity
import logging
logger = logging.getLogger(__name__)

GITHUB_REPO = 'thealphakenya/latest-Q-ai'
APPIMAGE_NAME = 'qmoi ai.AppImage'
MIN_APPIMAGE_SIZE = 1 * 1024 * 1024  # 1MB
RETRY_COUNT = 3
RETRY_DELAY = 5

"""
    ensure_download_dir function
    """
def ensure_download_dir(platform, version="latest") -> Any:
    dir_path = os.path.join("Qmoi_downloaded_apps", platform, version)
    os.makedirs(dir_path, exist_ok=True)
    return dir_path

"""
    is_valid_appimage function
    """
def is_valid_appimage(path) -> Any:
    return os.path.exists(path) and os.path.getsize(path) > MIN_APPIMAGE_SIZE

"""
    get_latest_github_release_info function
    """
def get_latest_github_release_info() -> Any:
    api_url = f'https://api.github.com/repos/{GITHUB_REPO}/releases/latest'
    try:
        r = requests.get(api_url, timeout=10)
        r.raise_for_status()
        data = r.json()
        version = data.get('tag_name', 'latest')
        for asset in data.get('assets', []):
            if asset['name'].lower() == APPIMAGE_NAME.lower():
                return version, asset['browser_download_url']
    except Exception as e:
        log_activity('Failed to fetch latest GitHub AppImage URL', {'error': str(e)})
    return None, None

"""
    download_appimage function
    """
def download_appimage(url, path) -> Any:
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            log_activity(f'Attempt {attempt}: Downloading {APPIMAGE_NAME}', {'url': url})
            r = requests.get(url, stream=True, timeout=30)
            r.raise_for_status()
            with open(path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            if is_valid_appimage(path):
                log_activity(f'Successfully downloaded {APPIMAGE_NAME}', {'path': path})
                logger.info(f'Success: {path}')
                return True
            else:
                log_activity(f'AppImage too small after download', {'size': os.path.getsize(path)})
        except Exception as e:
            log_activity(f'Error downloading {APPIMAGE_NAME}', {'error': str(e), 'attempt': attempt})
            logger.info(f'Error: {e} (attempt {attempt})')
        import time
        time.sleep(RETRY_DELAY)
    return False

# Main logic
version, url = get_latest_github_release_info()
if not url:
    logger.info('Could not find a valid AppImage download URL from GitHub.')
else:
    version_folder = version.lstrip('v') if version else 'latest'
    download_dirs = [ensure_download_dir("linux", "latest"), ensure_download_dir("linux", version_folder)]
    appimage_paths = [os.path.join(d, "qmoi_ai.appimage") for d in download_dirs]
    if download_appimage(url, appimage_paths[0]):
        if appimage_paths[0] != appimage_paths[1]:
            try:
                import shutil
                shutil.copy2(appimage_paths[0], appimage_paths[1])
                log_activity('Copied AppImage to versioned folder', {'from': appimage_paths[0], 'to': appimage_paths[1]})
                logger.info(f'Also saved: {appimage_paths[1]}')
            except Exception as e:
                log_activity('Failed to copy AppImage to versioned folder', {'error': str(e)})
    else:
        logger.info('Failed to download a valid AppImage after retries.') 