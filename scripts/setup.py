import os
import sys
import subprocess
import logging
from typing import List, Dict, Any
import json
from pathlib import Path


class SetupManager:
    def __init__(self):
        self.logger = self._setup_logger()
        self.requirements_file = "requirements.txt"
        self.config_file = "config/enhanced_features.json"
        self.scripts_dir = "scripts"
        self.logs_dir = "logs"

    def _setup_logger(self) -> logging.Logger:
        """Setup logging configuration"""
        logger = logging.getLogger("SetupManager")
        logger.setLevel(logging.INFO)

        # Create logs directory if it doesn't exist
        os.makedirs("logs", exist_ok=True)

        # Setup file handler
        handler = logging.FileHandler("logs/setup.log")
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        # Setup console handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

        return logger

    def setup_environment(self) -> Dict[str, Any]:
        """Setup the entire environment"""
        self.logger.info("Starting environment setup...")

        results = {"status": "success", "steps": {}}

        try:
            # Create necessary directories
            self._create_directories()
            results["steps"]["directories"] = "success"

            # Install dependencies
            self._install_dependencies()
            results["steps"]["dependencies"] = "success"

            # Setup configuration
            self._setup_configuration()
            results["steps"]["configuration"] = "success"

            # Setup scripts
            self._setup_scripts()
            results["steps"]["scripts"] = "success"

            self.logger.info("Environment setup completed successfully")

        except Exception as e:
            self.logger.error(f"Error setting up environment: {str(e)}")
            results["status"] = "error"
            results["error"] = str(e)

        return results

    def _create_directories(self):
        """Create necessary directories"""
        self.logger.info("Creating directories...")

        directories = [
            self.logs_dir,
            "config",
            "data",
            "tests",
            "tests/unit",
            "tests/integration",
            "tests/e2e",
        ]

        for directory in directories:
            os.makedirs(directory, exist_ok=True)
            self.logger.info(f"Created directory: {directory}")

    def _install_dependencies(self):
        """Install Python dependencies"""
        self.logger.info("Installing dependencies...")

        try:
            # Upgrade pip
            subprocess.run([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])

            # Install requirements
            subprocess.run(
                [sys.executable, "-m", "pip", "install", "-r", self.requirements_file]
            )

            self.logger.info("Dependencies installed successfully")

        except Exception as e:
            self.logger.error(f"Error installing dependencies: {str(e)}")
            raise

    def _setup_configuration(self):
        """Setup configuration files"""
        self.logger.info("Setting up configuration...")

        try:
            # Create config directory if it doesn't exist
            os.makedirs("config", exist_ok=True)

            # Load default configuration
            default_config = {
                "security": {
                    "network": {
                        "firewall": {
                            "enabled": True,
                            "threat_detection": True,
                            "traffic_analysis": True,
                            "vpn_routing": True,
                            "dns_encryption": True,
                        }
                    }
                },
                "browser": {
                    "ad_blocking": {
                        "enabled": True,
                        "ai_detection": True,
                        "custom_filters": True,
                        "auto_update": True,
                    }
                },
                "preview": {
                    "file_preview": {
                        "enabled": True,
                        "universal_support": True,
                        "media_controls": True,
                    }
                },
            }

            # Save configuration
            with open(self.config_file, "w") as f:
                json.dump(default_config, f, indent=4)

            self.logger.info("Configuration setup completed")

        except Exception as e:
            self.logger.error(f"Error setting up configuration: {str(e)}")
            raise

    def _setup_scripts(self):
        """Setup Python scripts"""
        self.logger.info("Setting up scripts...")

        try:
            # Create scripts directory if it doesn't exist
            os.makedirs(self.scripts_dir, exist_ok=True)

            # Make scripts executable
            for script in Path(self.scripts_dir).glob("*.py"):
                os.chmod(script, 0o755)

            self.logger.info("Scripts setup completed")

        except Exception as e:
            self.logger.error(f"Error setting up scripts: {str(e)}")
            raise


def main():
    """Main function to run setup"""
    setup_manager = SetupManager()
    results = setup_manager.setup_environment()

    # Print results
    print("\nSetup Results:")
    print("=============")
    print(f"Status: {results['status']}")

    if results["status"] == "success":
        print("\nCompleted Steps:")
        for step, status in results["steps"].items():
            print(f"- {step}: {status}")
    else:
        print(f"\nError: {results['error']}")


if __name__ == "__main__":
    main()
