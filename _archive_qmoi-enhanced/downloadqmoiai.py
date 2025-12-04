import os
import sys
import platform
import requests
from qmoi_activity_logger import log_activity
import re

GITHUB_REPO = 'thealphakenya/Alpha-Q-ai'
RETRY_COUNT = 3
RETRY_DELAY = 5
MIN_SIZE = 1 * 1024 * 1024  # 1MB

PLATFORM_MAP = {
    'windows': {'asset_ext': '.exe', 'folder': 'windows'},
    'mac': {'asset_ext': '.dmg', 'folder': 'mac'},
    'linux': {'asset_ext': '.appimage', 'folder': 'linux'},
    'linux_deb': {'asset_ext': '.deb', 'folder': 'linux'},
    'android': {'asset_ext': '.apk', 'folder': 'android'},
    'ios': {'asset_ext': '.ipa', 'folder': 'ios'},
    'smarttv': {'asset_ext': '.apk', 'folder': 'smarttv'},
    'raspberrypi': {'asset_ext': '.img', 'folder': 'raspberrypi'},
    'chromebook': {'asset_ext': '.zip', 'folder': 'chromebook'},
}

# --- New: Extract all app download links from QMOIAPPS.md ---
def extract_app_downloads(md_path='QMOIAPPS.md'):
    apps = []
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Find all rows in the markdown table
    rows = re.findall(r'\| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|', content)
    for row in rows:
        name = row[1].strip()
        version = row[2].strip()
        downloads = row[5].strip()
        # Find all [Platform](url) pairs
        links = re.findall(r'\[(\w+)\]\(([^)]+)\)', downloads)
        for platform, url in links:
            apps.append({'name': name, 'version': version, 'platform': platform.lower(), 'url': url})
    return apps

# --- New: Download all apps for all platforms ---
def ensure_download_dir(platform, version="latest"):
    dir_path = os.path.join("Qmoi_downloaded_apps", platform, version)
    os.makedirs(dir_path, exist_ok=True)
    return dir_path

def is_valid_file(path):
    return os.path.exists(path) and os.path.getsize(path) > MIN_SIZE

def download_file(url, path, app_name, platform):
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            log_activity(f'Attempt {attempt}: Downloading {app_name} for {platform}', {'url': url})
            r = requests.get(url, stream=True, timeout=30)
            r.raise_for_status()
            with open(path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            if is_valid_file(path):
                log_activity(f'Successfully downloaded {app_name} for {platform}', {'path': path})
                print(f'Success: {path}')
                return True
            else:
                log_activity(f'File too small after download', {'size': os.path.getsize(path)})
        except Exception as e:
            log_activity(f'Error downloading {app_name} for {platform}', {'error': str(e), 'attempt': attempt})
            print(f'Error: {e} (attempt {attempt})')
        import time
        time.sleep(RETRY_DELAY)
    return False

# --- New: Check all download links for reachability ---
def check_links_reachability(apps, timeout=10):
    broken = []
    for app in apps:
        url = app['url']
        name = app['name']
        platform = app['platform']
        try:
            r = requests.head(url, allow_redirects=True, timeout=timeout)
            if r.status_code != 200:
                print(f"BROKEN: {name} [{platform}] => {url} (status {r.status_code})")
                log_activity('Broken download link', {'app': name, 'platform': platform, 'url': url, 'status': r.status_code})
                broken.append(app)
            else:
                print(f"OK: {name} [{platform}] => {url}")
        except Exception as e:
            print(f"BROKEN: {name} [{platform}] => {url} (error: {e})")
            log_activity('Broken download link', {'app': name, 'platform': platform, 'url': url, 'error': str(e)})
            broken.append(app)
    return broken

def update_links_to_fallback(apps, old_domain, new_domain):
    updated = []
    for app in apps:
        if old_domain in app['url']:
            new_url = app['url'].replace(old_domain, new_domain)
            updated.append({**app, 'url': new_url})
        else:
            updated.append(app)
    return updated

def print_broken_links_report(broken):
    print("\n--- Broken Download Links Report ---")
    for app in broken:
        print(f"{app['name']} [{app['platform']}] => {app['url']}")
    print(f"Total broken links: {len(broken)}")

# --- Main logic: Download all apps for all platforms ---
def autodownload_all_apps():
    apps = extract_app_downloads()
    for app in apps:
        platform = app['platform']
        version = app['version'].lstrip('v') if app['version'] else 'latest'
        url = app['url']
        name = app['name']
        ext = os.path.splitext(url)[-1].lower()
        folder = PLATFORM_MAP.get(platform, {'folder': platform})['folder']
        filename = f"{name.replace(' ', '').lower()}{ext}"
        download_dir = ensure_download_dir(folder, "latest")
        version_dir = ensure_download_dir(folder, version)
        file_path_latest = os.path.join(download_dir, filename)
        file_path_version = os.path.join(version_dir, filename)
        if download_file(url, file_path_latest, name, platform):
            if file_path_latest != file_path_version:
                try:
                    import shutil
                    shutil.copy2(file_path_latest, file_path_version)
                    log_activity('Copied file to versioned folder', {'from': file_path_latest, 'to': file_path_version})
                except Exception as e:
                    log_activity('Failed to copy file to versioned folder', {'error': str(e)})
        else:
            print(f'Failed to download a valid {name} for {platform} after retries.')
            log_activity('Failed to download after retries', {'app': name, 'platform': platform, 'url': url})

if __name__ == "__main__":
    apps = extract_app_downloads()
    print("Checking all download links for reachability...")
    broken = check_links_reachability(apps)
    print_broken_links_report(broken)
    # To update links, uncomment and set domains:
    # fallback_domain = "downloads.qmoi.app"  # Example fallback
    # old_domain = "downloads-qmoi.tk"
    # updated_apps = update_links_to_fallback(apps, old_domain, fallback_domain)
    # print("Updated links to fallback domain.")
    autodownload_all_apps()
    print("All autodownloads complete.") 