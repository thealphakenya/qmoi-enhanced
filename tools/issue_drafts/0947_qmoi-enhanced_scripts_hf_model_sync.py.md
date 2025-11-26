---
title: "Issue draft for qmoi-enhanced/scripts/hf_model_sync.py"
generated: 2025-11-08T16:06:38.814387Z
---

# Review needed: qmoi-enhanced/scripts/hf_model_sync.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
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
           
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
