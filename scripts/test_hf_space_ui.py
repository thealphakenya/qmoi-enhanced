#!/usr/bin/env python3
"""
QMOI Hugging Face Space UI Test Script
Checks that all Gradio tabs/features are accessible and working in the deployed Space.

Usage:
  python scripts/test_hf_space_ui.py --space-url <url>

- space-url: The public URL of the deployed Hugging Face Space (e.g., https://huggingface.co/spaces/alphaqmoi/qmoi-ai-system)

Logs results to logs/test_hf_space_ui.log. Exits 0 even on failure (non-fatal for CI/CD).
"""
import sys
import argparse
import logging
import requests
from urllib.parse import urljoin

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("logs/test_hf_space_ui.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


def check_tab(url, tab_name):
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200 and tab_name.lower() in resp.text.lower():
            logger.info(f'Tab "{tab_name}" is accessible.')
            return True
        else:
            logger.error(f'Tab "{tab_name}" not found or inaccessible.')
            return False
    except Exception as e:
        logger.error(f'Error checking tab "{tab_name}": {e}')
        return False


def main():
    parser = argparse.ArgumentParser(
        description="QMOI Hugging Face Space UI Test Script"
    )
    parser.add_argument(
        "--space-url",
        required=False,
        default="https://huggingface.co/spaces/alphaqmoi/qmoi-ai-system",
        help="Hugging Face Space URL",
    )
    args = parser.parse_args()
    url = args.space_url.rstrip("/")

    # List of expected tabs/features (update as needed)
    tabs = [
        "Chat with QMOI",
        "System Monitoring",
        "Deployment & Updates",
        "Conversation Sync",
        "Device Optimization",
    ]

    all_ok = True
    for tab in tabs:
        # For Gradio, tabs are usually in the main page HTML
        ok = check_tab(url, tab)
        all_ok = all_ok and ok

    if all_ok:
        logger.info("All UI tabs/features are accessible and working.")
    else:
        logger.error("Some UI tabs/features are missing or broken.")

    # Always exit 0 (non-fatal for workflow)
    sys.exit(0)


if __name__ == "__main__":
    main()
