#!/usr/bin/env python3
"""
QMOI Hugging Face Sync Script
Syncs model/code to Hugging Face, verifies deployment, manages permissions, and logs all actions.
"""

import os
import sys
import subprocess
import requests
import json
import time
from datetime import datetime
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("logs/qmoi-hf-sync.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class QMOIHFSync:
    def __init__(self):
        self.hf_token = os.getenv("HF_TOKEN")
        self.model_repo = os.getenv("QMOI_HF_MODEL_REPO", "alphaqmoi/qmoi")
        self.space_repo = os.getenv("QMOI_HF_SPACE_REPO", "alphaqmoi/qmoi-space")
        self.model_dir = os.getenv("QMOI_MODEL_DIR", "models/latest")
        self.space_dir = os.getenv("QMOI_SPACE_DIR", "huggingface_space")
        self.log_file = "logs/qmoi-hf-sync.log"
        self.api_url = "https://huggingface.co/api"
        self.user = None
        self.session = requests.Session()
        if self.hf_token:
            self.session.headers.update({"Authorization": f"Bearer {self.hf_token}"})

    def log_action(self, action, status, details=None):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "action": action,
            "status": status,
            "details": details,
        }
        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")
        logger.info(f"{action}: {status} - {details}")

    def check_permissions(self):
        try:
            resp = self.session.get(f"{self.api_url}/whoami-v2")
            resp.raise_for_status()
            self.user = resp.json().get("name")
            self.log_action("Check Permissions", "success", f"User: {self.user}")
            return True
        except Exception as e:
            self.log_action("Check Permissions", "failed", str(e))
            return False

    def push_model(self):
        try:
            logger.info("Pushing model to Hugging Face...")
            cmd = f"huggingface-cli upload {self.model_dir}/* --repo-id {self.model_repo} --token {self.hf_token} --yes"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                self.log_action("Push Model", "success", result.stdout)
                return True
            else:
                self.log_action("Push Model", "failed", result.stderr)
                return False
        except Exception as e:
            self.log_action("Push Model", "failed", str(e))
            return False

    def push_space(self):
        try:
            logger.info("Pushing Space code to Hugging Face...")
            cmd = f"huggingface-cli upload {self.space_dir}/* --repo-id {self.space_repo} --token {self.hf_token} --yes"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                self.log_action("Push Space", "success", result.stdout)
                return True
            else:
                self.log_action("Push Space", "failed", result.stderr)
                return False
        except Exception as e:
            self.log_action("Push Space", "failed", str(e))
            return False

    def verify_deployment(self):
        try:
            logger.info("Verifying Hugging Face Space deployment...")
            url = f"https://huggingface.co/spaces/{self.space_repo}"
            resp = self.session.get(url)
            if resp.status_code == 200:
                self.log_action(
                    "Verify Deployment", "success", f"Space available: {url}"
                )
                return True
            else:
                self.log_action(
                    "Verify Deployment", "failed", f"Status: {resp.status_code}"
                )
                return False
        except Exception as e:
            self.log_action("Verify Deployment", "failed", str(e))
            return False

    def run(self):
        if not self.hf_token:
            logger.error("HF_TOKEN not set in environment.")
            return
        self.check_permissions()
        self.push_model()
        self.push_space()
        self.verify_deployment()


if __name__ == "__main__":
    QMOIHFSync().run()
