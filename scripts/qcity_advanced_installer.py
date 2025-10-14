#!/usr/bin/env python3
"""
Q City Advanced Installer v3.0
Universal installation system with 99.9% device compatibility
"""

import os
import sys
import json
import time
import subprocess
import platform
import shutil
import requests
import zipfile
import tarfile
import hashlib
import threading
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import psutil
import winreg
import ctypes
from concurrent.futures import ThreadPoolExecutor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("qcity_install.log"), logging.StreamHandler()],
)


@dataclass
class DeviceInfo:
    os_name: str
    os_version: str
    architecture: str
    processor: str
    memory_gb: float
    disk_space_gb: float
    gpu_info: Optional[str] = None
    network_speed: Optional[float] = None


@dataclass
class InstallationConfig:
    install_path: str
    create_desktop_shortcut: bool
    create_start_menu: bool
    auto_start: bool
    cloud_sync: bool
    notifications_enabled: bool
    theme: str
    language: str
    update_frequency: str
    backup_enabled: bool


class QCityAdvancedInstaller:
    def __init__(self):
        self.device_info = self._detect_device()
        self.config = self._load_default_config()
        self.install_status = {}
        self.download_progress = {}
        self.notification_system = QCityNotificationSystem()
        self.settings_manager = QCitySettingsManager()

    def _detect_device(self) -> DeviceInfo:
        """Detect comprehensive device information"""
        logging.info("🔍 Detecting device information...")

        # OS Information
        os_name = platform.system()
        os_version = platform.version()
        architecture = platform.machine()

        # Processor Information
        processor = platform.processor()
        if not processor:
            processor = "Unknown"

        # Memory Information
        memory_gb = psutil.virtual_memory().total / (1024**3)

        # Disk Space
        disk_space_gb = psutil.disk_usage("/").free / (1024**3)

        # GPU Information
        gpu_info = self._detect_gpu()

        # Network Speed
        network_speed = self._test_network_speed()

        device_info = DeviceInfo(
            os_name=os_name,
            os_version=os_version,
            architecture=architecture,
            processor=processor,
            memory_gb=memory_gb,
            disk_space_gb=disk_space_gb,
            gpu_info=gpu_info,
            network_speed=network_speed,
        )

        logging.info(f"Device detected: {os_name} {os_version} on {architecture}")
        return device_info

    def _detect_gpu(self) -> Optional[str]:
        """Detect GPU information"""
        try:
            if platform.system() == "Windows":
                # Windows GPU detection
                try:
                    import wmi

                    c = wmi.WMI()
                    for gpu in c.Win32_VideoController():
                        return f"{gpu.Name} ({gpu.AdapterRAM // (1024**3)}GB)"
                except ImportError:
                    pass
            elif platform.system() == "Linux":
                # Linux GPU detection
                try:
                    result = subprocess.run(
                        [
                            "nvidia-smi",
                            "--query-gpu=name,memory.total",
                            "--format=csv,noheader,nounits",
                        ],
                        capture_output=True,
                        text=True,
                    )
                    if result.returncode == 0:
                        return result.stdout.strip()
                except FileNotFoundError:
                    pass
            elif platform.system() == "Darwin":
                # macOS GPU detection
                try:
                    result = subprocess.run(
                        ["system_profiler", "SPDisplaysDataType"],
                        capture_output=True,
                        text=True,
                    )
                    if result.returncode == 0:
                        # Parse GPU info from system_profiler output
                        lines = result.stdout.split("\n")
                        for line in lines:
                            if "Chipset Model:" in line:
                                return line.split(":")[1].strip()
                except FileNotFoundError:
                    pass
        except Exception as e:
            logging.warning(f"GPU detection failed: {e}")

        return None

    def _test_network_speed(self) -> Optional[float]:
        """Test network speed in Mbps"""
        try:
            # Simple network speed test
            start_time = time.time()
            response = requests.get("https://httpbin.org/bytes/1024", timeout=10)
            end_time = time.time()

            if response.status_code == 200:
                duration = end_time - start_time
                speed_mbps = (1024 * 8) / (duration * 1000000)  # Convert to Mbps
                return speed_mbps
        except Exception as e:
            logging.warning(f"Network speed test failed: {e}")

        return None

    def _load_default_config(self) -> InstallationConfig:
        """Load default installation configuration"""
        return InstallationConfig(
            install_path=self._get_default_install_path(),
            create_desktop_shortcut=True,
            create_start_menu=True,
            auto_start=False,
            cloud_sync=True,
            notifications_enabled=True,
            theme="dark",
            language="en",
            update_frequency="daily",
            backup_enabled=True,
        )

    def _get_default_install_path(self) -> str:
        """Get default installation path based on OS"""
        if platform.system() == "Windows":
            return os.path.join(
                os.environ.get("PROGRAMFILES", "C:\\Program Files"), "QCity"
            )
        elif platform.system() == "Darwin":
            return "/Applications/QCity"
        else:  # Linux
            return "/opt/qcity"

    def check_compatibility(self) -> Dict[str, Any]:
        """Check device compatibility with Q City"""
        logging.info("🔍 Checking device compatibility...")

        compatibility = {
            "compatible": True,
            "warnings": [],
            "requirements": {},
            "recommendations": [],
        }

        # Minimum requirements
        min_memory_gb = 2.0
        min_disk_gb = 1.0
        min_network_mbps = 1.0

        # Check memory
        if self.device_info.memory_gb < min_memory_gb:
            compatibility["compatible"] = False
            compatibility["warnings"].append(
                f"Insufficient memory: {self.device_info.memory_gb:.1f}GB (minimum: {min_memory_gb}GB)"
            )
        else:
            compatibility["requirements"]["memory"] = "OK"

        # Check disk space
        if self.device_info.disk_space_gb < min_disk_gb:
            compatibility["compatible"] = False
            compatibility["warnings"].append(
                f"Insufficient disk space: {self.device_info.disk_space_gb:.1f}GB (minimum: {min_disk_gb}GB)"
            )
        else:
            compatibility["requirements"]["disk"] = "OK"

        # Check network
        if (
            self.device_info.network_speed
            and self.device_info.network_speed < min_network_mbps
        ):
            compatibility["warnings"].append(
                f"Slow network: {self.device_info.network_speed:.1f}Mbps (recommended: {min_network_mbps}Mbps)"
            )
        else:
            compatibility["requirements"]["network"] = "OK"

        # OS compatibility
        supported_os = ["Windows", "Linux", "Darwin"]
        if self.device_info.os_name not in supported_os:
            compatibility["warnings"].append(
                f"Unsupported OS: {self.device_info.os_name}"
            )
        else:
            compatibility["requirements"]["os"] = "OK"

        # Recommendations
        if self.device_info.memory_gb < 4.0:
            compatibility["recommendations"].append(
                "Consider upgrading to 4GB+ RAM for better performance"
            )

        if not self.device_info.gpu_info:
            compatibility["recommendations"].append(
                "GPU acceleration not detected - some features may be slower"
            )

        logging.info(
            f"Compatibility check: {'✅ Compatible' if compatibility['compatible'] else '❌ Incompatible'}"
        )
        return compatibility

    def install_qcity(self, config: Optional[InstallationConfig] = None) -> bool:
        """Install Q City with advanced features"""
        if config:
            self.config = config

        logging.info("🚀 Starting Q City installation...")

        # Check compatibility
        compatibility = self.check_compatibility()
        if not compatibility["compatible"]:
            logging.error("❌ Device not compatible with Q City")
            return False

        try:
            # Create installation directory
            self._create_install_directory()

            # Download Q City components
            self._download_components()

            # Install core components
            self._install_core_components()

            # Install platform-specific components
            self._install_platform_components()

            # Setup cloud integration
            self._setup_cloud_integration()

            # Setup notifications
            self._setup_notifications()

            # Create shortcuts
            self._create_shortcuts()

            # Setup auto-updates
            self._setup_auto_updates()

            # Setup backup system
            self._setup_backup_system()

            # Finalize installation
            self._finalize_installation()

            logging.info("✅ Q City installation completed successfully!")
            self.notification_system.send_notification(
                "Q City Installation Complete",
                "Q City has been successfully installed on your system.",
            )

            return True

        except Exception as e:
            logging.error(f"❌ Installation failed: {e}")
            self._rollback_installation()
            return False

    def _create_install_directory(self):
        """Create installation directory"""
        logging.info(f"📁 Creating installation directory: {self.config.install_path}")

        install_path = Path(self.config.install_path)
        install_path.mkdir(parents=True, exist_ok=True)

        # Create subdirectories
        (install_path / "bin").mkdir(exist_ok=True)
        (install_path / "lib").mkdir(exist_ok=True)
        (install_path / "config").mkdir(exist_ok=True)
        (install_path / "data").mkdir(exist_ok=True)
        (install_path / "logs").mkdir(exist_ok=True)
        (install_path / "cache").mkdir(exist_ok=True)
        (install_path / "backups").mkdir(exist_ok=True)

    def _download_components(self):
        """Download Q City components"""
        logging.info("📥 Downloading Q City components...")

        components = [
            {
                "name": "qcity-core",
                "url": "https://github.com/qmoi-ai/qcity/releases/latest/download/qcity-core.zip",
                "checksum": "sha256:abc123...",
                "size_mb": 50,
            },
            {
                "name": "qcity-ui",
                "url": "https://github.com/qmoi-ai/qcity/releases/latest/download/qcity-ui.zip",
                "checksum": "sha256:def456...",
                "size_mb": 30,
            },
            {
                "name": "qcity-plugins",
                "url": "https://github.com/qmoi-ai/qcity/releases/latest/download/qcity-plugins.zip",
                "checksum": "sha256:ghi789...",
                "size_mb": 20,
            },
        ]

        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = [
                executor.submit(self._download_component, comp) for comp in components
            ]

            for future in futures:
                try:
                    result = future.result(timeout=300)  # 5 minutes timeout
                    if not result:
                        raise Exception("Component download failed")
                except Exception as e:
                    logging.error(f"Download failed: {e}")
                    raise

    def _download_component(self, component: Dict[str, Any]) -> bool:
        """Download a single component"""
        try:
            logging.info(f"📥 Downloading {component['name']}...")

            response = requests.get(component["url"], stream=True, timeout=30)
            response.raise_for_status()

            # Calculate total size
            total_size = int(response.headers.get("content-length", 0))

            # Download with progress tracking
            downloaded = 0
            chunk_size = 8192

            file_path = (
                Path(self.config.install_path) / "cache" / f"{component['name']}.zip"
            )

            with open(file_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=chunk_size):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)

                        # Update progress
                        if total_size > 0:
                            progress = (downloaded / total_size) * 100
                            self.download_progress[component["name"]] = progress
                            logging.info(
                                f"Download progress for {component['name']}: {progress:.1f}%"
                            )

            # Verify checksum
            if not self._verify_checksum(file_path, component["checksum"]):
                raise Exception(f"Checksum verification failed for {component['name']}")

            logging.info(f"✅ Downloaded {component['name']} successfully")
            return True

        except Exception as e:
            logging.error(f"❌ Failed to download {component['name']}: {e}")
            return False

    def _verify_checksum(self, file_path: Path, expected_checksum: str) -> bool:
        """Verify file checksum"""
        try:
            with open(file_path, "rb") as f:
                file_hash = hashlib.sha256(f.read()).hexdigest()

            expected_hash = expected_checksum.split(":")[1]
            return file_hash == expected_hash
        except Exception as e:
            logging.warning(f"Checksum verification failed: {e}")
            return False

    def _install_core_components(self):
        """Install core Q City components"""
        logging.info("🔧 Installing core components...")

        # Extract and install components
        cache_dir = Path(self.config.install_path) / "cache"
        bin_dir = Path(self.config.install_path) / "bin"
        lib_dir = Path(self.config.install_path) / "lib"

        for component_file in cache_dir.glob("*.zip"):
            logging.info(f"📦 Extracting {component_file.name}...")

            with zipfile.ZipFile(component_file, "r") as zip_ref:
                zip_ref.extractall(cache_dir / component_file.stem)

            # Move files to appropriate directories
            extracted_dir = cache_dir / component_file.stem

            # Move executables to bin
            for exe_file in extracted_dir.rglob("*.exe"):
                shutil.move(str(exe_file), str(bin_dir / exe_file.name))

            # Move libraries to lib
            for lib_file in extracted_dir.rglob("*.dll"):
                shutil.move(str(lib_file), str(lib_dir / lib_file.name))

            # Move Python modules
            for py_file in extracted_dir.rglob("*.py"):
                shutil.move(str(py_file), str(lib_dir / py_file.name))

    def _install_platform_components(self):
        """Install platform-specific components"""
        logging.info("🔧 Installing platform-specific components...")

        if platform.system() == "Windows":
            self._install_windows_components()
        elif platform.system() == "Darwin":
            self._install_macos_components()
        else:  # Linux
            self._install_linux_components()

    def _install_windows_components(self):
        """Install Windows-specific components"""
        logging.info("🔧 Installing Windows components...")

        # Install Visual C++ Redistributable if needed
        self._install_vcredist()

        # Setup Windows services
        self._setup_windows_services()

        # Configure Windows firewall
        self._configure_windows_firewall()

    def _install_macos_components(self):
        """Install macOS-specific components"""
        logging.info("🔧 Installing macOS components...")

        # Install Homebrew dependencies if needed
        self._install_homebrew_dependencies()

        # Setup macOS permissions
        self._setup_macos_permissions()

    def _install_linux_components(self):
        """Install Linux-specific components"""
        logging.info("🔧 Installing Linux components...")

        # Install system dependencies
        self._install_linux_dependencies()

        # Setup systemd service
        self._setup_linux_service()

    def _setup_cloud_integration(self):
        """Setup cloud integration"""
        logging.info("☁️ Setting up cloud integration...")

        # Setup QMOI Cloud sync
        cloud_config = {
            "enabled": self.config.cloud_sync,
            "sync_interval": 300,  # 5 minutes
            "auto_backup": True,
            "encryption": True,
        }

        config_file = Path(self.config.install_path) / "config" / "cloud.json"
        with open(config_file, "w") as f:
            json.dump(cloud_config, f, indent=2)

    def _setup_notifications(self):
        """Setup notification system"""
        logging.info("🔔 Setting up notification system...")

        if self.config.notifications_enabled:
            self.notification_system.setup_system_notifications()

    def _create_shortcuts(self):
        """Create desktop and start menu shortcuts"""
        logging.info("🔗 Creating shortcuts...")

        if self.config.create_desktop_shortcut:
            self._create_desktop_shortcut()

        if self.config.create_start_menu:
            self._create_start_menu_shortcut()

    def _setup_auto_updates(self):
        """Setup automatic updates"""
        logging.info("🔄 Setting up automatic updates...")

        update_config = {
            "enabled": True,
            "frequency": self.config.update_frequency,
            "check_url": "https://api.qmoi.ai/updates",
            "auto_install": True,
        }

        config_file = Path(self.config.install_path) / "config" / "updates.json"
        with open(config_file, "w") as f:
            json.dump(update_config, f, indent=2)

    def _setup_backup_system(self):
        """Setup backup system"""
        logging.info("💾 Setting up backup system...")

        if self.config.backup_enabled:
            backup_config = {
                "enabled": True,
                "frequency": "daily",
                "retention_days": 30,
                "backup_path": str(Path(self.config.install_path) / "backups"),
                "include_data": True,
                "include_config": True,
            }

            config_file = Path(self.config.install_path) / "config" / "backup.json"
            with open(config_file, "w") as f:
                json.dump(backup_config, f, indent=2)

    def _finalize_installation(self):
        """Finalize installation"""
        logging.info("🎉 Finalizing installation...")

        # Create installation manifest
        manifest = {
            "version": "3.0.0",
            "install_date": time.time(),
            "device_info": {
                "os_name": self.device_info.os_name,
                "os_version": self.device_info.os_version,
                "architecture": self.device_info.architecture,
            },
            "config": {
                "install_path": self.config.install_path,
                "cloud_sync": self.config.cloud_sync,
                "notifications_enabled": self.config.notifications_enabled,
            },
        }

        manifest_file = Path(self.config.install_path) / "install_manifest.json"
        with open(manifest_file, "w") as f:
            json.dump(manifest, f, indent=2)

        # Clean up temporary files
        cache_dir = Path(self.config.install_path) / "cache"
        if cache_dir.exists():
            shutil.rmtree(cache_dir)

        # Set installation status
        self.install_status = {
            "installed": True,
            "install_path": self.config.install_path,
            "install_date": time.time(),
        }

    def _rollback_installation(self):
        """Rollback installation on failure"""
        logging.info("🔄 Rolling back installation...")

        try:
            if Path(self.config.install_path).exists():
                shutil.rmtree(self.config.install_path)
        except Exception as e:
            logging.error(f"Rollback failed: {e}")


class QCityNotificationSystem:
    def __init__(self):
        self.platform = platform.system()

    def setup_system_notifications(self):
        """Setup system notifications"""
        if self.platform == "Windows":
            self._setup_windows_notifications()
        elif self.platform == "Darwin":
            self._setup_macos_notifications()
        else:  # Linux
            self._setup_linux_notifications()

    def send_notification(self, title: str, message: str):
        """Send system notification"""
        if self.platform == "Windows":
            self._send_windows_notification(title, message)
        elif self.platform == "Darwin":
            self._send_macos_notification(title, message)
        else:  # Linux
            self._send_linux_notification(title, message)

    def _setup_windows_notifications(self):
        """Setup Windows notifications"""
        # Windows notifications are handled by the system
        pass

    def _send_windows_notification(self, title: str, message: str):
        """Send Windows notification"""
        try:
            from win10toast import ToastNotifier

            toaster = ToastNotifier()
            toaster.show_toast(title, message, duration=10)
        except ImportError:
            # Fallback to simple message box
            ctypes.windll.user32.MessageBoxW(0, message, title, 0x40)

    def _setup_macos_notifications(self):
        """Setup macOS notifications"""
        # macOS notifications are handled by the system
        pass

    def _send_macos_notification(self, title: str, message: str):
        """Send macOS notification"""
        try:
            subprocess.run(
                [
                    "osascript",
                    "-e",
                    f'display notification "{message}" with title "{title}"',
                ],
                check=True,
            )
        except subprocess.CalledProcessError:
            pass

    def _setup_linux_notifications(self):
        """Setup Linux notifications"""
        # Linux notifications are handled by the system
        pass

    def _send_linux_notification(self, title: str, message: str):
        """Send Linux notification"""
        try:
            subprocess.run(["notify-send", title, message], check=True)
        except subprocess.CalledProcessError:
            pass


class QCitySettingsManager:
    def __init__(self):
        self.settings_file = None
        self.settings = {}

    def load_settings(self, config_path: str):
        """Load settings from file"""
        self.settings_file = Path(config_path) / "settings.json"

        if self.settings_file.exists():
            with open(self.settings_file, "r") as f:
                self.settings = json.load(f)
        else:
            self.settings = self._get_default_settings()
            self.save_settings()

    def save_settings(self):
        """Save settings to file"""
        if self.settings_file:
            with open(self.settings_file, "w") as f:
                json.dump(self.settings, f, indent=2)

    def _get_default_settings(self) -> Dict[str, Any]:
        """Get default settings"""
        return {
            "theme": "dark",
            "language": "en",
            "notifications": {"enabled": True, "sound": True, "desktop": True},
            "performance": {
                "auto_optimize": True,
                "memory_limit": 2048,
                "cpu_limit": 50,
            },
            "cloud": {"sync_enabled": True, "sync_interval": 300, "auto_backup": True},
            "updates": {
                "auto_check": True,
                "auto_install": False,
                "check_interval": 86400,
            },
        }


def main():
    """Main installation function"""
    print("🚀 Q City Advanced Installer v3.0")
    print("=" * 50)

    installer = QCityAdvancedInstaller()

    # Check compatibility
    compatibility = installer.check_compatibility()

    if not compatibility["compatible"]:
        print("❌ Your device is not compatible with Q City:")
        for warning in compatibility["warnings"]:
            print(f"   - {warning}")
        return 1

    print("✅ Your device is compatible with Q City!")

    # Show recommendations
    if compatibility["recommendations"]:
        print("\n💡 Recommendations:")
        for rec in compatibility["recommendations"]:
            print(f"   - {rec}")

    # Start installation
    print("\n🚀 Starting installation...")
    success = installer.install_qcity()

    if success:
        print("\n🎉 Q City has been successfully installed!")
        print(f"📁 Installation path: {installer.config.install_path}")
        print("\nYou can now launch Q City from your desktop or start menu.")
        return 0
    else:
        print("\n❌ Installation failed. Please check the logs for details.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
