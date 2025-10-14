import os
import sys
import json
import logging
import subprocess
import shutil
import time
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import psutil
import requests
import paramiko
import nmap
import scapy.all as scapy
import yara
import hashlib
import ssl
import socket
import OpenSSL
import cryptography
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


class SecurityManager:
    def __init__(self, config_path: str = "config/security_config.json"):
        self.config_path = config_path
        self.config = self.load_config()
        self.logger = self.setup_logger()
        self.firewall_rules = []
        self.intrusion_detection_rules = []
        self.security_alerts = []
        self.encryption_key = None

        # Initialize security features
        self.setup_security()

    def setup_logger(self) -> logging.Logger:
        """Setup logging configuration."""
        logger = logging.getLogger("SecurityManager")
        logger.setLevel(logging.INFO)

        # Create handlers
        file_handler = logging.FileHandler("logs/security.log")
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
        """Load security configuration."""
        try:
            with open(self.config_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "firewall": {
                    "enabled": True,
                    "default_policy": "deny",
                    "rules": [],
                    "logging": True,
                },
                "intrusion_detection": {
                    "enabled": True,
                    "rules": [],
                    "alert_threshold": 5,
                    "block_threshold": 10,
                    "logging": True,
                },
                "vulnerability_scanning": {
                    "enabled": True,
                    "scan_interval": 3600,
                    "scan_ports": True,
                    "scan_services": True,
                    "scan_vulnerabilities": True,
                    "logging": True,
                },
                "encryption": {
                    "enabled": True,
                    "algorithm": "AES-256-GCM",
                    "key_rotation": 86400,
                    "secure_storage": True,
                },
                "authentication": {
                    "enabled": True,
                    "method": "password",
                    "mfa": False,
                    "password_policy": {
                        "min_length": 12,
                        "require_uppercase": True,
                        "require_lowercase": True,
                        "require_numbers": True,
                        "require_special": True,
                    },
                },
                "access_control": {
                    "enabled": True,
                    "default_policy": "deny",
                    "rules": [],
                    "logging": True,
                },
                "monitoring": {
                    "enabled": True,
                    "interval": 60,
                    "metrics": [
                        "failed_logins",
                        "suspicious_ips",
                        "malware_detection",
                        "system_changes",
                    ],
                    "alerts": {
                        "failed_logins_threshold": 3,
                        "suspicious_ips_threshold": 5,
                        "malware_detection_threshold": 1,
                        "system_changes_threshold": 10,
                    },
                },
            }

    def save_config(self) -> None:
        """Save security configuration."""
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        with open(self.config_path, "w") as f:
            json.dump(self.config, f, indent=4)

    def setup_security(self) -> None:
        """Setup security features."""
        try:
            # Initialize firewall
            if self.config["firewall"]["enabled"]:
                self.setup_firewall()

            # Initialize intrusion detection
            if self.config["intrusion_detection"]["enabled"]:
                self.setup_intrusion_detection()

            # Initialize vulnerability scanning
            if self.config["vulnerability_scanning"]["enabled"]:
                self.setup_vulnerability_scanning()

            # Initialize encryption
            if self.config["encryption"]["enabled"]:
                self.setup_encryption()

            # Initialize authentication
            if self.config["authentication"]["enabled"]:
                self.setup_authentication()

            # Initialize access control
            if self.config["access_control"]["enabled"]:
                self.setup_access_control()

            # Start monitoring
            if self.config["monitoring"]["enabled"]:
                self.start_monitoring()

        except Exception as e:
            self.logger.error(f"Error setting up security: {e}")

    def setup_firewall(self) -> None:
        """Setup firewall rules."""
        try:
            if sys.platform == "win32":
                # Windows
                subprocess.run(
                    ["netsh", "advfirewall", "set", "allprofiles", "state", "on"],
                    check=True,
                )

            elif sys.platform == "linux":
                # Linux
                subprocess.run(["ufw", "enable"], check=True)

            # Load default rules
            self.load_firewall_rules()

        except Exception as e:
            self.logger.error(f"Error setting up firewall: {e}")

    def load_firewall_rules(self) -> None:
        """Load firewall rules from configuration."""
        try:
            self.firewall_rules = self.config["firewall"]["rules"]

            # Apply rules
            for rule in self.firewall_rules:
                self.add_firewall_rule(rule)

        except Exception as e:
            self.logger.error(f"Error loading firewall rules: {e}")

    def add_firewall_rule(self, rule: Dict) -> bool:
        """Add firewall rule."""
        try:
            if sys.platform == "win32":
                # Windows
                subprocess.run(
                    [
                        "netsh",
                        "advfirewall",
                        "firewall",
                        "add",
                        "rule",
                        f"name={rule['name']}",
                        f"dir={rule['direction']}",
                        f"action={rule['action']}",
                        f"protocol={rule['protocol']}",
                        f"localport={rule['local_port']}",
                        f"remoteport={rule['remote_port']}",
                        f"localip={rule['local_ip']}",
                        f"remoteip={rule['remote_ip']}",
                    ],
                    check=True,
                )

            elif sys.platform == "linux":
                # Linux
                subprocess.run(
                    [
                        "ufw",
                        "allow",
                        f"{rule['protocol']}",
                        f"{rule['local_port']}",
                        f"to",
                        f"{rule['remote_ip']}",
                        f"port",
                        f"{rule['remote_port']}",
                    ],
                    check=True,
                )

            self.logger.info(f"Added firewall rule: {rule['name']}")
            return True

        except Exception as e:
            self.logger.error(f"Error adding firewall rule: {e}")
            return False

    def setup_intrusion_detection(self) -> None:
        """Setup intrusion detection system."""
        try:
            # Load rules
            self.load_intrusion_detection_rules()

            # Start monitoring
            self.start_intrusion_detection()

        except Exception as e:
            self.logger.error(f"Error setting up intrusion detection: {e}")

    def load_intrusion_detection_rules(self) -> None:
        """Load intrusion detection rules."""
        try:
            self.intrusion_detection_rules = self.config["intrusion_detection"]["rules"]

        except Exception as e:
            self.logger.error(f"Error loading intrusion detection rules: {e}")

    def start_intrusion_detection(self) -> None:
        """Start intrusion detection monitoring."""
        try:
            # Create packet sniffer
            self.sniffer = scapy.sniff(prn=self.analyze_packet, store=0)

        except Exception as e:
            self.logger.error(f"Error starting intrusion detection: {e}")

    def analyze_packet(self, packet: scapy.Packet) -> None:
        """Analyze network packet for intrusions."""
        try:
            # Check for suspicious patterns
            for rule in self.intrusion_detection_rules:
                if self.match_rule(packet, rule):
                    self.handle_intrusion(packet, rule)

        except Exception as e:
            self.logger.error(f"Error analyzing packet: {e}")

    def match_rule(self, packet: scapy.Packet, rule: Dict) -> bool:
        """Match packet against intrusion detection rule."""
        try:
            # Check protocol
            if rule["protocol"] and packet.haslayer(rule["protocol"]):
                return False

            # Check source IP
            if rule["source_ip"] and packet[scapy.IP].src != rule["source_ip"]:
                return False

            # Check destination IP
            if (
                rule["destination_ip"]
                and packet[scapy.IP].dst != rule["destination_ip"]
            ):
                return False

            # Check source port
            if rule["source_port"] and packet[scapy.TCP].sport != rule["source_port"]:
                return False

            # Check destination port
            if (
                rule["destination_port"]
                and packet[scapy.TCP].dport != rule["destination_port"]
            ):
                return False

            # Check payload
            if rule["payload"] and rule["payload"] not in str(packet[scapy.Raw].load):
                return False

            return True

        except Exception as e:
            self.logger.error(f"Error matching rule: {e}")
            return False

    def handle_intrusion(self, packet: scapy.Packet, rule: Dict) -> None:
        """Handle detected intrusion."""
        try:
            # Create alert
            alert = {
                "timestamp": datetime.now().isoformat(),
                "rule": rule["name"],
                "source_ip": packet[scapy.IP].src,
                "destination_ip": packet[scapy.IP].dst,
                "protocol": rule["protocol"],
                "severity": rule["severity"],
            }

            # Add to alerts
            self.security_alerts.append(alert)

            # Log alert
            if self.config["intrusion_detection"]["logging"]:
                self.logger.warning(f"Intrusion detected: {alert}")

            # Check threshold
            if self.check_alert_threshold(alert):
                self.block_ip(alert["source_ip"])

        except Exception as e:
            self.logger.error(f"Error handling intrusion: {e}")

    def check_alert_threshold(self, alert: Dict) -> bool:
        """Check if alert threshold is exceeded."""
        try:
            # Count alerts for this IP
            count = len(
                [
                    a
                    for a in self.security_alerts
                    if a["source_ip"] == alert["source_ip"]
                ]
            )

            # Check against threshold
            return count >= self.config["intrusion_detection"]["block_threshold"]

        except Exception as e:
            self.logger.error(f"Error checking alert threshold: {e}")
            return False

    def block_ip(self, ip: str) -> None:
        """Block IP address."""
        try:
            if sys.platform == "win32":
                # Windows
                subprocess.run(
                    [
                        "netsh",
                        "advfirewall",
                        "firewall",
                        "add",
                        "rule",
                        f"name=Block {ip}",
                        "dir=in",
                        "action=block",
                        f"remoteip={ip}",
                    ],
                    check=True,
                )

            elif sys.platform == "linux":
                # Linux
                subprocess.run(
                    ["iptables", "-A", "INPUT", "-s", ip, "-j", "DROP"], check=True
                )

            self.logger.info(f"Blocked IP address: {ip}")

        except Exception as e:
            self.logger.error(f"Error blocking IP: {e}")

    def setup_vulnerability_scanning(self) -> None:
        """Setup vulnerability scanning."""
        try:
            # Initialize scanner
            self.scanner = nmap.PortScanner()

            # Start scanning
            self.start_vulnerability_scanning()

        except Exception as e:
            self.logger.error(f"Error setting up vulnerability scanning: {e}")

    def start_vulnerability_scanning(self) -> None:
        """Start vulnerability scanning."""
        try:
            # Get local network
            network = self.get_local_network()

            # Scan network
            self.scanner.scan(
                hosts=network, arguments="-sV -sS -O --version-intensity 5"
            )

            # Analyze results
            self.analyze_scan_results()

            # Schedule next scan
            self.schedule_vulnerability_scan()

        except Exception as e:
            self.logger.error(f"Error starting vulnerability scanning: {e}")

    def get_local_network(self) -> str:
        """Get local network address."""
        try:
            # Get default gateway
            if sys.platform == "win32":
                # Windows
                output = subprocess.check_output(["ipconfig"]).decode()

                for line in output.split("\n"):
                    if "Default Gateway" in line:
                        gateway = line.split(":")[1].strip()
                        if gateway != "0.0.0.0":
                            return gateway

            elif sys.platform == "linux":
                # Linux
                output = subprocess.check_output(["ip", "route"]).decode()

                for line in output.split("\n"):
                    if "default" in line:
                        gateway = line.split()[2]
                        return gateway

            return "192.168.1.1"  # Default

        except Exception as e:
            self.logger.error(f"Error getting local network: {e}")
            return "192.168.1.1"  # Default

    def analyze_scan_results(self) -> None:
        """Analyze vulnerability scan results."""
        try:
            for host in self.scanner.all_hosts():
                # Get host info
                host_info = self.scanner[host]

                # Check for vulnerabilities
                vulnerabilities = self.check_vulnerabilities(host_info)

                # Create alert for each vulnerability
                for vuln in vulnerabilities:
                    alert = {
                        "timestamp": datetime.now().isoformat(),
                        "host": host,
                        "type": "vulnerability",
                        "severity": vuln["severity"],
                        "description": vuln["description"],
                    }

                    # Add to alerts
                    self.security_alerts.append(alert)

                    # Log alert
                    if self.config["vulnerability_scanning"]["logging"]:
                        self.logger.warning(f"Vulnerability detected: {alert}")

        except Exception as e:
            self.logger.error(f"Error analyzing scan results: {e}")

    def check_vulnerabilities(self, host_info: Dict) -> List[Dict]:
        """Check host for vulnerabilities."""
        try:
            vulnerabilities = []

            # Check for open ports
            for port in host_info.get("tcp", {}):
                # Check for common vulnerabilities
                if port in [21, 22, 23, 3389]:
                    vulnerabilities.append(
                        {"severity": "high", "description": f"Open {port} port"}
                    )

            # Check for outdated services
            for service in host_info.get("tcp", {}).values():
                if "version" in service:
                    # Check for known vulnerabilities
                    vulns = self.check_service_vulnerabilities(
                        service["name"], service["version"]
                    )
                    vulnerabilities.extend(vulns)

            return vulnerabilities

        except Exception as e:
            self.logger.error(f"Error checking vulnerabilities: {e}")
            return []

    def check_service_vulnerabilities(self, service: str, version: str) -> List[Dict]:
        """Check service for known vulnerabilities."""
        try:
            vulnerabilities = []

            # Query vulnerability database
            url = f"https://vuldb.com/?api=1&service={service}&version={version}"
            response = requests.get(url)

            if response.status_code == 200:
                data = response.json()

                for vuln in data.get("vulnerabilities", []):
                    vulnerabilities.append(
                        {
                            "severity": vuln["severity"],
                            "description": vuln["description"],
                        }
                    )

            return vulnerabilities

        except Exception as e:
            self.logger.error(f"Error checking service vulnerabilities: {e}")
            return []

    def schedule_vulnerability_scan(self) -> None:
        """Schedule next vulnerability scan."""
        try:
            interval = self.config["vulnerability_scanning"]["scan_interval"] * 1000
            self.scan_timer = time.after(interval, self.start_vulnerability_scanning)

        except Exception as e:
            self.logger.error(f"Error scheduling vulnerability scan: {e}")

    def setup_encryption(self) -> None:
        """Setup encryption."""
        try:
            # Generate encryption key
            self.generate_encryption_key()

            # Initialize Fernet
            self.fernet = Fernet(self.encryption_key)

        except Exception as e:
            self.logger.error(f"Error setting up encryption: {e}")

    def generate_encryption_key(self) -> None:
        """Generate encryption key."""
        try:
            # Generate random salt
            salt = os.urandom(16)

            # Generate key
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(), length=32, salt=salt, iterations=100000
            )

            # Derive key
            key = base64.urlsafe_b64encode(kdf.derive(os.urandom(32)))

            # Store key
            self.encryption_key = key

            # Schedule key rotation
            self.schedule_key_rotation()

        except Exception as e:
            self.logger.error(f"Error generating encryption key: {e}")

    def schedule_key_rotation(self) -> None:
        """Schedule encryption key rotation."""
        try:
            interval = self.config["encryption"]["key_rotation"] * 1000
            self.rotation_timer = time.after(interval, self.generate_encryption_key)

        except Exception as e:
            self.logger.error(f"Error scheduling key rotation: {e}")

    def encrypt_data(self, data: bytes) -> bytes:
        """Encrypt data."""
        try:
            return self.fernet.encrypt(data)

        except Exception as e:
            self.logger.error(f"Error encrypting data: {e}")
            return data

    def decrypt_data(self, data: bytes) -> bytes:
        """Decrypt data."""
        try:
            return self.fernet.decrypt(data)

        except Exception as e:
            self.logger.error(f"Error decrypting data: {e}")
            return data

    def setup_authentication(self) -> None:
        """Setup authentication."""
        try:
            # Load password policy
            self.password_policy = self.config["authentication"]["password_policy"]

            # Initialize MFA if enabled
            if self.config["authentication"]["mfa"]:
                self.setup_mfa()

        except Exception as e:
            self.logger.error(f"Error setting up authentication: {e}")

    def setup_mfa(self) -> None:
        """Setup multi-factor authentication."""
        try:
            # Generate secret key
            secret = pyotp.random_base32()

            # Create TOTP
            self.totp = pyotp.TOTP(secret)

        except Exception as e:
            self.logger.error(f"Error setting up MFA: {e}")

    def verify_password(self, password: str) -> bool:
        """Verify password against policy."""
        try:
            # Check length
            if len(password) < self.password_policy["min_length"]:
                return False

            # Check uppercase
            if self.password_policy["require_uppercase"] and not any(
                c.isupper() for c in password
            ):
                return False

            # Check lowercase
            if self.password_policy["require_lowercase"] and not any(
                c.islower() for c in password
            ):
                return False

            # Check numbers
            if self.password_policy["require_numbers"] and not any(
                c.isdigit() for c in password
            ):
                return False

            # Check special characters
            if self.password_policy["require_special"] and not any(
                not c.isalnum() for c in password
            ):
                return False

            return True

        except Exception as e:
            self.logger.error(f"Error verifying password: {e}")
            return False

    def verify_mfa(self, code: str) -> bool:
        """Verify MFA code."""
        try:
            return self.totp.verify(code)

        except Exception as e:
            self.logger.error(f"Error verifying MFA code: {e}")
            return False

    def setup_access_control(self) -> None:
        """Setup access control."""
        try:
            # Load rules
            self.access_control_rules = self.config["access_control"]["rules"]

        except Exception as e:
            self.logger.error(f"Error setting up access control: {e}")

    def check_access(self, user: str, resource: str, action: str) -> bool:
        """Check if user has access to resource."""
        try:
            # Check rules
            for rule in self.access_control_rules:
                if self.match_access_rule(user, resource, action, rule):
                    return rule["allow"]

            # Default policy
            return self.config["access_control"]["default_policy"] == "allow"

        except Exception as e:
            self.logger.error(f"Error checking access: {e}")
            return False

    def match_access_rule(
        self, user: str, resource: str, action: str, rule: Dict
    ) -> bool:
        """Match access control rule."""
        try:
            # Check user
            if rule["user"] != "*" and rule["user"] != user:
                return False

            # Check resource
            if rule["resource"] != "*" and rule["resource"] != resource:
                return False

            # Check action
            if rule["action"] != "*" and rule["action"] != action:
                return False

            return True

        except Exception as e:
            self.logger.error(f"Error matching access rule: {e}")
            return False

    def start_monitoring(self) -> None:
        """Start security monitoring."""
        try:
            # Start monitoring loop
            self.monitor_security()

        except Exception as e:
            self.logger.error(f"Error starting security monitoring: {e}")

    def monitor_security(self) -> None:
        """Monitor security metrics."""
        try:
            # Check failed logins
            if "failed_logins" in self.config["monitoring"]["metrics"]:
                self.check_failed_logins()

            # Check suspicious IPs
            if "suspicious_ips" in self.config["monitoring"]["metrics"]:
                self.check_suspicious_ips()

            # Check malware
            if "malware_detection" in self.config["monitoring"]["metrics"]:
                self.check_malware()

            # Check system changes
            if "system_changes" in self.config["monitoring"]["metrics"]:
                self.check_system_changes()

            # Schedule next monitoring cycle
            self.schedule_monitoring()

        except Exception as e:
            self.logger.error(f"Error monitoring security: {e}")

    def check_failed_logins(self) -> None:
        """Check for failed login attempts."""
        try:
            # Get failed logins
            failed_logins = self.get_failed_logins()

            # Check threshold
            if (
                len(failed_logins)
                >= self.config["monitoring"]["alerts"]["failed_logins_threshold"]
            ):
                # Create alert
                alert = {
                    "timestamp": datetime.now().isoformat(),
                    "type": "failed_logins",
                    "severity": "high",
                    "description": f"Multiple failed login attempts: {len(failed_logins)}",
                }

                # Add to alerts
                self.security_alerts.append(alert)

                # Log alert
                if self.config["monitoring"]["logging"]:
                    self.logger.warning(f"Security alert: {alert}")

        except Exception as e:
            self.logger.error(f"Error checking failed logins: {e}")

    def get_failed_logins(self) -> List[Dict]:
        """Get failed login attempts."""
        try:
            failed_logins = []

            if sys.platform == "win32":
                # Windows
                output = subprocess.check_output(
                    ["wevtutil", "qe", "Security", "/q:*[System[EventID=4625]]"]
                ).decode()

                for line in output.split("\n"):
                    if "Account Name" in line:
                        failed_logins.append(
                            {
                                "user": line.split(":")[1].strip(),
                                "timestamp": datetime.now().isoformat(),
                            }
                        )

            elif sys.platform == "linux":
                # Linux
                with open("/var/log/auth.log", "r") as f:
                    for line in f:
                        if "Failed password" in line:
                            failed_logins.append(
                                {
                                    "user": line.split("for")[1]
                                    .split("from")[0]
                                    .strip(),
                                    "timestamp": datetime.now().isoformat(),
                                }
                            )

            return failed_logins

        except Exception as e:
            self.logger.error(f"Error getting failed logins: {e}")
            return []

    def check_suspicious_ips(self) -> None:
        """Check for suspicious IP addresses."""
        try:
            # Get suspicious IPs
            suspicious_ips = self.get_suspicious_ips()

            # Check threshold
            if (
                len(suspicious_ips)
                >= self.config["monitoring"]["alerts"]["suspicious_ips_threshold"]
            ):
                # Create alert
                alert = {
                    "timestamp": datetime.now().isoformat(),
                    "type": "suspicious_ips",
                    "severity": "medium",
                    "description": f"Multiple suspicious IPs detected: {len(suspicious_ips)}",
                }

                # Add to alerts
                self.security_alerts.append(alert)

                # Log alert
                if self.config["monitoring"]["logging"]:
                    self.logger.warning(f"Security alert: {alert}")

        except Exception as e:
            self.logger.error(f"Error checking suspicious IPs: {e}")

    def get_suspicious_ips(self) -> List[str]:
        """Get suspicious IP addresses."""
        try:
            suspicious_ips = []

            # Get network connections
            connections = psutil.net_connections()

            for conn in connections:
                # Check if connection is suspicious
                if self.is_suspicious_connection(conn):
                    suspicious_ips.append(conn.raddr.ip)

            return suspicious_ips

        except Exception as e:
            self.logger.error(f"Error getting suspicious IPs: {e}")
            return []

    def is_suspicious_connection(self, conn: psutil._common.sconn) -> bool:
        """Check if connection is suspicious."""
        try:
            # Check for known malicious IPs
            if self.is_malicious_ip(conn.raddr.ip):
                return True

            # Check for unusual ports
            if conn.raddr.port in [4444, 6667, 31337]:
                return True

            # Check for unusual protocols
            if conn.type == socket.SOCK_RAW:
                return True

            return False

        except Exception as e:
            self.logger.error(f"Error checking suspicious connection: {e}")
            return False

    def is_malicious_ip(self, ip: str) -> bool:
        """Check if IP is known to be malicious."""
        try:
            # Query threat intelligence
            url = f"https://api.abuseipdb.com/api/v2/check?ipAddress={ip}"
            headers = {
                "Key": self.config["monitoring"]["abuseipdb_key"],
                "Accept": "application/json",
            }

            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                data = response.json()
                return data["data"]["abuseConfidenceScore"] > 50

            return False

        except Exception as e:
            self.logger.error(f"Error checking malicious IP: {e}")
            return False

    def check_malware(self) -> None:
        """Check for malware."""
        try:
            # Scan for malware
            malware = self.scan_malware()

            # Check threshold
            if (
                len(malware)
                >= self.config["monitoring"]["alerts"]["malware_detection_threshold"]
            ):
                # Create alert
                alert = {
                    "timestamp": datetime.now().isoformat(),
                    "type": "malware",
                    "severity": "critical",
                    "description": f"Malware detected: {len(malware)} files",
                }

                # Add to alerts
                self.security_alerts.append(alert)

                # Log alert
                if self.config["monitoring"]["logging"]:
                    self.logger.warning(f"Security alert: {alert}")

        except Exception as e:
            self.logger.error(f"Error checking malware: {e}")

    def scan_malware(self) -> List[Dict]:
        """Scan for malware."""
        try:
            malware = []

            # Load YARA rules
            rules = yara.compile("rules/malware.yar")

            # Scan files
            for root, _, files in os.walk("/"):
                for file in files:
                    try:
                        path = os.path.join(root, file)

                        # Skip system files
                        if self.is_system_file(path):
                            continue

                        # Scan file
                        matches = rules.match(path)

                        if matches:
                            malware.append(
                                {"path": path, "matches": [m.rule for m in matches]}
                            )

                    except:
                        continue

            return malware

        except Exception as e:
            self.logger.error(f"Error scanning malware: {e}")
            return []

    def is_system_file(self, path: str) -> bool:
        """Check if file is a system file."""
        try:
            # Skip common system directories
            system_dirs = ["/proc", "/sys", "/dev", "/run", "/var/cache", "/var/log"]

            for dir in system_dirs:
                if path.startswith(dir):
                    return True

            return False

        except Exception as e:
            self.logger.error(f"Error checking system file: {e}")
            return False

    def check_system_changes(self) -> None:
        """Check for system changes."""
        try:
            # Get system changes
            changes = self.get_system_changes()

            # Check threshold
            if (
                len(changes)
                >= self.config["monitoring"]["alerts"]["system_changes_threshold"]
            ):
                # Create alert
                alert = {
                    "timestamp": datetime.now().isoformat(),
                    "type": "system_changes",
                    "severity": "medium",
                    "description": f"Multiple system changes detected: {len(changes)}",
                }

                # Add to alerts
                self.security_alerts.append(alert)

                # Log alert
                if self.config["monitoring"]["logging"]:
                    self.logger.warning(f"Security alert: {alert}")

        except Exception as e:
            self.logger.error(f"Error checking system changes: {e}")

    def get_system_changes(self) -> List[Dict]:
        """Get system changes."""
        try:
            changes = []

            # Check file changes
            for root, _, files in os.walk("/"):
                for file in files:
                    try:
                        path = os.path.join(root, file)

                        # Skip system files
                        if self.is_system_file(path):
                            continue

                        # Get file hash
                        file_hash = self.get_file_hash(path)

                        # Check if hash changed
                        if self.has_hash_changed(path, file_hash):
                            changes.append(
                                {"type": "file_change", "path": path, "hash": file_hash}
                            )

                    except:
                        continue

            return changes

        except Exception as e:
            self.logger.error(f"Error getting system changes: {e}")
            return []

    def get_file_hash(self, path: str) -> str:
        """Get file hash."""
        try:
            with open(path, "rb") as f:
                return hashlib.sha256(f.read()).hexdigest()

        except Exception as e:
            self.logger.error(f"Error getting file hash: {e}")
            return ""

    def has_hash_changed(self, path: str, current_hash: str) -> bool:
        """Check if file hash has changed."""
        try:
            # Get stored hash
            stored_hash = self.get_stored_hash(path)

            # Compare hashes
            return stored_hash and stored_hash != current_hash

        except Exception as e:
            self.logger.error(f"Error checking hash change: {e}")
            return False

    def get_stored_hash(self, path: str) -> Optional[str]:
        """Get stored file hash."""
        try:
            # Load hash database
            with open("data/file_hashes.json", "r") as f:
                hashes = json.load(f)

            return hashes.get(path)

        except Exception as e:
            self.logger.error(f"Error getting stored hash: {e}")
            return None

    def schedule_monitoring(self) -> None:
        """Schedule next monitoring cycle."""
        try:
            interval = self.config["monitoring"]["interval"] * 1000
            self.monitor_timer = time.after(interval, self.monitor_security)

        except Exception as e:
            self.logger.error(f"Error scheduling monitoring: {e}")

    def cleanup(self) -> None:
        """Cleanup resources."""
        self.save_config()
        self.logger.info("Security manager cleanup completed")
