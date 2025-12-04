import subprocess
import time
import json
import os
import logging
from typing import Dict, List, Optional, Tuple
import threading
import queue
import re
import psutil
import netifaces
import speedtest
from datetime import datetime
import sys
import shutil
import requests
import paramiko
import openvpn
import wireguard
import ipaddress
import dns.resolver
import scapy.all as scapy
import socket

class NetworkManager:
    def __init__(self, config_path: str = "config/network_config.json"):
        self.config_path = config_path
        self.config = self.load_config()
        self.logger = self.setup_logger()
        self.vpn_clients = {}
        self.network_stats = {}
        self.connection_history = []
        
        # Initialize network monitoring
        self.setup_network_monitoring()
    
    def setup_logger(self) -> logging.Logger:
        """Setup logging configuration."""
        logger = logging.getLogger("NetworkManager")
        logger.setLevel(logging.INFO)
        
        # Create handlers
        file_handler = logging.FileHandler("logs/network.log")
        console_handler = logging.StreamHandler()
        
        # Create formatters
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        # Add handlers
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        
        return logger
    
    def load_config(self) -> Dict:
        """Load network configuration."""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "wifi": {
                    "enabled": True,
                    "auto_connect": True,
                    "preferred_networks": [],
                    "excluded_networks": [],
                    "max_retries": 3,
                    "retry_delay": 5
                },
                "vpn": {
                    "enabled": False,
                    "providers": {
                        "openvpn": {
                            "enabled": False,
                            "config_path": "config/vpn/openvpn",
                            "auto_connect": False
                        },
                        "wireguard": {
                            "enabled": False,
                            "config_path": "config/vpn/wireguard",
                            "auto_connect": False
                        }
                    },
                    "kill_switch": True,
                    "dns_leak_protection": True
                },
                "monitoring": {
                    "enabled": True,
                    "interval": 60,
                    "metrics": [
                        "speed",
                        "latency",
                        "packet_loss",
                        "signal_strength",
                        "data_usage"
                    ],
                    "alerts": {
                        "speed_threshold": 1.0,  # Mbps
                        "latency_threshold": 100,  # ms
                        "packet_loss_threshold": 5.0  # %
                    }
                },
                "optimization": {
                    "enabled": True,
                    "dns_servers": [
                        "8.8.8.8",
                        "8.8.4.4",
                        "1.1.1.1",
                        "1.0.0.1"
                    ],
                    "mtu_optimization": True,
                    "qos_enabled": True,
                    "bandwidth_limit": 0  # 0 = unlimited
                },
                "security": {
                    "enabled": True,
                    "firewall": True,
                    "intrusion_detection": True,
                    "port_scanning": True,
                    "vulnerability_scanning": True
                }
            }
    
    def save_config(self) -> None:
        """Save network configuration."""
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=4)
    
    def setup_network_monitoring(self) -> None:
        """Setup network monitoring."""
        if self.config["monitoring"]["enabled"]:
            self.start_monitoring()
    
    def start_monitoring(self) -> None:
        """Start network monitoring."""
        try:
            # Initialize speedtest
            self.speedtest = speedtest.Speedtest()
            
            # Start monitoring loop
            self.monitor_network()
        
        except Exception as e:
            self.logger.error(f"Error starting network monitoring: {e}")
    
    def monitor_network(self) -> None:
        """Monitor network performance."""
        try:
            # Get network interfaces
            interfaces = psutil.net_if_stats()
            
            for interface, stats in interfaces.items():
                if stats.isup:
                    # Get interface statistics
                    counters = psutil.net_io_counters(pernic=True)[interface]
                    
                    # Get signal strength (if wireless)
                    signal_strength = self.get_signal_strength(interface)
                    
                    # Get speed test results
                    speed = self.run_speed_test()
                    
                    # Get latency
                    latency = self.measure_latency()
                    
                    # Get packet loss
                    packet_loss = self.measure_packet_loss()
                    
                    # Update network statistics
                    self.network_stats[interface] = {
                        "timestamp": datetime.now().isoformat(),
                        "bytes_sent": counters.bytes_sent,
                        "bytes_recv": counters.bytes_recv,
                        "packets_sent": counters.packets_sent,
                        "packets_recv": counters.packets_recv,
                        "signal_strength": signal_strength,
                        "download_speed": speed["download"],
                        "upload_speed": speed["upload"],
                        "latency": latency,
                        "packet_loss": packet_loss
                    }
                    
                    # Check for alerts
                    self.check_alerts(interface)
            
            # Schedule next monitoring cycle
            self.schedule_monitoring()
        
        except Exception as e:
            self.logger.error(f"Error monitoring network: {e}")
    
    def schedule_monitoring(self) -> None:
        """Schedule next monitoring cycle."""
        interval = self.config["monitoring"]["interval"] * 1000  # Convert to milliseconds
        self.monitor_timer = time.after(interval, self.monitor_network)
    
    def get_signal_strength(self, interface: str) -> Optional[float]:
        """Get wireless signal strength."""
        try:
            if sys.platform == "win32":
                # Windows
                output = subprocess.check_output(
                    ["netsh", "wlan", "show", "interfaces"]
                ).decode()
                
                for line in output.split("\n"):
                    if "Signal" in line:
                        return float(line.split(":")[1].strip().replace("%", ""))
            
            elif sys.platform == "linux":
                # Linux
                output = subprocess.check_output(
                    ["iwconfig", interface]
                ).decode()
                
                for line in output.split("\n"):
                    if "Signal level" in line:
                        return float(line.split("=")[1].split()[0])
            
            return None
        
        except Exception as e:
            self.logger.error(f"Error getting signal strength: {e}")
            return None
    
    def run_speed_test(self) -> Dict[str, float]:
        """Run speed test."""
        try:
            self.speedtest.get_best_server()
            download = self.speedtest.download() / 1_000_000  # Convert to Mbps
            upload = self.speedtest.upload() / 1_000_000  # Convert to Mbps
            
            return {
                "download": download,
                "upload": upload
            }
        
        except Exception as e:
            self.logger.error(f"Error running speed test: {e}")
            return {
                "download": 0.0,
                "upload": 0.0
            }
    
    def measure_latency(self) -> float:
        """Measure network latency."""
        try:
            # Use Google DNS for latency test
            start_time = time.time()
            requests.get("https://8.8.8.8", timeout=1)
            end_time = time.time()
            
            return (end_time - start_time) * 1000  # Convert to milliseconds
        
        except Exception as e:
            self.logger.error(f"Error measuring latency: {e}")
            return 0.0
    
    def measure_packet_loss(self) -> float:
        """Measure packet loss."""
        try:
            # Send 10 ICMP packets to Google DNS
            sent = 0
            received = 0
            
            for _ in range(10):
                try:
                    requests.get("https://8.8.8.8", timeout=1)
                    received += 1
                except:
                    pass
                sent += 1
            
            return ((sent - received) / sent) * 100  # Convert to percentage
        
        except Exception as e:
            self.logger.error(f"Error measuring packet loss: {e}")
            return 0.0
    
    def check_alerts(self, interface: str) -> None:
        """Check for network alerts."""
        try:
            stats = self.network_stats[interface]
            alerts = self.config["monitoring"]["alerts"]
            
            # Check download speed
            if stats["download_speed"] < alerts["speed_threshold"]:
                self.logger.warning(
                    f"Low download speed on {interface}: "
                    f"{stats['download_speed']:.2f} Mbps"
                )
            
            # Check latency
            if stats["latency"] > alerts["latency_threshold"]:
                self.logger.warning(
                    f"High latency on {interface}: "
                    f"{stats['latency']:.2f} ms"
                )
            
            # Check packet loss
            if stats["packet_loss"] > alerts["packet_loss_threshold"]:
                self.logger.warning(
                    f"High packet loss on {interface}: "
                    f"{stats['packet_loss']:.2f}%"
                )
        
        except Exception as e:
            self.logger.error(f"Error checking alerts: {e}")
    
    def connect_wifi(self, ssid: str, password: Optional[str] = None) -> bool:
        """Connect to WiFi network."""
        try:
            if sys.platform == "win32":
                # Windows
                if password:
                    subprocess.run(
                        [
                            "netsh", "wlan", "connect",
                            "name=" + ssid,
                            "password=" + password
                        ],
                        check=True
                    )
                else:
                    subprocess.run(
                        ["netsh", "wlan", "connect", "name=" + ssid],
                        check=True
                    )
            
            elif sys.platform == "linux":
                # Linux
                if password:
                    subprocess.run(
                        [
                            "nmcli", "device", "wifi", "connect",
                            ssid, "password", password
                        ],
                        check=True
                    )
                else:
                    subprocess.run(
                        ["nmcli", "device", "wifi", "connect", ssid],
                        check=True
                    )
            
            # Add to connection history
            self.connection_history.append({
                "ssid": ssid,
                "timestamp": datetime.now().isoformat(),
                "success": True
            })
            
            self.logger.info(f"Connected to WiFi network: {ssid}")
            return True
        
        except Exception as e:
            self.logger.error(f"Error connecting to WiFi: {e}")
            
            # Add to connection history
            self.connection_history.append({
                "ssid": ssid,
                "timestamp": datetime.now().isoformat(),
                "success": False,
                "error": str(e)
            })
            
            return False
    
    def disconnect_wifi(self) -> bool:
        """Disconnect from WiFi network."""
        try:
            if sys.platform == "win32":
                # Windows
                subprocess.run(
                    ["netsh", "wlan", "disconnect"],
                    check=True
                )
            
            elif sys.platform == "linux":
                # Linux
                subprocess.run(
                    ["nmcli", "device", "disconnect", "wlan0"],
                    check=True
                )
            
            self.logger.info("Disconnected from WiFi network")
            return True
        
        except Exception as e:
            self.logger.error(f"Error disconnecting from WiFi: {e}")
            return False
    
    def scan_wifi(self) -> List[Dict]:
        """Scan for available WiFi networks."""
        try:
            networks = []
            
            if sys.platform == "win32":
                # Windows
                output = subprocess.check_output(
                    ["netsh", "wlan", "show", "networks"]
                ).decode()
                
                current_ssid = None
                current_signal = None
                current_security = None
                
                for line in output.split("\n"):
                    if "SSID" in line and "BSSID" not in line:
                        if current_ssid:
                            networks.append({
                                "ssid": current_ssid,
                                "signal": current_signal,
                                "security": current_security
                            })
                        
                        current_ssid = line.split(":")[1].strip()
                    
                    elif "Signal" in line:
                        current_signal = line.split(":")[1].strip()
                    
                    elif "Authentication" in line:
                        current_security = line.split(":")[1].strip()
                
                if current_ssid:
                    networks.append({
                        "ssid": current_ssid,
                        "signal": current_signal,
                        "security": current_security
                    })
            
            elif sys.platform == "linux":
                # Linux
                output = subprocess.check_output(
                    ["nmcli", "-f", "SSID,SIGNAL,SECURITY", "device", "wifi", "list"]
                ).decode()
                
                for line in output.split("\n")[1:]:
                    if line.strip():
                        parts = line.split()
                        networks.append({
                            "ssid": parts[0],
                            "signal": parts[1],
                            "security": parts[2] if len(parts) > 2 else "None"
                        })
            
            return networks
        
        except Exception as e:
            self.logger.error(f"Error scanning WiFi networks: {e}")
            return []
    
    def setup_vpn(self, provider: str, config: Dict) -> bool:
        """Setup VPN connection."""
        try:
            if provider == "openvpn":
                # Setup OpenVPN
                client = openvpn.Client(
                    config_path=config["config_path"],
                    auto_connect=config["auto_connect"]
                )
                self.vpn_clients["openvpn"] = client
            
            elif provider == "wireguard":
                # Setup WireGuard
                client = wireguard.Client(
                    config_path=config["config_path"],
                    auto_connect=config["auto_connect"]
                )
                self.vpn_clients["wireguard"] = client
            
            self.logger.info(f"Setup VPN provider: {provider}")
            return True
        
        except Exception as e:
            self.logger.error(f"Error setting up VPN: {e}")
            return False
    
    def connect_vpn(self, provider: str) -> bool:
        """Connect to VPN."""
        try:
            if provider in self.vpn_clients:
                self.vpn_clients[provider].connect()
                self.logger.info(f"Connected to VPN provider: {provider}")
                return True
            
            self.logger.error(f"VPN provider not found: {provider}")
            return False
        
        except Exception as e:
            self.logger.error(f"Error connecting to VPN: {e}")
            return False
    
    def disconnect_vpn(self, provider: str) -> bool:
        """Disconnect from VPN."""
        try:
            if provider in self.vpn_clients:
                self.vpn_clients[provider].disconnect()
                self.logger.info(f"Disconnected from VPN provider: {provider}")
                return True
            
            self.logger.error(f"VPN provider not found: {provider}")
            return False
        
        except Exception as e:
            self.logger.error(f"Error disconnecting from VPN: {e}")
            return False
    
    def optimize_network(self) -> bool:
        """Optimize network settings."""
        try:
            if self.config["optimization"]["enabled"]:
                # Set DNS servers
                if self.config["optimization"]["dns_servers"]:
                    self.set_dns_servers(
                        self.config["optimization"]["dns_servers"]
                    )
                
                # Optimize MTU
                if self.config["optimization"]["mtu_optimization"]:
                    self.optimize_mtu()
                
                # Enable QoS
                if self.config["optimization"]["qos_enabled"]:
                    self.enable_qos()
                
                # Set bandwidth limit
                if self.config["optimization"]["bandwidth_limit"]:
                    self.set_bandwidth_limit(
                        self.config["optimization"]["bandwidth_limit"]
                    )
                
                self.logger.info("Network optimization completed")
                return True
            
            return False
        
        except Exception as e:
            self.logger.error(f"Error optimizing network: {e}")
            return False
    
    def set_dns_servers(self, servers: List[str]) -> None:
        """Set DNS servers."""
        try:
            if sys.platform == "win32":
                # Windows
                for server in servers:
                    subprocess.run(
                        [
                            "netsh", "interface", "ip", "set", "dns",
                            "name=Wi-Fi", "static", server
                        ],
                        check=True
                    )
            
            elif sys.platform == "linux":
                # Linux
                with open("/etc/resolv.conf", "w") as f:
                    for server in servers:
                        f.write(f"nameserver {server}\n")
        
        except Exception as e:
            self.logger.error(f"Error setting DNS servers: {e}")
    
    def optimize_mtu(self) -> None:
        """Optimize MTU size."""
        try:
            # Find optimal MTU using ping
            optimal_mtu = 1500  # Default
            
            for mtu in range(1500, 500, -1):
                try:
                    subprocess.run(
                        [
                            "ping", "-f", "-l", str(mtu),
                            "-n", "1", "8.8.8.8"
                        ],
                        check=True,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE
                    )
                    optimal_mtu = mtu
                    break
                except:
                    continue
            
            # Set MTU
            if sys.platform == "win32":
                # Windows
                subprocess.run(
                    [
                        "netsh", "interface", "ipv4", "set", "subinterface",
                        "name=Wi-Fi", f"mtu={optimal_mtu}"
                    ],
                    check=True
                )
            
            elif sys.platform == "linux":
                # Linux
                subprocess.run(
                    ["ip", "link", "set", "wlan0", "mtu", str(optimal_mtu)],
                    check=True
                )
        
        except Exception as e:
            self.logger.error(f"Error optimizing MTU: {e}")
    
    def enable_qos(self) -> None:
        """Enable Quality of Service."""
        try:
            if sys.platform == "win32":
                # Windows
                subprocess.run(
                    [
                        "netsh", "interface", "tcp", "set", "global",
                        "autotuninglevel=normal"
                    ],
                    check=True
                )
            
            elif sys.platform == "linux":
                # Linux
                subprocess.run(
                    ["tc", "qdisc", "add", "dev", "wlan0", "root", "tbf"],
                    check=True
                )
        
        except Exception as e:
            self.logger.error(f"Error enabling QoS: {e}")
    
    def set_bandwidth_limit(self, limit: int) -> None:
        """Set bandwidth limit."""
        try:
            if sys.platform == "win32":
                # Windows
                subprocess.run(
                    [
                        "netsh", "interface", "tcp", "set", "global",
                        f"autotuninglevel=restricted limit={limit}"
                    ],
                    check=True
                )
            
            elif sys.platform == "linux":
                # Linux
                subprocess.run(
                    [
                        "tc", "qdisc", "add", "dev", "wlan0", "root",
                        "tbf", "rate", f"{limit}mbit"
                    ],
                    check=True
                )
        
        except Exception as e:
            self.logger.error(f"Error setting bandwidth limit: {e}")
    
    def scan_network(self) -> Dict:
        """Scan network for devices and vulnerabilities."""
        try:
            if self.config["security"]["enabled"]:
                results = {
                    "devices": [],
                    "vulnerabilities": [],
                    "ports": []
                }
                
                # Get local network
                network = self.get_local_network()
                
                # Scan for devices
                devices = self.scan_devices(network)
                results["devices"] = devices
                
                # Scan for vulnerabilities
                if self.config["security"]["vulnerability_scanning"]:
                    vulnerabilities = self.scan_vulnerabilities(devices)
                    results["vulnerabilities"] = vulnerabilities
                
                # Scan ports
                if self.config["security"]["port_scanning"]:
                    ports = self.scan_ports(devices)
                    results["ports"] = ports
                
                return results
            
            return {}
        
        except Exception as e:
            self.logger.error(f"Error scanning network: {e}")
            return {}
    
    def get_local_network(self) -> str:
        """Get local network address."""
        try:
            # Get default gateway
            if sys.platform == "win32":
                # Windows
                output = subprocess.check_output(
                    ["ipconfig"]
                ).decode()
                
                for line in output.split("\n"):
                    if "Default Gateway" in line:
                        gateway = line.split(":")[1].strip()
                        if gateway != "0.0.0.0":
                            return gateway
            
            elif sys.platform == "linux":
                # Linux
                output = subprocess.check_output(
                    ["ip", "route"]
                ).decode()
                
                for line in output.split("\n"):
                    if "default" in line:
                        gateway = line.split()[2]
                        return gateway
            
            return "192.168.1.1"  # Default
        
        except Exception as e:
            self.logger.error(f"Error getting local network: {e}")
            return "192.168.1.1"  # Default
    
    def scan_devices(self, network: str) -> List[Dict]:
        """Scan network for devices."""
        try:
            devices = []
            
            # Create ARP request
            arp = scapy.ARP(pdst=network)
            ether = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
            packet = ether/arp
            
            # Send packet
            result = scapy.srp(packet, timeout=3, verbose=0)[0]
            
            for sent, received in result:
                devices.append({
                    "ip": received.psrc,
                    "mac": received.hwsrc,
                    "vendor": self.get_vendor(received.hwsrc)
                })
            
            return devices
        
        except Exception as e:
            self.logger.error(f"Error scanning devices: {e}")
            return []
    
    def get_vendor(self, mac: str) -> str:
        """Get vendor from MAC address."""
        try:
            # Query MAC address database
            url = f"https://api.macvendors.com/{mac}"
            response = requests.get(url)
            
            if response.status_code == 200:
                return response.text
            
            return "Unknown"
        
        except Exception as e:
            self.logger.error(f"Error getting vendor: {e}")
            return "Unknown"
    
    def scan_vulnerabilities(self, devices: List[Dict]) -> List[Dict]:
        """Scan devices for vulnerabilities."""
        try:
            vulnerabilities = []
            
            for device in devices:
                # Check for common vulnerabilities
                vulns = self.check_device_vulnerabilities(device)
                vulnerabilities.extend(vulns)
            
            return vulnerabilities
        
        except Exception as e:
            self.logger.error(f"Error scanning vulnerabilities: {e}")
            return []
    
    def check_device_vulnerabilities(self, device: Dict) -> List[Dict]:
        """Check device for vulnerabilities."""
        try:
            vulnerabilities = []
            
            # Check for open ports
            open_ports = self.scan_ports([device])
            
            for port in open_ports:
                if port["port"] in [21, 22, 23, 3389]:
                    vulnerabilities.append({
                        "device": device["ip"],
                        "type": "open_port",
                        "port": port["port"],
                        "severity": "high",
                        "description": f"Open {port['service']} port"
                    })
            
            # Check for weak protocols
            if self.check_weak_protocols(device):
                vulnerabilities.append({
                    "device": device["ip"],
                    "type": "weak_protocol",
                    "severity": "medium",
                    "description": "Weak protocol detected"
                })
            
            return vulnerabilities
        
        except Exception as e:
            self.logger.error(f"Error checking vulnerabilities: {e}")
            return []
    
    def scan_ports(self, devices: List[Dict]) -> List[Dict]:
        """Scan devices for open ports."""
        try:
            ports = []
            
            for device in devices:
                # Scan common ports
                common_ports = [20, 21, 22, 23, 25, 53, 80, 110, 143, 443, 3389]
                
                for port in common_ports:
                    try:
                        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                        sock.settimeout(1)
                        result = sock.connect_ex((device["ip"], port))
                        
                        if result == 0:
                            service = self.get_service_name(port)
                            ports.append({
                                "device": device["ip"],
                                "port": port,
                                "service": service,
                                "state": "open"
                            })
                        
                        sock.close()
                    
                    except:
                        continue
            
            return ports
        
        except Exception as e:
            self.logger.error(f"Error scanning ports: {e}")
            return []
    
    def get_service_name(self, port: int) -> str:
        """Get service name from port number."""
        try:
            return socket.getservbyport(port)
        except:
            return "unknown"
    
    def check_weak_protocols(self, device: Dict) -> bool:
        """Check for weak protocols."""
        try:
            # Check for Telnet
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                result = sock.connect_ex((device["ip"], 23))
                sock.close()
                
                if result == 0:
                    return True
            except:
                pass
            
            # Check for FTP
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                result = sock.connect_ex((device["ip"], 21))
                sock.close()
                
                if result == 0:
                    return True
            except:
                pass
            
            return False
        
        except Exception as e:
            self.logger.error(f"Error checking weak protocols: {e}")
            return False
    
    def cleanup(self) -> None:
        """Cleanup resources."""
        self.save_config()
        self.logger.info("Network manager cleanup completed") 