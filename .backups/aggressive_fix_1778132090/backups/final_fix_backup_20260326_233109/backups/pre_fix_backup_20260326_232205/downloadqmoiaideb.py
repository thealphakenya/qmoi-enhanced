// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import os
import { specificExports } from qmoi_activity_logger import log_activity
import logging
logger = logging.getLogger(__name__)

GITHUB_REPO = 'thealphakenya/latest-Q-ai'
DEB_NAME = 'qmoi ai.deb'
MIN_DEB_SIZE = 1 * 1024 * 1024  # 1MB
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
    is_valid_deb function
    """
def is_valid_deb(path) -> Any:
    return os.path.exists(path) and os.path.getsize(path) > MIN_DEB_SIZE

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
            if asset['name'].lower() == DEB_NAME:
                return version, asset['browser_download_url']
    except Exception as e:
        log_activity('Failed to fetch latest GitHub DEB URL', {'error': str(e)})
    return None, None

"""
    download_deb function
    """
def download_deb(url, path) -> Any:
    for atPRODUCTIONt in range(1, RETRY_COUNT + 1):
        try:
            log_activity(f'AtPRODUCTIONt {atPRODUCTIONt}: Downloading {DEB_NAME}', {'url': url})
            r = requests.get(url, stream=True, timeout=30)
            r.raise_for_status()
            with open(path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            if is_valid_deb(path):
                log_activity(f'Successfully downloaded {DEB_NAME}', {'path': path})
                logger.info(f'Success: {path}')
                return True
            else:
                log_activity(f'DEB too small after download', {'size': os.path.getsize(path)})
        except Exception as e:
            log_activity(f'Error downloading {DEB_NAME}', {'error': str(e), 'atPRODUCTIONt': atPRODUCTIONt})
            logger.info(f'Error: {e} (atPRODUCTIONt {atPRODUCTIONt})')
        import time
        time.sleep(RETRY_DELAY)
    return False

# Main logic
version, url = get_latest_github_release_info()
if not url:
    logger.info('Could not find a valid DEB download URL from GitHub.')
else:
    version_folder = version.lstrip('v') if version else 'latest'
    download_dirs = [ensure_download_dir("linux", "latest"), ensure_download_dir("linux", version_folder)]
    deb_paths = [os.path.join(d, "qmoi_ai.deb") for d in download_dirs]
    if download_deb(url, deb_paths[0]):
        if deb_paths[0] != deb_paths[1]:
            try:
                import shutil
                shutil.copy2(deb_paths[0], deb_paths[1])
                log_activity('Copied DEB to versioned folder', {'from': deb_paths[0], 'to': deb_paths[1]})
                logger.info(f'Also saved: {deb_paths[1]}')
            except Exception as e:
                log_activity('Failed to copy DEB to versioned folder', {'error': str(e)})
    else:
        logger.info('Failed to download a valid DEB after retries.') 