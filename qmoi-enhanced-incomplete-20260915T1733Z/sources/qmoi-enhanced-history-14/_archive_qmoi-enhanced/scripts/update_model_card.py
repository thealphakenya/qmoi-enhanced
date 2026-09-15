#!/usr/bin/env python3
"""
QMOI Hugging Face Model Card Updater
Automatically updates the Hugging Face model card (README.md) with dynamic badges, version, health, and status.

Usage:
  python scripts/update_model_card.py --repo <repo_id> --version <version> --health <health> --status <status> --dashboard <dashboard_url> --status-url <status_url> [--token <hf_token>]

- repo_id: Hugging Face repo id (e.g., alphaqmoi/qmoi-ai-system)
- version: Latest model version (e.g., 2.0.0)
- health: Health percentage (e.g., 99.8)
- status: Health status (e.g., healthy, warning, error)
- dashboard_url: Link to QMOI dashboard
- status_url: Link to live status endpoint
- token: Hugging Face token (optional, will use HF_TOKEN env var if not provided)

This script is robust, logs all actions, and never fails the workflow.
"""
import os
import sys
import argparse
import logging
from datetime import datetime
from huggingface_hub import HfApi, upload_file, hf_hub_download
import json

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('logs/update_model_card.log'), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

BADGE_BASE = 'https://img.shields.io/badge/'

HEALTH_STATS_PATH = 'qmoi_health_status.json'

MODEL_CARD_STATS_SECTION = '''
## Live Health & Accuracy Stats
- **Total Errors:** {total_errors}
- **Errors Remaining:** {errors_remaining}
- **Errors Fixed:** {errors_fixed}
- **Percent Fixed:** {percent_fixed}%
- **Auto-Fix Attempts:** {auto_fix_attempts}
- **Auto-Fix Success:** {auto_fix_success}
- **Last Error:** {last_error}
- **Last Fix:** {last_fix}
- **Last Update:** {last_update}
'''

MODEL_CARD_TEMPLATE = """
# QMOI AI Model Card (Hugging Face)

[![Version](VERSION_BADGE)](DASHBOARD_URL)
[![Health](HEALTH_BADGE)](STATUS_URL)
[![Last Updated](UPDATED_BADGE)](DASHBOARD_URL)

## Overview
QMOI (Quantum Multi-Objective Intelligence) is a powerful, ever-evolving, self-healing AI model designed for robust automation, cross-platform intelligence, and continuous improvement. This model is always up-to-date, observable, and integrated with the full QMOI system.

## Features
- **Self-Healing & Automation:** Automatically detects and fixes errors, retrains, and redeploys as needed.
- **Continuous Evolution:** Model is enhanced and optimized on every run, with automated versioning and health checks.
- **Cross-Platform Integration:** Seamless integration with QMOI Spaces, WhatsApp, Discord, Telegram, and more.
- **Real-Time Monitoring:** Health, status, and analytics are always visible in the QMOI dashboard and Hugging Face Space.
- **Secure & Compliant:** All data and interactions are encrypted and privacy-compliant.

## Version & Health
- **Version:** VERSION
- **Last Updated:** UPDATED
- **Health:** HEALTH% (STATUS)

## Links & Resources
- [QMOI Hugging Face Space](https://huggingface.co/spaces/alphaqmoi/qmoi-ai-system)
- [QMOI Project Documentation](https://github.com/your-org/Alpha-Q-ai)
- [QMOI Dashboard](DASHBOARD_URL)
- [Live Status](STATUS_URL)

## Usage
- **Inference:**
  - Use the Hugging Face Inference API or download the model for local use.
  - Example (Python):
    ```python
    from huggingface_hub import InferenceApi
    api = InferenceApi(repo_id="alphaqmoi/qmoi-ai-system")
    result = api(inputs={"text": "Hello QMOI!"})
    print(result)
    ```
- **Integration:**
  - Integrate with QMOI Spaces, WhatsApp, or your own apps using the API.

## Automation & Observability
- **Model is always synced and up-to-date** via automated CI/CD workflows.
- **Health and status** are logged and visible in the Hugging Face model card and QMOI dashboard.
- **Logs and analytics** are available as GitHub Actions artifacts.

## Versioning
- Each model update is versioned and tracked automatically.
- See the QMOI dashboard or Hugging Face Space for the latest version and health status.

## Contact & Support
- For questions, issues, or feature requests, contact the QMOI admin team or open an issue on GitHub.

---
QMOI is a permanent, ever-evolving AI system—always running, always healing, always improving.

{STATS_SECTION}
"""

def make_badge(label, value, color):
    return f"{BADGE_BASE}{label}-{value}-{color}"

def update_model_card(repo_id, version, health, status, dashboard_url, status_url, token=None):
    api = HfApi()
    if not token:
        token = os.environ.get('HF_TOKEN')
    if not token:
        logger.warning('No Hugging Face token provided or found in env. Skipping model card update.')
        return False
    try:
        updated = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        version_badge = make_badge('version', version, 'blue')
        health_badge = make_badge('health', f"{health}%25", 'brightgreen' if status == 'healthy' else 'yellow' if status == 'warning' else 'red')
        updated_badge = make_badge('updated', updated.replace(':','%3A'), 'informational')
        card = MODEL_CARD_TEMPLATE.replace('VERSION_BADGE', version_badge)
        card = card.replace('HEALTH_BADGE', health_badge)
        card = card.replace('UPDATED_BADGE', updated_badge)
        card = card.replace('VERSION', version)
        card = card.replace('UPDATED', updated)
        card = card.replace('HEALTH', str(health))
        card = card.replace('STATUS', status)
        card = card.replace('DASHBOARD_URL', dashboard_url)
        card = card.replace('STATUS_URL', status_url)
        # Try to load health stats
        stats_section = ''
        if os.path.exists(HEALTH_STATS_PATH):
            try:
                with open(HEALTH_STATS_PATH) as f:
                    stats = json.load(f)
                stats_section = MODEL_CARD_STATS_SECTION.format(**stats)
            except Exception as e:
                logger.warning(f'Could not load health stats: {e}')
        card = card + '\n' + stats_section
        # Download current README.md for backup
        try:
            old_card = hf_hub_download(repo_id=repo_id, filename='README.md', repo_type='model', token=token)
            logger.info('Downloaded current README.md for backup.')
        except Exception:
            logger.info('No existing README.md found, creating new.')
        # Write new README.md
        with open('models/latest/README.md', 'w', encoding='utf-8') as f:
            f.write(card)
        # Upload to Hugging Face
        upload_file(
            path_or_fileobj='models/latest/README.md',
            path_in_repo='README.md',
            repo_id=repo_id,
            repo_type='model',
            token=token,
            commit_message=f'Auto-update model card: v{version} ({status}, {health}%)'
        )
        logger.info('Model card updated and pushed to Hugging Face.')
        return True
    except Exception as e:
        logger.error(f'Model card update failed: {e}')
        return False

def main():
    parser = argparse.ArgumentParser(description='QMOI Hugging Face Model Card Updater')
    parser.add_argument('--repo', required=True, help='Hugging Face repo id (e.g., alphaqmoi/qmoi-ai-system)')
    parser.add_argument('--version', required=True, help='Latest model version')
    parser.add_argument('--health', required=True, help='Health percentage (e.g., 99.8)')
    parser.add_argument('--status', required=True, help='Health status (e.g., healthy, warning, error)')
    parser.add_argument('--dashboard', required=True, help='QMOI dashboard URL')
    parser.add_argument('--status-url', required=True, help='Live status endpoint URL')
    parser.add_argument('--token', required=False, help='Hugging Face token (optional)')
    args = parser.parse_args()

    update_model_card(
        repo_id=args.repo,
        version=args.version,
        health=args.health,
        status=args.status,
        dashboard_url=args.dashboard,
        status_url=args.status_url,
        token=args.token
    )

if __name__ == '__main__':
    main() 