import os
import sys
import json
import logging
import subprocess
import shutil
import time
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import heroku3
import digitalocean
import boto3
import google.cloud.resourcemanager
import azure.mgmt.resource
import paramiko
import docker
from pathlib import Path


class CloudDeployer:
    def __init__(self, config_path: str = "config/cloud_config.json"):
        self.config_path = config_path
        self.config = self.load_config()
        self.logger = self.setup_logger()
        self.deployment_history = []
        self.current_deployment = None

        # Initialize cloud clients
        self.heroku_client = None
        self.digitalocean_client = None
        self.aws_client = None
        self.azure_client = None
        self.gcp_client = None

        # Initialize deployment targets
        self.targets = {
            "heroku": self._deploy_heroku,
            "digitalocean": self._deploy_digitalocean,
            "aws": self._deploy_aws,
            "azure": self._deploy_azure,
            "gcp": self._deploy_gcp,
            "vercel": self._deploy_vercel,
        }

    def setup_logger(self) -> logging.Logger:
        """Setup logging configuration."""
        logger = logging.getLogger("CloudDeployer")
        logger.setLevel(logging.INFO)

        # Create handlers
        file_handler = logging.FileHandler("logs/cloud_deploy.log")
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
        """Load cloud deployment configuration."""
        try:
            with open(self.config_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "default_target": "vercel",
                "heroku": {
                    "enabled": False,
                    "app_name": "q-city",
                    "region": "us",
                    "stack": "container",
                    "addons": ["heroku-postgresql", "heroku-redis"],
                    "config_vars": {"ENVIRONMENT": "production"},
                },
                "digitalocean": {
                    "enabled": False,
                    "region": "nyc3",
                    "size": "s-1vcpu-1gb",
                    "image": "ubuntu-20-04-x64",
                    "ssh_keys": [],
                    "backups": True,
                    "monitoring": True,
                },
                "aws": {
                    "enabled": False,
                    "region": "us-west-2",
                    "instance_type": "t2.micro",
                    "ami_id": "ami-0c55b159cbfafe1f0",
                    "security_groups": [],
                    "key_name": "q-city",
                },
                "azure": {
                    "enabled": False,
                    "location": "westus2",
                    "vm_size": "Standard_B1s",
                    "image": "UbuntuServer",
                    "resource_group": "q-city",
                    "subnet": "default",
                },
                "gcp": {
                    "enabled": False,
                    "project_id": "",
                    "zone": "us-central1-a",
                    "machine_type": "e2-micro",
                    "image": "ubuntu-2004-focal-v20201014",
                    "network": "default",
                },
                "vercel": {"enabled": True, "prod": True},
            }

    def save_config(self) -> None:
        """Save cloud deployment configuration."""
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        with open(self.config_path, "w") as f:
            json.dump(self.config, f, indent=4)

    def initialize_cloud_clients(self) -> None:
        """Initialize cloud service clients."""
        try:
            # Initialize Heroku client
            if self.config["heroku"]["enabled"]:
                self.heroku_client = heroku3.from_key(os.environ.get("HEROKU_API_KEY"))

            # Initialize DigitalOcean client
            if self.config["digitalocean"]["enabled"]:
                self.digitalocean_client = digitalocean.Manager(
                    token=os.environ.get("DIGITALOCEAN_TOKEN")
                )

            # Initialize AWS client
            if self.config["aws"]["enabled"]:
                self.aws_client = boto3.client(
                    "ec2", region_name=self.config["aws"]["region"]
                )

            # Initialize Azure client
            if self.config["azure"]["enabled"]:
                self.azure_client = azure.mgmt.resource.ResourceManagementClient(
                    credential=azure.identity.DefaultAzureCredential(),
                    subscription_id=os.environ.get("AZURE_SUBSCRIPTION_ID"),
                )

            # Initialize GCP client
            if self.config["gcp"]["enabled"]:
                self.gcp_client = google.cloud.resourcemanager.ProjectsClient()

        except Exception as e:
            self.logger.error(f"Error initializing cloud clients: {e}")

    def deploy(self, target: str) -> bool:
        """Deploy to specified cloud target."""
        try:
            # Validate target
            if target not in self.targets:
                self.logger.error(f"Invalid deployment target: {target}")
                return False

            # Check if target is enabled
            if not self.config[target]["enabled"]:
                self.logger.error(f"Deployment target {target} is disabled")
                return False

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

    def _deploy_heroku(self) -> bool:
        """Deploy to Heroku."""
        try:
            if not self.heroku_client:
                self.initialize_cloud_clients()

            # Create app if it doesn't exist
            try:
                app = self.heroku_client.apps()[self.config["heroku"]["app_name"]]
            except:
                app = self.heroku_client.create_app(
                    name=self.config["heroku"]["app_name"],
                    region=self.config["heroku"]["region"],
                    stack=self.config["heroku"]["stack"],
                )

            # Add addons
            for addon in self.config["heroku"]["addons"]:
                app.install_addon(addon)

            # Set config vars
            app.update_config_vars(self.config["heroku"]["config_vars"])

            # Create Procfile
            with open("Procfile", "w") as f:
                f.write("web: python main.py")

            # Create runtime.txt
            with open("runtime.txt", "w") as f:
                f.write("python-3.9.0")

            # Initialize git repository
            subprocess.run(["git", "init"], check=True)

            # Add Heroku remote
            subprocess.run(
                [
                    "git",
                    "remote",
                    "add",
                    "heroku",
                    f"https://git.heroku.com/{app.name}.git",
                ],
                check=True,
            )

            # Commit changes
            subprocess.run(["git", "add", "."], check=True)
            subprocess.run(["git", "commit", "-m", "Deploy to Heroku"], check=True)

            # Push to Heroku
            subprocess.run(["git", "push", "heroku", "master"], check=True)

            self.logger.info(f"Deployed to Heroku app: {app.name}")
            return True

        except Exception as e:
            self.logger.error(f"Error deploying to Heroku: {e}")
            return False

    def _deploy_digitalocean(self) -> bool:
        """Deploy to DigitalOcean."""
        try:
            if not self.digitalocean_client:
                self.initialize_cloud_clients()

            # Create droplet
            droplet = digitalocean.Droplet(
                token=os.environ.get("DIGITALOCEAN_TOKEN"),
                name="q-city",
                region=self.config["digitalocean"]["region"],
                image=self.config["digitalocean"]["image"],
                size_slug=self.config["digitalocean"]["size"],
                ssh_keys=self.config["digitalocean"]["ssh_keys"],
                backups=self.config["digitalocean"]["backups"],
                monitoring=self.config["digitalocean"]["monitoring"],
            )

            droplet.create()

            # Wait for droplet to be ready
            while True:
                actions = droplet.get_actions()
                for action in actions:
                    action.load()
                    if action.status == "completed":
                        break
                time.sleep(5)

            # Get droplet IP
            droplet.load()
            ip_address = droplet.ip_address

            # Deploy application using SSH
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(
                ip_address,
                username="root",
                key_filename=os.environ.get("DIGITALOCEAN_SSH_KEY"),
            )

            # Copy files
            sftp = ssh.open_sftp()
            for item in os.listdir("."):
                if item not in [".git", "deployments", "backups", "logs"]:
                    src = os.path.join(".", item)
                    dst = f"/root/q-city/{item}"
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

            self.logger.info(f"Deployed to DigitalOcean droplet: {ip_address}")
            return True

        except Exception as e:
            self.logger.error(f"Error deploying to DigitalOcean: {e}")
            return False

    def _deploy_aws(self) -> bool:
        """Deploy to AWS."""
        try:
            if not self.aws_client:
                self.initialize_cloud_clients()

            # Create EC2 instance
            response = self.aws_client.run_instances(
                ImageId=self.config["aws"]["ami_id"],
                InstanceType=self.config["aws"]["instance_type"],
                MinCount=1,
                MaxCount=1,
                SecurityGroupIds=self.config["aws"]["security_groups"],
                KeyName=self.config["aws"]["key_name"],
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
                key_filename=os.environ.get("AWS_KEY_PATH"),
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

            self.logger.info(f"Deployed to AWS instance: {public_ip}")
            return True

        except Exception as e:
            self.logger.error(f"Error deploying to AWS: {e}")
            return False

    def _deploy_azure(self) -> bool:
        """Deploy to Azure."""
        try:
            if not self.azure_client:
                self.initialize_cloud_clients()

            # Create resource group
            resource_group = self.azure_client.resource_groups.create_or_update(
                self.config["azure"]["resource_group"],
                {"location": self.config["azure"]["location"]},
            )

            # Create virtual machine
            vm_client = azure.mgmt.compute.ComputeManagementClient(
                credential=azure.identity.DefaultAzureCredential(),
                subscription_id=os.environ.get("AZURE_SUBSCRIPTION_ID"),
            )

            vm = vm_client.virtual_machines.begin_create_or_update(
                resource_group.name,
                "q-city-vm",
                {
                    "location": resource_group.location,
                    "hardware_profile": {"vm_size": self.config["azure"]["vm_size"]},
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
                        "admin_password": os.environ.get("AZURE_VM_PASSWORD"),
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
                subscription_id=os.environ.get("AZURE_SUBSCRIPTION_ID"),
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
                password=os.environ.get("AZURE_VM_PASSWORD"),
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

            self.logger.info(f"Deployed to Azure VM: {public_ip}")
            return True

        except Exception as e:
            self.logger.error(f"Error deploying to Azure: {e}")
            return False

    def _deploy_gcp(self) -> bool:
        """Deploy to Google Cloud Platform."""
        try:
            if not self.gcp_client:
                self.initialize_cloud_clients()

            # Create compute engine instance
            compute_client = google.cloud.compute.ComputeEngineClient()

            instance = compute_client.insert_instance(
                project=self.config["gcp"]["project_id"],
                zone=self.config["gcp"]["zone"],
                instance_resource={
                    "name": "q-city-instance",
                    "machine_type": f"zones/{self.config['gcp']['zone']}/machineTypes/{self.config['gcp']['machine_type']}",
                    "disks": [
                        {
                            "boot": True,
                            "initialize_params": {
                                "source_image": f"projects/{self.config['gcp']['project_id']}/global/images/{self.config['gcp']['image']}"
                            },
                        }
                    ],
                    "network_interfaces": [
                        {
                            "network": f"projects/{self.config['gcp']['project_id']}/global/networks/{self.config['gcp']['network']}",
                            "access_configs": [
                                {"name": "External NAT", "type": "ONE_TO_ONE_NAT"}
                            ],
                        }
                    ],
                },
            ).result()

            # Get instance public IP
            instance = compute_client.get_instance(
                project=self.config["gcp"]["project_id"],
                zone=self.config["gcp"]["zone"],
                instance="q-city-instance",
            )

            public_ip = instance.network_interfaces[0].access_configs[0].nat_i_p

            # Deploy application using SSH
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(
                public_ip, username="ubuntu", key_filename=os.environ.get("GCP_SSH_KEY")
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

            self.logger.info(f"Deployed to GCP instance: {public_ip}")
            return True

        except Exception as e:
            self.logger.error(f"Error deploying to GCP: {e}")
            return False

    def _deploy_vercel(self) -> bool:
        """Deploy to Vercel."""
        try:
            self.logger.info("Starting Vercel deployment...")
            command = ["npx", "vercel", "--yes"]
            if self.config["vercel"].get("prod"):
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

    def _copy_directory(self, sftp: paramiko.SFTPClient, src: str, dst: str) -> None:
        """Copy directory recursively using SFTP."""
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

    def _create_network_interface(self, resource_group) -> str:
        """Create network interface for Azure VM."""
        try:
            # Create virtual network
            network_client = azure.mgmt.network.NetworkManagementClient(
                credential=azure.identity.DefaultAzureCredential(),
                subscription_id=os.environ.get("AZURE_SUBSCRIPTION_ID"),
            )

            vnet = network_client.virtual_networks.begin_create_or_update(
                resource_group.name,
                "q-city-vnet",
                {
                    "location": resource_group.location,
                    "address_space": {"address_prefixes": ["10.0.0.0/16"]},
                },
            ).result()

            # Create subnet
            subnet = network_client.subnets.begin_create_or_update(
                resource_group.name,
                vnet.name,
                self.config["azure"]["subnet"],
                {"address_prefix": "10.0.0.0/24"},
            ).result()

            # Create public IP
            public_ip = network_client.public_ip_addresses.begin_create_or_update(
                resource_group.name,
                "q-city-ip",
                {
                    "location": resource_group.location,
                    "public_ip_allocation_method": "Dynamic",
                },
            ).result()

            # Create network interface
            nic = network_client.network_interfaces.begin_create_or_update(
                resource_group.name,
                "q-city-nic",
                {
                    "location": resource_group.location,
                    "ip_configurations": [
                        {
                            "name": "q-city-ipconfig",
                            "subnet": {"id": subnet.id},
                            "public_ip_address": {"id": public_ip.id},
                        }
                    ],
                },
            ).result()

            return nic.id

        except Exception as e:
            self.logger.error(f"Error creating network interface: {e}")
            return ""

    def cleanup(self) -> None:
        """Cleanup resources."""
        self.save_config()
        self.logger.info("Cloud deployer cleanup completed")
