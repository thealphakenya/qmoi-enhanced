#!/usr/bin/env python3
"""
QMOI Complete System Integration
Orchestrates all QMOI components including monitoring, AI services, automation, and deployment.
Ensures all systems work together seamlessly with comprehensive health checks and auto-recovery.
"""

import os
import sys
import json
import time
import logging
import subprocess
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import requests
import psutil

class QMOICompleteSystem:
    def __init__(self):
        self.logger = self.setup_logging()
        self.config = self.load_config()
        self.system_active = False
        self.components = {}
        self.health_status = {}
        self.performance_metrics = {}
        
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/qmoi_complete_system.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    def load_config(self) -> Dict[str, Any]:
        """Load complete system configuration"""
        config = {
            'system_components': {
                'core_services': {
                    'qmoi_ai': {
                        'script': 'scripts/start_qmoi_enhanced.py',
                        'priority': 'critical',
                        'auto_restart': True,
                        'health_check': True
                    },
                    'monitoring_system': {
                        'script': 'scripts/start_monitoring_system.py',
                        'priority': 'critical',
                        'auto_restart': True,
                        'health_check': True
                    },
                    'security_monitor': {
                        'script': 'scripts/qmoi_security_monitor.py',
                        'priority': 'critical',
                        'auto_restart': True,
                        'health_check': True
                    }
                },
                'monitoring_services': {
                    'system_health': 'scripts/monitoring/system_health_monitor.py',
                    'performance': 'scripts/monitoring/performance_monitor.py',
                    'revenue': 'scripts/monitoring/revenue_monitor.py',
                    'employment': 'scripts/monitoring/employment_monitor.py',
                    'cloud_resources': 'scripts/monitoring/cloud_resources_monitor.py',
                    'api_endpoints': 'scripts/monitoring/api_endpoints_monitor.py',
                    'backup': 'scripts/monitoring/backup_monitor.py',
                    'notifications': 'scripts/monitoring/notification_monitor.py'
                },
                'automation_services': {
                    'auto_fix': 'scripts/qmoi_error_auto_fix.py',
                    'deployment': 'scripts/deploy/auto_deploy.py',
                    'backup_automation': 'scripts/automation/qmoi_master_automation.py'
                },
                'ai_services': {
                    'trading_engine': 'backend/trading-engine.ts',
                    'ai_automation': 'scripts/ai_automation.py',
                    'feature_suggester': 'scripts/qmoi_feature_suggester.py'
                }
            },
            'health_checks': {
                'interval': 60,  # seconds
                'timeout': 30,   # seconds
                'max_retries': 3
            },
            'performance_thresholds': {
                'cpu_usage': 80,      # %
                'memory_usage': 85,   # %
                'disk_usage': 90,     # %
                'response_time': 5000 # ms
            },
            'auto_recovery': {
                'enabled': True,
                'max_attempts': 5,
                'cooldown_period': 300  # seconds
            },
            'dashboard': {
                'enabled': True,
                'port': 8080,
                'host': '0.0.0.0'
            }
        }
        
        # Load from config file if exists
        config_file = 'config/qmoi_complete_system_config.json'
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                self.logger.error(f"Error loading config: {e}")
        
        return config
    
    def check_dependencies(self) -> bool:
        """Check if all required dependencies are available"""
        try:
            self.logger.info("Checking system dependencies...")
            
            required_packages = [
                'requests', 'psutil', 'boto3', 'azure.mgmt.compute',
                'google.cloud', 'aiohttp', 'schedule', 'flask'
            ]
            
            missing_packages = []
            for package in required_packages:
                try:
                    __import__(package)
                except ImportError:
                    missing_packages.append(package)
            
            if missing_packages:
                self.logger.warning(f"Missing packages: {missing_packages}")
                self.logger.info("Installing missing packages...")
                
                for package in missing_packages:
                    try:
                        subprocess.check_call([
                            sys.executable, '-m', 'pip', 'install', package
                        ])
                        self.logger.info(f"Installed {package}")
                    except subprocess.CalledProcessError as e:
                        self.logger.error(f"Failed to install {package}: {e}")
                        return False
            
            # Check required directories
            required_dirs = ['logs', 'config', 'scripts', 'scripts/monitoring']
            for directory in required_dirs:
                if not os.path.exists(directory):
                    os.makedirs(directory, exist_ok=True)
                    self.logger.info(f"Created directory: {directory}")
            
            self.logger.info("All dependencies satisfied")
            return True
            
        except Exception as e:
            self.logger.error(f"Error checking dependencies: {e}")
            return False
    
    def start_component(self, component_name: str, component_config: Dict[str, Any]) -> bool:
        """Start a system component"""
        try:
            script_path = component_config.get('script')
            if not script_path or not os.path.exists(script_path):
                self.logger.error(f"Script not found for {component_name}: {script_path}")
                return False
            
            self.logger.info(f"Starting {component_name}...")
            
            # Start the component process
            process = subprocess.Popen([
                sys.executable, script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            # Store component info
            self.components[component_name] = {
                'process': process,
                'config': component_config,
                'start_time': datetime.now(),
                'status': 'starting',
                'restart_count': 0,
                'last_health_check': None
            }
            
            # Wait for startup
            time.sleep(5)
            
            # Check if process is running
            if process.poll() is None:
                self.components[component_name]['status'] = 'running'
                self.logger.info(f"✓ {component_name} started successfully")
                return True
            else:
                # Process failed to start
                stdout, stderr = process.communicate()
                self.logger.error(f"✗ Failed to start {component_name}: {stderr.decode()}")
                self.components[component_name]['status'] = 'failed'
                return False
                
        except Exception as e:
            self.logger.error(f"Error starting {component_name}: {e}")
            return False
    
    def stop_component(self, component_name: str):
        """Stop a system component"""
        try:
            if component_name in self.components:
                component_info = self.components[component_name]
                process = component_info['process']
                
                self.logger.info(f"Stopping {component_name}...")
                
                # Terminate process
                process.terminate()
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.kill()
                
                component_info['status'] = 'stopped'
                component_info['stop_time'] = datetime.now()
                
                self.logger.info(f"✓ {component_name} stopped")
                
        except Exception as e:
            self.logger.error(f"Error stopping {component_name}: {e}")
    
    def restart_component(self, component_name: str) -> bool:
        """Restart a system component"""
        try:
            self.logger.info(f"Restarting {component_name}...")
            
            # Stop component
            self.stop_component(component_name)
            
            # Wait before restart
            time.sleep(2)
            
            # Start component
            if component_name in self.config['system_components']['core_services']:
                component_config = self.config['system_components']['core_services'][component_name]
                return self.start_component(component_name, component_config)
            
            return False
            
        except Exception as e:
            self.logger.error(f"Error restarting {component_name}: {e}")
            return False
    
    def check_component_health(self, component_name: str) -> bool:
        """Check health of a component"""
        try:
            if component_name not in self.components:
                return False
            
            component_info = self.components[component_name]
            process = component_info['process']
            
            # Check if process is running
            if process.poll() is None:
                # Check for recent log activity
                log_file = f'logs/{component_name.replace("_", "")}.log'
                if os.path.exists(log_file):
                    stat = os.stat(log_file)
                    if time.time() - stat.st_mtime < 600:  # 10 minutes
                        component_info['last_health_check'] = datetime.now()
                        return True
            
            return False
            
        except Exception as e:
            self.logger.error(f"Error checking health of {component_name}: {e}")
            return False
    
    def start_core_services(self) -> bool:
        """Start core QMOI services"""
        try:
            self.logger.info("Starting core QMOI services...")
            
            core_services = self.config['system_components']['core_services']
            success_count = 0
            
            for service_name, service_config in core_services.items():
                if self.start_component(service_name, service_config):
                    success_count += 1
                else:
                    self.logger.error(f"Failed to start core service: {service_name}")
            
            self.logger.info(f"Started {success_count}/{len(core_services)} core services")
            
            # All critical services must be running
            critical_services = [name for name, config in core_services.items() 
                               if config.get('priority') == 'critical']
            
            critical_running = 0
            for service_name in critical_services:
                if service_name in self.components and self.components[service_name]['status'] == 'running':
                    critical_running += 1
            
            if critical_running < len(critical_services):
                self.logger.error("Not all critical services are running")
                return False
            
            return success_count >= len(core_services) * 0.8  # 80% success rate
            
        except Exception as e:
            self.logger.error(f"Error starting core services: {e}")
            return False
    
    def start_monitoring_services(self):
        """Start monitoring services"""
        try:
            self.logger.info("Starting monitoring services...")
            
            monitoring_services = self.config['system_components']['monitoring_services']
            
            for service_name, script_path in monitoring_services.items():
                try:
                    if os.path.exists(script_path):
                        process = subprocess.Popen([
                            sys.executable, script_path
                        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                        
                        self.components[f"monitor_{service_name}"] = {
                            'process': process,
                            'config': {'script': script_path},
                            'start_time': datetime.now(),
                            'status': 'running',
                            'restart_count': 0,
                            'last_health_check': None
                        }
                        
                        self.logger.info(f"Started monitoring service: {service_name}")
                    else:
                        self.logger.warning(f"Monitoring script not found: {script_path}")
                        
                except Exception as e:
                    self.logger.error(f"Error starting monitoring service {service_name}: {e}")
            
        except Exception as e:
            self.logger.error(f"Error starting monitoring services: {e}")
    
    def collect_system_metrics(self) -> Dict[str, Any]:
        """Collect system-wide metrics"""
        try:
            metrics = {
                'timestamp': datetime.now().isoformat(),
                'system': {
                    'cpu_percent': psutil.cpu_percent(interval=1),
                    'memory_percent': psutil.virtual_memory().percent,
                    'disk_percent': psutil.disk_usage('/').percent,
                    'load_average': psutil.getloadavg() if hasattr(psutil, 'getloadavg') else None
                },
                'components': {
                    'total': len(self.components),
                    'running': 0,
                    'stopped': 0,
                    'failed': 0
                },
                'qmoi_processes': 0
            }
            
            # Count component statuses
            for component_name, component_info in self.components.items():
                status = component_info['status']
                if status == 'running':
                    metrics['components']['running'] += 1
                elif status == 'stopped':
                    metrics['components']['stopped'] += 1
                elif status == 'failed':
                    metrics['components']['failed'] += 1
            
            # Count QMOI processes
            for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
                try:
                    if 'qmoi' in proc.info['name'].lower() or any('qmoi' in str(arg).lower() for arg in proc.info['cmdline'] or []):
                        metrics['qmoi_processes'] += 1
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            return metrics
            
        except Exception as e:
            self.logger.error(f"Error collecting system metrics: {e}")
            return {}
    
    def health_check_loop(self):
        """Main health check loop"""
        while self.system_active:
            try:
                # Check component health
                for component_name, component_info in self.components.items():
                    if component_info['config'].get('health_check', False):
                        if not self.check_component_health(component_name):
                            self.logger.warning(f"Component {component_name} appears unhealthy")
                            
                            # Auto-restart if enabled
                            if component_info['config'].get('auto_restart', False):
                                max_attempts = self.config['auto_recovery']['max_attempts']
                                if component_info['restart_count'] < max_attempts:
                                    self.logger.info(f"Auto-restarting {component_name}...")
                                    if self.restart_component(component_name):
                                        component_info['restart_count'] = 0
                                        self.logger.info(f"Successfully restarted {component_name}")
                                    else:
                                        component_info['restart_count'] += 1
                                        self.logger.error(f"Failed to restart {component_name} (attempt {component_info['restart_count']})")
                                else:
                                    self.logger.error(f"Component {component_name} failed too many times")
                
                # Collect and store metrics
                metrics = self.collect_system_metrics()
                self.performance_metrics[datetime.now().isoformat()] = metrics
                
                # Keep only last 24 hours of metrics
                cutoff_time = datetime.now() - timedelta(hours=24)
                self.performance_metrics = {
                    k: v for k, v in self.performance_metrics.items()
                    if datetime.fromisoformat(k) > cutoff_time
                }
                
                # Check system resource thresholds
                system = metrics.get('system', {})
                if system.get('cpu_percent', 0) > self.config['performance_thresholds']['cpu_usage']:
                    self.logger.warning(f"High CPU usage: {system['cpu_percent']}%")
                
                if system.get('memory_percent', 0) > self.config['performance_thresholds']['memory_usage']:
                    self.logger.warning(f"High memory usage: {system['memory_percent']}%")
                
                if system.get('disk_percent', 0) > self.config['performance_thresholds']['disk_usage']:
                    self.logger.warning(f"High disk usage: {system['disk_percent']}%")
                
            except Exception as e:
                self.logger.error(f"Error in health check loop: {e}")
            
            time.sleep(self.config['health_checks']['interval'])
    
    def generate_system_report(self) -> Dict[str, Any]:
        """Generate comprehensive system report"""
        try:
            report = {
                'timestamp': datetime.now().isoformat(),
                'system_status': {
                    'overall_health': 'healthy',
                    'components_total': len(self.components),
                    'components_running': 0,
                    'components_failed': 0
                },
                'components': {},
                'performance': {},
                'recommendations': []
            }
            
            # Component status
            for component_name, component_info in self.components.items():
                status = component_info['status']
                if status == 'running':
                    report['system_status']['components_running'] += 1
                elif status == 'failed':
                    report['system_status']['components_failed'] += 1
                
                report['components'][component_name] = {
                    'status': status,
                    'start_time': component_info['start_time'].isoformat(),
                    'restart_count': component_info['restart_count'],
                    'last_health_check': component_info['last_health_check'].isoformat() if component_info['last_health_check'] else None
                }
            
            # Performance metrics
            if self.performance_metrics:
                latest_metrics = list(self.performance_metrics.values())[-1]
                report['performance'] = latest_metrics
            
            # Determine overall health
            if report['system_status']['components_failed'] > 0:
                report['system_status']['overall_health'] = 'critical'
            elif report['system_status']['components_running'] < len(self.components) * 0.9:
                report['system_status']['overall_health'] = 'warning'
            
            # Generate recommendations
            if report['system_status']['components_failed'] > 0:
                report['recommendations'].append({
                    'priority': 'critical',
                    'message': f"{report['system_status']['components_failed']} components failed. Immediate attention required."
                })
            
            if report['system_status']['components_running'] < len(self.components):
                report['recommendations'].append({
                    'priority': 'high',
                    'message': f"Only {report['system_status']['components_running']}/{report['system_status']['components_total']} components running."
                })
            
            return report
            
        except Exception as e:
            self.logger.error(f"Error generating system report: {e}")
            return {}
    
    def save_report(self, report: Dict[str, Any]):
        """Save system report"""
        try:
            # Save to logs directory
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            report_file = f'logs/qmoi_system_report_{timestamp}.json'
            
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2)
            
            # Save latest report
            with open('logs/qmoi_system_latest.json', 'w') as f:
                json.dump(report, f, indent=2)
            
            self.logger.info(f"System report saved: {report_file}")
            
        except Exception as e:
            self.logger.error(f"Error saving report: {e}")
    
    def start_system(self):
        """Start the complete QMOI system"""
        try:
            self.logger.info("Starting QMOI Complete System")
            
            # Check dependencies
            if not self.check_dependencies():
                self.logger.error("Dependency check failed")
                return False
            
            # Start core services
            if not self.start_core_services():
                self.logger.error("Failed to start core services")
                return False
            
            # Start monitoring services
            self.start_monitoring_services()
            
            # Start health check thread
            health_thread = threading.Thread(target=self.health_check_loop)
            health_thread.daemon = True
            health_thread.start()
            
            self.system_active = True
            self.logger.info("QMOI Complete System started successfully")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Error starting system: {e}")
            return False
    
    def stop_system(self):
        """Stop the complete QMOI system"""
        try:
            self.logger.info("Stopping QMOI Complete System")
            
            self.system_active = False
            
            # Stop all components
            for component_name in list(self.components.keys()):
                self.stop_component(component_name)
            
            self.logger.info("QMOI Complete System stopped")
            
        except Exception as e:
            self.logger.error(f"Error stopping system: {e}")
    
    def run(self):
        """Main system loop"""
        try:
            self.logger.info("Starting QMOI Complete System")
            
            if not self.start_system():
                self.logger.error("Failed to start system")
                return
            
            # Generate reports periodically
            while self.system_active:
                time.sleep(3600)  # Generate report every hour
                
                if self.system_active:
                    report = self.generate_system_report()
                    self.save_report(report)
                    
                    # Log summary
                    status = report.get('system_status', {})
                    self.logger.info(f"System Status: {status.get('overall_health', 'unknown')}, "
                                   f"Components: {status.get('components_running', 0)}/{status.get('components_total', 0)} running")
                    
        except KeyboardInterrupt:
            self.logger.info("Received interrupt signal")
        except Exception as e:
            self.logger.error(f"Error in main system loop: {e}")
        finally:
            self.stop_system()

def main():
    """Main function"""
    system = QMOICompleteSystem()
    system.run()

if __name__ == "__main__":
    main() 