#!/usr/bin/env python3
"""
QMOI Performance Monitoring Script
Monitors system performance, resource usage, and provides optimization recommendations
"""

import os
import sys
import json
import time
import logging
import psutil
import threading
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import argparse
import requests
import asyncio
import aiohttp

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/performance_monitoring.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QMOIPerformanceMonitor:
    def __init__(self, continuous: bool = False, alert_threshold: float = 80.0):
        self.continuous = continuous
        self.alert_threshold = alert_threshold
        self.root_dir = Path(__file__).parent.parent.parent
        self.logs_dir = self.root_dir / 'logs'
        self.reports_dir = self.root_dir / 'reports'
        
        # Ensure directories exist
        self.logs_dir.mkdir(exist_ok=True)
        self.reports_dir.mkdir(exist_ok=True)
        
        # Performance history
        self.performance_history = []
        self.max_history_size = 1000
        
        # Alert system
        self.alerts = []
        self.alert_cooldown = 300  # 5 minutes between alerts
        
        # Monitoring configuration
        self.monitoring_config = {
            'cpu_threshold': 80.0,
            'memory_threshold': 85.0,
            'disk_threshold': 90.0,
            'network_threshold': 1000000,  # 1MB/s
            'process_threshold': 100,
            'response_time_threshold': 2.0  # seconds
        }

    def get_system_metrics(self) -> Dict[str, Any]:
        """Get current system performance metrics"""
        try:
            # CPU metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            cpu_count = psutil.cpu_count()
            cpu_freq = psutil.cpu_freq()
            
            # Memory metrics
            memory = psutil.virtual_memory()
            swap = psutil.swap_memory()
            
            # Disk metrics
            disk = psutil.disk_usage('/')
            disk_io = psutil.disk_io_counters()
            
            # Network metrics
            network = psutil.net_io_counters()
            
            # Process metrics
            process_count = len(psutil.pids())
            
            # Top processes by CPU and memory
            top_processes = self.get_top_processes()
            
            metrics = {
                'timestamp': datetime.now().isoformat(),
                'cpu': {
                    'usage_percent': cpu_percent,
                    'count': cpu_count,
                    'frequency_mhz': cpu_freq.current if cpu_freq else None,
                    'load_average': self.get_load_average()
                },
                'memory': {
                    'total_gb': memory.total / (1024**3),
                    'available_gb': memory.available / (1024**3),
                    'used_gb': memory.used / (1024**3),
                    'usage_percent': memory.percent,
                    'swap_total_gb': swap.total / (1024**3),
                    'swap_used_gb': swap.used / (1024**3),
                    'swap_usage_percent': swap.percent
                },
                'disk': {
                    'total_gb': disk.total / (1024**3),
                    'used_gb': disk.used / (1024**3),
                    'free_gb': disk.free / (1024**3),
                    'usage_percent': (disk.used / disk.total) * 100,
                    'read_bytes': disk_io.read_bytes if disk_io else 0,
                    'write_bytes': disk_io.write_bytes if disk_io else 0
                },
                'network': {
                    'bytes_sent': network.bytes_sent,
                    'bytes_recv': network.bytes_recv,
                    'packets_sent': network.packets_sent,
                    'packets_recv': network.packets_recv
                },
                'processes': {
                    'total_count': process_count,
                    'top_by_cpu': top_processes['cpu'],
                    'top_by_memory': top_processes['memory']
                },
                'system': {
                    'boot_time': datetime.fromtimestamp(psutil.boot_time()).isoformat(),
                    'uptime_seconds': time.time() - psutil.boot_time()
                }
            }
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error getting system metrics: {e}")
            return {}

    def get_load_average(self) -> Optional[float]:
        """Get system load average"""
        try:
            if hasattr(psutil, 'getloadavg'):
                return psutil.getloadavg()[0]
            else:
                # Windows fallback
                return None
        except Exception:
            return None

    def get_top_processes(self, limit: int = 5) -> Dict[str, List[Dict]]:
        """Get top processes by CPU and memory usage"""
        try:
            processes = []
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'memory_info']):
                try:
                    processes.append({
                        'pid': proc.info['pid'],
                        'name': proc.info['name'],
                        'cpu_percent': proc.info['cpu_percent'],
                        'memory_percent': proc.info['memory_percent'],
                        'memory_mb': proc.info['memory_info'].rss / (1024**2) if proc.info['memory_info'] else 0
                    })
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            # Sort by CPU and memory
            top_cpu = sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:limit]
            top_memory = sorted(processes, key=lambda x: x['memory_mb'], reverse=True)[:limit]
            
            return {
                'cpu': top_cpu,
                'memory': top_memory
            }
            
        except Exception as e:
            logger.error(f"Error getting top processes: {e}")
            return {'cpu': [], 'memory': []}

    def check_performance_alerts(self, metrics: Dict[str, Any]) -> List[Dict]:
        """Check for performance alerts based on thresholds"""
        alerts = []
        
        try:
            # CPU alert
            if metrics['cpu']['usage_percent'] > self.monitoring_config['cpu_threshold']:
                alerts.append({
                    'type': 'high_cpu',
                    'severity': 'warning',
                    'message': f"High CPU usage: {metrics['cpu']['usage_percent']:.1f}%",
                    'value': metrics['cpu']['usage_percent'],
                    'threshold': self.monitoring_config['cpu_threshold']
                })
            
            # Memory alert
            if metrics['memory']['usage_percent'] > self.monitoring_config['memory_threshold']:
                alerts.append({
                    'type': 'high_memory',
                    'severity': 'warning',
                    'message': f"High memory usage: {metrics['memory']['usage_percent']:.1f}%",
                    'value': metrics['memory']['usage_percent'],
                    'threshold': self.monitoring_config['memory_threshold']
                })
            
            # Disk alert
            if metrics['disk']['usage_percent'] > self.monitoring_config['disk_threshold']:
                alerts.append({
                    'type': 'high_disk',
                    'severity': 'critical',
                    'message': f"High disk usage: {metrics['disk']['usage_percent']:.1f}%",
                    'value': metrics['disk']['usage_percent'],
                    'threshold': self.monitoring_config['disk_threshold']
                })
            
            # Process count alert
            if metrics['processes']['total_count'] > self.monitoring_config['process_threshold']:
                alerts.append({
                    'type': 'high_process_count',
                    'severity': 'info',
                    'message': f"High process count: {metrics['processes']['total_count']}",
                    'value': metrics['processes']['total_count'],
                    'threshold': self.monitoring_config['process_threshold']
                })
            
            # Swap usage alert
            if metrics['memory']['swap_usage_percent'] > 50:
                alerts.append({
                    'type': 'high_swap',
                    'severity': 'warning',
                    'message': f"High swap usage: {metrics['memory']['swap_usage_percent']:.1f}%",
                    'value': metrics['memory']['swap_usage_percent'],
                    'threshold': 50
                })
                
        except Exception as e:
            logger.error(f"Error checking performance alerts: {e}")
        
        return alerts

    def generate_optimization_recommendations(self, metrics: Dict[str, Any]) -> List[Dict]:
        """Generate optimization recommendations based on metrics"""
        recommendations = []
        
        try:
            # CPU recommendations
            if metrics['cpu']['usage_percent'] > 70:
                recommendations.append({
                    'category': 'cpu',
                    'priority': 'high',
                    'title': 'Optimize CPU Usage',
                    'description': 'Consider optimizing CPU-intensive processes or scaling resources',
                    'actions': [
                        'Review and optimize top CPU-consuming processes',
                        'Consider process scheduling optimization',
                        'Scale CPU resources if possible'
                    ]
                })
            
            # Memory recommendations
            if metrics['memory']['usage_percent'] > 80:
                recommendations.append({
                    'category': 'memory',
                    'priority': 'high',
                    'title': 'Optimize Memory Usage',
                    'description': 'Memory usage is high, consider optimization or scaling',
                    'actions': [
                        'Review memory-intensive processes',
                        'Consider memory optimization techniques',
                        'Scale memory resources if possible'
                    ]
                })
            
            # Disk recommendations
            if metrics['disk']['usage_percent'] > 85:
                recommendations.append({
                    'category': 'disk',
                    'priority': 'critical',
                    'title': 'Free Up Disk Space',
                    'description': 'Disk space is critically low',
                    'actions': [
                        'Clean up temporary files and logs',
                        'Remove unused applications and files',
                        'Consider disk expansion'
                    ]
                })
            
            # Process recommendations
            if metrics['processes']['total_count'] > 80:
                recommendations.append({
                    'category': 'processes',
                    'priority': 'medium',
                    'title': 'Review Process Count',
                    'description': 'High number of running processes',
                    'actions': [
                        'Review and terminate unnecessary processes',
                        'Optimize process startup and shutdown',
                        'Consider process consolidation'
                    ]
                })
                
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
        
        return recommendations

    def save_metrics(self, metrics: Dict[str, Any]) -> None:
        """Save metrics to history"""
        self.performance_history.append(metrics)
        
        # Limit history size
        if len(self.performance_history) > self.max_history_size:
            self.performance_history.pop(0)
        
        # Save to file periodically
        if len(self.performance_history) % 10 == 0:
            self.save_metrics_to_file()

    def save_metrics_to_file(self) -> None:
        """Save metrics history to file"""
        try:
            metrics_file = self.reports_dir / 'performance_metrics.json'
            with open(metrics_file, 'w') as f:
                json.dump(self.performance_history, f, indent=2, default=str)
            logger.info(f"Metrics saved to {metrics_file}")
        except Exception as e:
            logger.error(f"Error saving metrics: {e}")

    def generate_performance_report(self) -> Dict[str, Any]:
        """Generate comprehensive performance report"""
        if not self.performance_history:
            return {}
        
        try:
            # Calculate averages
            cpu_usage = [m['cpu']['usage_percent'] for m in self.performance_history if 'cpu' in m]
            memory_usage = [m['memory']['usage_percent'] for m in self.performance_history if 'memory' in m]
            disk_usage = [m['disk']['usage_percent'] for m in self.performance_history if 'disk' in m]
            
            report = {
                'generated_at': datetime.now().isoformat(),
                'monitoring_duration': len(self.performance_history),
                'summary': {
                    'avg_cpu_usage': sum(cpu_usage) / len(cpu_usage) if cpu_usage else 0,
                    'avg_memory_usage': sum(memory_usage) / len(memory_usage) if memory_usage else 0,
                    'avg_disk_usage': sum(disk_usage) / len(disk_usage) if disk_usage else 0,
                    'max_cpu_usage': max(cpu_usage) if cpu_usage else 0,
                    'max_memory_usage': max(memory_usage) if memory_usage else 0,
                    'max_disk_usage': max(disk_usage) if disk_usage else 0
                },
                'alerts': self.alerts,
                'recommendations': self.generate_optimization_recommendations(self.performance_history[-1]) if self.performance_history else [],
                'trends': self.analyze_trends()
            }
            
            return report
            
        except Exception as e:
            logger.error(f"Error generating performance report: {e}")
            return {}

    def analyze_trends(self) -> Dict[str, Any]:
        """Analyze performance trends"""
        if len(self.performance_history) < 10:
            return {}
        
        try:
            # Get recent metrics
            recent = self.performance_history[-10:]
            older = self.performance_history[-20:-10] if len(self.performance_history) >= 20 else self.performance_history[:-10]
            
            # Calculate trends
            recent_cpu = [m['cpu']['usage_percent'] for m in recent if 'cpu' in m]
            older_cpu = [m['cpu']['usage_percent'] for m in older if 'cpu' in m]
            
            recent_memory = [m['memory']['usage_percent'] for m in recent if 'memory' in m]
            older_memory = [m['memory']['usage_percent'] for m in older if 'memory' in m]
            
            trends = {
                'cpu_trend': 'increasing' if sum(recent_cpu) > sum(older_cpu) else 'decreasing' if sum(recent_cpu) < sum(older_cpu) else 'stable',
                'memory_trend': 'increasing' if sum(recent_memory) > sum(older_memory) else 'decreasing' if sum(recent_memory) < sum(older_memory) else 'stable',
                'stability_score': self.calculate_stability_score()
            }
            
            return trends
            
        except Exception as e:
            logger.error(f"Error analyzing trends: {e}")
            return {}

    def calculate_stability_score(self) -> float:
        """Calculate system stability score (0-100)"""
        if len(self.performance_history) < 5:
            return 100.0
        
        try:
            # Calculate variance in key metrics
            cpu_values = [m['cpu']['usage_percent'] for m in self.performance_history[-20:] if 'cpu' in m]
            memory_values = [m['memory']['usage_percent'] for m in self.performance_history[-20:] if 'memory' in m]
            
            # Calculate coefficient of variation (lower is more stable)
            def cv(values):
                if not values or sum(values) == 0:
                    return 0
                mean = sum(values) / len(values)
                variance = sum((x - mean) ** 2 for x in values) / len(values)
                return (variance ** 0.5) / mean if mean > 0 else 0
            
            cpu_cv = cv(cpu_values)
            memory_cv = cv(memory_values)
            
            # Convert to stability score (0-100)
            stability_score = max(0, 100 - (cpu_cv + memory_cv) * 50)
            
            return round(stability_score, 2)
            
        except Exception as e:
            logger.error(f"Error calculating stability score: {e}")
            return 100.0

    def send_alerts(self, alerts: List[Dict]) -> None:
        """Send performance alerts"""
        for alert in alerts:
            # Check if we should send this alert (cooldown)
            alert_key = f"{alert['type']}_{alert['severity']}"
            last_alert_time = self.get_last_alert_time(alert_key)
            
            if time.time() - last_alert_time > self.alert_cooldown:
                self.send_alert(alert)
                self.update_last_alert_time(alert_key)

    def get_last_alert_time(self, alert_key: str) -> float:
        """Get last alert time for cooldown"""
        alert_file = self.logs_dir / 'alert_times.json'
        try:
            if alert_file.exists():
                with open(alert_file, 'r') as f:
                    alert_times = json.load(f)
                    return alert_times.get(alert_key, 0)
        except Exception:
            pass
        return 0

    def update_last_alert_time(self, alert_key: str) -> None:
        """Update last alert time"""
        alert_file = self.logs_dir / 'alert_times.json'
        try:
            alert_times = {}
            if alert_file.exists():
                with open(alert_file, 'r') as f:
                    alert_times = json.load(f)
            
            alert_times[alert_key] = time.time()
            
            with open(alert_file, 'w') as f:
                json.dump(alert_times, f)
        except Exception as e:
            logger.error(f"Error updating alert time: {e}")

    def send_alert(self, alert: Dict) -> None:
        """Send a single alert"""
        try:
            # Log the alert
            logger.warning(f"PERFORMANCE ALERT: {alert['message']}")
            
            # Add to alerts list
            self.alerts.append({
                **alert,
                'timestamp': datetime.now().isoformat()
            })
            
            # Send notification (placeholder for actual notification system)
            self.send_notification(alert)
            
        except Exception as e:
            logger.error(f"Error sending alert: {e}")

    def send_notification(self, alert: Dict) -> None:
        """Send notification about alert"""
        try:
            # Placeholder for actual notification system
            # This could send email, Slack message, etc.
            notification_script = self.root_dir / 'scripts' / 'utils' / 'send_notification.py'
            if notification_script.exists():
                import subprocess
                subprocess.run([
                    'python', str(notification_script),
                    '--type', 'performance_alert',
                    '--severity', alert['severity'],
                    '--message', alert['message']
                ])
        except Exception as e:
            logger.error(f"Error sending notification: {e}")

    def monitor_once(self) -> Dict[str, Any]:
        """Perform one monitoring cycle"""
        logger.info("Performing performance monitoring cycle...")
        
        # Get current metrics
        metrics = self.get_system_metrics()
        if not metrics:
            return {}
        
        # Check for alerts
        alerts = self.check_performance_alerts(metrics)
        if alerts:
            self.send_alerts(alerts)
        
        # Save metrics
        self.save_metrics(metrics)
        
        # Generate recommendations
        recommendations = self.generate_optimization_recommendations(metrics)
        
        cycle_result = {
            'timestamp': datetime.now().isoformat(),
            'metrics': metrics,
            'alerts': alerts,
            'recommendations': recommendations
        }
        
        logger.info(f"Monitoring cycle complete. Alerts: {len(alerts)}, Recommendations: {len(recommendations)}")
        return cycle_result

    def start_continuous_monitoring(self, interval: int = 60) -> None:
        """Start continuous monitoring"""
        logger.info(f"Starting continuous performance monitoring (interval: {interval}s)")
        
        try:
            while True:
                self.monitor_once()
                time.sleep(interval)
        except KeyboardInterrupt:
            logger.info("Continuous monitoring stopped by user")
        except Exception as e:
            logger.error(f"Continuous monitoring error: {e}")

    def generate_final_report(self) -> None:
        """Generate and save final performance report"""
        report = self.generate_performance_report()
        if report:
            report_file = self.reports_dir / f'performance_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
            try:
                with open(report_file, 'w') as f:
                    json.dump(report, f, indent=2, default=str)
                logger.info(f"Performance report saved to {report_file}")
            except Exception as e:
                logger.error(f"Error saving performance report: {e}")

def main():
    parser = argparse.ArgumentParser(description='QMOI Performance Monitoring Script')
    parser.add_argument('--continuous', '-c',
                       action='store_true',
                       help='Run continuous monitoring')
    parser.add_argument('--interval', '-i',
                       type=int,
                       default=60,
                       help='Monitoring interval in seconds (default: 60)')
    parser.add_argument('--alert-threshold', '-t',
                       type=float,
                       default=80.0,
                       help='Alert threshold percentage (default: 80.0)')
    parser.add_argument('--once', '-o',
                       action='store_true',
                       help='Run monitoring once and exit')
    
    args = parser.parse_args()
    
    monitor = QMOIPerformanceMonitor(
        continuous=args.continuous,
        alert_threshold=args.alert_threshold
    )
    
    try:
        if args.once:
            # Run once
            result = monitor.monitor_once()
            if result:
                print(json.dumps(result, indent=2, default=str))
        elif args.continuous:
            # Run continuously
            monitor.start_continuous_monitoring(args.interval)
        else:
            # Run once by default
            result = monitor.monitor_once()
            if result:
                print(json.dumps(result, indent=2, default=str))
        
        # Generate final report
        monitor.generate_final_report()
        
    except KeyboardInterrupt:
        logger.info("Monitoring stopped by user")
        monitor.generate_final_report()
    except Exception as e:
        logger.error(f"Monitoring error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main() 