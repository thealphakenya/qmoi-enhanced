#!/usr/bin/env python3
"""
QMOI Backup Monitor
Comprehensive backup monitoring system that tracks backup status, integrity, storage usage,
and automated backup scheduling for the QMOI AI system.
"""

import os
import sys
import json
import time
import logging
import threading
import hashlib
import shutil
import zipfile
import tarfile
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import schedule
import psutil

class BackupMonitor:
    def __init__(self):
        self.logger = self.setup_logging()
        self.config = self.load_config()
        self.monitoring_active = False
        self.backup_status = {}
        self.backup_history = []
        self.storage_usage = {}
        self.integrity_checks = {}
        
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/backup_monitor.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    def load_config(self) -> Dict[str, Any]:
        """Load monitoring configuration"""
        config = {
            'backup_directories': {
                'system': 'backups/system',
                'data': 'backups/data',
                'config': 'backups/config',
                'logs': 'backups/logs',
                'models': 'backups/models'
            },
            'backup_schedule': {
                'system': '0 2 * * *',      # Daily at 2 AM
                'data': '0 */6 * * *',      # Every 6 hours
                'config': '0 1 * * *',      # Daily at 1 AM
                'logs': '0 3 * * *',        # Daily at 3 AM
                'models': '0 4 * * 0'       # Weekly on Sunday at 4 AM
            },
            'retention_policy': {
                'system': 30,    # Keep 30 days
                'data': 7,       # Keep 7 days
                'config': 90,    # Keep 90 days
                'logs': 14,      # Keep 14 days
                'models': 12     # Keep 12 weeks
            },
            'compression': True,
            'encryption': False,
            'integrity_check': True,
            'storage_threshold': 85,  # Alert when storage usage > 85%
            'monitoring_interval': 300  # 5 minutes
        }
        
        # Load from config file if exists
        config_file = 'config/backup_monitoring_config.json'
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                self.logger.error(f"Error loading config: {e}")
        
        return config
    
    def start_monitoring(self):
        """Start backup monitoring"""
        try:
            self.monitoring_active = True
            self.logger.info("Starting QMOI Backup Monitor")
            
            # Create backup directories
            self.create_backup_directories()
            
            # Start monitoring threads
            threads = []
            
            # Backup status monitoring
            threads.append(threading.Thread(target=self.monitor_backup_status))
            
            # Storage monitoring
            threads.append(threading.Thread(target=self.monitor_storage_usage))
            
            # Integrity checking
            if self.config['integrity_check']:
                threads.append(threading.Thread(target=self.monitor_backup_integrity))
            
            # Start all threads
            for thread in threads:
                thread.daemon = True
                thread.start()
            
            # Schedule automated backups
            self.schedule_backups()
            
            self.logger.info(f"Backup monitoring started with {len(threads)} threads")
            
        except Exception as e:
            self.logger.error(f"Error starting backup monitoring: {e}")
    
    def stop_monitoring(self):
        """Stop backup monitoring"""
        self.monitoring_active = False
        self.logger.info("Backup monitoring stopped")
    
    def create_backup_directories(self):
        """Create backup directories if they don't exist"""
        for backup_type, directory in self.config['backup_directories'].items():
            try:
                os.makedirs(directory, exist_ok=True)
                self.logger.info(f"Created backup directory: {directory}")
            except Exception as e:
                self.logger.error(f"Error creating backup directory {directory}: {e}")
    
    def schedule_backups(self):
        """Schedule automated backups"""
        try:
            for backup_type, schedule_time in self.config['backup_schedule'].items():
                schedule.every().day.at(schedule_time.split()[1] + ":" + schedule_time.split()[0]).do(
                    self.create_backup, backup_type
                )
                self.logger.info(f"Scheduled {backup_type} backup for {schedule_time}")
            
            # Start scheduler thread
            scheduler_thread = threading.Thread(target=self.run_scheduler)
            scheduler_thread.daemon = True
            scheduler_thread.start()
            
        except Exception as e:
            self.logger.error(f"Error scheduling backups: {e}")
    
    def run_scheduler(self):
        """Run the backup scheduler"""
        while self.monitoring_active:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except Exception as e:
                self.logger.error(f"Error in scheduler: {e}")
    
    def create_backup(self, backup_type: str) -> Dict[str, Any]:
        """Create a backup of specified type"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_dir = self.config['backup_directories'][backup_type]
            backup_filename = f"{backup_type}_backup_{timestamp}"
            backup_path = os.path.join(backup_dir, backup_filename)
            
            backup_info = {
                'type': backup_type,
                'timestamp': datetime.now().isoformat(),
                'filename': backup_filename,
                'path': backup_path,
                'size': 0,
                'status': 'in_progress',
                'integrity_check': False
            }
            
            self.logger.info(f"Creating {backup_type} backup: {backup_filename}")
            
            # Determine source directories based on backup type
            source_dirs = self.get_source_directories(backup_type)
            
            if not source_dirs:
                backup_info['status'] = 'failed'
                backup_info['error'] = 'No source directories found'
                self.logger.error(f"No source directories found for {backup_type} backup")
                return backup_info
            
            # Create backup archive
            if self.config['compression']:
                backup_path += '.tar.gz'
                with tarfile.open(backup_path, 'w:gz') as tar:
                    for source_dir in source_dirs:
                        if os.path.exists(source_dir):
                            tar.add(source_dir, arcname=os.path.basename(source_dir))
            else:
                backup_path += '.zip'
                with zipfile.ZipFile(backup_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for source_dir in source_dirs:
                        if os.path.exists(source_dir):
                            for root, dirs, files in os.walk(source_dir):
                                for file in files:
                                    file_path = os.path.join(root, file)
                                    arcname = os.path.relpath(file_path, source_dir)
                                    zipf.write(file_path, arcname)
            
            # Get backup size
            backup_info['size'] = os.path.getsize(backup_path)
            backup_info['status'] = 'completed'
            
            # Perform integrity check
            if self.config['integrity_check']:
                backup_info['integrity_check'] = self.check_backup_integrity(backup_path)
            
            # Update backup status
            self.backup_status[backup_type] = backup_info
            self.backup_history.append(backup_info)
            
            # Clean old backups
            self.cleanup_old_backups(backup_type)
            
            self.logger.info(f"Created {backup_type} backup: {backup_filename} ({backup_info['size']} bytes)")
            
            return backup_info
            
        except Exception as e:
            self.logger.error(f"Error creating {backup_type} backup: {e}")
            backup_info['status'] = 'failed'
            backup_info['error'] = str(e)
            return backup_info
    
    def get_source_directories(self, backup_type: str) -> List[str]:
        """Get source directories for backup type"""
        source_mapping = {
            'system': ['scripts', 'config', 'requirements'],
            'data': ['data', 'datasets', 'logs'],
            'config': ['config'],
            'logs': ['logs'],
            'models': ['models', 'huggingface_space']
        }
        
        return source_mapping.get(backup_type, [])
    
    def check_backup_integrity(self, backup_path: str) -> bool:
        """Check backup file integrity"""
        try:
            if backup_path.endswith('.tar.gz'):
                with tarfile.open(backup_path, 'r:gz') as tar:
                    tar.getmembers()  # This will raise an error if corrupted
            elif backup_path.endswith('.zip'):
                with zipfile.ZipFile(backup_path, 'r') as zipf:
                    zipf.testzip()  # This will raise an error if corrupted
            
            return True
            
        except Exception as e:
            self.logger.error(f"Backup integrity check failed for {backup_path}: {e}")
            return False
    
    def cleanup_old_backups(self, backup_type: str):
        """Clean up old backups based on retention policy"""
        try:
            retention_days = self.config['retention_policy'][backup_type]
            backup_dir = self.config['backup_directories'][backup_type]
            cutoff_time = datetime.now() - timedelta(days=retention_days)
            
            if not os.path.exists(backup_dir):
                return
            
            for filename in os.listdir(backup_dir):
                if filename.startswith(f"{backup_type}_backup_"):
                    file_path = os.path.join(backup_dir, filename)
                    file_time = datetime.fromtimestamp(os.path.getctime(file_path))
                    
                    if file_time < cutoff_time:
                        os.remove(file_path)
                        self.logger.info(f"Removed old backup: {filename}")
                        
        except Exception as e:
            self.logger.error(f"Error cleaning up old backups: {e}")
    
    def monitor_backup_status(self):
        """Monitor backup status and history"""
        while self.monitoring_active:
            try:
                # Check for failed backups
                for backup_type, status in self.backup_status.items():
                    if status.get('status') == 'failed':
                        self.logger.warning(f"Backup {backup_type} failed: {status.get('error', 'Unknown error')}")
                
                # Check backup frequency
                for backup_type in self.config['backup_directories'].keys():
                    last_backup = self.get_last_backup_time(backup_type)
                    if last_backup:
                        hours_since_backup = (datetime.now() - last_backup).total_seconds() / 3600
                        
                        # Alert if backup is overdue
                        if hours_since_backup > 24:
                            self.logger.warning(f"Backup {backup_type} is overdue ({hours_since_backup:.1f} hours)")
                
            except Exception as e:
                self.logger.error(f"Error in backup status monitoring: {e}")
            
            time.sleep(self.config['monitoring_interval'])
    
    def monitor_storage_usage(self):
        """Monitor backup storage usage"""
        while self.monitoring_active:
            try:
                for backup_type, directory in self.config['backup_directories'].items():
                    if os.path.exists(directory):
                        total_size = 0
                        file_count = 0
                        
                        for root, dirs, files in os.walk(directory):
                            for file in files:
                                file_path = os.path.join(root, file)
                                total_size += os.path.getsize(file_path)
                                file_count += 1
                        
                        # Get disk usage
                        disk_usage = psutil.disk_usage(directory)
                        usage_percentage = (disk_usage.used / disk_usage.total) * 100
                        
                        self.storage_usage[backup_type] = {
                            'directory': directory,
                            'total_size': total_size,
                            'file_count': file_count,
                            'disk_usage_percentage': usage_percentage,
                            'free_space': disk_usage.free,
                            'timestamp': datetime.now().isoformat()
                        }
                        
                        # Alert if storage usage is high
                        if usage_percentage > self.config['storage_threshold']:
                            self.logger.warning(f"High storage usage for {backup_type}: {usage_percentage:.1f}%")
                
            except Exception as e:
                self.logger.error(f"Error in storage monitoring: {e}")
            
            time.sleep(self.config['monitoring_interval'] * 2)  # Check storage less frequently
    
    def monitor_backup_integrity(self):
        """Monitor backup integrity"""
        while self.monitoring_active:
            try:
                for backup_type, directory in self.config['backup_directories'].items():
                    if os.path.exists(directory):
                        for filename in os.listdir(directory):
                            if filename.startswith(f"{backup_type}_backup_"):
                                file_path = os.path.join(directory, filename)
                                
                                # Check if integrity was already verified
                                if file_path not in self.integrity_checks:
                                    is_valid = self.check_backup_integrity(file_path)
                                    self.integrity_checks[file_path] = {
                                        'valid': is_valid,
                                        'checked_at': datetime.now().isoformat()
                                    }
                                    
                                    if not is_valid:
                                        self.logger.error(f"Backup integrity check failed: {filename}")
                
            except Exception as e:
                self.logger.error(f"Error in integrity monitoring: {e}")
            
            time.sleep(self.config['monitoring_interval'] * 4)  # Check integrity less frequently
    
    def get_last_backup_time(self, backup_type: str) -> Optional[datetime]:
        """Get the timestamp of the last backup for a type"""
        try:
            backup_dir = self.config['backup_directories'][backup_type]
            if not os.path.exists(backup_dir):
                return None
            
            latest_time = None
            for filename in os.listdir(backup_dir):
                if filename.startswith(f"{backup_type}_backup_"):
                    file_path = os.path.join(backup_dir, filename)
                    file_time = datetime.fromtimestamp(os.path.getctime(file_path))
                    
                    if latest_time is None or file_time > latest_time:
                        latest_time = file_time
            
            return latest_time
            
        except Exception as e:
            self.logger.error(f"Error getting last backup time: {e}")
            return None
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive backup monitoring report"""
        try:
            report = {
                'timestamp': datetime.now().isoformat(),
                'summary': {
                    'total_backup_types': len(self.config['backup_directories']),
                    'successful_backups': 0,
                    'failed_backups': 0,
                    'total_storage_used': 0,
                    'alerts': []
                },
                'backup_status': self.backup_status,
                'storage_usage': self.storage_usage,
                'recent_backups': self.backup_history[-10:],  # Last 10 backups
                'recommendations': []
            }
            
            # Calculate summary statistics
            for backup_type, status in self.backup_status.items():
                if status.get('status') == 'completed':
                    report['summary']['successful_backups'] += 1
                elif status.get('status') == 'failed':
                    report['summary']['failed_backups'] += 1
            
            for storage_info in self.storage_usage.values():
                report['summary']['total_storage_used'] += storage_info.get('total_size', 0)
                
                if storage_info.get('disk_usage_percentage', 0) > self.config['storage_threshold']:
                    report['summary']['alerts'].append({
                        'type': 'high_storage_usage',
                        'backup_type': storage_info.get('directory', ''),
                        'usage_percentage': storage_info.get('disk_usage_percentage', 0)
                    })
            
            # Generate recommendations
            if report['summary']['failed_backups'] > 0:
                report['recommendations'].append({
                    'type': 'backup_failures',
                    'priority': 'high',
                    'message': f"{report['summary']['failed_backups']} backup(s) failed. Review backup configuration and system resources."
                })
            
            if report['summary']['total_storage_used'] > 1024 * 1024 * 1024 * 10:  # 10GB
                report['recommendations'].append({
                    'type': 'storage_optimization',
                    'priority': 'medium',
                    'message': f"Large backup storage usage ({report['summary']['total_storage_used'] / (1024**3):.2f} GB). Consider compression or retention policy adjustment."
                })
            
            return report
            
        except Exception as e:
            self.logger.error(f"Error generating report: {e}")
            return {}
    
    def save_report(self, report: Dict[str, Any]):
        """Save monitoring report"""
        try:
            # Save to logs directory
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            report_file = f'logs/backup_monitor_report_{timestamp}.json'
            
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2)
            
            # Save latest report
            with open('logs/backup_monitor_latest.json', 'w') as f:
                json.dump(report, f, indent=2)
            
            self.logger.info(f"Backup monitor report saved: {report_file}")
            
        except Exception as e:
            self.logger.error(f"Error saving report: {e}")
    
    def run(self):
        """Main monitoring loop"""
        try:
            self.logger.info("Starting QMOI Backup Monitor")
            self.start_monitoring()
            
            # Generate reports periodically
            while self.monitoring_active:
                time.sleep(3600)  # Generate report every hour
                
                if self.monitoring_active:
                    report = self.generate_report()
                    self.save_report(report)
                    
        except KeyboardInterrupt:
            self.logger.info("Received interrupt signal")
        except Exception as e:
            self.logger.error(f"Error in main monitoring loop: {e}")
        finally:
            self.stop_monitoring()

def main():
    """Main function"""
    monitor = BackupMonitor()
    monitor.run()

if __name__ == "__main__":
    main()