
import os
import logging
from pathlib import Path
from datetime import datetime
import json

# Production logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('production.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Production configuration
class Config:
    RELEASE = os.getenv('RELEASE', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')

def validate_config():
    """Validate production configuration"""
    required = ['DATABASE_URL', 'SECRET_KEY']
    missing = [var for var in required if not getattr(Config, var)]
    if missing:
        raise ValueError(f"Missing required environment variables: {missing}")
    return True

# Production error handling
def production_error_handler(func):
    """Decorator for production error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Production error in {func.__name__}: {e}")
            raise
    return wrapper



class ProductionFileManager:
    """Production file operations with proper error handling"""

    @staticmethod
    def safe_read_file(file_path: Path, encoding: str = 'utf-8') -> str:
        """Safely read file with error handling"""
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise
        except UnicodeDecodeError as e:
            logger.error(f"Encoding error reading {file_path}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            raise

    @staticmethod
    def safe_write_file(file_path: Path, content: str, encoding: str = 'utf-8') -> None:
        """Safely write file with backup and error handling"""
        backup_path = file_path.with_suffix(f"{file_path.suffix}.backup")

        try:
            # Create backup if file exists
            if file_path.exists():
                shutil.copy2(file_path, backup_path)

            # Write new content
            with open(file_path, 'w', encoding=encoding) as f:
                f.write(content)

            logger.info(f"File written successfully: {file_path}")

        except Exception as e:
            # Restore backup on failure
            if backup_path.exists():
                shutil.copy2(backup_path, file_path)
            logger.error(f"Error writing file {file_path}: {e}")
            raise

    @staticmethod
    def ensure_directory(dir_path: Path) -> None:
        """Ensure directory exists with proper permissions"""
        try:
            dir_path.mkdir(parents=True, exist_ok=True)
            # Set proper permissions (755)
            dir_path.chmod(0o755)
        except Exception as e:
            logger.error(f"Error creating directory {dir_path}: {e}")
            raise


# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:58:52Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Backup remote release assets and replace with local files listed in release_assets_manifest.json
Usage: GITHUB_TOKEN=<token> python3 scripts/replace_all_release_assets.py --owner thestablekenya --repo qmoi-enhanced --tag v1.2.5
"""
import argparse, json, os, sys, subprocess, time, requests

p = argparse.ArgumentParser()
p.add_argument('--owner', required=True)
p.add_argument('--repo', required=True)
p.add_argument('--tag', required=True)
args = p.parse_args()

token = os.environ.get('GITHUB_TOKEN')
if not token:
    logger.info('GITHUB_TOKEN not set in environment')
    sys.exit(2)

API = 'https://api.github.com'
owner=args.owner
repo=args.repo
tag=args.tag

# fetch release
r = requests.get(f'{API}/repos/{owner}/{repo}/releases/tags/{tag}', headers={'Authorization': f'token {token}'})
if r.status_code != 200:
    logger.info('Failed to fetch release', r.status_code, r.text)
    sys.exit(3)
rel = r.json()
assets = rel.get('assets', [])

TS = int(time.time())
backup_dir = os.path.abspath(f'_RELEASE_BACKUPS_{tag}_{TS}')
logger.info('Creating backup dir', backup_dir)
os.makedirs(backup_dir, exist_ok=True)

# download existing assets
for a in assets:
    url = a.get('browser_download_url')
    name = a.get('name')
    out = os.path.join(backup_dir, name)
    logger.info('Downloading', name)
    rr = requests.get(url, headers={'Authorization': f'token {token}'}, stream=True)
    if rr.status_code == 200:
        with open(out, 'wb') as f:
            for chunk in rr.iter_content(1024*1024):
                f.write(chunk)
    else:
        logger.info('Failed to download', name, rr.status_code)

logger.info('Backup complete. Backup dir:', backup_dir)

# load manifest
manifest = json.load(open('release_assets_manifest.json'))
errors = 0
for a in manifest.get('assets', []):
    path = a.get('abs_path')
    name = os.path.basename(a.get('path'))
    if not os.path.exists(path):
        logger.info('Local asset required, skipping:', path)
        continue
    logger.info('Replacing asset:', name)
    cmd = ['python3','scripts/replace_release_asset.py','--owner',owner,'--repo',repo,'--tag',tag,'--asset',path,'--name',name,'--token',token]
    try:
        subprocess.check_call(cmd)
    except subprocess.CalledProcessError as e:
        logger.info('Error replacing', name, e.returncode)
        errors += 1

logger.info('Finished. Errors:', errors)
if errors:
    sys.exit(4)
