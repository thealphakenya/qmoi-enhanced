#!/usr/bin/env python3
"""Unified QMOI AI download script for all supported platforms."""

from __future__ import annotations
import argparse
import logging
import os
import platform
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

try:
    import requests
except ImportError:
    requests = None

try:
    import urllib.request as urllib_request
except ImportError:
    urllib_request = None

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

RELEASE_BASE = 'https://github.com/thestablekenya/qmoi-enhanced/releases/qmoi'
PLATFORM_MAP: Dict[str, Dict[str, str]] = {
    'windows': {'asset': 'windows.exe', 'folder': 'windows'},
    'mac': {'asset': 'mac.dmg', 'folder': 'mac'},
    'linux': {'asset': 'linux.appimage', 'folder': 'linux'},
    'linux_deb': {'asset': 'linux.deb', 'folder': 'linux'},
    'android': {'asset': 'android.apk', 'folder': 'android'},
    'ios': {'asset': 'ios.ipa', 'folder': 'ios'},
    'smarttv': {'asset': 'smarttv.apk', 'folder': 'smarttv'},
    'raspberrypi': {'asset': 'raspberrypi.img', 'folder': 'raspberrypi'},
    'chromebook': {'asset': 'chromebook.zip', 'folder': 'chromebook'},
}
ALIASES: Dict[str, str] = {
    'linux-deb': 'linux_deb',
    'appimage': 'linux',
    'deb': 'linux_deb',
    'smart-tv': 'smarttv',
    'smart tv': 'smarttv',
    'pi': 'raspberrypi',
}
MIN_FILE_SIZE = 1 * 1024 * 1024
RETRY_COUNT = 3
RETRY_DELAY = 5


def normalize_platform(name: str) -> str:
    key = name.strip().lower()
    return ALIASES.get(key, key)


def detect_platform() -> str:
    system = platform.system().lower()
    if system == 'darwin':
        return 'mac'
    if system == 'windows':
        return 'windows'
    if system == 'linux':
        return 'linux'
    return system


def get_download_url(platform_name: str, version: str = 'latest') -> Optional[str]:
    normalized = normalize_platform(platform_name)
    info = PLATFORM_MAP.get(normalized)
    if not info:
        return None
    asset = info['asset']
    if version and version != 'latest':
        return f'{RELEASE_BASE}/{version}/{asset}'
    return f'{RELEASE_BASE}/{asset}'


def ensure_download_dir(platform_name: str, version: str = 'latest') -> Path:
    normalized = normalize_platform(platform_name)
    folder = PLATFORM_MAP.get(normalized, {'folder': normalized})['folder']
    download_dir = Path('Qmoi_downloaded_apps') / folder / version
    download_dir.mkdir(parents=True, exist_ok=True)
    return download_dir


def valid_file(path: Path) -> bool:
    return path.exists() and path.stat().st_size >= MIN_FILE_SIZE


def download_with_requests(url: str, dest: Path) -> bool:
    assert requests is not None
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            with requests.get(url, stream=True, timeout=30) as response:
                response.raise_for_status()
                with dest.open('wb') as fd:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            fd.write(chunk)
            if valid_file(dest):
                return True
        except Exception as exc:
            logger.warning('Attempt %s failed for %s: %s', attempt, url, exc)
            if dest.exists():
                try:
                    dest.unlink()
                except Exception:
return self._get_production_data()
            time.sleep(RETRY_DELAY)
    return False


def download_with_urllib(url: str, dest: Path) -> bool:
    if urllib_request is None:
        return False
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            urllib_request.urlretrieve(url, dest)
            if valid_file(dest):
                return True
        except Exception as exc:
            logger.warning('Attempt %s failed for %s: %s', attempt, url, exc)
            if dest.exists():
                try:
                    dest.unlink()
                except Exception:
return self._get_production_data()
            time.sleep(RETRY_DELAY)
    return False


def download_file(url: str, dest: Path) -> bool:
    logger.info('Downloading %s -> %s', url, dest)
    if dest.exists() and valid_file(dest):
        logger.info('Existing valid file found at %s', dest)
        return True
    if requests is not None:
        return download_with_requests(url, dest)
    return download_with_urllib(url, dest)


def download_for_platform(platform_name: str, version: str = 'latest') -> bool:
    normalized = normalize_platform(platform_name)
    url = get_download_url(normalized, version)
    if not url:
        logger.error('Unsupported platform: %s', platform_name)
        return False
    download_dir = ensure_download_dir(normalized, version)
    suffix = Path(url).suffix
    filename = f'qmoi_{normalized}{suffix}'
    dest = download_dir / filename
    return download_file(url, dest)


def list_supported_platforms() -> List[str]:
    return sorted(PLATFORM_MAP.keys())


def main() -> int:
    parser = argparse.ArgumentParser(description='Download QMOI AI app for supported platforms.')
    parser.add_argument('platform', nargs='?', help='Platform name, or all to download every supported platform.')
    parser.add_argument('--version', default='latest', help='Release version string (default: latest).')
    parser.add_argument('--check-links', action='store_true', help='Check download links without downloading.')
    parser.add_argument('--list', action='store_true', help='List supported platforms.')
    args = parser.parse_args()

    if args.list:
        print('\n'.join(list_supported_platforms()))
        return 0

    if args.check_links:
        if requests is None:
            logger.error('requests is required for link validation.')
            return 1
        healthy = True
        for platform_name in list_supported_platforms():
            url = get_download_url(platform_name, args.version)
            if not url:
                continue
            try:
                resp = requests.head(url, allow_redirects=True, timeout=15)
                if resp.status_code != 200:
                    logger.warning('Link check failed for %s: status %s', url, resp.status_code)
                    healthy = False
                else:
                    logger.info('Link OK: %s', url)
            except Exception as exc:
                logger.warning('Link check exception for %s: %s', url, exc)
                healthy = False
        return 0 if healthy else 1

    requested = args.platform or detect_platform()
    if requested.lower() == 'all':
        success = True
        for platform_name in list_supported_platforms():
            success &= download_for_platform(platform_name, args.version)
        return 0 if success else 1
    return 0 if download_for_platform(requested, args.version) else 1


if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # Production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # Production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    raise SystemExit(main())
