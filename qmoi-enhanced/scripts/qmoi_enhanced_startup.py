#!/usr/bin/env python3
"""
QMOI Enhanced Startup Script

Comprehensive startup script that ensures QMOI is always running with:
- Automated environment setup
- Cloud integration
- Error auto-fixing
- Performance optimization
- Continuous monitoring
- Auto-updating capabilities
"""

import os
import sys
import json
import time
import subprocess
import threading
import psutil
import logging
from datetime import datetime, timedelta
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def install_dependencies():
    """Install required dependencies"""
    logger.info("Installing required dependencies...")
    
    dependencies = [
        "schedule>=1.2.0",
        "requests>=2.31.0",
        "psutil>=5.9.0",
        "fastapi>=0.104.0",
        "uvicorn>=0.24.0",
        "gradio>=4.0.0",
        "transformers>=4.35.0",
        "torch>=2.1.0",
        "huggingface_hub>=0.19.0",
        "pandas>=2.1.0",
        "numpy>=1.24.0",
        "sqlalchemy>=2.0.0",
        "cryptography>=41.0.0",
        "boto3>=1.34.0",
        "google-cloud-storage>=2.10.0",
        "azure-storage-blob>=12.19.0",
        "cloudflare>=2.19.0",
        "digitalocean>=1.28.0",
        "redis>=5.0.0",
        "celery>=5.3.0",
        "prometheus_client>=0.19.0",
        "grafana_api>=1.0.0",
        "python-dotenv>=1.0.0"
    ]
    
    for dep in dependencies:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", dep])
            logger.info(f"Installed: {dep}")
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to install {dep}: {e}")

# Try to import schedule, install if missing
try:
    import schedule
except ImportError:
    logger.warning("Schedule module not found, installing dependencies...")
    install_dependencies()
    try:
        import schedule
    except ImportError:
        logger.error("Failed to install schedule module")
        sys.exit(1)

class QMOIEnhancedStartup:
    """QMOI Enhanced Startup Manager"""
    
    def __init__(self):
        self.processes = {}
        self.startup_time = datetime.now()
        self.system_healthy = True
        self.auto_restart_count = 0
        self.max_restarts = 10
        
    def startup_qmoi_system(self):
        """Complete QMOI system startup"""
        logger.info("🚀 Starting QMOI Enhanced System...")
        
        try:
            # Step 1: Environment setup
            self.setup_environment()
            
            # Step 2: Install dependencies
            self.install_dependencies()
            
            # Step 3: Setup cloud integration
            self.setup_cloud_integration()
            
            # Step 4: Setup Hugging Face integration
            self.setup_huggingface_integration()
            
            # Step 5: Initialize databases
            self.initialize_databases()
            
            # Step 6: Start core services
            self.start_core_services()
            
            # Step 7: Start monitoring
            self.start_monitoring()
            
            # Step 8: Start auto-updating
            self.start_auto_updating()
            
            # Step 9: Start error auto-fixing
            self.start_error_auto_fixing()
            
            # Step 10: Verify system health
            self.verify_system_health()
            
            logger.info("✅ QMOI Enhanced System started successfully!")
            return True
            
        except Exception as e:
            logger.error(f"❌ Startup failed: {e}")
            return False
    
    def setup_environment(self):
        """Setup environment"""
        logger.info("Setting up environment...")
        
        # Create all necessary directories
        directories = [
            "employment_letters", "logs", "reports", "models/latest",
            "huggingface_space", "data", "config", "keys", "backups",
            "cloud_cache", "temp", "artifacts", "distributions",
            "qmoi_avatars", "qmoi_deals", "qmoi_revenue", "qmoi_platforms"
        ]
        
        for directory in directories:
            Path(directory).mkdir(parents=True, exist_ok=True)
            logger.info(f"Created directory: {directory}")
        
        # Set environment variables
        env_vars = {
            "QMOI_ENVIRONMENT": "production",
            "QMOI_VERSION": "2.0",
            "QMOI_DAILY_TARGET": "100000",
            "QMOI_AUTO_UPDATE": "true",
            "QMOI_ERROR_AUTO_FIX": "true",
            "QMOI_CLOUD_INTEGRATION": "true",
            "QMOI_HF_INTEGRATION": "true"
        }
        
        for key, value in env_vars.items():
            os.environ[key] = value
        
        logger.info("Environment setup completed")
    
    def install_dependencies(self):
        """Install all dependencies"""
        logger.info("Installing dependencies...")
        
        # Core dependencies
        core_deps = [
            "requests>=2.31.0", "psutil>=5.9.0", "fastapi>=0.104.0",
            "uvicorn>=0.24.0", "gradio>=4.0.0", "transformers>=4.35.0",
            "torch>=2.1.0", "huggingface_hub>=0.19.0", "pandas>=2.1.0",
            "numpy>=1.24.0", "sqlalchemy>=2.0.0", "cryptography>=41.0.0"
        ]
        
        # Cloud dependencies
        cloud_deps = [
            "boto3>=1.34.0", "google-cloud-storage>=2.10.0",
            "azure-storage-blob>=12.19.0", "cloudflare>=2.19.0",
            "digitalocean>=1.28.0", "redis>=5.0.0", "celery>=5.3.0"
        ]
        
        # Monitoring dependencies
        monitoring_deps = [
            "prometheus_client>=0.19.0", "grafana_api>=1.0.0",
            "schedule>=1.2.0", "python-dotenv>=1.0.0"
        ]
        
        all_deps = core_deps + cloud_deps + monitoring_deps
        
        for dep in all_deps:
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", dep])
                logger.info(f"Installed: {dep}")
            except subprocess.CalledProcessError as e:
                logger.error(f"Failed to install {dep}: {e}")
        
        logger.info("Dependencies installation completed")
    
    def setup_cloud_integration(self):
        """Setup cloud integration"""
        logger.info("Setting up cloud integration...")
        
        try:
            # Run cloud setup script
            subprocess.run([sys.executable, "scripts/qmoi_cloud_setup.py"])
            logger.info("Cloud integration setup completed")
        except Exception as e:
            logger.error(f"Cloud setup failed: {e}")
    
    def setup_huggingface_integration(self):
        """Setup Hugging Face integration"""
        logger.info("Setting up Hugging Face integration...")
        
        try:
            # Run Hugging Face setup script
            subprocess.run([sys.executable, "scripts/qmoi_huggingface_setup.py"])
            logger.info("Hugging Face integration setup completed")
        except Exception as e:
            logger.error(f"Hugging Face setup failed: {e}")
    
    def initialize_databases(self):
        """Initialize all databases"""
        logger.info("Initializing databases...")
        
        databases = [
            "qmoi_enhanced_revenue.db",
            "qmoi_employment.db",
            "qmoi_deals.db",
            "qmoi_avatars.db",
            "qmoi_platforms.db"
        ]
        
        for db_file in databases:
            try:
                import sqlite3
                conn = sqlite3.connect(db_file)
                cursor = conn.cursor()
                
                # Create tables based on database type
                if "revenue" in db_file:
                    cursor.execute('''
                        CREATE TABLE IF NOT EXISTS revenue_platforms (
                            platform_id TEXT PRIMARY KEY,
                            name TEXT,
                            category TEXT,
                            daily_target REAL,
                            current_revenue REAL,
                            success_rate REAL,
                            automation_level REAL,
                            last_updated TEXT,
                            status TEXT
                        )
                    ''')
                elif "employment" in db_file:
                    cursor.execute('''
                        CREATE TABLE IF NOT EXISTS employees (
                            employee_id TEXT PRIMARY KEY,
                            name TEXT,
                            category TEXT,
                            salary REAL,
                            performance_bonus REAL,
                            hire_date TEXT,
                            status TEXT
                        )
                    ''')
                elif "deals" in db_file:
                    cursor.execute('''
                        CREATE TABLE IF NOT EXISTS deals (
                            deal_id TEXT PRIMARY KEY,
                            platform TEXT,
                            amount REAL,
                            success_rate REAL,
                            created_date TEXT,
                            status TEXT
                        )
                    ''')
                
                conn.commit()
                conn.close()
                logger.info(f"Database initialized: {db_file}")
                
            except Exception as e:
                logger.error(f"Database initialization failed for {db_file}: {e}")
        
        logger.info("Database initialization completed")
    
    def start_core_services(self):
        """Start core QMOI services"""
        logger.info("Starting core services...")
        
        services = [
            {
                "name": "qmoi_main",
                "script": "scripts/start_qmoi_enhanced.py",
                "port": 7860
            },
            {
                "name": "qmoi_hf_space",
                "script": "huggingface_space/app.py",
                "port": 7861
            },
            {
                "name": "qmoi_revenue_manager",
                "script": "models/latest/qmoi_enhanced_revenue.py",
                "port": None
            },
            {
                "name": "qmoi_employment_manager",
                "script": "models/latest/qmoi_enhanced_model.py",
                "port": None
            }
        ]
        
        for service in services:
            try:
                process = subprocess.Popen([
                    sys.executable, service["script"]
                ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                self.processes[service["name"]] = {
                    "process": process,
                    "script": service["script"],
                    "port": service["port"],
                    "start_time": datetime.now(),
                    "restart_count": 0
                }
                
                logger.info(f"Started service: {service['name']}")
                
                # Wait a bit between starts
                time.sleep(2)
                
            except Exception as e:
                logger.error(f"Failed to start {service['name']}: {e}")
        
        logger.info("Core services started")
    
    def start_monitoring(self):
        """Start monitoring services"""
        logger.info("Starting monitoring services...")
        
        monitoring_services = [
            "scripts/qmoi_cloud_monitor.py",
            "scripts/qmoi_hf_monitoring.py",
            "scripts/qmoi_performance_monitor.py"
        ]
        
        for service in monitoring_services:
            try:
                process = subprocess.Popen([
                    sys.executable, service
                ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                self.processes[f"monitor_{service.split('/')[-1]}"] = {
                    "process": process,
                    "script": service,
                    "start_time": datetime.now()
                }
                
                logger.info(f"Started monitoring: {service}")
                
            except Exception as e:
                logger.error(f"Failed to start monitoring {service}: {e}")
        
        logger.info("Monitoring services started")
    
    def start_auto_updating(self):
        """Start auto-updating services"""
        logger.info("Starting auto-updating services...")
        
        update_services = [
            "scripts/qmoi_hf_auto_update.py",
            "scripts/qmoi_auto_setup.py"
        ]
        
        for service in update_services:
            try:
                process = subprocess.Popen([
                    sys.executable, service
                ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                self.processes[f"update_{service.split('/')[-1]}"] = {
                    "process": process,
                    "script": service,
                    "start_time": datetime.now()
                }
                
                logger.info(f"Started auto-updating: {service}")
                
            except Exception as e:
                logger.error(f"Failed to start auto-updating {service}: {e}")
        
        logger.info("Auto-updating services started")
    
    def start_error_auto_fixing(self):
        """Start error auto-fixing service"""
        logger.info("Starting error auto-fixing service...")
        
        try:
            process = subprocess.Popen([
                sys.executable, "scripts/qmoi_error_auto_fix.py"
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            self.processes["error_auto_fix"] = {
                "process": process,
                "script": "scripts/qmoi_error_auto_fix.py",
                "start_time": datetime.now()
            }
            
            logger.info("Error auto-fixing service started")
            
        except Exception as e:
            logger.error(f"Failed to start error auto-fixing: {e}")
    
    def verify_system_health(self):
        """Verify system health"""
        logger.info("Verifying system health...")
        
        health_checks = [
            self.check_processes_health,
            self.check_database_health,
            self.check_api_health,
            self.check_cloud_health,
            self.check_hf_health
        ]
        
        all_healthy = True
        
        for check in health_checks:
            try:
                if not check():
                    all_healthy = False
            except Exception as e:
                logger.error(f"Health check failed: {e}")
                all_healthy = False
        
        self.system_healthy = all_healthy
        
        if all_healthy:
            logger.info("✅ All system health checks passed")
        else:
            logger.warning("⚠️ Some system health checks failed")
        
        return all_healthy
    
    def check_processes_health(self) -> bool:
        """Check if all processes are running"""
        for name, info in self.processes.items():
            if info["process"].poll() is not None:
                logger.warning(f"Process {name} is not running")
                return False
        return True
    
    def check_database_health(self) -> bool:
        """Check database health"""
        try:
            import sqlite3
            databases = [
                "qmoi_enhanced_revenue.db",
                "qmoi_employment.db",
                "qmoi_deals.db"
            ]
            
            for db_file in databases:
                if os.path.exists(db_file):
                    conn = sqlite3.connect(db_file)
                    cursor = conn.cursor()
                    cursor.execute("SELECT 1")
                    conn.close()
                else:
                    logger.warning(f"Database {db_file} not found")
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return False
    
    def check_api_health(self) -> bool:
        """Check API health"""
        try:
            import requests
            
            endpoints = [
                "http://localhost:7860/status",
                "http://localhost:7861"
            ]
            
            for endpoint in endpoints:
                response = requests.get(endpoint, timeout=5)
                if response.status_code != 200:
                    logger.warning(f"API {endpoint} returned {response.status_code}")
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"API health check failed: {e}")
            return False
    
    def check_cloud_health(self) -> bool:
        """Check cloud health"""
        try:
            cloud_config_path = "cloud_config/qmoi_cloud_config.json"
            if not os.path.exists(cloud_config_path):
                logger.warning("Cloud configuration not found")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Cloud health check failed: {e}")
            return False
    
    def check_hf_health(self) -> bool:
        """Check Hugging Face health"""
        try:
            hf_config_path = "config/huggingface_config.json"
            if not os.path.exists(hf_config_path):
                logger.warning("Hugging Face configuration not found")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Hugging Face health check failed: {e}")
            return False
    
    def run_continuous_monitoring(self):
        """Run continuous monitoring"""
        logger.info("Starting continuous monitoring...")
        
        def monitoring_loop():
            while True:
                try:
                    # Check system health
                    if not self.verify_system_health():
                        self.handle_system_issues()
                    
                    # Restart failed processes
                    self.restart_failed_processes()
                    
                    # Optimize system
                    self.optimize_system()
                    
                    # Generate health report
                    self.generate_health_report()
                    
                    time.sleep(60)  # Check every minute
                    
                except Exception as e:
                    logger.error(f"Monitoring error: {e}")
                    time.sleep(300)  # Wait 5 minutes on error
        
        threading.Thread(target=monitoring_loop, daemon=True).start()
        logger.info("Continuous monitoring started")
    
    def handle_system_issues(self):
        """Handle system issues"""
        logger.warning("Handling system issues...")
        
        # Restart critical services
        critical_services = ["qmoi_main", "qmoi_hf_space"]
        
        for service_name in critical_services:
            if service_name in self.processes:
                info = self.processes[service_name]
                if info["process"].poll() is not None:
                    logger.info(f"Restarting critical service: {service_name}")
                    self.restart_service(service_name)
    
    def restart_failed_processes(self):
        """Restart failed processes"""
        for name, info in self.processes.items():
            if info["process"].poll() is not None:
                if info["restart_count"] < 3:
                    logger.info(f"Restarting failed process: {name}")
                    self.restart_service(name)
                    info["restart_count"] += 1
                else:
                    logger.error(f"Process {name} failed too many times")
    
    def restart_service(self, service_name: str):
        """Restart a specific service"""
        if service_name in self.processes:
            info = self.processes[service_name]
            
            # Stop old process
            try:
                info["process"].terminate()
                info["process"].wait(timeout=10)
            except:
                info["process"].kill()
            
            # Start new process
            try:
                new_process = subprocess.Popen([
                    sys.executable, info["script"]
                ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                info["process"] = new_process
                info["start_time"] = datetime.now()
                
                logger.info(f"Service {service_name} restarted")
                
            except Exception as e:
                logger.error(f"Failed to restart {service_name}: {e}")
    
    def optimize_system(self):
        """Optimize system performance"""
        try:
            # Clear temporary files
            temp_dirs = ["temp", "cloud_cache", "logs"]
            for temp_dir in temp_dirs:
                if os.path.exists(temp_dir):
                    for file in os.listdir(temp_dir):
                        file_path = os.path.join(temp_dir, file)
                        if os.path.isfile(file_path):
                            if time.time() - os.path.getmtime(file_path) > 86400:  # 24 hours
                                os.remove(file_path)
            
            # Force garbage collection
            import gc
            gc.collect()
            
        except Exception as e:
            logger.error(f"System optimization failed: {e}")
    
    def generate_health_report(self):
        """Generate health report"""
        try:
            report = {
                "timestamp": datetime.now().isoformat(),
                "uptime": str(datetime.now() - self.startup_time),
                "system_healthy": self.system_healthy,
                "processes": {},
                "auto_restart_count": self.auto_restart_count,
                "system_resources": {
                    "cpu_usage": psutil.cpu_percent(),
                    "memory_usage": psutil.virtual_memory().percent,
                    "disk_usage": psutil.disk_usage('/').percent
                }
            }
            
            for name, info in self.processes.items():
                report["processes"][name] = {
                    "running": info["process"].poll() is None,
                    "uptime": str(datetime.now() - info["start_time"]),
                    "restart_count": info.get("restart_count", 0)
                }
            
            # Save report
            with open("logs/qmoi_health_report.json", "w") as f:
                json.dump(report, f, indent=2)
            
        except Exception as e:
            logger.error(f"Health report generation failed: {e}")
    
    def run(self):
        """Run the enhanced startup system"""
        logger.info("🚀 QMOI Enhanced Startup System")
        
        # Startup system
        if self.startup_qmoi_system():
            logger.info("✅ QMOI Enhanced System is running!")
            
            # Start continuous monitoring
            self.run_continuous_monitoring()
            
            # Keep running
            try:
                while True:
                    time.sleep(60)
            except KeyboardInterrupt:
                logger.info("🛑 Shutting down QMOI Enhanced System...")
                self.shutdown()
        else:
            logger.error("❌ QMOI Enhanced System startup failed")
    
    def shutdown(self):
        """Shutdown the system"""
        logger.info("Shutting down QMOI Enhanced System...")
        
        # Stop all processes
        for name, info in self.processes.items():
            try:
                info["process"].terminate()
                info["process"].wait(timeout=10)
                logger.info(f"Stopped process: {name}")
            except:
                info["process"].kill()
                logger.info(f"Force killed process: {name}")
        
        logger.info("✅ QMOI Enhanced System shutdown completed")

def main():
    """Main function"""
    startup = QMOIEnhancedStartup()
    startup.run()

if __name__ == "__main__":
    main() 