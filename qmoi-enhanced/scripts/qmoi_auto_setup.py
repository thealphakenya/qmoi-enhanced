#!/usr/bin/env python3
"""
QMOI Auto Setup & Continuous Running System

This script ensures QMOI is always running, self-updating, and automatically fixing issues.
Features:
- Automated environment setup
- Continuous monitoring and auto-restart
- Self-updating capabilities
- Error auto-fixing
- Cloud integration
- Performance optimization
"""

import os
import sys
import time
import json
import subprocess
import threading
import psutil
import requests
import logging
from datetime import datetime, timedelta
from pathlib import Path
import schedule

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("qmoi_auto_setup.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class QMOIAutoSetup:
    """Automated QMOI setup and continuous running system"""

    def __init__(self):
        self.qmoi_process = None
        self.hf_space_process = None
        self.last_update_check = datetime.now()
        self.update_interval = timedelta(hours=1)
        self.restart_interval = timedelta(hours=6)
        self.last_restart = datetime.now()
        self.error_count = 0
        self.max_errors = 5

    def setup_environment(self):
        """Automated environment setup"""
        logger.info("Setting up QMOI environment...")

        # Create all necessary directories
        directories = [
            "employment_letters",
            "logs",
            "reports",
            "models/latest",
            "huggingface_space",
            "data",
            "config",
            "keys",
            "backups",
            "cloud_cache",
            "temp",
            "artifacts",
            "distributions",
        ]

        for directory in directories:
            Path(directory).mkdir(parents=True, exist_ok=True)
            logger.info(f"Created directory: {directory}")

        # Install dependencies
        self.install_dependencies()

        # Setup cloud integration
        self.setup_cloud_integration()

        # Setup Hugging Face integration
        self.setup_huggingface_integration()

        logger.info("Environment setup completed")

    def install_dependencies(self):
        """Install all required dependencies"""
        logger.info("Installing dependencies...")

        requirements = [
            "requests>=2.31.0",
            "psutil>=5.9.0",
            "fastapi>=0.104.0",
            "uvicorn>=0.24.0",
            "gradio>=4.0.0",
            "transformers>=4.35.0",
            "torch>=2.1.0",
            "huggingface_hub>=0.19.0",
            "pandas>=2.1.0",
            "numpy>=1.24.0",
            "sqlalchemy>=2.0.0",
            "cryptography>=41.0.0",
            "schedule>=1.2.0",
            "python-dotenv>=1.0.0",
            "click>=8.1.0",
            "rich>=13.0.0",
            "boto3>=1.34.0",
            "google-cloud-storage>=2.10.0",
            "azure-storage-blob>=12.19.0",
            "redis>=5.0.0",
            "celery>=5.3.0",
        ]

        for req in requirements:
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", req])
                logger.info(f"Installed: {req}")
            except subprocess.CalledProcessError as e:
                logger.error(f"Failed to install {req}: {e}")

    def setup_cloud_integration(self):
        """Setup cloud integration for offloading and storage"""
        logger.info("Setting up cloud integration...")

        cloud_config = {
            "cloud_providers": {
                "aws": {
                    "enabled": True,
                    "s3_bucket": "qmoi-cloud-storage",
                    "region": "us-east-1",
                },
                "gcp": {
                    "enabled": True,
                    "bucket": "qmoi-cloud-storage",
                    "region": "us-central1",
                },
                "azure": {
                    "enabled": True,
                    "container": "qmoi-cloud-storage",
                    "region": "eastus",
                },
            },
            "cloud_offloading": {
                "enabled": True,
                "offload_builds": True,
                "offload_tests": True,
                "offload_artifacts": True,
                "sync_interval": 300,  # 5 minutes
            },
            "cloud_storage": {
                "enabled": True,
                "cache_node_modules": True,
                "cache_build_files": True,
                "cache_artifacts": True,
            },
            "multi_device": {
                "enabled": True,
                "failover": True,
                "load_balancing": True,
                "device_sync": True,
            },
        }

        with open("config/cloud_config.json", "w") as f:
            json.dump(cloud_config, f, indent=2)

        logger.info("Cloud integration configured")

    def setup_huggingface_integration(self):
        """Setup Hugging Face integration"""
        logger.info("Setting up Hugging Face integration...")

        hf_config = {
            "model_name": "alphaqmoi/qmoi",
            "space_name": "alphaqmoi/qmoi-ai-system",
            "auto_update": True,
            "auto_deploy": True,
            "model_sync": True,
            "space_sync": True,
            "inference_api": True,
            "model_card_auto_update": True,
        }

        with open("config/huggingface_config.json", "w") as f:
            json.dump(hf_config, f, indent=2)

        logger.info("Hugging Face integration configured")

    def start_qmoi_system(self):
        """Start the QMOI system"""
        logger.info("Starting QMOI system...")

        try:
            # Start main QMOI system
            self.qmoi_process = subprocess.Popen(
                [sys.executable, "scripts/start_qmoi_enhanced.py"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            # Start Hugging Face Space
            self.hf_space_process = subprocess.Popen(
                [sys.executable, "huggingface_space/app.py"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            logger.info("QMOI system started successfully")
            return True

        except Exception as e:
            logger.error(f"Failed to start QMOI system: {e}")
            return False

    def check_system_health(self):
        """Check system health and restart if needed"""
        try:
            # Check if processes are running
            if self.qmoi_process and self.qmoi_process.poll() is not None:
                logger.warning("QMOI process died, restarting...")
                self.restart_qmoi_system()
                return False

            if self.hf_space_process and self.hf_space_process.poll() is not None:
                logger.warning("Hugging Face Space process died, restarting...")
                self.restart_hf_space()
                return False

            # Check system resources
            cpu_percent = psutil.cpu_percent()
            memory_percent = psutil.virtual_memory().percent

            if cpu_percent > 90 or memory_percent > 90:
                logger.warning(
                    f"High resource usage: CPU {cpu_percent}%, Memory {memory_percent}%"
                )
                self.optimize_resources()

            # Check if restart is needed
            if datetime.now() - self.last_restart > self.restart_interval:
                logger.info("Scheduled restart...")
                self.restart_qmoi_system()
                self.last_restart = datetime.now()

            return True

        except Exception as e:
            logger.error(f"Health check failed: {e}")
            self.error_count += 1
            return False

    def restart_qmoi_system(self):
        """Restart QMOI system"""
        logger.info("Restarting QMOI system...")

        if self.qmoi_process:
            self.qmoi_process.terminate()
            self.qmoi_process.wait()

        time.sleep(5)
        self.start_qmoi_system()

    def restart_hf_space(self):
        """Restart Hugging Face Space"""
        logger.info("Restarting Hugging Face Space...")

        if self.hf_space_process:
            self.hf_space_process.terminate()
            self.hf_space_process.wait()

        time.sleep(5)
        self.hf_space_process = subprocess.Popen(
            [sys.executable, "huggingface_space/app.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

    def optimize_resources(self):
        """Optimize system resources"""
        logger.info("Optimizing system resources...")

        # Clear temporary files
        temp_dirs = ["temp", "cloud_cache", "logs"]
        for temp_dir in temp_dirs:
            if os.path.exists(temp_dir):
                for file in os.listdir(temp_dir):
                    file_path = os.path.join(temp_dir, file)
                    if os.path.isfile(file_path):
                        # Keep only recent files
                        if (
                            time.time() - os.path.getmtime(file_path) > 86400
                        ):  # 24 hours
                            os.remove(file_path)

        # Force garbage collection
        import gc

        gc.collect()

        logger.info("Resource optimization completed")

    def auto_update(self):
        """Auto-update QMOI system"""
        logger.info("Checking for updates...")

        try:
            # Check for code updates
            subprocess.check_call(["git", "pull"])

            # Update dependencies
            subprocess.check_call(
                [
                    sys.executable,
                    "-m",
                    "pip",
                    "install",
                    "--upgrade",
                    "-r",
                    "requirements/qmoi_enhanced_requirements.txt",
                ]
            )

            # Update Hugging Face model
            self.update_huggingface_model()

            logger.info("Auto-update completed")

        except Exception as e:
            logger.error(f"Auto-update failed: {e}")

    def update_huggingface_model(self):
        """Update Hugging Face model and space"""
        logger.info("Updating Hugging Face model...")

        try:
            # Update model card
            from models.latest.qmoi_enhanced_model import QMOIEnhancedSystem

            qmoi = QMOIEnhancedSystem()
            model_card = qmoi.hf_integration.update_model_card()

            # Push to Hugging Face
            subprocess.check_call(
                ["huggingface-cli", "upload", "alphaqmoi/qmoi", "models/latest/"]
            )

            logger.info("Hugging Face model updated")

        except Exception as e:
            logger.error(f"Failed to update Hugging Face model: {e}")

    def run_continuous_monitoring(self):
        """Run continuous monitoring"""
        logger.info("Starting continuous monitoring...")

        # Schedule tasks
        schedule.every(5).minutes.do(self.check_system_health)
        schedule.every(1).hour.do(self.auto_update)
        schedule.every(30).minutes.do(self.optimize_resources)

        while True:
            try:
                schedule.run_pending()
                time.sleep(60)

                # Check error count
                if self.error_count > self.max_errors:
                    logger.error("Too many errors, performing full restart...")
                    self.full_restart()
                    self.error_count = 0

            except Exception as e:
                logger.error(f"Monitoring error: {e}")
                time.sleep(300)  # Wait 5 minutes on error

    def full_restart(self):
        """Perform full system restart"""
        logger.info("Performing full system restart...")

        # Stop all processes
        if self.qmoi_process:
            self.qmoi_process.terminate()
        if self.hf_space_process:
            self.hf_space_process.terminate()

        time.sleep(10)

        # Setup environment
        self.setup_environment()

        # Start system
        self.start_qmoi_system()

        logger.info("Full restart completed")

    def run(self):
        """Run the auto setup system"""
        logger.info("Starting QMOI Auto Setup System...")

        # Initial setup
        self.setup_environment()

        # Start system
        if not self.start_qmoi_system():
            logger.error("Failed to start QMOI system")
            return False

        # Start monitoring
        self.run_continuous_monitoring()


def main():
    """Main function"""
    auto_setup = QMOIAutoSetup()
    auto_setup.run()


if __name__ == "__main__":
    main()
