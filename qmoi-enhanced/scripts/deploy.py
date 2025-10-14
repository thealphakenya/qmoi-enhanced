import os
import sys
import logging
import json
import subprocess
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path
import shutil
import requests
import docker
from fabric import Connection
import paramiko
import yaml


class Deployer:
    def __init__(self, config_path: Optional[str] = None):
        self.logger = self._setup_logger()
        self.config = self._load_config(config_path)
        self.deploy_dir = Path(self.config["deploy_dir"])
        self.deploy_dir.mkdir(exist_ok=True)
        self.deployment_history: List[Dict] = []
        self.current_version = self._get_current_version()

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger("Deployer")
        logger.setLevel(logging.INFO)

        # Create handlers
        file_handler = logging.FileHandler("deploy.log")
        console_handler = logging.StreamHandler()

        # Create formatters and add it to handlers
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        # Add handlers to the logger
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger

    def _load_config(self, config_path: Optional[str]) -> Dict:
        """Load deployment configuration from file or use defaults."""
        if config_path and os.path.exists(config_path):
            try:
                with open(config_path, "r") as f:
                    return json.load(f)
            except Exception as e:
                self.logger.error(f"Error loading config: {str(e)}")
                return self._get_default_config()
        return self._get_default_config()

    def _get_default_config(self) -> Dict:
        """Get default deployment configuration."""
        return {
            "deploy_dir": "deployments",
            "app_name": "alpha-q-ai",
            "environments": {
                "development": {
                    "host": "localhost",
                    "port": 22,
                    "user": "deploy",
                    "key_file": "~/.ssh/id_rsa",
                    "app_dir": "/var/www/alpha-q-ai",
                    "docker_compose": True,
                },
                "staging": {
                    "host": "staging.example.com",
                    "port": 22,
                    "user": "deploy",
                    "key_file": "~/.ssh/id_rsa",
                    "app_dir": "/var/www/alpha-q-ai",
                    "docker_compose": True,
                },
                "production": {
                    "host": "production.example.com",
                    "port": 22,
                    "user": "deploy",
                    "key_file": "~/.ssh/id_rsa",
                    "app_dir": "/var/www/alpha-q-ai",
                    "docker_compose": True,
                },
            },
            "docker": {
                "registry": "docker.io",
                "repository": "alpha-q-ai",
                "build_args": {},
            },
            "backup": {"enabled": True, "retention_days": 7},
        }

    def _get_current_version(self) -> str:
        """Get current application version."""
        try:
            version_file = Path("version.txt")
            if version_file.exists():
                with open(version_file, "r") as f:
                    return f.read().strip()
            return "0.0.0"
        except Exception as e:
            self.logger.error(f"Error getting current version: {str(e)}")
            return "0.0.0"

    def _update_version(self, new_version: str) -> None:
        """Update application version."""
        try:
            with open("version.txt", "w") as f:
                f.write(new_version)
            self.current_version = new_version
            self.logger.info(f"Version updated to: {new_version}")
        except Exception as e:
            self.logger.error(f"Error updating version: {str(e)}")
            raise

    def _create_deployment_record(
        self, environment: str, version: str, status: str, details: Dict
    ) -> None:
        """Create deployment record."""
        try:
            record = {
                "timestamp": datetime.now().isoformat(),
                "environment": environment,
                "version": version,
                "status": status,
                "details": details,
            }

            self.deployment_history.append(record)

            # Save to file
            deployment_file = (
                self.deploy_dir / f"deployment_{environment}_{version}.json"
            )
            with open(deployment_file, "w") as f:
                json.dump(record, f, indent=2)

            self.logger.info(f"Deployment record created: {deployment_file}")
        except Exception as e:
            self.logger.error(f"Error creating deployment record: {str(e)}")

    def _build_docker_image(self, version: str) -> str:
        """Build Docker image for deployment."""
        try:
            client = docker.from_env()

            # Build image
            image_name = f"{self.config['docker']['registry']}/{self.config['docker']['repository']}:{version}"
            client.images.build(
                path=".", tag=image_name, buildargs=self.config["docker"]["build_args"]
            )

            # Push to registry
            client.images.push(image_name)

            self.logger.info(f"Docker image built and pushed: {image_name}")
            return image_name
        except Exception as e:
            self.logger.error(f"Error building Docker image: {str(e)}")
            raise

    def _deploy_docker_compose(self, environment: str, version: str) -> None:
        """Deploy using Docker Compose."""
        try:
            env_config = self.config["environments"][environment]

            # Create connection
            conn = Connection(
                host=env_config["host"],
                user=env_config["user"],
                port=env_config["port"],
                connect_kwargs={"key_filename": env_config["key_file"]},
            )

            # Update docker-compose.yml
            compose_file = Path("docker-compose.yml")
            if compose_file.exists():
                with open(compose_file, "r") as f:
                    compose_config = yaml.safe_load(f)

                # Update image version
                for service in compose_config["services"].values():
                    if "image" in service:
                        service["image"] = (
                            f"{self.config['docker']['repository']}:{version}"
                        )

                # Save updated config
                with open(compose_file, "w") as f:
                    yaml.dump(compose_config, f)

            # Deploy to remote server
            with conn.cd(env_config["app_dir"]):
                # Upload files
                conn.put("docker-compose.yml", "docker-compose.yml")

                # Pull new images and restart
                conn.run("docker-compose pull")
                conn.run("docker-compose up -d")

            self.logger.info(f"Docker Compose deployment completed for {environment}")
        except Exception as e:
            self.logger.error(f"Error deploying with Docker Compose: {str(e)}")
            raise

    def _backup_environment(self, environment: str) -> None:
        """Create backup of current deployment."""
        try:
            if not self.config["backup"]["enabled"]:
                return

            env_config = self.config["environments"][environment]
            backup_dir = self.deploy_dir / "backups" / environment
            backup_dir.mkdir(parents=True, exist_ok=True)

            # Create backup
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_name = f"backup_{environment}_{timestamp}"
            backup_path = backup_dir / backup_name

            # Create connection
            conn = Connection(
                host=env_config["host"],
                user=env_config["user"],
                port=env_config["port"],
                connect_kwargs={"key_filename": env_config["key_file"]},
            )

            # Create backup archive
            with conn.cd(env_config["app_dir"]):
                conn.run(f"tar -czf {backup_name}.tar.gz .")
                conn.get(f"{backup_name}.tar.gz", str(backup_path) + ".tar.gz")
                conn.run(f"rm {backup_name}.tar.gz")

            self.logger.info(f"Backup created: {backup_path}")
        except Exception as e:
            self.logger.error(f"Error creating backup: {str(e)}")
            raise

    def _cleanup_old_backups(self) -> None:
        """Remove old backups."""
        try:
            if not self.config["backup"]["enabled"]:
                return

            retention_date = datetime.now() - timedelta(
                days=self.config["backup"]["retention_days"]
            )
            backup_dir = self.deploy_dir / "backups"

            for env_dir in backup_dir.iterdir():
                if env_dir.is_dir():
                    for backup_file in env_dir.glob("backup_*.tar.gz"):
                        try:
                            backup_date = datetime.strptime(
                                backup_file.stem.split("_")[2], "%Y%m%d_%H%M%S"
                            )
                            if backup_date < retention_date:
                                backup_file.unlink()
                                self.logger.info(f"Removed old backup: {backup_file}")
                        except Exception as e:
                            self.logger.warning(
                                f"Error processing backup {backup_file}: {str(e)}"
                            )
        except Exception as e:
            self.logger.error(f"Error cleaning up old backups: {str(e)}")

    def deploy(self, environment: str, version: Optional[str] = None) -> bool:
        """Deploy application to specified environment."""
        try:
            if environment not in self.config["environments"]:
                raise ValueError(f"Invalid environment: {environment}")

            # Generate version if not provided
            if not version:
                version = datetime.now().strftime("%Y%m%d_%H%M%S")

            self.logger.info(
                f"Starting deployment to {environment} (version: {version})"
            )

            # Create backup
            self._backup_environment(environment)

            # Build and push Docker image
            image_name = self._build_docker_image(version)

            # Deploy using Docker Compose
            self._deploy_docker_compose(environment, version)

            # Update version
            self._update_version(version)

            # Create deployment record
            self._create_deployment_record(
                environment=environment,
                version=version,
                status="success",
                details={"image": image_name, "method": "docker-compose"},
            )

            # Cleanup old backups
            self._cleanup_old_backups()

            self.logger.info(
                f"Deployment completed successfully: {environment} -> {version}"
            )
            return True
        except Exception as e:
            self.logger.error(f"Deployment failed: {str(e)}")

            # Create failed deployment record
            self._create_deployment_record(
                environment=environment,
                version=version or "unknown",
                status="failed",
                details={"error": str(e)},
            )

            return False

    def rollback(self, environment: str, version: str) -> bool:
        """Rollback deployment to specified version."""
        try:
            self.logger.info(f"Starting rollback to version {version} in {environment}")

            # Find backup for version
            backup_dir = self.deploy_dir / "backups" / environment
            backup_file = next(
                (
                    f
                    for f in backup_dir.glob(f"backup_{environment}_{version}_*.tar.gz")
                ),
                None,
            )

            if not backup_file:
                raise ValueError(f"No backup found for version {version}")

            # Deploy backup
            env_config = self.config["environments"][environment]

            # Create connection
            conn = Connection(
                host=env_config["host"],
                user=env_config["user"],
                port=env_config["port"],
                connect_kwargs={"key_filename": env_config["key_file"]},
            )

            # Restore backup
            with conn.cd(env_config["app_dir"]):
                # Upload backup
                conn.put(str(backup_file), "backup.tar.gz")

                # Extract backup
                conn.run("tar -xzf backup.tar.gz")
                conn.run("rm backup.tar.gz")

                # Restart services
                if env_config["docker_compose"]:
                    conn.run("docker-compose up -d")

            # Update version
            self._update_version(version)

            # Create rollback record
            self._create_deployment_record(
                environment=environment,
                version=version,
                status="rollback",
                details={"backup_file": str(backup_file), "method": "backup-restore"},
            )

            self.logger.info(
                f"Rollback completed successfully: {environment} -> {version}"
            )
            return True
        except Exception as e:
            self.logger.error(f"Rollback failed: {str(e)}")

            # Create failed rollback record
            self._create_deployment_record(
                environment=environment,
                version=version,
                status="rollback-failed",
                details={"error": str(e)},
            )

            return False

    def get_deployment_history(self, environment: Optional[str] = None) -> List[Dict]:
        """Get deployment history, optionally filtered by environment."""
        if environment:
            return [
                d for d in self.deployment_history if d["environment"] == environment
            ]
        return self.deployment_history


def main():
    # Example usage
    deployer = Deployer()

    try:
        # Deploy to staging
        success = deployer.deploy("staging")
        print(f"Deployment to staging: {'Success' if success else 'Failed'}")

        # Get deployment history
        history = deployer.get_deployment_history("staging")
        print("\nDeployment History:")
        for record in history:
            print(
                f"- {record['version']} ({record['status']}) at {record['timestamp']}"
            )

        # Rollback if needed
        if not success and history:
            last_version = history[-1]["version"]
            rollback_success = deployer.rollback("staging", last_version)
            print(
                f"\nRollback to {last_version}: {'Success' if rollback_success else 'Failed'}"
            )

    except Exception as e:
        print(f"Error: {str(e)}")


if __name__ == "__main__":
    main()
