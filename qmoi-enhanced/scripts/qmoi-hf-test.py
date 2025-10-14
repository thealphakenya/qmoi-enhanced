#!/usr/bin/env python3
"""
QMOI Hugging Face Test Script
Tests Hugging Face Space/model, runs API/UI tests, logs results, and auto-fixes on failure.
"""

import os
import sys
import requests
import json
import time
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("logs/qmoi-hf-test.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class QMOIHuggingFaceTest:
    def __init__(self):
        self.space_url = os.getenv(
            "QMOI_HF_SPACE_URL", "https://huggingface.co/spaces/alphaqmoi/qmoi-space"
        )
        self.api_url = self.space_url.replace("/spaces/", "/api/spaces/")
        self.log_file = "logs/qmoi-hf-test.log"
        self.max_retries = 3

    def log_result(self, test, status, details=None):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "test": test,
            "status": status,
            "details": details,
        }
        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")
        logger.info(f"{test}: {status} - {details}")

    def test_api(self):
        prompt = "Test prompt from QMOI automation."
        for attempt in range(1, self.max_retries + 1):
            try:
                logger.info(f"Testing Hugging Face API (attempt {attempt})...")
                resp = requests.post(
                    f"{self.api_url}/run/predict", json={"data": [prompt]}
                )
                if resp.status_code == 200 and "data" in resp.json():
                    self.log_result("API Test", "success", resp.json())
                    return True
                else:
                    self.log_result("API Test", "failed", resp.text)
            except Exception as e:
                self.log_result("API Test", "failed", str(e))
            time.sleep(2)
        return False

    def test_ui(self):
        try:
            logger.info("Testing Hugging Face UI...")
            resp = requests.get(self.space_url)
            if resp.status_code == 200:
                self.log_result("UI Test", "success", "UI loaded successfully")
                return True
            else:
                self.log_result("UI Test", "failed", f"Status: {resp.status_code}")
                return False
        except Exception as e:
            self.log_result("UI Test", "failed", str(e))
            return False

    def auto_fix(self):
        logger.info("Attempting auto-fix for Hugging Face Space...")
        # Trigger a redeploy or notify master (placeholder for real fix logic)
        self.log_result(
            "Auto-Fix", "triggered", "Redeploy or manual intervention required"
        )

    def run(self):
        api_ok = self.test_api()
        ui_ok = self.test_ui()
        if not (api_ok and ui_ok):
            self.auto_fix()


if __name__ == "__main__":
    QMOIHuggingFaceTest().run()
