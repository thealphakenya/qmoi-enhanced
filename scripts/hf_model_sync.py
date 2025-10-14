#!/usr/bin/env python3
"""
QMOI Hugging Face Model Sync Utility
Automatically uploads the latest QMOI model to the Hugging Face model repository.

Usage:
  python scripts/hf_model_sync.py --repo <repo_id> --model-path <path> [--token <hf_token>]

- repo_id: Hugging Face repo id (e.g., alphaqmoi/qmoi-ai-system)
- model-path: Path to model directory or file (e.g., models/latest/ or models/qmoi.pt)
- token: Hugging Face token (optional, will use HF_TOKEN env var if not provided)

This script is robust, logs all actions, retries on failure, and never fails the workflow.
"""
import os
import sys
import time
import argparse
import logging
from huggingface_hub import HfApi, HfFolder, upload_folder, upload_file

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('logs/hf_model_sync.log'), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

RETRY_LIMIT = 3
RETRY_DELAY = 10  # seconds

def sync_model(repo_id, model_path, token=None):
    api = HfApi()
    if not token:
        token = os.environ.get('HF_TOKEN')
    if not token:
        logger.warning('No Hugging Face token provided or found in env. Skipping model sync.')
        return False
    try:
        if os.path.isdir(model_path):
            logger.info(f'Uploading model folder {model_path} to {repo_id}...')
            upload_folder(
                repo_id=repo_id,
                folder_path=model_path,
                repo_type='model',
                token=token,
                commit_message='Auto-sync QMOI model update',
                allow_patterns=['*.pt', '*.bin', '*.onnx', '*.json', '*.txt', '*.md', '*.yaml', '*.yml']
            )
        else:
            logger.info(f'Uploading model file {model_path} to {repo_id}...')
            upload_file(
                path_or_fileobj=model_path,
                path_in_repo=os.path.basename(model_path),
                repo_id=repo_id,
                repo_type='model',
                token=token,
                commit_message='Auto-sync QMOI model update'
            )
        logger.info('Model sync to Hugging Face successful.')
        return True
    except Exception as e:
        logger.error(f'Model sync failed: {e}')
        return False

def main():
    parser = argparse.ArgumentParser(description='QMOI Hugging Face Model Sync Utility')
    parser.add_argument('--repo', required=True, help='Hugging Face repo id (e.g., alphaqmoi/qmoi-ai-system)')
    parser.add_argument('--model-path', required=True, help='Path to model directory or file')
    parser.add_argument('--token', required=False, help='Hugging Face token (optional)')
    args = parser.parse_args()

    for attempt in range(1, RETRY_LIMIT + 1):
        logger.info(f'Attempt {attempt} to sync model...')
        success = sync_model(args.repo, args.model_path, args.token)
        if success:
            break
        logger.warning(f'Retrying in {RETRY_DELAY} seconds...')
        time.sleep(RETRY_DELAY)
    else:
        logger.error('All attempts to sync model failed. Continuing workflow (non-fatal).')

if __name__ == '__main__':
    main() 