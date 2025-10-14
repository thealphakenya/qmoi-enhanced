#!/usr/bin/env python3
"""
QMOI Health Monitor
Monitors system health and generates reports
"""

import os
import sys
import json
import time
import psutil
import requests
import logging
from datetime import datetime
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from models.latest.qmoi_enhanced_model import QMOIEnhancedSystem

class QMOIHealthMonitor:
    def __init__(self):
        self.logger = self._setup_logging()
        self.qmoi_system = QMOIEnhancedSystem()
        self.health_report = {
            "timestamp": datetime.now().isoformat(),
            "system_status": "unknown",
            "services": {},
            "resources": {},
            "errors": [],
            "warnings": []
        }
    
    def _setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/health_monitor.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    def check_system_resources(self):
        """Check system resource usage"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            self.health_report["resources"] = {
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "memory_available": memory.available,
                "disk_percent": disk.percent,
                "disk_free": disk.free
            }
            
            # Check for resource warnings
            if cpu_percent > 80:
                self.health_report["warnings"].append(f"High CPU usage: {cpu_percent}%")
            if memory.percent > 85:
                self.health_report["warnings"].append(f"High memory usage: {memory.percent}%")
            if disk.percent > 90:
                self.health_report["warnings"].append(f"High disk usage: {disk.percent}%")
                
        except Exception as e:
            self.health_report["errors"].append(f"Resource check failed: {str(e)}")
    
    def check_qmoi_services(self):
        """Check QMOI service status"""
        services = [
            "qmoi_main",
            "qmoi_revenue_manager", 
            "qmoi_employment_manager",
            "qmoi_hf_space"
        ]
        
        for service in services:
            try:
                # Check if process is running
                is_running = self._check_process_running(service)
                self.health_report["services"][service] = {
                    "status": "running" if is_running else "stopped",
                    "last_check": datetime.now().isoformat()
                }
                
                if not is_running:
                    self.health_report["warnings"].append(f"Service {service} is not running")
                    
            except Exception as e:
                self.health_report["errors"].append(f"Service check failed for {service}: {str(e)}")
    
    def _check_process_running(self, service_name):
        """Check if a process is running"""
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                if service_name in ' '.join(proc.info['cmdline'] or []):
                    return True
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return False
    
    def check_api_endpoints(self):
        """Check API endpoint health"""
        endpoints = [
            "http://localhost:7860/status",
            "http://localhost:8000/health",
            "http://localhost:3000/api/health"
        ]
        
        for endpoint in endpoints:
            try:
                response = requests.get(endpoint, timeout=5)
                if response.status_code == 200:
                    self.health_report["services"][f"api_{endpoint}"] = {
                        "status": "healthy",
                        "response_time": response.elapsed.total_seconds()
                    }
                else:
                    self.health_report["warnings"].append(f"API endpoint {endpoint} returned {response.status_code}")
            except Exception as e:
                self.health_report["errors"].append(f"API endpoint {endpoint} check failed: {str(e)}")
    
    def check_database_health(self):
        """Check database health"""
        try:
            # Check if database files exist and are accessible
            db_files = [
                "qmoi_enhanced_revenue.db",
                "qmoi_employment.db", 
                "qmoi_deals.db",
                "qmoi_avatars.db"
            ]
            
            for db_file in db_files:
                db_path = Path(db_file)
                if db_path.exists():
                    # Check file size and modification time
                    stat = db_path.stat()
                    self.health_report["services"][f"db_{db_file}"] = {
                        "status": "healthy",
                        "size": stat.st_size,
                        "last_modified": datetime.fromtimestamp(stat.st_mtime).isoformat()
                    }
                else:
                    self.health_report["warnings"].append(f"Database file {db_file} not found")
                    
        except Exception as e:
            self.health_report["errors"].append(f"Database health check failed: {str(e)}")
    
    def check_revenue_health(self):
        """Check revenue system health"""
        try:
            # Check revenue targets and performance
            revenue_data = self.qmoi_system.get_revenue_status()
            
            if revenue_data:
                daily_revenue = revenue_data.get("daily_revenue", 0)
                target_revenue = revenue_data.get("target_revenue", 100000)
                
                self.health_report["services"]["revenue_system"] = {
                    "status": "healthy" if daily_revenue >= target_revenue else "warning",
                    "daily_revenue": daily_revenue,
                    "target_revenue": target_revenue,
                    "performance_percent": (daily_revenue / target_revenue) * 100
                }
                
                if daily_revenue < target_revenue:
                    self.health_report["warnings"].append(f"Revenue below target: ${daily_revenue} vs ${target_revenue}")
            else:
                self.health_report["warnings"].append("Revenue data not available")
                
        except Exception as e:
            self.health_report["errors"].append(f"Revenue health check failed: {str(e)}")
    
    def check_employment_health(self):
        """Check employment system health"""
        try:
            # Check employment system status
            employment_data = self.qmoi_system.get_employment_status()
            
            if employment_data:
                active_employees = employment_data.get("active_employees", 0)
                total_positions = employment_data.get("total_positions", 0)
                
                self.health_report["services"]["employment_system"] = {
                    "status": "healthy",
                    "active_employees": active_employees,
                    "total_positions": total_positions,
                    "fill_rate": (active_employees / total_positions) * 100 if total_positions > 0 else 0
                }
            else:
                self.health_report["warnings"].append("Employment data not available")
                
        except Exception as e:
            self.health_report["errors"].append(f"Employment health check failed: {str(e)}")
    
    def generate_health_score(self):
        """Generate overall health score"""
        score = 100
        
        # Deduct points for warnings and errors
        score -= len(self.health_report["warnings"]) * 5
        score -= len(self.health_report["errors"]) * 10
        
        # Deduct points for stopped services
        stopped_services = sum(1 for service in self.health_report["services"].values() 
                             if service.get("status") == "stopped")
        score -= stopped_services * 15
        
        # Ensure score doesn't go below 0
        score = max(0, score)
        
        self.health_report["health_score"] = score
        
        # Set overall system status
        if score >= 90:
            self.health_report["system_status"] = "excellent"
        elif score >= 75:
            self.health_report["system_status"] = "good"
        elif score >= 50:
            self.health_report["system_status"] = "fair"
        else:
            self.health_report["system_status"] = "poor"
    
    def save_health_report(self):
        """Save health report to file"""
        try:
            # Ensure logs directory exists
            Path("logs").mkdir(exist_ok=True)
            
            # Save detailed report
            with open("logs/health_report.json", "w") as f:
                json.dump(self.health_report, f, indent=2)
            
            # Save summary report
            summary = {
                "timestamp": self.health_report["timestamp"],
                "system_status": self.health_report["system_status"],
                "health_score": self.health_report["health_score"],
                "warnings_count": len(self.health_report["warnings"]),
                "errors_count": len(self.health_report["errors"]),
                "services_count": len(self.health_report["services"])
            }
            
            with open("logs/health_summary.json", "w") as f:
                json.dump(summary, f, indent=2)
                
            self.logger.info(f"Health report saved. Score: {self.health_report['health_score']}")
            
        except Exception as e:
            self.logger.error(f"Failed to save health report: {str(e)}")
    
    def run_health_check(self):
        """Run complete health check"""
        self.logger.info("Starting QMOI health check...")
        
        try:
            # Run all health checks
            self.check_system_resources()
            self.check_qmoi_services()
            self.check_api_endpoints()
            self.check_database_health()
            self.check_revenue_health()
            self.check_employment_health()
            
            # Generate health score
            self.generate_health_score()
            
            # Save report
            self.save_health_report()
            
            # Log results
            self.logger.info(f"Health check completed. Status: {self.health_report['system_status']}")
            self.logger.info(f"Health score: {self.health_report['health_score']}")
            
            if self.health_report["warnings"]:
                self.logger.warning(f"Warnings: {len(self.health_report['warnings'])}")
            if self.health_report["errors"]:
                self.logger.error(f"Errors: {len(self.health_report['errors'])}")
            
            return self.health_report
            
        except Exception as e:
            self.logger.error(f"Health check failed: {str(e)}")
            self.health_report["errors"].append(f"Health check failed: {str(e)}")
            self.save_health_report()
            return self.health_report

def main():
    """Main function"""
    monitor = QMOIHealthMonitor()
    report = monitor.run_health_check()
    
    # Exit with error code if health is poor
    if report["system_status"] == "poor":
        sys.exit(1)
    elif report["system_status"] == "fair":
        sys.exit(2)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main() 