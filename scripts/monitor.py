import logging
import time
import json
import psutil
import platform
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional
import threading
import queue
import socket
import requests
from dataclasses import dataclass, asdict


@dataclass
class SystemMetrics:
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    network_io: Dict[str, float]
    process_count: int
    uptime: float
    temperature: Optional[float]
    power_usage: Optional[float]
    gpu_usage: Optional[float]
    timestamp: str


@dataclass
class PerformanceMetrics:
    response_time: float
    throughput: float
    error_rate: float
    queue_size: int
    active_connections: int
    cache_hit_rate: float
    timestamp: str


@dataclass
class ResourceMetrics:
    cpu_cores: int
    total_memory: float
    total_disk: float
    network_speed: float
    gpu_memory: Optional[float]
    timestamp: str


class SystemMonitor:
    def __init__(self, config_path: str = "config/monitor_config.json"):
        self.logger = logging.getLogger(__name__)
        self.setup_logging()
        self.load_config(config_path)
        self.metrics_queue = queue.Queue()
        self.running = False
        self.monitoring_thread = None
        self.alert_thresholds = self.config.get("alert_thresholds", {})
        self.metrics_history: List[Dict[str, Any]] = []
        self.max_history_size = self.config.get("max_history_size", 1000)
        self.setup_metrics_storage()

    def setup_logging(self):
        """Setup monitoring logging configuration"""
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[logging.FileHandler("logs/monitor.log"), logging.StreamHandler()],
        )

    def load_config(self, config_path: str):
        """Load monitoring configuration"""
        try:
            with open(config_path) as f:
                self.config = json.load(f)
        except FileNotFoundError:
            self.logger.warning(
                f"Monitor config not found at {config_path}, using defaults"
            )
            self.config = {
                "monitoring_interval": 1.0,
                "metrics_retention": 3600,
                "alert_thresholds": {
                    "cpu_usage": 90,
                    "memory_usage": 90,
                    "disk_usage": 90,
                    "error_rate": 0.1,
                },
            }

    def setup_metrics_storage(self):
        """Setup metrics storage directory"""
        metrics_dir = Path("data/metrics")
        metrics_dir.mkdir(parents=True, exist_ok=True)

    def start(self):
        """Start monitoring"""
        if self.running:
            return

        self.running = True
        self.monitoring_thread = threading.Thread(target=self._monitoring_loop)
        self.monitoring_thread.daemon = True
        self.monitoring_thread.start()
        self.logger.info("System monitoring started")

    def stop(self):
        """Stop monitoring"""
        self.running = False
        if self.monitoring_thread:
            self.monitoring_thread.join()
        self.logger.info("System monitoring stopped")

    def _monitoring_loop(self):
        """Main monitoring loop"""
        while self.running:
            try:
                # Collect metrics
                system_metrics = self._collect_system_metrics()
                performance_metrics = self._collect_performance_metrics()
                resource_metrics = self._collect_resource_metrics()

                # Store metrics
                metrics = {
                    "system": asdict(system_metrics),
                    "performance": asdict(performance_metrics),
                    "resources": asdict(resource_metrics),
                }
                self.metrics_queue.put(metrics)
                self._store_metrics(metrics)

                # Check alerts
                self._check_alerts(metrics)

                # Cleanup old metrics
                self._cleanup_old_metrics()

                time.sleep(self.config.get("monitoring_interval", 1.0))

            except Exception as e:
                self.logger.error(f"Error in monitoring loop: {str(e)}")

    def _collect_system_metrics(self) -> SystemMetrics:
        """Collect system metrics"""
        try:
            cpu_usage = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage("/")
            net_io = psutil.net_io_counters()

            return SystemMetrics(
                cpu_usage=cpu_usage,
                memory_usage=memory.percent,
                disk_usage=disk.percent,
                network_io={
                    "bytes_sent": net_io.bytes_sent,
                    "bytes_recv": net_io.bytes_recv,
                },
                process_count=len(psutil.pids()),
                uptime=time.time() - psutil.boot_time(),
                temperature=self._get_temperature(),
                power_usage=self._get_power_usage(),
                gpu_usage=self._get_gpu_usage(),
                timestamp=datetime.now().isoformat(),
            )
        except Exception as e:
            self.logger.error(f"Error collecting system metrics: {str(e)}")
            return SystemMetrics(
                cpu_usage=0,
                memory_usage=0,
                disk_usage=0,
                network_io={"bytes_sent": 0, "bytes_recv": 0},
                process_count=0,
                uptime=0,
                temperature=None,
                power_usage=None,
                gpu_usage=None,
                timestamp=datetime.now().isoformat(),
            )

    def _collect_performance_metrics(self) -> PerformanceMetrics:
        """Collect performance metrics"""
        try:
            return PerformanceMetrics(
                response_time=self._measure_response_time(),
                throughput=self._measure_throughput(),
                error_rate=self._calculate_error_rate(),
                queue_size=self.metrics_queue.qsize(),
                active_connections=self._count_active_connections(),
                cache_hit_rate=self._calculate_cache_hit_rate(),
                timestamp=datetime.now().isoformat(),
            )
        except Exception as e:
            self.logger.error(f"Error collecting performance metrics: {str(e)}")
            return PerformanceMetrics(
                response_time=0,
                throughput=0,
                error_rate=0,
                queue_size=0,
                active_connections=0,
                cache_hit_rate=0,
                timestamp=datetime.now().isoformat(),
            )

    def _collect_resource_metrics(self) -> ResourceMetrics:
        """Collect resource metrics"""
        try:
            return ResourceMetrics(
                cpu_cores=psutil.cpu_count(),
                total_memory=psutil.virtual_memory().total,
                total_disk=psutil.disk_usage("/").total,
                network_speed=self._measure_network_speed(),
                gpu_memory=self._get_gpu_memory(),
                timestamp=datetime.now().isoformat(),
            )
        except Exception as e:
            self.logger.error(f"Error collecting resource metrics: {str(e)}")
            return ResourceMetrics(
                cpu_cores=0,
                total_memory=0,
                total_disk=0,
                network_speed=0,
                gpu_memory=None,
                timestamp=datetime.now().isoformat(),
            )

    def _get_temperature(self) -> Optional[float]:
        """Get system temperature"""
        try:
            if platform.system() == "Linux":
                with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
                    return float(f.read()) / 1000.0
            return None
        except:
            return None

    def _get_power_usage(self) -> Optional[float]:
        """Get system power usage"""
        try:
            if platform.system() == "Linux":
                with open("/sys/class/power_supply/BAT0/power_now", "r") as f:
                    return float(f.read()) / 1000000.0
            return None
        except:
            return None

    def _get_gpu_usage(self) -> Optional[float]:
        """Get GPU usage"""
        try:
            # Implement GPU usage monitoring
            return None
        except:
            return None

    def _get_gpu_memory(self) -> Optional[float]:
        """Get GPU memory"""
        try:
            # Implement GPU memory monitoring
            return None
        except:
            return None

    def _measure_response_time(self) -> float:
        """Measure system response time"""
        try:
            start_time = time.time()
            # Implement response time measurement
            return time.time() - start_time
        except:
            return 0.0

    def _measure_throughput(self) -> float:
        """Measure system throughput"""
        try:
            # Implement throughput measurement
            return 0.0
        except:
            return 0.0

    def _calculate_error_rate(self) -> float:
        """Calculate system error rate"""
        try:
            # Implement error rate calculation
            return 0.0
        except:
            return 0.0

    def _count_active_connections(self) -> int:
        """Count active network connections"""
        try:
            return len(psutil.net_connections())
        except:
            return 0

    def _calculate_cache_hit_rate(self) -> float:
        """Calculate cache hit rate"""
        try:
            # Implement cache hit rate calculation
            return 0.0
        except:
            return 0.0

    def _measure_network_speed(self) -> float:
        """Measure network speed"""
        try:
            # Implement network speed measurement
            return 0.0
        except:
            return 0.0

    def _store_metrics(self, metrics: Dict[str, Any]):
        """Store metrics in history"""
        self.metrics_history.append(metrics)
        if len(self.metrics_history) > self.max_history_size:
            self.metrics_history.pop(0)

        # Save to file
        try:
            metrics_file = (
                Path("data/metrics")
                / f"metrics_{datetime.now().strftime('%Y%m%d')}.json"
            )
            with open(metrics_file, "a") as f:
                json.dump(metrics, f)
                f.write("\n")
        except Exception as e:
            self.logger.error(f"Error storing metrics: {str(e)}")

    def _check_alerts(self, metrics: Dict[str, Any]):
        """Check metrics against alert thresholds"""
        try:
            system_metrics = metrics["system"]
            performance_metrics = metrics["performance"]

            # Check CPU usage
            if system_metrics["cpu_usage"] > self.alert_thresholds.get("cpu_usage", 90):
                self._trigger_alert("high_cpu_usage", system_metrics)

            # Check memory usage
            if system_metrics["memory_usage"] > self.alert_thresholds.get(
                "memory_usage", 90
            ):
                self._trigger_alert("high_memory_usage", system_metrics)

            # Check disk usage
            if system_metrics["disk_usage"] > self.alert_thresholds.get(
                "disk_usage", 90
            ):
                self._trigger_alert("high_disk_usage", system_metrics)

            # Check error rate
            if performance_metrics["error_rate"] > self.alert_thresholds.get(
                "error_rate", 0.1
            ):
                self._trigger_alert("high_error_rate", performance_metrics)

        except Exception as e:
            self.logger.error(f"Error checking alerts: {str(e)}")

    def _trigger_alert(self, alert_type: str, metrics: Dict[str, Any]):
        """Trigger an alert"""
        try:
            alert = {
                "type": alert_type,
                "timestamp": datetime.now().isoformat(),
                "metrics": metrics,
            }
            self.logger.warning(f"Alert triggered: {json.dumps(alert, indent=2)}")

            # Store alert
            alerts_file = Path("logs/alerts.json")
            with open(alerts_file, "a") as f:
                json.dump(alert, f)
                f.write("\n")

            # Send alert notification
            self._send_alert_notification(alert)

        except Exception as e:
            self.logger.error(f"Error triggering alert: {str(e)}")

    def _send_alert_notification(self, alert: Dict[str, Any]):
        """Send alert notification"""
        try:
            # Implement alert notification (e.g., email, SMS, webhook)
            pass
        except Exception as e:
            self.logger.error(f"Error sending alert notification: {str(e)}")

    def _cleanup_old_metrics(self):
        """Clean up old metrics files"""
        try:
            metrics_dir = Path("data/metrics")
            retention_days = self.config.get("metrics_retention", 7)
            cutoff_date = datetime.now().timestamp() - (retention_days * 86400)

            for file in metrics_dir.glob("metrics_*.json"):
                if file.stat().st_mtime < cutoff_date:
                    file.unlink()
        except Exception as e:
            self.logger.error(f"Error cleaning up old metrics: {str(e)}")

    def get_metrics(
        self, start_time: Optional[str] = None, end_time: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get metrics within a time range"""
        try:
            if not start_time and not end_time:
                return self.metrics_history

            filtered_metrics = []
            for metrics in self.metrics_history:
                timestamp = metrics["system"]["timestamp"]
                if start_time and timestamp < start_time:
                    continue
                if end_time and timestamp > end_time:
                    continue
                filtered_metrics.append(metrics)

            return filtered_metrics
        except Exception as e:
            self.logger.error(f"Error getting metrics: {str(e)}")
            return []

    def get_alerts(
        self, start_time: Optional[str] = None, end_time: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get alerts within a time range"""
        try:
            alerts = []
            alerts_file = Path("logs/alerts.json")

            if not alerts_file.exists():
                return alerts

            with open(alerts_file) as f:
                for line in f:
                    alert = json.loads(line)
                    timestamp = alert["timestamp"]
                    if start_time and timestamp < start_time:
                        continue
                    if end_time and timestamp > end_time:
                        continue
                    alerts.append(alert)

            return alerts
        except Exception as e:
            self.logger.error(f"Error getting alerts: {str(e)}")
            return []
