"""
Cloud deployment module for Q-city application.
Supports multiple cloud platforms including Heroku and DigitalOcean.
"""

from typing import Dict, List, Optional, Union
import os
import json
from dataclasses import dataclass
import subprocess
from pathlib import Path


@dataclass
class CloudConfig:
    """Configuration for cloud deployment."""

    platform: str
    region: str
    instance_type: str
    scaling_config: Dict[str, Union[int, bool]]
    environment_vars: Dict[str, str]
    backup_config: Dict[str, Union[str, int]]


class CloudDeployer:
    """Handles cloud deployment for Q-city."""

    def __init__(self, config: CloudConfig):
        self.config = config
        self.deployment_history: List[Dict] = []
        self.current_state: Dict = {}

    def deploy(self, app_path: str) -> bool:
        """Deploy the application to the configured cloud platform."""
        try:
            if self.config.platform == "heroku":
                return self._deploy_to_heroku(app_path)
            elif self.config.platform == "digitalocean":
                return self._deploy_to_digitalocean(app_path)
            else:
                raise ValueError(f"Unsupported platform: {self.config.platform}")
        except Exception as e:
            self._log_deployment_error(str(e))
            return False

    def _deploy_to_heroku(self, app_path: str) -> bool:
        """Deploy to Heroku platform."""
        try:
            # Set up Heroku CLI commands
            commands = [
                f"heroku create q-city-{self.config.region}",
                f"heroku config:set {' '.join(f'{k}={v}' for k, v in self.config.environment_vars.items())}",
                "git add .",
                "git commit -m 'Deploy to Heroku'",
                "git push heroku main",
            ]

            # Execute deployment commands
            for cmd in commands:
                subprocess.run(cmd, shell=True, check=True)

            self._log_deployment_success("heroku")
            return True

        except subprocess.CalledProcessError as e:
            self._log_deployment_error(f"Heroku deployment failed: {str(e)}")
            return False

    def _deploy_to_digitalocean(self, app_path: str) -> bool:
        """Deploy to DigitalOcean platform."""
        try:
            # Set up DigitalOcean deployment commands
            commands = [
                f"doctl apps create --spec {self._generate_do_spec(app_path)}",
                f"doctl apps update {self._get_app_id()} --spec {self._generate_do_spec(app_path)}",
            ]

            # Execute deployment commands
            for cmd in commands:
                subprocess.run(cmd, shell=True, check=True)

            self._log_deployment_success("digitalocean")
            return True

        except subprocess.CalledProcessError as e:
            self._log_deployment_error(f"DigitalOcean deployment failed: {str(e)}")
            return False

    def _generate_do_spec(self, app_path: str) -> str:
        """Generate DigitalOcean app specification."""
        spec = {
            "name": f"q-city-{self.config.region}",
            "region": self.config.region,
            "services": [
                {
                    "name": "web",
                    "instance_count": self.config.scaling_config.get(
                        "min_instances", 1
                    ),
                    "instance_size_slug": self.config.instance_type,
                    "envs": self.config.environment_vars,
                }
            ],
        }

        spec_path = Path(app_path) / "do-app.yaml"
        with open(spec_path, "w") as f:
            json.dump(spec, f, indent=2)

        return str(spec_path)

    def _get_app_id(self) -> str:
        """Get the DigitalOcean app ID."""
        result = subprocess.run(
            "doctl apps list --format ID", shell=True, capture_output=True, text=True
        )
        return result.stdout.strip()

    def _log_deployment_success(self, platform: str) -> None:
        """Log successful deployment."""
        self.deployment_history.append(
            {
                "timestamp": "now",  # Replace with actual timestamp
                "platform": platform,
                "status": "success",
                "config": self.config.__dict__,
            }
        )

    def _log_deployment_error(self, error: str) -> None:
        """Log deployment error."""
        self.deployment_history.append(
            {
                "timestamp": "now",  # Replace with actual timestamp
                "platform": self.config.platform,
                "status": "error",
                "error": error,
                "config": self.config.__dict__,
            }
        )

    def get_deployment_history(self) -> List[Dict]:
        """Get the deployment history."""
        return self.deployment_history

    def reset_deployment_history(self) -> None:
        """Reset the deployment history."""
        self.deployment_history = []


def create_deployer(config: CloudConfig) -> CloudDeployer:
    """Factory function to create a deployer instance."""
    return CloudDeployer(config)
