import os
import requests
from qmoi_activity_logger import log_activity

GITHUB_REPO = 'thealphakenya/Alpha-Q-ai'
APK_NAME = 'qmoi ai_smarttv.apk'
MIN_APK_SIZE = 1 * 1024 * 1024  # 1MB
RETRY_COUNT = 3
RETRY_DELAY = 5

def ensure_download_dir(platform, version="latest"):
    dir_path = os.path.join("Qmoi_downloaded_apps", platform, version)
    os.makedirs(dir_path, exist_ok=True)
    return dir_path

def is_valid_apk(path):
    return os.path.exists(path) and os.path.getsize(path) > MIN_APK_SIZE

def get_latest_github_release_info():
    api_url = f'https://api.github.com/repos/{GITHUB_REPO}/releases/latest'
    try:
        r = requests.get(api_url, timeout=10)
        r.raise_for_status()
        data = r.json()
        version = data.get('tag_name', 'latest')
        for asset in data.get('assets', []):
            if asset['name'].lower() == APK_NAME:
                return version, asset['browser_download_url']
    except Exception as e:
        log_activity('Failed to fetch latest GitHub Smart TV APK URL', {'error': str(e)})
    return None, None

def download_apk(url, path):
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            log_activity(f'Attempt {attempt}: Downloading {APK_NAME}', {'url': url})
            r = requests.get(url, stream=True, timeout=30)
            r.raise_for_status()
            with open(path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            if is_valid_apk(path):
                log_activity(f'Successfully downloaded {APK_NAME}', {'path': path})
                print(f'Success: {path}')
                return True
            else:
                log_activity(f'Smart TV APK too small after download', {'size': os.path.getsize(path)})
        except Exception as e:
            log_activity(f'Error downloading {APK_NAME}', {'error': str(e), 'attempt': attempt})
            print(f'Error: {e} (attempt {attempt})')
        import time
        time.sleep(RETRY_DELAY)
    return False

# Main logic
version, url = get_latest_github_release_info()
if not url:
    print('Could not find a valid Smart TV APK download URL from GitHub.')
else:
    version_folder = version.lstrip('v') if version else 'latest'
    download_dirs = [ensure_download_dir("smarttv", "latest"), ensure_download_dir("smarttv", version_folder)]
    apk_paths = [os.path.join(d, "qmoi_ai_smarttv.apk") for d in download_dirs]
    if download_apk(url, apk_paths[0]):
        if apk_paths[0] != apk_paths[1]:
            try:
                import shutil
                shutil.copy2(apk_paths[0], apk_paths[1])
                log_activity('Copied Smart TV APK to versioned folder', {'from': apk_paths[0], 'to': apk_paths[1]})
                print(f'Also saved: {apk_paths[1]}')
            except Exception as e:
                log_activity('Failed to copy Smart TV APK to versioned folder', {'error': str(e)})
    else:
        print('Failed to download a valid Smart TV APK after retries.') 