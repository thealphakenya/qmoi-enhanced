#!/usr/bin/env python3
"""
QMOI Network Connectivity Manager
Ensures continuous internet connectivity through multiple methods
"""

import os
import sys
import time
import subprocess
import requests
import logging
import json
import threading
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import platform
import socket
import urllib.request
import urllib.error

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/network_connectivity.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class NetworkStatus:
    """Network connection status"""
    connected: bool
    method: str
    speed: float
    latency: float
    ip_address: str
    dns_servers: List[str]
    timestamp: datetime

@dataclass
class ConnectionMethod:
    """Connection method configuration"""
    name: str
    enabled: bool
    priority: int
    config: Dict
    last_used: Optional[datetime] = None

class NetworkConnectivityManager:
    """Main class for managing network connectivity"""
    
    def __init__(self):
        self.os_type = platform.system().lower()
        self.connection_methods = {}
        self.current_connection = None
        self.monitoring_active = False
        self.retry_attempts = 0
        self.max_retries = 5
        
        # Create logs directory
        os.makedirs("logs", exist_ok=True)
        
        # Initialize connection methods
        self.initialize_connection_methods()
        
        # Test URLs for connectivity
        self.test_urls = [
            "https://www.google.com",
            "https://www.github.com",
            "https://www.cloudflare.com",
            "https://www.amazon.com",
            "https://www.microsoft.com"
        ]
        
        # Zero-rated sites (free data)
        self.zero_rated_sites = [
            "https://www.wikipedia.org",
            "https://www.facebook.com",
            "https://www.whatsapp.com",
            "https://www.google.com",
            "https://www.youtube.com"
        ]
        
        # VPN providers
        self.vpn_providers = {
            "nordvpn": {
                "command": "nordvpn",
                "connect": "nordvpn connect",
                "disconnect": "nordvpn disconnect",
                "status": "nordvpn status"
            },
            "expressvpn": {
                "command": "expressvpn",
                "connect": "expressvpn connect",
                "disconnect": "expressvpn disconnect",
                "status": "expressvpn status"
            },
            "protonvpn": {
                "command": "protonvpn",
                "connect": "protonvpn connect",
                "disconnect": "protonvpn disconnect",
                "status": "protonvpn status"
            }
        }
    
    def initialize_connection_methods(self):
        """Initialize all connection methods"""
        self.connection_methods = {
            "wifi": ConnectionMethod(
                name="WiFi",
                enabled=True,
                priority=1,
                config={
                    "auto_connect": True,
                    "preferred_networks": [],
                    "scan_interval": 30
                }
            ),
            "ethernet": ConnectionMethod(
                name="Ethernet",
                enabled=True,
                priority=2,
                config={
                    "auto_connect": True,
                    "dhcp": True
                }
            ),
            "mobile_hotspot": ConnectionMethod(
                name="Mobile Hotspot",
                enabled=True,
                priority=3,
                config={
                    "auto_connect": True,
                    "ssid": "",
                    "password": ""
                }
            ),
            "vpn": ConnectionMethod(
                name="VPN",
                enabled=True,
                priority=4,
                config={
                    "providers": ["nordvpn", "expressvpn", "protonvpn"],
                    "auto_connect": True,
                    "fallback": True
                }
            ),
            "qcity": ConnectionMethod(
                name="QCity",
                enabled=True,
                priority=5,
                config={
                    "endpoint": "https://qcity.ai",
                    "auto_connect": True,
                    "offload": True
                }
            ),
            "zero_rated": ConnectionMethod(
                name="Zero-Rated Sites",
                enabled=True,
                priority=6,
                config={
                    "sites": self.zero_rated_sites,
                    "auto_connect": True
                }
            )
        }
    
    def check_internet_connectivity(self) -> bool:
        """Check if internet is accessible"""
        for url in self.test_urls:
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    return True
            except Exception:
                continue
        return False
    
    def get_network_speed(self) -> float:
        """Get current network speed in Mbps"""
        try:
            # Simple speed test using a small file download
            start_time = time.time()
            response = requests.get("https://httpbin.org/bytes/1024", timeout=10)
            end_time = time.time()
            
            if response.status_code == 200:
                duration = end_time - start_time
                speed = (1024 * 8) / (duration * 1000000)  # Convert to Mbps
                return round(speed, 2)
        except Exception:
            pass
        
        return 0.0
    
    def get_network_latency(self) -> float:
        """Get network latency in milliseconds"""
        try:
            start_time = time.time()
            response = requests.get("https://www.google.com", timeout=10)
            end_time = time.time()
            
            if response.status_code == 200:
                latency = (end_time - start_time) * 1000  # Convert to milliseconds
                return round(latency, 2)
        except Exception:
            pass
        
        return 0.0
    
    def get_ip_address(self) -> str:
        """Get current public IP address"""
        try:
            response = requests.get("https://httpbin.org/ip", timeout=10)
            if response.status_code == 200:
                return response.json()["origin"]
        except Exception:
            pass
        
        return "unknown"
    
    def get_dns_servers(self) -> List[str]:
        """Get current DNS servers"""
        try:
            if self.os_type == "windows":
                result = subprocess.run(["ipconfig", "/all"], capture_output=True, text=True)
                dns_servers = []
                for line in result.stdout.split('\n'):
                    if "DNS Servers" in line:
                        dns = line.split(':')[-1].strip()
                        if dns:
                            dns_servers.append(dns)
                return dns_servers
            else:
                result = subprocess.run(["cat", "/etc/resolv.conf"], capture_output=True, text=True)
                dns_servers = []
                for line in result.stdout.split('\n'):
                    if line.startswith("nameserver"):
                        dns = line.split()[1]
                        dns_servers.append(dns)
                return dns_servers
        except Exception:
            return []
    
    def get_current_network_status(self) -> NetworkStatus:
        """Get current network status"""
        connected = self.check_internet_connectivity()
        speed = self.get_network_speed() if connected else 0.0
        latency = self.get_network_latency() if connected else 0.0
        ip_address = self.get_ip_address() if connected else "unknown"
        dns_servers = self.get_dns_servers()
        
        return NetworkStatus(
            connected=connected,
            method=self.current_connection.name if self.current_connection else "unknown",
            speed=speed,
            latency=latency,
            ip_address=ip_address,
            dns_servers=dns_servers,
            timestamp=datetime.now()
        )
    
    def scan_wifi_networks(self) -> List[Dict]:
        """Scan for available WiFi networks"""
        networks = []
        
        try:
            if self.os_type == "windows":
                result = subprocess.run(["netsh", "wlan", "show", "networks"], capture_output=True, text=True)
                current_ssid = None
                current_security = None
                
                for line in result.stdout.split('\n'):
                    if "SSID" in line and "BSSID" not in line:
                        current_ssid = line.split(':')[-1].strip()
                    elif "Authentication" in line:
                        current_security = line.split(':')[-1].strip()
                        if current_ssid and current_security:
                            networks.append({
                                "ssid": current_ssid,
                                "security": current_security,
                                "signal_strength": "unknown"
                            })
                            current_ssid = None
                            current_security = None
            
            elif self.os_type == "linux":
                result = subprocess.run(["iwlist", "scan"], capture_output=True, text=True)
                current_ssid = None
                current_security = None
                
                for line in result.stdout.split('\n'):
                    if "ESSID" in line:
                        current_ssid = line.split('"')[1] if '"' in line else "unknown"
                    elif "Encryption key" in line:
                        current_security = "WPA" if "on" in line else "Open"
                        if current_ssid and current_security:
                            networks.append({
                                "ssid": current_ssid,
                                "security": current_security,
                                "signal_strength": "unknown"
                            })
                            current_ssid = None
                            current_security = None
            
            elif self.os_type == "darwin":  # macOS
                result = subprocess.run(["airport", "-s"], capture_output=True, text=True)
                for line in result.stdout.split('\n')[1:]:  # Skip header
                    if line.strip():
                        parts = line.split()
                        if len(parts) >= 3:
                            networks.append({
                                "ssid": parts[0],
                                "security": parts[6] if len(parts) > 6 else "unknown",
                                "signal_strength": parts[1]
                            })
        
        except Exception as e:
            logger.error(f"Error scanning WiFi networks: {e}")
        
        return networks
    
    def connect_wifi(self, ssid: str, password: str = None) -> bool:
        """Connect to a WiFi network"""
        try:
            if self.os_type == "windows":
                if password:
                    # Create WiFi profile
                    profile = f"""<?xml version="1.0"?>
<WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
    <name>{ssid}</name>
    <SSIDConfig>
        <SSID>
            <name>{ssid}</name>
        </SSID>
    </SSIDConfig>
    <connectionType>ESS</connectionType>
    <connectionMode>auto</connectionMode>
    <MSM>
        <security>
            <authEncryption>
                <authentication>WPA2PSK</authentication>
                <encryption>AES</encryption>
                <useOneX>false</useOneX>
            </authEncryption>
            <sharedKey>
                <keyType>passPhrase</keyType>
                <protected>false</protected>
                <keyMaterial>{password}</keyMaterial>
            </sharedKey>
        </security>
    </MSM>
</WLANProfile>"""
                    
                    # Save profile
                    with open(f"{ssid}.xml", "w") as f:
                        f.write(profile)
                    
                    # Add profile
                    subprocess.run(["netsh", "wlan", "add", "profile", f"filename={ssid}.xml"], check=True)
                    
                    # Connect
                    subprocess.run(["netsh", "wlan", "connect", f"name={ssid}"], check=True)
                    
                    # Clean up
                    os.remove(f"{ssid}.xml")
                else:
                    subprocess.run(["netsh", "wlan", "connect", f"name={ssid}"], check=True)
            
            elif self.os_type == "linux":
                if password:
                    # Use wpa_supplicant
                    config = f"""network={{
    ssid="{ssid}"
    psk="{password}"
}}"""
                    
                    with open("/etc/wpa_supplicant/wpa_supplicant.conf", "a") as f:
                        f.write(config)
                    
                    subprocess.run(["wpa_supplicant", "-B", "-i", "wlan0", "-c", "/etc/wpa_supplicant/wpa_supplicant.conf"], check=True)
                    subprocess.run(["dhclient", "wlan0"], check=True)
                else:
                    subprocess.run(["iwconfig", "wlan0", "essid", ssid], check=True)
                    subprocess.run(["dhclient", "wlan0"], check=True)
            
            elif self.os_type == "darwin":  # macOS
                if password:
                    subprocess.run(["networksetup", "-setairportnetwork", "en0", ssid, password], check=True)
                else:
                    subprocess.run(["networksetup", "-setairportnetwork", "en0", ssid], check=True)
            
            # Wait for connection
            time.sleep(5)
            
            # Verify connection
            if self.check_internet_connectivity():
                self.current_connection = self.connection_methods["wifi"]
                self.current_connection.last_used = datetime.now()
                logger.info(f"Successfully connected to WiFi: {ssid}")
                return True
            
        except Exception as e:
            logger.error(f"Error connecting to WiFi {ssid}: {e}")
        
        return False
    
    def auto_connect_wifi(self) -> bool:
        """Automatically connect to available WiFi networks"""
        logger.info("Attempting auto WiFi connection")
        
        # Get saved networks
        saved_networks = self.get_saved_wifi_networks()
        
        # Scan available networks
        available_networks = self.scan_wifi_networks()
        
        # Try to connect to saved networks first
        for saved_network in saved_networks:
            for available_network in available_networks:
                if available_network["ssid"] == saved_network["ssid"]:
                    if self.connect_wifi(saved_network["ssid"], saved_network.get("password")):
                        return True
        
        # Try open networks
        for network in available_networks:
            if network["security"] == "Open":
                if self.connect_wifi(network["ssid"]):
                    return True
        
        return False
    
    def get_saved_wifi_networks(self) -> List[Dict]:
        """Get saved WiFi networks"""
        networks = []
        
        try:
            if self.os_type == "windows":
                result = subprocess.run(["netsh", "wlan", "show", "profiles"], capture_output=True, text=True)
                for line in result.stdout.split('\n'):
                    if "All User Profile" in line:
                        ssid = line.split(':')[-1].strip()
                        networks.append({"ssid": ssid})
            
            elif self.os_type == "linux":
                if os.path.exists("/etc/wpa_supplicant/wpa_supplicant.conf"):
                    with open("/etc/wpa_supplicant/wpa_supplicant.conf", "r") as f:
                        content = f.read()
                        # Parse networks from wpa_supplicant config
                        # This is a simplified version
                        pass
            
            elif self.os_type == "darwin":  # macOS
                result = subprocess.run(["security", "find-generic-password", "-D", "AirPort network password", "-a"], capture_output=True, text=True)
                # Parse saved networks
                pass
        
        except Exception as e:
            logger.error(f"Error getting saved WiFi networks: {e}")
        
        return networks
    
    def connect_vpn(self, provider: str = None) -> bool:
        """Connect to VPN"""
        logger.info(f"Attempting VPN connection with provider: {provider}")
        
        try:
            if provider and provider in self.vpn_providers:
                vpn_config = self.vpn_providers[provider]
                
                # Check if VPN client is installed
                try:
                    subprocess.run([vpn_config["command"], "--version"], check=True, capture_output=True)
                except subprocess.CalledProcessError:
                    logger.error(f"VPN client {provider} not installed")
                    return False
                
                # Connect to VPN
                subprocess.run(vpn_config["connect"].split(), check=True)
                
                # Wait for connection
                time.sleep(10)
                
                # Verify connection
                if self.check_internet_connectivity():
                    self.current_connection = self.connection_methods["vpn"]
                    self.current_connection.last_used = datetime.now()
                    logger.info(f"Successfully connected to VPN: {provider}")
                    return True
            
            else:
                # Try all available VPN providers
                for provider_name, vpn_config in self.vpn_providers.items():
                    try:
                        subprocess.run([vpn_config["command"], "--version"], check=True, capture_output=True)
                        subprocess.run(vpn_config["connect"].split(), check=True)
                        time.sleep(10)
                        
                        if self.check_internet_connectivity():
                            self.current_connection = self.connection_methods["vpn"]
                            self.current_connection.last_used = datetime.now()
                            logger.info(f"Successfully connected to VPN: {provider_name}")
                            return True
                    
                    except subprocess.CalledProcessError:
                        continue
        
        except Exception as e:
            logger.error(f"Error connecting to VPN: {e}")
        
        return False
    
    def connect_qcity(self) -> bool:
        """Connect to QCity for offloading"""
        logger.info("Attempting QCity connection")
        
        try:
            # Test QCity connectivity
            response = requests.get(self.connection_methods["qcity"].config["endpoint"], timeout=10)
            
            if response.status_code == 200:
                self.current_connection = self.connection_methods["qcity"]
                self.current_connection.last_used = datetime.now()
                logger.info("Successfully connected to QCity")
                return True
        
        except Exception as e:
            logger.error(f"Error connecting to QCity: {e}")
        
        return False
    
    def use_zero_rated_sites(self) -> bool:
        """Use zero-rated sites for connectivity"""
        logger.info("Attempting zero-rated sites connection")
        
        try:
            for site in self.zero_rated_sites:
                try:
                    response = requests.get(site, timeout=10)
                    if response.status_code == 200:
                        self.current_connection = self.connection_methods["zero_rated"]
                        self.current_connection.last_used = datetime.now()
                        logger.info(f"Successfully connected via zero-rated site: {site}")
                        return True
                except Exception:
                    continue
        
        except Exception as e:
            logger.error(f"Error using zero-rated sites: {e}")
        
        return False
    
    def ensure_connectivity(self) -> bool:
        """Ensure internet connectivity through any available method"""
        logger.info("Ensuring internet connectivity")
        
        # Check current connectivity
        if self.check_internet_connectivity():
            logger.info("Internet connectivity already available")
            return True
        
        # Try connection methods in priority order
        sorted_methods = sorted(
            self.connection_methods.values(),
            key=lambda x: x.priority
        )
        
        for method in sorted_methods:
            if not method.enabled:
                continue
            
            logger.info(f"Trying connection method: {method.name}")
            
            success = False
            if method.name == "WiFi":
                success = self.auto_connect_wifi()
            elif method.name == "Ethernet":
                success = self.check_internet_connectivity()  # Ethernet is usually always on
            elif method.name == "Mobile Hotspot":
                success = self.connect_mobile_hotspot()
            elif method.name == "VPN":
                success = self.connect_vpn()
            elif method.name == "QCity":
                success = self.connect_qcity()
            elif method.name == "Zero-Rated Sites":
                success = self.use_zero_rated_sites()
            
            if success:
                self.current_connection = method
                method.last_used = datetime.now()
                logger.info(f"Successfully connected via {method.name}")
                return True
        
        logger.error("Failed to establish internet connectivity")
        return False
    
    def connect_mobile_hotspot(self) -> bool:
        """Connect to mobile hotspot"""
        logger.info("Attempting mobile hotspot connection")
        
        try:
            # This would typically involve connecting to a mobile hotspot
            # For now, we'll just check if we can connect to any available network
            return self.auto_connect_wifi()
        
        except Exception as e:
            logger.error(f"Error connecting to mobile hotspot: {e}")
            return False
    
    def start_continuous_monitoring(self, interval: int = 60):
        """Start continuous connectivity monitoring"""
        logger.info("Starting continuous connectivity monitoring")
        self.monitoring_active = True
        
        def monitor_loop():
            while self.monitoring_active:
                try:
                    # Check current connectivity
                    if not self.check_internet_connectivity():
                        logger.warning("Internet connectivity lost, attempting to restore")
                        self.ensure_connectivity()
                    
                    # Log current status
                    status = self.get_current_network_status()
                    logger.info(f"Network status: {status}")
                    
                    # Wait before next check
                    time.sleep(interval)
                
                except Exception as e:
                    logger.error(f"Error in monitoring loop: {e}")
                    time.sleep(interval)
        
        # Start monitoring in background thread
        monitor_thread = threading.Thread(target=monitor_loop, daemon=True)
        monitor_thread.start()
    
    def stop_continuous_monitoring(self):
        """Stop continuous connectivity monitoring"""
        logger.info("Stopping continuous connectivity monitoring")
        self.monitoring_active = False
    
    def get_connection_statistics(self) -> Dict:
        """Get connection statistics"""
        return {
            "current_connection": self.current_connection.name if self.current_connection else "none",
            "connection_methods": {
                name: {
                    "enabled": method.enabled,
                    "priority": method.priority,
                    "last_used": method.last_used.isoformat() if method.last_used else None
                }
                for name, method in self.connection_methods.items()
            },
            "current_status": self.get_current_network_status().__dict__,
            "monitoring_active": self.monitoring_active
        }
    
    def optimize_connection(self):
        """Optimize current connection"""
        logger.info("Optimizing network connection")
        
        try:
            # Optimize DNS
            self.optimize_dns()
            
            # Optimize TCP settings
            self.optimize_tcp_settings()
            
            # Clear DNS cache
            self.clear_dns_cache()
            
            logger.info("Network connection optimized")
        
        except Exception as e:
            logger.error(f"Error optimizing connection: {e}")
    
    def optimize_dns(self):
        """Optimize DNS settings"""
        try:
            # Use fast DNS servers
            fast_dns_servers = [
                "8.8.8.8",  # Google DNS
                "8.8.4.4",  # Google DNS
                "1.1.1.1",  # Cloudflare DNS
                "1.0.0.1"   # Cloudflare DNS
            ]
            
            if self.os_type == "windows":
                for dns in fast_dns_servers:
                    subprocess.run(["netsh", "interface", "ip", "set", "dns", "name=*", f"static {dns}"], check=True)
            
            elif self.os_type == "linux":
                with open("/etc/resolv.conf", "w") as f:
                    for dns in fast_dns_servers:
                        f.write(f"nameserver {dns}\n")
            
            elif self.os_type == "darwin":  # macOS
                subprocess.run(["networksetup", "-setdnsservers", "Wi-Fi"] + fast_dns_servers, check=True)
        
        except Exception as e:
            logger.error(f"Error optimizing DNS: {e}")
    
    def optimize_tcp_settings(self):
        """Optimize TCP settings"""
        try:
            if self.os_type == "linux":
                # Optimize TCP settings
                tcp_settings = {
                    "net.core.rmem_max": "16777216",
                    "net.core.wmem_max": "16777216",
                    "net.ipv4.tcp_rmem": "4096 87380 16777216",
                    "net.ipv4.tcp_wmem": "4096 65536 16777216",
                    "net.ipv4.tcp_congestion_control": "bbr"
                }
                
                for setting, value in tcp_settings.items():
                    subprocess.run(["sysctl", "-w", f"{setting}={value}"], check=True)
        
        except Exception as e:
            logger.error(f"Error optimizing TCP settings: {e}")
    
    def clear_dns_cache(self):
        """Clear DNS cache"""
        try:
            if self.os_type == "windows":
                subprocess.run(["ipconfig", "/flushdns"], check=True)
            
            elif self.os_type == "linux":
                subprocess.run(["systemctl", "restart", "systemd-resolved"], check=True)
            
            elif self.os_type == "darwin":  # macOS
                subprocess.run(["sudo", "killall", "-HUP", "mDNSResponder"], check=True)
        
        except Exception as e:
            logger.error(f"Error clearing DNS cache: {e}")

    def test_all_connectivity(self) -> Dict:
        """Test all connectivity methods and return results"""
        results = {}
        for method in sorted(self.connection_methods.values(), key=lambda x: x.priority):
            if not method.enabled:
                continue
            logger.info(f"Testing connection method: {method.name}")
            success = False
            if method.name == "WiFi":
                success = self.auto_connect_wifi()
            elif method.name == "Ethernet":
                success = self.check_internet_connectivity()
            elif method.name == "Mobile Hotspot":
                success = self.connect_mobile_hotspot()
            elif method.name == "VPN":
                success = self.connect_vpn()
            elif method.name == "QCity":
                success = self.connect_qcity()
            elif method.name == "Zero-Rated Sites":
                success = self.use_zero_rated_sites()
            results[method.name] = success
        return results

    def update_zero_rated_endpoints(self):
        """Update zero-rated endpoint list from a remote source or config"""
        try:
            # Example: fetch from a remote config
            response = requests.get('https://qcity.ai/api/zero-rated-endpoints', timeout=10)
            if response.status_code == 200:
                self.zero_rated_sites = response.json().get('endpoints', self.zero_rated_sites)
                logger.info(f"Updated zero-rated endpoints: {self.zero_rated_sites}")
        except Exception as e:
            logger.error(f"Failed to update zero-rated endpoints: {e}")

    def auto_repair_connectivity(self):
        """Aggressively attempt to repair connectivity by cycling methods and updating endpoints"""
        logger.info("Starting aggressive auto-repair for connectivity")
        for attempt in range(self.max_retries):
            if self.ensure_connectivity():
                logger.info("Connectivity restored during auto-repair")
                return True
            self.update_zero_rated_endpoints()
            time.sleep(5)
        logger.error("Auto-repair failed to restore connectivity")
        return False

def main():
    """Main function"""
    # Initialize network manager
    network_manager = NetworkConnectivityManager()
    
    # Check command line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "ensure":
            # Ensure connectivity
            success = network_manager.ensure_connectivity()
            if success:
                logger.info("Connectivity ensured successfully")
                sys.exit(0)
            else:
                logger.error("Failed to ensure connectivity")
                sys.exit(1)
        
        elif command == "monitor":
            # Start continuous monitoring
            network_manager.start_continuous_monitoring()
            
            try:
                # Keep running
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                network_manager.stop_continuous_monitoring()
        
        elif command == "status":
            # Show current status
            status = network_manager.get_current_network_status()
            print(json.dumps(status.__dict__, indent=2, default=str))
        
        elif command == "statistics":
            # Show connection statistics
            stats = network_manager.get_connection_statistics()
            print(json.dumps(stats, indent=2, default=str))
        
        elif command == "optimize":
            # Optimize connection
            network_manager.optimize_connection()
        
        elif command == "scan-wifi":
            # Scan WiFi networks
            networks = network_manager.scan_wifi_networks()
            print(json.dumps(networks, indent=2))
        
        elif command == "test-all":
            # Test all connectivity methods
            results = network_manager.test_all_connectivity()
            print(json.dumps(results, indent=2))
        
        elif command == "auto-repair":
            # Aggressively attempt to repair connectivity
            success = network_manager.auto_repair_connectivity()
            if success:
                logger.info("Auto-repair successful")
            else:
                logger.error("Auto-repair failed")
        
        elif command == "update-zero-rated":
            # Update zero-rated endpoints
            network_manager.update_zero_rated_endpoints()
        
        else:
            logger.error(f"Unknown command: {command}")
            sys.exit(1)
    
    else:
        # Default: ensure connectivity
        success = network_manager.ensure_connectivity()
        if success:
            logger.info("Connectivity ensured successfully")
        else:
            logger.error("Failed to ensure connectivity")
            sys.exit(1)

if __name__ == "__main__":
    main() 