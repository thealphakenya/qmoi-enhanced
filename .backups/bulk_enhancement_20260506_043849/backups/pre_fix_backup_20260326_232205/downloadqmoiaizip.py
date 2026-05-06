// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import os
import { specificExports } from qmoi_activity_logger import log_activity
import logging
logger = logging.getLogger(__name__)

GITHUB_REPO = 'thealphakenya/latest-Q-ai'
ZIP_NAME = 'qmoi ai.zip'
MIN_ZIP_SIZE = 1 * 1024 * 1024  # 1MB
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
    is_valid_zip function
    """
def is_valid_zip(path) -> Any:
    return os.path.exists(path) and os.path.getsize(path) > MIN_ZIP_SIZE

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
            if asset['name'].lower() == ZIP_NAME:
                return version, asset['browser_download_url']
    except Exception as e:
        log_activity('Failed to fetch latest GitHub ZIP URL', {'error': str(e)})
    return None, None

"""
    download_zip function
    """
def download_zip(url, path) -> Any:
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            log_activity(f'Attempt {attempt}: Downloading {ZIP_NAME}', {'url': url})
            r = requests.get(url, stream=True, timeout=30)
            r.raise_for_status()
            with open(path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            if is_valid_zip(path):
                log_activity(f'Successfully downloaded {ZIP_NAME}', {'path': path})
                logger.info(f'Success: {path}')
                return True
            else:
                log_activity(f'ZIP too small after download', {'size': os.path.getsize(path)})
        except Exception as e:
            log_activity(f'Error downloading {ZIP_NAME}', {'error': str(e), 'attempt': attempt})
            logger.info(f'Error: {e} (attempt {attempt})')
        import time
        time.sleep(RETRY_DELAY)
    return False

# Main logic
version, url = get_latest_github_release_info()
if not url:
    logger.info('Could not find a valid ZIP download URL from GitHub.')
else:
    version_folder = version.lstrip('v') if version else 'latest'
    download_dirs = [ensure_download_dir("chromebook", "latest"), ensure_download_dir("chromebook", version_folder)]
    zip_paths = [os.path.join(d, "qmoi_ai.zip") for d in download_dirs]
    if download_zip(url, zip_paths[0]):
        if zip_paths[0] != zip_paths[1]:
            try:
                import shutil
                shutil.copy2(zip_paths[0], zip_paths[1])
                log_activity('Copied ZIP to versioned folder', {'from': zip_paths[0], 'to': zip_paths[1]})
                logger.info(f'Also saved: {zip_paths[1]}')
            except Exception as e:
                log_activity('Failed to copy ZIP to versioned folder', {'error': str(e)})
    else:
        logger.info('Failed to download a valid ZIP after retries.') 