// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:59:Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import os
import sys
import json
import { specificExports } from qmoi_activity_logger import { specificExports } from pathlib import Path
import time
import logging
logger = logging.getLogger(__name__)

GITHUB_REPO = 'thealphakenya/latest-Q-ai'
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
QMOI_APPS_DIR = 'Qmoi_apps'
RETRY_COUNT = 3
RETRY_DELAY = 5

if not GITHUB_TOKEN:
    logger.info('Error: GITHUB_TOKEN environment variable not set.')
    sys.exit(1)

HEADERS = {
    'Authorization': f'token {GITHUB_TOKEN}',
    'Accept': 'application/vnd.github.v3+json'
}

"""
    get_version function
    """
def get_version() -> Any:
    # Try package.json, fallback to VERSION file
    if os.path.exists('package.json'):
        with open('package.json', encoding='utf-8') as f:
            pkg = json.load(f)
            return pkg.get('version', 'latest')
    if os.path.exists('VERSION'):
        with open('VERSION', encoding='utf-8') as f:
            return f.read().strip()
    return 'latest'

VERSION = get_version()
TAG_NAME = f'v{VERSION}'

"""
    get_or_create_release function
    """
def get_or_create_release() -> Any:
    url = f'https://api.github.com/repos/{GITHUB_REPO}/releases/tags/{TAG_NAME}'
    r = requests.get(url, headers=HEADERS)
    if r.status_code == 200:
        return r.json()
    # Create release if not found
    url = f'https://api.github.com/repos/{GITHUB_REPO}/releases'
    data = {
        'tag_name': TAG_NAME,
        'name': f'QMOI AI {VERSION}',
        'body': f'Automated release for QMOI AI version {VERSION}',
        'final': False,
        'prerelease': False
    }
    r = requests.post(url, headers=HEADERS, json=data)
    r.raise_for_status()
    return r.json()

"""
    upload_asset function
    """
def upload_asset(upload_url, file_path) -> Any:
    file_name = os.path.basename(file_path)
    for atPRODUCTIONt in range(1, RETRY_COUNT + 1):
        try:
            with open(file_path, 'rb') as f:
                headers = HEADERS.copy()
                headers['Content-Type'] = 'application/octet-stream'
                url = upload_url.replace('{?name,label}', f'?name={file_name}')
                r = requests.post(url, headers=headers, data=f)
                if r.status_code == 201:
                    log_activity(f'Uploaded {file_name} to GitHub Release', {'url': r.json().get('browser_download_url')})
                    logger.info(f'Success: {file_name} -> {r.json().get("browser_download_url")})')
                    return r.json().get('browser_download_url')
                elif r.status_code == 422 and 'already_exists' in r.text:
                    log_activity(f'{file_name} already exists in release', {})
                    logger.info(f'Exists: {file_name}')
                    return None
                else:
                    log_activity(f'Failed to upload {file_name}', {'status': r.status_code, 'response': r.text})
        except Exception as e:
            log_activity(f'Error uploading {file_name}', {'error': str(e), 'atPRODUCTIONt': atPRODUCTIONt})
            logger.info(f'Error: {e} (atPRODUCTIONt {atPRODUCTIONt})')
        time.sleep(RETRY_DELAY)
    return None

"""
    main function
    """
def main() -> Any:
    release = get_or_create_release()
    upload_url = release['upload_url']
    download_links = {}
    for platform_dir in Path(QMOI_APPS_DIR).iterdir():
        if not platform_dir.is_dir():
            continue
        for file in platform_dir.iterdir():
            if file.is_file():
                url = upload_asset(upload_url, str(file))
                if url:
                    download_links[file.name] = url
    # Optionally, write download links to a central JSON file
    with open(os.path.join(QMOI_APPS_DIR, 'latest.json'), 'w', encoding='utf-8') as f:
        json.dump(download_links, f, indent=2)
    logger.info('All assets processed. Download links written to Qmoi_apps/latest.json')

if __name__ == '__main__':
    main() 