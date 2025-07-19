import os
import sys
import platform
import requests
from qmoi_activity_logger import log_activity

GITHUB_REPO = 'thealphakenya/Alpha-Q-ai'
RETRY_COUNT = 3
RETRY_DELAY = 5
MIN_SIZE = 1 * 1024 * 1024  # 1MB

PLATFORM_MAP = {
    'windows': {'names': ['Windows'], 'asset': 'qmoi ai.exe', 'folder': 'windows'},
    'mac': {'names': ['Darwin', 'Mac'], 'asset': 'qmoi ai.dmg', 'folder': 'mac'},
    'linux_deb': {'names': ['Linux'], 'asset': 'qmoi ai.deb', 'folder': 'linux'},
    'linux_appimage': {'names': ['Linux'], 'asset': 'qmoi ai.appimage', 'folder': 'linux'},
    'android': {'names': ['Android'], 'asset': 'qmoi ai.apk', 'folder': 'android'},
    'ios': {'names': ['iOS'], 'asset': 'qmoi ai.ipa', 'folder': 'ios'},
    'smarttv': {'names': ['SmartTV'], 'asset': 'qmoi ai_smarttv.apk', 'folder': 'smarttv'},
    'raspberrypi': {'names': ['Raspberry'], 'asset': 'qmoi ai.img', 'folder': 'raspberrypi'},
    'chromebook': {'names': ['CrOS', 'Chromebook'], 'asset': 'qmoi ai.zip', 'folder': 'chromebook'},
}

# Detect platform
uname = platform.system()
if 'ANDROID_STORAGE' in os.environ or 'android' in uname.lower():
    detected = 'android'
elif 'raspberry' in uname.lower():
    detected = 'raspberrypi'
elif 'windows' in uname.lower():
    detected = 'windows'
elif 'darwin' in uname.lower() or 'mac' in uname.lower():
    detected = 'mac'
elif 'linux' in uname.lower():
    # Let user choose between deb and appimage if both are available
    detected = 'linux'
elif 'ios' in uname.lower():
    detected = 'ios'
else:
    detected = None

# Allow override via CLI
if len(sys.argv) > 1:
    detected = sys.argv[1].lower()

if not detected or detected not in PLATFORM_MAP:
    print(f"Could not auto-detect platform. Please specify one of: {', '.join(PLATFORM_MAP.keys())}")
    sys.exit(1)

# For Linux, ask user to choose deb or appimage if not specified
if detected == 'linux':
    print("Linux detected. Choose package type:")
    print("1) DEB (qmoi ai.deb)")
    print("2) AppImage (qmoi ai.appimage)")
    choice = input("Enter 1 or 2: ").strip()
    if choice == '2':
        detected = 'linux_appimage'
    else:
        detected = 'linux_deb'

info = PLATFORM_MAP[detected]
ASSET_NAME = info['asset']
PLATFORM_FOLDER = info['folder']


def ensure_download_dir(platform, version="latest"):
    dir_path = os.path.join("Qmoi_downloaded_apps", platform, version)
    os.makedirs(dir_path, exist_ok=True)
    return dir_path

def is_valid_file(path):
    return os.path.exists(path) and os.path.getsize(path) > MIN_SIZE

def get_latest_github_release_info():
    api_url = f'https://api.github.com/repos/{GITHUB_REPO}/releases/latest'
    try:
        r = requests.get(api_url, timeout=10)
        r.raise_for_status()
        data = r.json()
        version = data.get('tag_name', 'latest')
        for asset in data.get('assets', []):
            if asset['name'].lower() == ASSET_NAME.lower():
                return version, asset['browser_download_url']
    except Exception as e:
        log_activity('Failed to fetch latest GitHub asset URL', {'error': str(e)})
    return None, None

def download_file(url, path):
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            log_activity(f'Attempt {attempt}: Downloading {ASSET_NAME}', {'url': url})
            r = requests.get(url, stream=True, timeout=30)
            r.raise_for_status()
            with open(path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            if is_valid_file(path):
                log_activity(f'Successfully downloaded {ASSET_NAME}', {'path': path})
                print(f'Success: {path}')
                return True
            else:
                log_activity(f'File too small after download', {'size': os.path.getsize(path)})
        except Exception as e:
            log_activity(f'Error downloading {ASSET_NAME}', {'error': str(e), 'attempt': attempt})
            print(f'Error: {e} (attempt {attempt})')
        import time
        time.sleep(RETRY_DELAY)
    return False

# Main logic
version, url = get_latest_github_release_info()
if not url:
    print(f'Could not find a valid {ASSET_NAME} download URL from GitHub.')
    sys.exit(1)
else:
    version_folder = version.lstrip('v') if version else 'latest'
    download_dirs = [ensure_download_dir(PLATFORM_FOLDER, "latest"), ensure_download_dir(PLATFORM_FOLDER, version_folder)]
    file_paths = [os.path.join(d, ASSET_NAME.replace(' ', '_').replace('AppImage', 'appimage').replace('DEB', 'deb').replace('DMG', 'dmg').replace('IPA', 'ipa').replace('APK', 'apk').replace('IMG', 'img').replace('ZIP', 'zip').replace('EXE', 'exe').lower()) for d in download_dirs]
    if download_file(url, file_paths[0]):
        if file_paths[0] != file_paths[1]:
            try:
                import shutil
                shutil.copy2(file_paths[0], file_paths[1])
                log_activity('Copied file to versioned folder', {'from': file_paths[0], 'to': file_paths[1]})
                print(f'Also saved: {file_paths[1]}')
            except Exception as e:
                log_activity('Failed to copy file to versioned folder', {'error': str(e)})
    else:
        print(f'Failed to download a valid {ASSET_NAME} after retries.')
        sys.exit(1) 