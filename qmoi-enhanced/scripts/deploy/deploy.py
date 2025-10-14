import os
import sys
import json
import logging
import subprocess
import shutil
import time
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import boto3
import azure.mgmt.resource
import google.cloud.resourcemanager
import paramiko
import docker
from pathlib import Path


class Deployer:
    def __init__(self, config_path: str = "config/deploy_config.json"):
        self.config_path = config_path
        self.config = self.load_config()
        self.logger = self.setup_logger()
        self.deployment_history = []
        self.current_deployment = None

        # Initialize cloud clients
        self.aws_client = None
        self.azure_client = None
        self.gcp_client = None

        # Initialize deployment targets
        self.targets = {
            "local": self._deploy_local,
            "aws": self._deploy_aws,
            "azure": self._deploy_azure,
            "gcp": self._deploy_gcp,
            "docker": self._deploy_docker,
            "kubernetes": self._deploy_kubernetes,
            "vercel": self._deploy_vercel,
        }

    def setup_logger(self) -> logging.Logger:
        """Setup logging configuration."""
        logger = logging.getLogger("Deployer")
        logger.setLevel(logging.INFO)

        # Create handlers
        file_handler = logging.FileHandler("logs/deployer.log")
        console_handler = logging.StreamHandler()

        # Create formatters
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        # Add handlers
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger

    def load_config(self) -> Dict:
        """Load deployment configuration."""
        try:
            with open(self.config_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            self.logger.warning(f"Config file not found: {self.config_path}")
            return {
                "default_target": "vercel",
                "backup_before_deploy": True,
                "notify_on_deploy": True,
                "deployment_timeout": 3600,
                "retry_attempts": 3,
                "targets": {
                    "local": {
                        "enabled": True,
                        "backup_dir": "backups",
                        "max_backups": 5,
                    },
                    "aws": {
                        "enabled": False,
                        "region": "us-west-2",
                        "instance_type": "t2.micro",
                        "ami_id": "ami-0c55b159cbfafe1f0",
                    },
                    "azure": {
                        "enabled": False,
                        "location": "westus2",
                        "vm_size": "Standard_B1s",
                        "image": "UbuntuServer",
                    },
                    "gcp": {
                        "enabled": False,
                        "project_id": "",
                        "zone": "us-central1-a",
                        "machine_type": "e2-micro",
                    },
                    "docker": {
                        "enabled": False,
                        "image_name": "q-city",
                        "container_name": "q-city-container",
                    },
                    "kubernetes": {
                        "enabled": False,
                        "namespace": "q-city",
                        "replicas": 1,
                    },
                    "vercel": {"enabled": True, "prod": True},
                },
            }

    def save_config(self) -> None:
        """Save deployment configuration."""
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        with open(self.config_path, "w") as f:
            json.dump(self.config, f, indent=4)

    def initialize_cloud_clients(self) -> None:
        """Initialize cloud service clients."""
        try:
            # Initialize AWS client
            if self.config["targets"]["aws"]["enabled"]:
                self.aws_client = boto3.client(
                    "ec2", region_name=self.config["targets"]["aws"]["region"]
                )

            # Initialize Azure client
            if self.config["targets"]["azure"]["enabled"]:
                credentials = azure.mgmt.resource.ResourceManagementClient(
                    credential=azure.identity.DefaultAzureCredential(),
                    subscription_id=self.config["targets"]["azure"]["subscription_id"],
                )
                self.azure_client = credentials

            # Initialize GCP client
            if self.config["targets"]["gcp"]["enabled"]:
                self.gcp_client = google.cloud.resourcemanager.ProjectsClient()

        except Exception as e:
            self.logger.error(f"Error initializing cloud clients: {e}")

    def deploy(self, target: Optional[str] = None) -> bool:
        """Deploy to specified target."""
        try:
            # Use default target if none specified
            target = target or self.config["default_target"]

            # Validate target
            if target not in self.targets:
                self.logger.error(f"Invalid deployment target: {target}")
                return False

            # Check if target is enabled
            if not self.config["targets"][target]["enabled"]:
                self.logger.error(f"Deployment target {target} is disabled")
                return False

            # Create backup if enabled
            if self.config["backup_before_deploy"]:
                self._create_backup()

            # Start deployment
            self.current_deployment = {
                "target": target,
                "start_time": datetime.now().isoformat(),
                "status": "in_progress",
            }

            # Execute deployment
            success = self.targets[target]()

            # Update deployment status
            self.current_deployment["end_time"] = datetime.now().isoformat()
            self.current_deployment["status"] = "completed" if success else "failed"

            # Add to history
            self.deployment_history.append(self.current_deployment)

            # Keep only last 100 deployments
            if len(self.deployment_history) > 100:
                self.deployment_history = self.deployment_history[-100:]

            return success

        except Exception as e:
            self.logger.error(f"Error during deployment: {e}")
            if self.current_deployment:
                self.current_deployment["end_time"] = datetime.now().isoformat()
                self.current_deployment["status"] = "failed"
                self.current_deployment["error"] = str(e)
                self.deployment_history.append(self.current_deployment)
            return False

    def _deploy_local(self) -> bool:
        """Deploy to local machine."""
        try:
            # Create deployment directory
            deploy_dir = "deployments/local"
            os.makedirs(deploy_dir, exist_ok=True)

            # Copy files
            for item in os.listdir("."):
                if item not in [".git", "deployments", "backups", "logs"]:
                    src = os.path.join(".", item)
                    dst = os.path.join(deploy_dir, item)
                    if os.path.isdir(src):
                        shutil.copytree(src, dst, dirs_exist_ok=True)
                    else:
                        shutil.copy2(src, dst)

            # Install dependencies
            subprocess.run(
                [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
                check=True,
            )

            # Start application
            subprocess.Popen([sys.executable, "main.py"], cwd=deploy_dir)

            self.logger.info("Local deployment completed successfully")
            return True

        except Exception as e:
            self.logger.error(f"Error in local deployment: {e}")
            return False

    def _deploy_aws(self) -> bool:
        """Deploy to AWS."""
        try:
            if not self.aws_client:
                self.initialize_cloud_clients()

            # Create EC2 instance
            response = self.aws_client.run_instances(
                ImageId=self.config["targets"]["aws"]["ami_id"],
                InstanceType=self.config["targets"]["aws"]["instance_type"],
                MinCount=1,
                MaxCount=1,
                TagSpecifications=[
                    {
                        "ResourceType": "instance",
                        "Tags": [{"Key": "Name", "Value": "q-city"}],
                    }
                ],
            )

            instance_id = response["Instances"][0]["InstanceId"]

            # Wait for instance to be running
            waiter = self.aws_client.get_waiter("instance_running")
            waiter.wait(InstanceIds=[instance_id])

            # Get instance public IP
            instance = self.aws_client.describe_instances(InstanceIds=[instance_id])[
                "Reservations"
            ][0]["Instances"][0]

            public_ip = instance["PublicIpAddress"]

            # Deploy application using SSH
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(
                public_ip,
                username="ec2-user",
                key_filename=self.config["targets"]["aws"]["key_path"],
            )

            # Copy files
            sftp = ssh.open_sftp()
            for item in os.listdir("."):
                if item not in [".git", "deployments", "backups", "logs"]:
                    src = os.path.join(".", item)
                    dst = f"/home/ec2-user/q-city/{item}"
                    if os.path.isdir(src):
                        self._copy_directory(sftp, src, dst)
                    else:
                        sftp.put(src, dst)

            # Install dependencies and start application
            commands = [
                "sudo yum update -y",
                "sudo yum install -y python3-pip",
                "cd q-city",
                "pip3 install -r requirements.txt",
                "nohup python3 main.py > app.log 2>&1 &",
            ]

            for command in commands:
                ssh.exec_command(command)

            ssh.close()

            self.logger.info(
                f"AWS deployment completed successfully. Instance IP: {public_ip}"
            )
            return True

        except Exception as e:
            self.logger.error(f"Error in AWS deployment: {e}")
            return False

    def _deploy_azure(self) -> bool:
        """Deploy to Azure."""
        try:
            if not self.azure_client:
                self.initialize_cloud_clients()

            # Create resource group
            resource_group = self.azure_client.resource_groups.create_or_update(
                self.config["targets"]["azure"]["resource_group"],
                {"location": self.config["targets"]["azure"]["location"]},
            )

            # Create virtual machine
            vm_client = azure.mgmt.compute.ComputeManagementClient(
                credential=azure.identity.DefaultAzureCredential(),
                subscription_id=self.config["targets"]["azure"]["subscription_id"],
            )

            vm = vm_client.virtual_machines.begin_create_or_update(
                resource_group.name,
                "q-city-vm",
                {
                    "location": resource_group.location,
                    "hardware_profile": {
                        "vm_size": self.config["targets"]["azure"]["vm_size"]
                    },
                    "storage_profile": {
                        "image_reference": {
                            "publisher": "Canonical",
                            "offer": "UbuntuServer",
                            "sku": "18.04-LTS",
                            "version": "latest",
                        }
                    },
                    "os_profile": {
                        "computer_name": "q-city-vm",
                        "admin_username": "azureuser",
                        "admin_password": self.config["targets"]["azure"][
                            "admin_password"
                        ],
                    },
                    "network_profile": {
                        "network_interfaces": [
                            {"id": self._create_network_interface(resource_group)}
                        ]
                    },
                },
            ).result()

            # Get VM public IP
            network_client = azure.mgmt.network.NetworkManagementClient(
                credential=azure.identity.DefaultAzureCredential(),
                subscription_id=self.config["targets"]["azure"]["subscription_id"],
            )

            public_ip = network_client.public_ip_addresses.get(
                resource_group.name, "q-city-ip"
            ).ip_address

            # Deploy application using SSH
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(
                public_ip,
                username="azureuser",
                password=self.config["targets"]["azure"]["admin_password"],
            )

            # Copy files
            sftp = ssh.open_sftp()
            for item in os.listdir("."):
                if item not in [".git", "deployments", "backups", "logs"]:
                    src = os.path.join(".", item)
                    dst = f"/home/azureuser/q-city/{item}"
                    if os.path.isdir(src):
                        self._copy_directory(sftp, src, dst)
                    else:
                        sftp.put(src, dst)

            # Install dependencies and start application
            commands = [
                "sudo apt-get update",
                "sudo apt-get install -y python3-pip",
                "cd q-city",
                "pip3 install -r requirements.txt",
                "nohup python3 main.py > app.log 2>&1 &",
            ]

            for command in commands:
                ssh.exec_command(command)

            ssh.close()

            self.logger.info(
                f"Azure deployment completed successfully. VM IP: {public_ip}"
            )
            return True

        except Exception as e:
            self.logger.error(f"Error in Azure deployment: {e}")
            return False

    def _deploy_gcp(self) -> bool:
        """Deploy to Google Cloud Platform."""
        try:
            if not self.gcp_client:
                self.initialize_cloud_clients()

            # Create compute engine instance
            compute_client = google.cloud.compute.ComputeEngineClient()

            instance = compute_client.insert_instance(
                project=self.config["targets"]["gcp"]["project_id"],
                zone=self.config["targets"]["gcp"]["zone"],
                instance_resource={
                    "name": "q-city-instance",
                    "machine_type": f"zones/{self.config['targets']['gcp']['zone']}/machineTypes/{self.config['targets']['gcp']['machine_type']}",
                    "disks": [
                        {
                            "boot": True,
                            "initialize_params": {
                                "source_image": "projects/ubuntu-os-cloud/global/images/family/ubuntu-1804-lts"
                            },
                        }
                    ],
                    "network_interfaces": [
                        {
                            "network": "global/networks/default",
                            "access_configs": [
                                {"name": "External NAT", "type": "ONE_TO_ONE_NAT"}
                            ],
                        }
                    ],
                },
            ).result()

            # Get instance public IP
            instance = compute_client.get_instance(
                project=self.config["targets"]["gcp"]["project_id"],
                zone=self.config["targets"]["gcp"]["zone"],
                instance="q-city-instance",
            )

            public_ip = instance.network_interfaces[0].access_configs[0].nat_i_p

            # Deploy application using SSH
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(
                public_ip,
                username="ubuntu",
                key_filename=self.config["targets"]["gcp"]["key_path"],
            )

            # Copy files
            sftp = ssh.open_sftp()
            for item in os.listdir("."):
                if item not in [".git", "deployments", "backups", "logs"]:
                    src = os.path.join(".", item)
                    dst = f"/home/ubuntu/q-city/{item}"
                    if os.path.isdir(src):
                        self._copy_directory(sftp, src, dst)
                    else:
                        sftp.put(src, dst)

            # Install dependencies and start application
            commands = [
                "sudo apt-get update",
                "sudo apt-get install -y python3-pip",
                "cd q-city",
                "pip3 install -r requirements.txt",
                "nohup python3 main.py > app.log 2>&1 &",
            ]

            for command in commands:
                ssh.exec_command(command)

            ssh.close()

            self.logger.info(
                f"GCP deployment completed successfully. Instance IP: {public_ip}"
            )
            return True

        except Exception as e:
            self.logger.error(f"Error in GCP deployment: {e}")
            return False

    def _deploy_docker(self) -> bool:
        """Deploy using Docker."""
        try:
            # Initialize Docker client
            client = docker.from_env()

            # Build Docker image
            client.images.build(
                path=".", tag=self.config["targets"]["docker"]["image_name"], rm=True
            )

            # Run container
            client.containers.run(
                self.config["targets"]["docker"]["image_name"],
                name=self.config["targets"]["docker"]["container_name"],
                detach=True,
                ports={"8000/tcp": 8000},
            )

            self.logger.info("Docker deployment completed successfully")
            return True

        except Exception as e:
            self.logger.error(f"Error in Docker deployment: {e}")
            return False

    def _deploy_kubernetes(self) -> bool:
        """Deploy to Kubernetes."""
        try:
            # Create deployment YAML
            deployment_yaml = f"""
            apiVersion: apps/v1
            kind: Deployment
            metadata:
              name: q-city
              namespace: {self.config['targets']['kubernetes']['namespace']}
            spec:
              replicas: {self.config['targets']['kubernetes']['replicas']}
              selector:
                matchLabels:
                  app: q-city
              template:
                metadata:
                  labels:
                    app: q-city
                spec:
                  containers:
                  - name: q-city
                    image: {self.config['targets']['docker']['image_name']}
                    ports:
                    - containerPort: 8000
            """

            # Apply deployment
            subprocess.run(
                ["kubectl", "apply", "-f", "-"],
                input=deployment_yaml.encode(),
                check=True,
            )

            # Create service
            service_yaml = f"""
            apiVersion: v1
            kind: Service
            metadata:
              name: q-city
              namespace: {self.config['targets']['kubernetes']['namespace']}
            spec:
              selector:
                app: q-city
              ports:
              - port: 80
                targetPort: 8000
              type: LoadBalancer
            """

            subprocess.run(
                ["kubectl", "apply", "-f", "-"], input=service_yaml.encode(), check=True
            )

            self.logger.info("Kubernetes deployment completed successfully")
            return True

        except Exception as e:
            self.logger.error(f"Error in Kubernetes deployment: {e}")
            return False

    def _deploy_vercel(self) -> bool:
        """Deploy to Vercel."""
        try:
            self.logger.info("Starting Vercel deployment...")
            command = ["npx", "vercel", "--yes"]
            if self.config["targets"]["vercel"].get("prod"):
                command.append("--prod")

            result = subprocess.run(command, check=True, capture_output=True, text=True)
            self.logger.info("Vercel deployment successful!")
            self.logger.info(result.stdout)
            return True
        except subprocess.CalledProcessError as e:
            self.logger.error(f"Error in Vercel deployment: {e}")
            self.logger.error(e.stderr)
            return False
        except Exception as e:
            self.logger.error(
                f"An unexpected error occurred during Vercel deployment: {e}"
            )
            return False

    def _create_backup(self) -> None:
        """Create a backup of the current state."""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_dir = os.path.join(
                self.config["targets"]["local"]["backup_dir"], f"backup_{timestamp}"
            )

            # Create backup directory
            os.makedirs(backup_dir, exist_ok=True)

            # Copy files
            for item in os.listdir("."):
                if item not in [".git", "deployments", "backups", "logs"]:
                    src = os.path.join(".", item)
                    dst = os.path.join(backup_dir, item)
                    if os.path.isdir(src):
                        shutil.copytree(src, dst)
                    else:
                        shutil.copy2(src, dst)

            # Clean up old backups
            self._cleanup_old_backups()

            self.logger.info(f"Created backup at: {backup_dir}")

        except Exception as e:
            self.logger.error(f"Error creating backup: {e}")

    def _cleanup_old_backups(self) -> None:
        """Clean up old backup files."""
        try:
            backup_dir = self.config["targets"]["local"]["backup_dir"]
            max_backups = self.config["targets"]["local"]["max_backups"]

            backups = sorted(
                [os.path.join(backup_dir, d) for d in os.listdir(backup_dir)],
                key=os.path.getmtime,
            )

            while len(backups) > max_backups:
                old_backup = backups.pop(0)
                shutil.rmtree(old_backup)
                self.logger.info(f"Removed old backup: {old_backup}")

        except Exception as e:
            self.logger.error(f"Error cleaning up old backups: {e}")

    def _copy_directory(self, sftp: paramiko.SFTPClient, src: str, dst: str) -> None:
        """Copy directory using SFTP."""
        try:
            os.makedirs(dst, exist_ok=True)

            for item in os.listdir(src):
                src_path = os.path.join(src, item)
                dst_path = os.path.join(dst, item)

                if os.path.isdir(src_path):
                    self._copy_directory(sftp, src_path, dst_path)
                else:
                    sftp.put(src_path, dst_path)

        except Exception as e:
            self.logger.error(f"Error copying directory: {e}")

    def get_deployment_statistics(self) -> Dict:
        """Get deployment statistics."""
        return {
            "total_deployments": len(self.deployment_history),
            "successful_deployments": len(
                [d for d in self.deployment_history if d["status"] == "completed"]
            ),
            "failed_deployments": len(
                [d for d in self.deployment_history if d["status"] == "failed"]
            ),
            "deployment_targets": self._count_deployment_targets(),
            "recent_deployments": self.deployment_history[-10:],
        }

    def _count_deployment_targets(self) -> Dict:
        """Count deployments by target."""
        counts = {}
        for deployment in self.deployment_history:
            target = deployment["target"]
            if target not in counts:
                counts[target] = {"total": 0, "successful": 0, "failed": 0}

            counts[target]["total"] += 1
            if deployment["status"] == "completed":
                counts[target]["successful"] += 1
            else:
                counts[target]["failed"] += 1

        return counts

    def cleanup(self) -> None:
        """Cleanup resources."""
        self.save_config()
        self.logger.info("Deployer cleanup completed")
