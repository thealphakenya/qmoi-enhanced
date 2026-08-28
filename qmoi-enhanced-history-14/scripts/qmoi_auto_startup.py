#!/usr/bin/env python3
"""
QMOI Auto Startup System
Automatically starts QMOI systems in background
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
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi_auto_startup.log'),
        logging.StreamHandler()
    ]
)

class QMOIAutoStartup:
    def __init__(self):
        self.running = False
        self.processes = []
        self.status_file = 'logs/qmoi_startup_status.json'
        
        # Ensure logs directory exists
        os.makedirs('logs', exist_ok=True)
        
        # Initialize status
        self.update_status({
            'running': False,
            'started_at': None,
            'processes': [],
            'errors': []
        })
    
    def update_status(self, status_updates: Dict[str, Any]):
        """Update startup status"""
        try:
            current_status = {}
            if os.path.exists(self.status_file):
                with open(self.status_file, 'r') as f:
                    current_status = json.load(f)
            
            current_status.update(status_updates)
            current_status['last_updated'] = datetime.now().isoformat()
            
            with open(self.status_file, 'w') as f:
                json.dump(current_status, f, indent=2)
        except Exception as e:
            logging.error(f"Failed to update status: {e}")
    
    def start_device_controller(self):
        """Start device controller"""
        try:
            script_path = os.path.join(os.getcwd(), 'scripts', 'qmoi_automated_device_controller.py')
            if os.path.exists(script_path):
                process = subprocess.Popen([
                    sys.executable, script_path
                ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                self.processes.append(('device_controller', process))
                logging.info("✅ Device controller started")
                return True
            else:
                logging.error(f"Device controller script not found: {script_path}")
                return False
        except Exception as e:
            logging.error(f"Failed to start device controller: {e}")
            return False
    
    def start_betting_system(self):
        """Start betting system"""
        try:
            script_path = os.path.join(os.getcwd(), 'scripts', 'qmoi_automated_betting_system.py')
            if os.path.exists(script_path):
                process = subprocess.Popen([
                    sys.executable, script_path
                ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                self.processes.append(('betting_system', process))
                logging.info("✅ Betting system started")
                return True
            else:
                logging.error(f"Betting system script not found: {script_path}")
                return False
        except Exception as e:
            logging.error(f"Failed to start betting system: {e}")
            return False
    
    def monitor_processes(self):
        """Monitor running processes"""
        while self.running:
            try:
                for name, process in self.processes:
                    if process.poll() is not None:
                        logging.warning(f"⚠️ {name} process stopped, restarting...")
                        self.restart_process(name)
                
                # Update status
                process_status = []
                for name, process in self.processes:
                    process_status.append({
                        'name': name,
                        'pid': process.pid,
                        'running': process.poll() is None
                    })
                
                self.update_status({'processes': process_status})
                time.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                logging.error(f"Monitoring error: {e}")
                time.sleep(60)
    
    def restart_process(self, process_name: str):
        """Restart a stopped process"""
        try:
            # Remove old process
            self.processes = [(name, proc) for name, proc in self.processes if name != process_name]
            
            # Restart process
            if process_name == 'device_controller':
                self.start_device_controller()
            elif process_name == 'betting_system':
                self.start_betting_system()
                
        except Exception as e:
            logging.error(f"Failed to restart {process_name}: {e}")
    
    def start(self):
        """Start all QMOI systems"""
        if self.running:
            logging.warning("QMOI Auto Startup is already running")
            return
        
        logging.info("🚀 Starting QMOI Auto Startup System...")
        self.running = True
        
        # Update status
        self.update_status({
            'running': True,
            'started_at': datetime.now().isoformat()
        })
        
        try:
            # Start device controller
            if self.start_device_controller():
                logging.info("✅ Device controller started successfully")
            
            # Start betting system
            if self.start_betting_system():
                logging.info("✅ Betting system started successfully")
            
            # Start monitoring
            monitor_thread = threading.Thread(target=self.monitor_processes, daemon=True)
            monitor_thread.start()
            logging.info("✅ Process monitoring started")
            
            logging.info("🎉 QMOI Auto Startup System is now running!")
            logging.info("📊 All systems are running in the background")
            logging.info("📝 Check logs/ for detailed activity logs")
            logging.info("🛑 Press Ctrl+C to stop all systems")
            
            # Keep main thread alive
            while self.running:
                time.sleep(1)
                
        except KeyboardInterrupt:
            logging.info("Received interrupt signal")
            self.stop()
        except Exception as e:
            logging.error(f"Startup error: {e}")
            self.stop()
    
    def stop(self):
        """Stop all QMOI systems"""
        logging.info("🛑 Stopping QMOI Auto Startup System...")
        self.running = False
        
        try:
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
            self.update_status({'running': False})
            logging.info("✅ All systems stopped")
            
        except Exception as e:
            logging.error(f"Failed to stop systems: {e}")

def create_startup_script():
    """Create a startup script for Windows"""
    try:
        startup_script = """@echo off
cd /d "%~dp0"
python scripts/qmoi_auto_startup.py
pause
"""
        
        with open('start_qmoi_systems.bat', 'w') as f:
            f.write(startup_script)
        
        print("✅ Created startup script: start_qmoi_systems.bat")
        print("🔧 Double-click the .bat file to start QMOI systems")
        
    except Exception as e:
        print(f"❌ Failed to create startup script: {e}")

def main():
    """Main function"""
    if len(sys.argv) > 1 and sys.argv[1] == 'create-startup':
        create_startup_script()
        return
    
    startup_system = QMOIAutoStartup()
    startup_system.start()

if __name__ == "__main__":
    main() 