#!/usr/bin/env python3
"""
QMOI Windows Service Manager
Runs QMOI automated systems as Windows services
"""

import os
import sys
import time
import json
import logging
import subprocess
import threading
from datetime import datetime
from pathlib import Path
import win32serviceutil
import win32service
import win32event
import servicemanager
import socket

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("logs/qmoi_windows_service.log"),
        logging.StreamHandler(),
    ],
)


class QMOIWindowsService(win32serviceutil.ServiceFramework):
    """QMOI Windows Service"""

    _svc_name_ = "QMOIAutomatedSystem"
    _svc_display_name_ = "QMOI Automated System Service"
    _svc_description_ = "QMOI Device Controller and Betting System Service"

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.stop_event = win32event.CreateEvent(None, 0, 0, None)
        self.running = False
        self.processes = []

        # Service status file
        self.status_file = "logs/qmoi_service_status.json"
        os.makedirs("logs", exist_ok=True)

    def SvcStop(self):
        """Stop the service"""
        logging.info("🛑 Stopping QMOI Windows Service...")
        self.running = False
        win32event.SetEvent(self.stop_event)

    def SvcDoRun(self):
        """Run the service"""
        logging.info("🚀 Starting QMOI Windows Service...")
        self.running = True
        self.update_service_status("running")

        try:
            # Start automated systems
            self.start_automated_systems()

            # Keep service running
            while self.running:
                time.sleep(1)

        except Exception as e:
            logging.error(f"Service error: {e}")
            self.update_service_status("error", str(e))
        finally:
            self.stop_automated_systems()
            self.update_service_status("stopped")

    def start_automated_systems(self):
        """Start all automated systems"""
        try:
            logging.info("🔧 Starting automated systems...")

            # Start device controller
            self.start_device_controller()

            # Start betting system
            self.start_betting_system()

            # Start monitoring
            self.start_monitoring()

            logging.info("✅ All automated systems started successfully")

        except Exception as e:
            logging.error(f"Failed to start automated systems: {e}")

    def start_device_controller(self):
        """Start device controller process"""
        try:
            script_path = os.path.join(
                os.getcwd(), "scripts", "qmoi_automated_device_controller.py"
            )
            if os.path.exists(script_path):
                process = subprocess.Popen(
                    [sys.executable, script_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                )
                self.processes.append(("device_controller", process))
                logging.info("✅ Device controller started")
            else:
                logging.error(f"Device controller script not found: {script_path}")
        except Exception as e:
            logging.error(f"Failed to start device controller: {e}")

    def start_betting_system(self):
        """Start betting system process"""
        try:
            script_path = os.path.join(
                os.getcwd(), "scripts", "qmoi_automated_betting_system.py"
            )
            if os.path.exists(script_path):
                process = subprocess.Popen(
                    [sys.executable, script_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                )
                self.processes.append(("betting_system", process))
                logging.info("✅ Betting system started")
            else:
                logging.error(f"Betting system script not found: {script_path}")
        except Exception as e:
            logging.error(f"Failed to start betting system: {e}")

    def start_monitoring(self):
        """Start monitoring process"""
        try:
            # Create monitoring thread
            monitor_thread = threading.Thread(
                target=self.monitor_processes, daemon=True
            )
            monitor_thread.start()
            logging.info("✅ Process monitoring started")
        except Exception as e:
            logging.error(f"Failed to start monitoring: {e}")

    def monitor_processes(self):
        """Monitor running processes"""
        while self.running:
            try:
                for name, process in self.processes:
                    if process.poll() is not None:
                        logging.warning(f"⚠️ {name} process stopped, restarting...")
                        self.restart_process(name)

                time.sleep(30)  # Check every 30 seconds

            except Exception as e:
                logging.error(f"Monitoring error: {e}")
                time.sleep(60)

    def restart_process(self, process_name: str):
        """Restart a stopped process"""
        try:
            # Remove old process
            self.processes = [
                (name, proc) for name, proc in self.processes if name != process_name
            ]

            # Restart process
            if process_name == "device_controller":
                self.start_device_controller()
            elif process_name == "betting_system":
                self.start_betting_system()

        except Exception as e:
            logging.error(f"Failed to restart {process_name}: {e}")

    def stop_automated_systems(self):
        """Stop all automated systems"""
        try:
            logging.info("🛑 Stopping automated systems...")

            for name, process in self.processes:
                try:
                    process.terminate()
                    process.wait(timeout=10)
                    logging.info(f"✅ {name} stopped")
                except subprocess.TimeoutExpired:
                    process.kill()
                    logging.warning(f"⚠️ {name} force killed")
                except Exception as e:
                    logging.error(f"Failed to stop {name}: {e}")

            self.processes.clear()

        except Exception as e:
            logging.error(f"Failed to stop automated systems: {e}")

    def update_service_status(self, status: str, error: str = None):
        """Update service status"""
        try:
            status_data = {
                "status": status,
                "timestamp": datetime.now().isoformat(),
                "error": error,
            }

            with open(self.status_file, "w") as f:
                json.dump(status_data, f, indent=2)

        except Exception as e:
            logging.error(f"Failed to update service status: {e}")


def install_service():
    """Install the Windows service"""
    try:
        win32serviceutil.InstallService(
            QMOIWindowsService._svc_name_,
            QMOIWindowsService._svc_display_name_,
            QMOIWindowsService._svc_description_,
        )
        print("✅ QMOI Windows Service installed successfully")
        print("🔧 To start the service, run: net start QMOIAutomatedSystem")
        print("🛑 To stop the service, run: net stop QMOIAutomatedSystem")
    except Exception as e:
        print(f"❌ Failed to install service: {e}")


def uninstall_service():
    """Uninstall the Windows service"""
    try:
        win32serviceutil.RemoveService(QMOIWindowsService._svc_name_)
        print("✅ QMOI Windows Service uninstalled successfully")
    except Exception as e:
        print(f"❌ Failed to uninstall service: {e}")


def main():
    """Main function"""
    if len(sys.argv) == 1:
        servicemanager.Initialize()
        servicemanager.PrepareToHostSingle(QMOIWindowsService)
        servicemanager.StartServiceCtrlDispatcher()
    else:
        win32serviceutil.HandleCommandLine(QMOIWindowsService)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "install":
        install_service()
    elif len(sys.argv) > 1 and sys.argv[1] == "uninstall":
        uninstall_service()
    else:
        main()
