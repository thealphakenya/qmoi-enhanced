#!/usr/bin/env python3
"""
QCity Device Management & Unlimited QCity Automation
Robust device detection, dependency management, and automated troubleshooting
"""

import os
import sys
import platform
import subprocess
import json
import logging
import shutil
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import psutil
import socket

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qcity_device_manager.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QCityDeviceManager:
    """Comprehensive QCity device management and automation"""
    
    def __init__(self):
        self.device_info = self.get_device_info()
        self.install_log = []
        self.error_log = []
        self.success_log = []
        self.master_config = self.load_master_config()
        
    def load_master_config(self) -> Dict:
        """Load master configuration for device management"""
        config_path = Path("config/qcity_device_config.json")
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return {
            "auto_install_dependencies": True,
            "retry_failed_installs": True,
            "max_retries": 3,
            "unlimited_qcity_mode": True,
            "device_compatibility_check": True,
            "auto_troubleshoot": True,
            "master_only_device_management": True
        }
    
    def get_device_info(self) -> Dict:
        """Get comprehensive device information"""
        info = {
            'os': platform.system(),
            'os_version': platform.version(),
            'architecture': platform.architecture()[0],
            'processor': platform.processor(),
            'hostname': socket.gethostname(),
            'python_version': sys.version,
            'cpu_count': psutil.cpu_count(),
            'memory_total': psutil.virtual_memory().total,
            'disk_free': psutil.disk_usage('/').free,
            'network_interfaces': self.get_network_info(),
            'installed_packages': self.get_installed_packages(),
            'timestamp': datetime.now().isoformat()
        }
        
        # OS-specific information
        if platform.system() == "Windows":
            info.update(self.get_windows_info())
        elif platform.system() == "Linux":
            info.update(self.get_linux_info())
        elif platform.system() == "Darwin":
            info.update(self.get_macos_info())
        
        return info
    
    def get_network_info(self) -> Dict:
        """Get network interface information"""
        interfaces = {}
        try:
            for interface, addresses in psutil.net_if_addrs().items():
                interfaces[interface] = {
                    'addresses': [addr.address for addr in addresses if addr.family == socket.AF_INET],
                    'mac': [addr.address for addr in addresses if addr.family == psutil.AF_LINK]
                }
        except Exception as e:
            logger.warning(f"Failed to get network info: {e}")
        
        return interfaces
    
    def get_installed_packages(self) -> List[str]:
        """Get list of installed Python packages"""
        try:
            result = subprocess.run([sys.executable, '-m', 'pip', 'list'], 
                                  capture_output=True, text=True, timeout=30)
            packages = []
            for line in result.stdout.split('\n')[2:]:  # Skip header
                if line.strip():
                    packages.append(line.split()[0])
            return packages
        except Exception as e:
            logger.warning(f"Failed to get installed packages: {e}")
            return []
    
    def get_windows_info(self) -> Dict:
        """Get Windows-specific information"""
        info = {}
        try:
            # Get Windows version
            result = subprocess.run(['ver'], capture_output=True, text=True, timeout=10)
            info['windows_version'] = result.stdout.strip()
            
            # Get PowerShell version
            result = subprocess.run(['powershell', '$PSVersionTable.PSVersion'], 
                                  capture_output=True, text=True, timeout=10)
            info['powershell_version'] = result.stdout.strip()
            
        except Exception as e:
            logger.warning(f"Failed to get Windows info: {e}")
        
        return info
    
    def get_linux_info(self) -> Dict:
        """Get Linux-specific information"""
        info = {}
        try:
            # Get Linux distribution
            if os.path.exists('/etc/os-release'):
                with open('/etc/os-release', 'r') as f:
                    for line in f:
                        if line.startswith('PRETTY_NAME'):
                            info['linux_distro'] = line.split('=')[1].strip().strip('"')
                            break
            
            # Get kernel version
            result = subprocess.run(['uname', '-r'], capture_output=True, text=True, timeout=10)
            info['kernel_version'] = result.stdout.strip()
            
        except Exception as e:
            logger.warning(f"Failed to get Linux info: {e}")
        
        return info
    
    def get_macos_info(self) -> Dict:
        """Get macOS-specific information"""
        info = {}
        try:
            # Get macOS version
            result = subprocess.run(['sw_vers', '-productVersion'], 
                                  capture_output=True, text=True, timeout=10)
            info['macos_version'] = result.stdout.strip()
            
            # Get Xcode version
            result = subprocess.run(['xcodebuild', '-version'], 
                                  capture_output=True, text=True, timeout=10)
            info['xcode_version'] = result.stdout.strip()
            
        except Exception as e:
            logger.warning(f"Failed to get macOS info: {e}")
        
        return info
    
    def check_device_compatibility(self) -> Dict:
        """Check if device is compatible with QCity"""
        compatibility = {
            'compatible': True,
            'issues': [],
            'recommendations': [],
            'score': 100
        }
        
        # Check minimum requirements
        min_requirements = {
            'cpu_count': 2,
            'memory_gb': 4,
            'disk_gb': 10,
            'python_version': '3.8'
        }
        
        # Check CPU
        if self.device_info['cpu_count'] < min_requirements['cpu_count']:
            compatibility['issues'].append(f"Insufficient CPU cores: {self.device_info['cpu_count']} < {min_requirements['cpu_count']}")
            compatibility['score'] -= 20
        
        # Check memory
        memory_gb = self.device_info['memory_total'] / (1024**3)
        if memory_gb < min_requirements['memory_gb']:
            compatibility['issues'].append(f"Insufficient memory: {memory_gb:.1f}GB < {min_requirements['memory_gb']}GB")
            compatibility['score'] -= 30
        
        # Check disk space
        disk_gb = self.device_info['disk_free'] / (1024**3)
        if disk_gb < min_requirements['disk_gb']:
            compatibility['issues'].append(f"Insufficient disk space: {disk_gb:.1f}GB < {min_requirements['disk_gb']}GB")
            compatibility['score'] -= 15
        
        # Check Python version
        python_version = sys.version_info
        min_python = tuple(map(int, min_requirements['python_version'].split('.')))
        if python_version < min_python:
            compatibility['issues'].append(f"Python version too old: {python_version} < {min_python}")
            compatibility['score'] -= 25
        
        # Check network connectivity
        if not self.check_network_connectivity():
            compatibility['issues'].append("No internet connectivity")
            compatibility['score'] -= 10
        
        # Generate recommendations
        if compatibility['score'] < 100:
            compatibility['compatible'] = False
            if memory_gb < min_requirements['memory_gb']:
                compatibility['recommendations'].append("Upgrade RAM to at least 4GB")
            if disk_gb < min_requirements['disk_gb']:
                compatibility['recommendations'].append("Free up disk space or upgrade storage")
            if python_version < min_python:
                compatibility['recommendations'].append("Upgrade Python to 3.8 or higher")
        
        return compatibility
    
    def check_network_connectivity(self) -> bool:
        """Check internet connectivity"""
        try:
            requests.get("https://www.google.com", timeout=5)
            return True
        except:
            return False
    
    def install_dependency(self, package: str, retries: int = 3) -> bool:
        """Install a Python package with retry logic"""
        for attempt in range(retries):
            try:
                logger.info(f"Installing {package} (attempt {attempt + 1}/{retries})")
                
                # Try pip install
                result = subprocess.run(
                    [sys.executable, '-m', 'pip', 'install', package, '--upgrade'],
                    capture_output=True, text=True, timeout=300
                )
                
                if result.returncode == 0:
                    self.success_log.append(f"Successfully installed {package}")
                    logger.info(f"Successfully installed {package}")
                    return True
                else:
                    error_msg = f"Failed to install {package}: {result.stderr}"
                    self.error_log.append(error_msg)
                    logger.warning(error_msg)
                    
                    # Try alternative installation methods
                    if attempt == retries - 1:
                        return self.try_alternative_install(package)
                    
            except subprocess.TimeoutExpired:
                error_msg = f"Timeout installing {package}"
                self.error_log.append(error_msg)
                logger.warning(error_msg)
            except Exception as e:
                error_msg = f"Error installing {package}: {str(e)}"
                self.error_log.append(error_msg)
                logger.error(error_msg)
        
        return False
    
    def try_alternative_install(self, package: str) -> bool:
        """Try alternative installation methods"""
        logger.info(f"Trying alternative installation methods for {package}")
        
        # Try conda if available
        if shutil.which('conda'):
            try:
                result = subprocess.run(['conda', 'install', '-y', package], 
                                      capture_output=True, text=True, timeout=300)
                if result.returncode == 0:
                    self.success_log.append(f"Successfully installed {package} via conda")
                    return True
            except Exception as e:
                logger.warning(f"Conda install failed for {package}: {e}")
        
        # Try system package manager
        if platform.system() == "Linux":
            return self.try_system_package_manager(package)
        
        return False
    
    def try_system_package_manager(self, package: str) -> bool:
        """Try system package manager installation"""
        package_mapping = {
            'requests': 'python3-requests',
            'psutil': 'python3-psutil',
            'numpy': 'python3-numpy',
            'pandas': 'python3-pandas'
        }
        
        system_package = package_mapping.get(package, f"python3-{package}")
        
        # Try apt (Ubuntu/Debian)
        if shutil.which('apt'):
            try:
                result = subprocess.run(['sudo', 'apt', 'install', '-y', system_package], 
                                      capture_output=True, text=True, timeout=300)
                if result.returncode == 0:
                    self.success_log.append(f"Successfully installed {package} via apt")
                    return True
            except Exception as e:
                logger.warning(f"Apt install failed for {package}: {e}")
        
        # Try yum (RHEL/CentOS)
        if shutil.which('yum'):
            try:
                result = subprocess.run(['sudo', 'yum', 'install', '-y', system_package], 
                                      capture_output=True, text=True, timeout=300)
                if result.returncode == 0:
                    self.success_log.append(f"Successfully installed {package} via yum")
                    return True
            except Exception as e:
                logger.warning(f"Yum install failed for {package}: {e}")
        
        return False
    
    def install_qcity_dependencies(self) -> Dict:
        """Install all QCity dependencies"""
        logger.info("Installing QCity dependencies")
        
        # Core dependencies for unlimited QCity
        dependencies = [
            'requests>=2.25.0',
            'psutil>=5.8.0',
            'numpy>=1.21.0',
            'pandas>=1.3.0',
            'matplotlib>=3.4.0',
            'seaborn>=0.11.0',
            'scikit-learn>=1.0.0',
            'tensorflow>=2.8.0',
            'torch>=1.10.0',
            'transformers>=4.15.0',
            'datasets>=1.17.0',
            'accelerate>=0.5.0',
            'optuna>=2.10.0',
            'mlflow>=1.20.0',
            'wandb>=0.12.0',
            'streamlit>=1.10.0',
            'gradio>=3.0.0',
            'fastapi>=0.70.0',
            'uvicorn>=0.15.0',
            'sqlalchemy>=1.4.0',
            'alembic>=1.7.0',
            'redis>=4.0.0',
            'celery>=5.2.0',
            'flower>=1.0.0',
            'prometheus-client>=0.12.0',
            'grafana-api>=1.0.0',
            'elasticsearch>=7.17.0',
            'kibana>=7.17.0',
            'logstash>=7.17.0',
            'beats>=7.17.0'
        ]
        
        results = {
            'total_dependencies': len(dependencies),
            'successful_installs': 0,
            'failed_installs': 0,
            'failed_packages': [],
            'install_log': []
        }
        
        for package in dependencies:
            if self.install_dependency(package):
                results['successful_installs'] += 1
                results['install_log'].append(f"✓ {package}")
            else:
                results['failed_installs'] += 1
                results['failed_packages'].append(package)
                results['install_log'].append(f"✗ {package}")
        
        return results
    
    def setup_qcity_environment(self) -> Dict:
        """Setup QCity environment and configuration"""
        logger.info("Setting up QCity environment")
        
        setup_results = {
            'directories_created': [],
            'configs_created': [],
            'permissions_set': [],
            'errors': []
        }
        
        # Create necessary directories
        directories = [
            'qcity_data',
            'qcity_models',
            'qcity_logs',
            'qcity_configs',
            'qcity_backups',
            'qcity_cache',
            'qcity_reports'
        ]
        
        for directory in directories:
            try:
                Path(directory).mkdir(exist_ok=True)
                setup_results['directories_created'].append(directory)
            except Exception as e:
                setup_results['errors'].append(f"Failed to create {directory}: {e}")
        
        # Create configuration files
        configs = {
            'qcity_config.json': {
                'version': '1.0.0',
                'unlimited_mode': True,
                'auto_optimization': True,
                'master_only': True,
                'device_info': self.device_info
            },
            'qcity_database.json': {
                'type': 'sqlite',
                'path': 'qcity_data/qcity.db',
                'backup_enabled': True
            },
            'qcity_logging.json': {
                'level': 'INFO',
                'file': 'qcity_logs/qcity.log',
                'max_size': '100MB',
                'backup_count': 5
            }
        }
        
        for config_file, config_data in configs.items():
            try:
                config_path = Path(f"qcity_configs/{config_file}")
                config_path.parent.mkdir(exist_ok=True)
                with open(config_path, 'w') as f:
                    json.dump(config_data, f, indent=2)
                setup_results['configs_created'].append(config_file)
            except Exception as e:
                setup_results['errors'].append(f"Failed to create {config_file}: {e}")
        
        return setup_results
    
    def run_device_diagnostics(self) -> Dict:
        """Run comprehensive device diagnostics"""
        logger.info("Running device diagnostics")
        
        diagnostics = {
            'device_info': self.device_info,
            'compatibility': self.check_device_compatibility(),
            'network_test': self.test_network_connectivity(),
            'performance_test': self.run_performance_test(),
            'security_check': self.run_security_check(),
            'timestamp': datetime.now().isoformat()
        }
        
        return diagnostics
    
    def test_network_connectivity(self) -> Dict:
        """Test network connectivity to various services"""
        services = [
            'https://www.google.com',
            'https://github.com',
            'https://pypi.org',
            'https://huggingface.co',
            'https://api.openai.com'
        ]
        
        results = {}
        for service in services:
            try:
                response = requests.get(service, timeout=10)
                results[service] = {
                    'status': 'connected',
                    'response_time': response.elapsed.total_seconds(),
                    'status_code': response.status_code
                }
            except Exception as e:
                results[service] = {
                    'status': 'failed',
                    'error': str(e)
                }
        
        return results
    
    def run_performance_test(self) -> Dict:
        """Run basic performance tests"""
        import time
        
        results = {
            'cpu_test': {},
            'memory_test': {},
            'disk_test': {},
            'network_test': {}
        }
        
        # CPU test
        start_time = time.time()
        for i in range(1000000):
            _ = i * i
        results['cpu_test']['time'] = time.time() - start_time
        
        # Memory test
        start_time = time.time()
        test_data = [i for i in range(100000)]
        results['memory_test']['time'] = time.time() - start_time
        results['memory_test']['memory_used'] = len(test_data) * 8  # Approximate bytes
        
        # Disk test
        start_time = time.time()
        test_file = 'qcity_cache/performance_test.txt'
        try:
            with open(test_file, 'w') as f:
                f.write('x' * 1000000)
            results['disk_test']['write_time'] = time.time() - start_time
            
            start_time = time.time()
            with open(test_file, 'r') as f:
                f.read()
            results['disk_test']['read_time'] = time.time() - start_time
            
            os.remove(test_file)
        except Exception as e:
            results['disk_test']['error'] = str(e)
        
        return results
    
    def run_security_check(self) -> Dict:
        """Run basic security checks"""
        security = {
            'file_permissions': {},
            'network_security': {},
            'python_security': {}
        }
        
        # Check file permissions
        important_files = [
            'qcity_configs/qcity_config.json',
            'qcity_logs/qcity.log'
        ]
        
        for file_path in important_files:
            try:
                if os.path.exists(file_path):
                    stat = os.stat(file_path)
                    security['file_permissions'][file_path] = {
                        'mode': oct(stat.st_mode),
                        'owner': stat.st_uid,
                        'group': stat.st_gid
                    }
            except Exception as e:
                security['file_permissions'][file_path] = {'error': str(e)}
        
        # Check Python security
        try:
            result = subprocess.run([sys.executable, '-m', 'pip', 'audit'], 
                                  capture_output=True, text=True, timeout=60)
            security['python_security']['audit_result'] = result.stdout
        except Exception as e:
            security['python_security']['error'] = str(e)
        
        return security
    
    def generate_report(self) -> Dict:
        """Generate comprehensive device management report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'device_info': self.device_info,
            'compatibility': self.check_device_compatibility(),
            'install_results': self.install_qcity_dependencies(),
            'setup_results': self.setup_qcity_environment(),
            'diagnostics': self.run_device_diagnostics(),
            'success_log': self.success_log,
            'error_log': self.error_log,
            'recommendations': self.generate_recommendations()
        }
        
        # Save report
        report_path = Path("qcity_reports/device_management_report.json")
        report_path.parent.mkdir(exist_ok=True)
        
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def generate_recommendations(self) -> List[str]:
        """Generate recommendations based on diagnostics"""
        recommendations = []
        
        compatibility = self.check_device_compatibility()
        if not compatibility['compatible']:
            recommendations.extend(compatibility['recommendations'])
        
        if len(self.error_log) > 0:
            recommendations.append("Review error log and address failed installations")
        
        if self.device_info['memory_total'] / (1024**3) < 8:
            recommendations.append("Consider upgrading RAM for better performance")
        
        if self.device_info['cpu_count'] < 4:
            recommendations.append("Consider upgrading to a multi-core processor")
        
        return recommendations

def main():
    """Main device management runner"""
    logger.info("Starting QCity Device Management")
    
    device_manager = QCityDeviceManager()
    
    # Run comprehensive device management
    report = device_manager.generate_report()
    
    # Print summary
    print("\n" + "="*50)
    print("QCity Device Management Report")
    print("="*50)
    print(f"Device: {report['device_info']['hostname']}")
    print(f"OS: {report['device_info']['os']} {report['device_info']['os_version']}")
    print(f"Compatibility Score: {report['compatibility']['score']}/100")
    print(f"Installations: {report['install_results']['successful_installs']}/{report['install_results']['total_dependencies']}")
    print(f"Errors: {len(report['error_log'])}")
    print("="*50)
    
    if report['compatibility']['compatible']:
        print("✅ Device is compatible with QCity")
    else:
        print("❌ Device has compatibility issues")
        for issue in report['compatibility']['issues']:
            print(f"  - {issue}")
    
    if len(report['recommendations']) > 0:
        print("\nRecommendations:")
        for rec in report['recommendations']:
            print(f"  - {rec}")
    
    logger.info("QCity Device Management completed")

if __name__ == "__main__":
    main() 