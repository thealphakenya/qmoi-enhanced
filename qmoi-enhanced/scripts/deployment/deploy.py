import os
import sys
import shutil
import subprocess
import logging
import json
from typing import Dict, List, Optional
from datetime import datetime


class QCityDeployer:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.deploy_log_path = "logs/deploy.log"
        self.config_path = "config/deploy_config.json"

        # Create logs directory if it doesn't exist
        os.makedirs("logs", exist_ok=True)

        # Setup logging
        self.setup_logging()

        # Load deployment configuration
        self.config = self.load_config()

    def setup_logging(self):
        """Setup logging configuration."""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler(self.deploy_log_path),
                logging.StreamHandler(sys.stdout),
            ],
        )

    def load_config(self) -> Dict:
        """Load deployment configuration."""
        try:
            with open(self.config_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return self.get_default_config()

    def get_default_config(self) -> Dict:
        """Get default deployment configuration."""
        return {
            "version": "1.0.0",
            "environment": "production",
            "backup": True,
            "cleanup": True,
            "notify": True,
            "targets": {"windows": True, "linux": False, "macos": False},
            "components": {
                "ui": True,
                "network": True,
                "optimization": True,
                "error_tracking": True,
            },
        }

    def deploy(self):
        """Deploy Q-city."""
        self.logger.info("Starting deployment...")

        try:
            # Create backup
            if self.config["backup"]:
                self.create_backup()

            # Deploy components
            self.deploy_components()

            # Cleanup
            if self.config["cleanup"]:
                self.cleanup()

            # Notify
            if self.config["notify"]:
                self.notify_deployment()

            self.logger.info("Deployment completed successfully")

        except Exception as e:
            self.logger.error(f"Deployment failed: {e}")
            raise

    def create_backup(self):
        """Create backup of current installation."""
        self.logger.info("Creating backup...")

        backup_dir = f"backups/{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.makedirs(backup_dir, exist_ok=True)

        # Backup important directories
        for dir_name in ["config", "logs", "scripts"]:
            if os.path.exists(dir_name):
                shutil.copytree(
                    dir_name, os.path.join(backup_dir, dir_name), dirs_exist_ok=True
                )

        self.logger.info(f"Backup created at {backup_dir}")

    def deploy_components(self):
        """Deploy Q-city components."""
        self.logger.info("Deploying components...")

        # Deploy UI
        if self.config["components"]["ui"]:
            self.deploy_ui()

        # Deploy network manager
        if self.config["components"]["network"]:
            self.deploy_network_manager()

        # Deploy optimization
        if self.config["components"]["optimization"]:
            self.deploy_optimization()

        # Deploy error tracking
        if self.config["components"]["error_tracking"]:
            self.deploy_error_tracking()

    def deploy_ui(self):
        """Deploy UI components."""
        self.logger.info("Deploying UI...")

        # Copy UI files
        ui_files = [
            "scripts/ui/qcity_ui_enhancement.py",
            "scripts/ui/styles.css",
            "scripts/ui/assets/",
        ]

        for file_path in ui_files:
            if os.path.exists(file_path):
                if os.path.isdir(file_path):
                    shutil.copytree(
                        file_path,
                        os.path.join("dist", "ui", os.path.basename(file_path)),
                        dirs_exist_ok=True,
                    )
                else:
                    shutil.copy2(
                        file_path,
                        os.path.join("dist", "ui", os.path.basename(file_path)),
                    )

    def deploy_network_manager(self):
        """Deploy network manager components."""
        self.logger.info("Deploying network manager...")

        # Copy network manager files
        network_files = [
            "scripts/network/wifi_manager.py",
            "config/saved_networks.json",
        ]

        for file_path in network_files:
            if os.path.exists(file_path):
                shutil.copy2(
                    file_path,
                    os.path.join("dist", "network", os.path.basename(file_path)),
                )

    def deploy_optimization(self):
        """Deploy optimization components."""
        self.logger.info("Deploying optimization...")

        # Copy optimization files
        optimization_files = [
            "scripts/optimization/advanced_optimization.py",
            "config/optimization_config.json",
        ]

        for file_path in optimization_files:
            if os.path.exists(file_path):
                shutil.copy2(
                    file_path,
                    os.path.join("dist", "optimization", os.path.basename(file_path)),
                )

    def deploy_error_tracking(self):
        """Deploy error tracking components."""
        self.logger.info("Deploying error tracking...")

        # Copy error tracking files
        error_files = ["scripts/utils/error_fixer.py", "config/error_config.json"]

        for file_path in error_files:
            if os.path.exists(file_path):
                shutil.copy2(
                    file_path,
                    os.path.join("dist", "error_tracking", os.path.basename(file_path)),
                )

    def cleanup(self):
        """Clean up temporary files."""
        self.logger.info("Cleaning up...")

        # Remove temporary files
        temp_dirs = ["__pycache__", ".pytest_cache", ".coverage"]
        for dir_name in temp_dirs:
            if os.path.exists(dir_name):
                shutil.rmtree(dir_name)

        # Remove old backups (keep last 5)
        backup_dir = "backups"
        if os.path.exists(backup_dir):
            backups = sorted(os.listdir(backup_dir))
            if len(backups) > 5:
                for old_backup in backups[:-5]:
                    shutil.rmtree(os.path.join(backup_dir, old_backup))

    def notify_deployment(self):
        """Notify about deployment completion."""
        self.logger.info("Sending deployment notification...")

        # Create notification message
        message = f"""
        Q-City Deployment Complete
        Version: {self.config['version']}
        Environment: {self.config['environment']}
        Timestamp: {datetime.now().isoformat()}
        """

        # Send notification (implement your preferred notification method)
        print(message)


def main():
    deployer = QCityDeployer()
    deployer.deploy()


if __name__ == "__main__":
    main()
