#!/usr/bin/env python3
"""
QMOI Device Ownership Detector
Automatically detects device restrictions from organizations like M-KOPA, Watu Credit, etc.
Triggers QMOI Own Device feature when restrictions are detected.
"""

import os
import sys
import json
import logging
import platform
import subprocess
import psutil
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import requests
import hashlib

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class DeviceRestriction:
    """Represents a detected device restriction"""
    type: str
    severity: str
    description: str
    detected_at: datetime
    organization: str
    restrictions: List[str]
    device_info: Dict[str, Any]
    unlock_methods: List[str]

@dataclass
class UnlockResult:
    """Result of an unlock attempt"""
    success: bool
    message: str
    method_used: str
    duration_seconds: float
    errors: List[str]

class DeviceOwnershipDetector:
    """Advanced device ownership and restriction detection system"""
    
    def __init__(self):
        self.device_info = self._get_device_info()
        self.known_organizations = {
            'mkopa': {
                'name': 'M-KOPA',
                'package_names': ['com.mkopa', 'com.mkopasolar', 'com.mkopasmart'],
                'signatures': ['mkopa', 'm-kopa', 'mkopasmart'],
                'restriction_types': ['payment_lock', 'device_admin', 'app_restriction', 'network_lock']
            },
            'watu': {
                'name': 'Watu Credit',
                'package_names': ['com.watu', 'com.watucredit', 'com.watucredit'],
                'signatures': ['watu', 'watu credit', 'watucredit'],
                'restriction_types': ['loan_lock', 'device_admin', 'usage_monitoring', 'payment_enforcement']
            },
            'carrier': {
                'name': 'Carrier Lock',
                'package_names': [],
                'signatures': ['carrier', 'network', 'sim_lock'],
                'restriction_types': ['network_lock', 'sim_lock', 'carrier_restriction']
            },
            'mdm': {
                'name': 'Mobile Device Management',
                'package_names': [],
                'signatures': ['mdm', 'device_management', 'enterprise'],
                'restriction_types': ['device_admin', 'policy_enforcement', 'app_management']
            }
        }
        self.detection_results = []
        
    def _get_device_info(self) -> Dict[str, Any]:
        """Get comprehensive device information"""
        try:
            device_info = {
                'platform': platform.system(),
                'platform_version': platform.version(),
                'architecture': platform.machine(),
                'processor': platform.processor(),
                'hostname': platform.node(),
                'python_version': sys.version,
                'memory_total': psutil.virtual_memory().total,
                'memory_available': psutil.virtual_memory().available,
                'disk_usage': psutil.disk_usage('/'),
                'cpu_count': psutil.cpu_count(),
                'boot_time': datetime.fromtimestamp(psutil.boot_time()),
                'network_interfaces': self._get_network_info(),
                'installed_apps': self._get_installed_apps(),
                'running_processes': self._get_running_processes(),
                'device_id': self._generate_device_id()
            }
            return device_info
        except Exception as e:
            logger.error(f"Error getting device info: {e}")
            return {}
    
    def _get_network_info(self) -> Dict[str, Any]:
        """Get network interface information"""
        try:
            network_info = {}
            for interface, addresses in psutil.net_if_addrs().items():
                network_info[interface] = {
                    'addresses': [addr.address for addr in addresses],
                    'netmask': [addr.netmask for addr in addresses if addr.netmask],
                    'family': [addr.family for addr in addresses]
                }
            return network_info
        except Exception as e:
            logger.error(f"Error getting network info: {e}")
            return {}
    
    def _get_installed_apps(self) -> List[str]:
        """Get list of installed applications"""
        try:
            if platform.system() == "Windows":
                return self._get_windows_apps()
            elif platform.system() == "Darwin":  # macOS
                return self._get_macos_apps()
            elif platform.system() == "Linux":
                return self._get_linux_apps()
            else:
                return []
        except Exception as e:
            logger.error(f"Error getting installed apps: {e}")
            return []
    
    def _get_windows_apps(self) -> List[str]:
        """Get Windows installed applications"""
        try:
            apps = []
            # Check registry for installed applications
            import winreg
            keys = [
                r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
                r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"
            ]
            
            for key_path in keys:
                try:
                    with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, key_path) as key:
                        for i in range(winreg.QueryInfoKey(key)[0]):
                            try:
                                subkey_name = winreg.EnumKey(key, i)
                                with winreg.OpenKey(key, subkey_name) as subkey:
                                    try:
                                        app_name = winreg.QueryValueEx(subkey, "DisplayName")[0]
                                        apps.append(app_name)
                                    except:
                                        pass
                            except:
                                pass
                except:
                    pass
            return apps
        except Exception as e:
            logger.error(f"Error getting Windows apps: {e}")
            return []
    
    def _get_macos_apps(self) -> List[str]:
        """Get macOS installed applications"""
        try:
            apps = []
            app_dirs = ['/Applications', '/System/Applications', os.path.expanduser('~/Applications')]
            
            for app_dir in app_dirs:
                if os.path.exists(app_dir):
                    for item in os.listdir(app_dir):
                        if item.endswith('.app'):
                            apps.append(item.replace('.app', ''))
            return apps
        except Exception as e:
            logger.error(f"Error getting macOS apps: {e}")
            return []
    
    def _get_linux_apps(self) -> List[str]:
        """Get Linux installed applications"""
        try:
            apps = []
            # Check common package managers
            package_managers = ['dpkg', 'rpm', 'pacman', 'yum']
            
            for pm in package_managers:
                try:
                    result = subprocess.run([pm, '-l'], capture_output=True, text=True)
                    if result.returncode == 0:
                        lines = result.stdout.split('\n')
                        for line in lines:
                            if line.strip():
                                apps.append(line.split()[1] if len(line.split()) > 1 else line.strip())
                except:
                    pass
            return apps
        except Exception as e:
            logger.error(f"Error getting Linux apps: {e}")
            return []
    
    def _get_running_processes(self) -> List[str]:
        """Get list of running processes"""
        try:
            processes = []
            for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
                try:
                    processes.append({
                        'pid': proc.info['pid'],
                        'name': proc.info['name'],
                        'cmdline': ' '.join(proc.info['cmdline']) if proc.info['cmdline'] else ''
                    })
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
            return processes
        except Exception as e:
            logger.error(f"Error getting running processes: {e}")
            return []
    
    def _generate_device_id(self) -> str:
        """Generate unique device identifier"""
        try:
            # Combine multiple device characteristics
            device_chars = [
                platform.node(),
                platform.machine(),
                str(psutil.cpu_count()),
                str(psutil.virtual_memory().total),
                platform.processor()
            ]
            device_string = ''.join(device_chars)
            return hashlib.sha256(device_string.encode()).hexdigest()[:16]
        except Exception as e:
            logger.error(f"Error generating device ID: {e}")
            return "unknown"
    
    def detect_all_restrictions(self) -> List[DeviceRestriction]:
        """Detect all types of device restrictions"""
        logger.info("🔍 Starting comprehensive device restriction detection...")
        
        all_restrictions = []
        
        # Detect organization-specific restrictions
        for org_key, org_info in self.known_organizations.items():
            restrictions = self._detect_organization_restrictions(org_key, org_info)
            all_restrictions.extend(restrictions)
        
        # Detect general MDM restrictions
        mdm_restrictions = self._detect_mdm_restrictions()
        all_restrictions.extend(mdm_restrictions)
        
        # Detect carrier locks
        carrier_restrictions = self._detect_carrier_restrictions()
        all_restrictions.extend(carrier_restrictions)
        
        # Detect payment locks
        payment_restrictions = self._detect_payment_restrictions()
        all_restrictions.extend(payment_restrictions)
        
        # Detect app restrictions
        app_restrictions = self._detect_app_restrictions()
        all_restrictions.extend(app_restrictions)
        
        # Detect network restrictions
        network_restrictions = self._detect_network_restrictions()
        all_restrictions.extend(network_restrictions)
        
        # Detect location restrictions
        location_restrictions = self._detect_location_restrictions()
        all_restrictions.extend(location_restrictions)
        
        self.detection_results = all_restrictions
        logger.info(f"🔍 Detection complete. Found {len(all_restrictions)} restrictions.")
        
        return all_restrictions
    
    def _detect_organization_restrictions(self, org_key: str, org_info: Dict[str, Any]) -> List[DeviceRestriction]:
        """Detect restrictions from specific organizations"""
        restrictions = []
        
        try:
            # Check for organization-specific apps
            for package_name in org_info['package_names']:
                if self._check_app_installed(package_name):
                    restrictions.append(DeviceRestriction(
                        type=org_key,
                        severity='high',
                        description=f"{org_info['name']} app detected: {package_name}",
                        detected_at=datetime.now(),
                        organization=org_info['name'],
                        restrictions=['app_installed', 'device_admin'],
                        device_info=self.device_info,
                        unlock_methods=['remove_app', 'disable_device_admin', 'clear_policies']
                    ))
            
            # Check for organization signatures in running processes
            for proc in self.device_info.get('running_processes', []):
                proc_name = proc.get('name', '').lower()
                proc_cmdline = proc.get('cmdline', '').lower()
                
                for signature in org_info['signatures']:
                    if signature.lower() in proc_name or signature.lower() in proc_cmdline:
                        restrictions.append(DeviceRestriction(
                            type=org_key,
                            severity='medium',
                            description=f"{org_info['name']} process detected: {proc_name}",
                            detected_at=datetime.now(),
                            organization=org_info['name'],
                            restrictions=['process_running', 'background_service'],
                            device_info=self.device_info,
                            unlock_methods=['terminate_process', 'disable_service', 'remove_app']
                        ))
                        break
            
            # Check for organization-specific files and directories
            org_files = self._check_organization_files(org_key, org_info)
            if org_files:
                restrictions.append(DeviceRestriction(
                    type=org_key,
                    severity='medium',
                    description=f"{org_info['name']} files detected on device",
                    detected_at=datetime.now(),
                    organization=org_info['name'],
                    restrictions=['files_present', 'configuration_stored'],
                    device_info=self.device_info,
                    unlock_methods=['remove_files', 'clear_configuration', 'reset_settings']
                ))
        
        except Exception as e:
            logger.error(f"Error detecting {org_key} restrictions: {e}")
        
        return restrictions
    
    def _check_app_installed(self, package_name: str) -> bool:
        """Check if a specific app is installed"""
        try:
            installed_apps = self.device_info.get('installed_apps', [])
            return any(package_name.lower() in app.lower() for app in installed_apps)
        except Exception as e:
            logger.error(f"Error checking app installation: {e}")
            return False
    
    def _check_organization_files(self, org_key: str, org_info: Dict[str, Any]) -> List[str]:
        """Check for organization-specific files and directories"""
        org_files = []
        
        try:
            # Common directories to check
            check_dirs = [
                '/etc', '/var/lib', '/usr/local', '/opt',
                os.path.expanduser('~/.config'),
                os.path.expanduser('~/Library'),
                os.path.expanduser('~/AppData')
            ]
            
            for check_dir in check_dirs:
                if os.path.exists(check_dir):
                    for root, dirs, files in os.walk(check_dir):
                        for item in dirs + files:
                            item_lower = item.lower()
                            for signature in org_info['signatures']:
                                if signature.lower() in item_lower:
                                    org_files.append(os.path.join(root, item))
        
        except Exception as e:
            logger.error(f"Error checking organization files: {e}")
        
        return org_files
    
    def _detect_mdm_restrictions(self) -> List[DeviceRestriction]:
        """Detect Mobile Device Management restrictions"""
        restrictions = []
        
        try:
            # Check for MDM profiles (macOS)
            if platform.system() == "Darwin":
                try:
                    result = subprocess.run(['profiles', 'list'], capture_output=True, text=True)
                    if result.returncode == 0 and 'MDM' in result.stdout:
                        restrictions.append(DeviceRestriction(
                            type='mdm',
                            severity='high',
                            description='MDM profile detected on macOS',
                            detected_at=datetime.now(),
                            organization='Mobile Device Management',
                            restrictions=['mdm_profile', 'device_management'],
                            device_info=self.device_info,
                            unlock_methods=['remove_mdm_profile', 'disable_device_management']
                        ))
                except:
                    pass
            
            # Check for device admin policies (Android/Windows)
            if self._check_device_admin_policies():
                restrictions.append(DeviceRestriction(
                    type='mdm',
                    severity='high',
                    description='Device admin policies detected',
                    detected_at=datetime.now(),
                    organization='Mobile Device Management',
                    restrictions=['device_admin', 'policy_enforcement'],
                    device_info=self.device_info,
                    unlock_methods=['remove_device_admin', 'clear_policies', 'disable_management']
                ))
        
        except Exception as e:
            logger.error(f"Error detecting MDM restrictions: {e}")
        
        return restrictions
    
    def _check_device_admin_policies(self) -> bool:
        """Check for device admin policies"""
        try:
            # Check for common MDM/device admin indicators
            indicators = [
                'device_policy',
                'device_admin',
                'enterprise_policy',
                'mdm_policy',
                'management_policy'
            ]
            
            for proc in self.device_info.get('running_processes', []):
                proc_name = proc.get('name', '').lower()
                proc_cmdline = proc.get('cmdline', '').lower()
                
                for indicator in indicators:
                    if indicator in proc_name or indicator in proc_cmdline:
                        return True
            
            return False
        except Exception as e:
            logger.error(f"Error checking device admin policies: {e}")
            return False
    
    def _detect_carrier_restrictions(self) -> List[DeviceRestriction]:
        """Detect carrier locks and network restrictions"""
        restrictions = []
        
        try:
            # Check for SIM lock indicators
            if self._check_sim_lock():
                restrictions.append(DeviceRestriction(
                    type='carrier',
                    severity='medium',
                    description='SIM lock detected',
                    detected_at=datetime.now(),
                    organization='Carrier',
                    restrictions=['sim_lock', 'network_restriction'],
                    device_info=self.device_info,
                    unlock_methods=['unlock_sim', 'remove_carrier_lock', 'network_unlock']
                ))
            
            # Check for network restrictions
            if self._check_network_restrictions():
                restrictions.append(DeviceRestriction(
                    type='carrier',
                    severity='low',
                    description='Network restrictions detected',
                    detected_at=datetime.now(),
                    organization='Carrier',
                    restrictions=['network_throttling', 'bandwidth_limit'],
                    device_info=self.device_info,
                    unlock_methods=['bypass_network_restrictions', 'vpn_unlock', 'proxy_unlock']
                ))
        
        except Exception as e:
            logger.error(f"Error detecting carrier restrictions: {e}")
        
        return restrictions
    
    def _check_sim_lock(self) -> bool:
        """Check for SIM lock"""
        try:
            # This would require platform-specific implementation
            # For now, return False as placeholder
            return False
        except Exception as e:
            logger.error(f"Error checking SIM lock: {e}")
            return False
    
    def _check_network_restrictions(self) -> bool:
        """Check for network restrictions"""
        try:
            # Test network connectivity and speed
            # This is a simplified check
            return False
        except Exception as e:
            logger.error(f"Error checking network restrictions: {e}")
            return False
    
    def _detect_payment_restrictions(self) -> List[DeviceRestriction]:
        """Detect payment-based restrictions"""
        restrictions = []
        
        try:
            # Check for payment-related processes
            payment_indicators = [
                'payment', 'billing', 'subscription', 'loan',
                'credit', 'debit', 'financial', 'transaction'
            ]
            
            for proc in self.device_info.get('running_processes', []):
                proc_name = proc.get('name', '').lower()
                proc_cmdline = proc.get('cmdline', '').lower()
                
                for indicator in payment_indicators:
                    if indicator in proc_name or indicator in proc_cmdline:
                        restrictions.append(DeviceRestriction(
                            type='payment',
                            severity='high',
                            description=f'Payment-related process detected: {proc_name}',
                            detected_at=datetime.now(),
                            organization='Payment System',
                            restrictions=['payment_monitoring', 'billing_enforcement'],
                            device_info=self.device_info,
                            unlock_methods=['disable_payment_monitoring', 'clear_billing_data', 'bypass_payment_lock']
                        ))
                        break
        
        except Exception as e:
            logger.error(f"Error detecting payment restrictions: {e}")
        
        return restrictions
    
    def _detect_app_restrictions(self) -> List[DeviceRestriction]:
        """Detect app installation and usage restrictions"""
        restrictions = []
        
        try:
            # Check for app store restrictions
            if self._check_app_store_restrictions():
                restrictions.append(DeviceRestriction(
                    type='app',
                    severity='medium',
                    description='App store restrictions detected',
                    detected_at=datetime.now(),
                    organization='App Store',
                    restrictions=['app_installation_block', 'developer_account_lock'],
                    device_info=self.device_info,
                    unlock_methods=['bypass_app_store', 'enable_side_loading', 'remove_restrictions']
                ))
        
        except Exception as e:
            logger.error(f"Error detecting app restrictions: {e}")
        
        return restrictions
    
    def _check_app_store_restrictions(self) -> bool:
        """Check for app store restrictions"""
        try:
            # This would require platform-specific implementation
            return False
        except Exception as e:
            logger.error(f"Error checking app store restrictions: {e}")
            return False
    
    def _detect_network_restrictions(self) -> List[DeviceRestriction]:
        """Detect network access restrictions"""
        restrictions = []
        
        try:
            # Check for firewall or proxy restrictions
            if self._check_firewall_restrictions():
                restrictions.append(DeviceRestriction(
                    type='network',
                    severity='low',
                    description='Firewall or proxy restrictions detected',
                    detected_at=datetime.now(),
                    organization='Network Security',
                    restrictions=['firewall_block', 'proxy_restriction'],
                    device_info=self.device_info,
                    unlock_methods=['bypass_firewall', 'disable_proxy', 'network_unlock']
                ))
        
        except Exception as e:
            logger.error(f"Error detecting network restrictions: {e}")
        
        return restrictions
    
    def _check_firewall_restrictions(self) -> bool:
        """Check for firewall restrictions"""
        try:
            # This would require platform-specific implementation
            return False
        except Exception as e:
            logger.error(f"Error checking firewall restrictions: {e}")
            return False
    
    def _detect_location_restrictions(self) -> List[DeviceRestriction]:
        """Detect location-based restrictions"""
        restrictions = []
        
        try:
            # Check for location tracking or restrictions
            if self._check_location_restrictions():
                restrictions.append(DeviceRestriction(
                    type='location',
                    severity='medium',
                    description='Location-based restrictions detected',
                    detected_at=datetime.now(),
                    organization='Location Services',
                    restrictions=['location_tracking', 'geo_restriction'],
                    device_info=self.device_info,
                    unlock_methods=['disable_location_tracking', 'bypass_geo_restriction', 'location_unlock']
                ))
        
        except Exception as e:
            logger.error(f"Error detecting location restrictions: {e}")
        
        return restrictions
    
    def _check_location_restrictions(self) -> bool:
        """Check for location restrictions"""
        try:
            # This would require platform-specific implementation
            return False
        except Exception as e:
            logger.error(f"Error checking location restrictions: {e}")
            return False
    
    def generate_detection_report(self) -> Dict[str, Any]:
        """Generate comprehensive detection report"""
        try:
            report = {
                'timestamp': datetime.now().isoformat(),
                'device_info': self.device_info,
                'detected_restrictions': [
                    {
                        'type': r.type,
                        'severity': r.severity,
                        'description': r.description,
                        'organization': r.organization,
                        'restrictions': r.restrictions,
                        'unlock_methods': r.unlock_methods,
                        'detected_at': r.detected_at.isoformat()
                    }
                    for r in self.detection_results
                ],
                'summary': {
                    'total_restrictions': len(self.detection_results),
                    'high_severity': len([r for r in self.detection_results if r.severity == 'high']),
                    'critical_severity': len([r for r in self.detection_results if r.severity == 'critical']),
                    'organizations': list(set(r.organization for r in self.detection_results))
                }
            }
            return report
        except Exception as e:
            logger.error(f"Error generating detection report: {e}")
            return {}

def main():
    """Main function to run device ownership detection"""
    try:
        logger.info("🚀 Starting QMOI Device Ownership Detection...")
        
        detector = DeviceOwnershipDetector()
        restrictions = detector.detect_all_restrictions()
        
        if restrictions:
            logger.warning(f"🚨 Found {len(restrictions)} device restrictions!")
            for restriction in restrictions:
                logger.warning(f"  - {restriction.organization}: {restriction.description} ({restriction.severity})")
            
            # Generate report
            report = detector.generate_detection_report()
            
            # Save report
            with open('device_restrictions_report.json', 'w') as f:
                json.dump(report, f, indent=2)
            
            logger.info("📊 Detection report saved to device_restrictions_report.json")
            
            # Trigger QMOI Own Device if restrictions found
            if restrictions:
                logger.info("🔓 Triggering QMOI Own Device feature...")
                # This would trigger the UI component to show the QMOI Own Device button
                
        else:
            logger.info("✅ No device restrictions detected. Device is free!")
        
        return restrictions
        
    except Exception as e:
        logger.error(f"❌ Error in device ownership detection: {e}")
        return []

if __name__ == "__main__":
    main() 