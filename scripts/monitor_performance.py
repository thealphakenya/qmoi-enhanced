import psutil
import time
import logging
import json
from datetime import datetime
from typing import Dict, List, Optional
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path


class PerformanceMonitor:
    def __init__(self, log_dir: str = "logs"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        self.logger = self._setup_logger()
        self.metrics_history: List[Dict] = []
        self.start_time = time.time()
        self.sampling_interval = 1.0  # seconds
        self.max_history_size = 1000  # maximum number of metrics to store

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger("PerformanceMonitor")
        logger.setLevel(logging.INFO)

        # Create handlers
        file_handler = logging.FileHandler(self.log_dir / "performance_monitor.log")
        console_handler = logging.StreamHandler()

        # Create formatters and add it to handlers
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        # Add handlers to the logger
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger

    def collect_metrics(self) -> Dict:
        """Collect current system metrics."""
        try:
            process = psutil.Process()
            memory_info = process.memory_info()

            metrics = {
                "timestamp": datetime.now().isoformat(),
                "cpu_percent": process.cpu_percent(),
                "memory_rss": memory_info.rss,
                "memory_vms": memory_info.vms,
                "num_threads": process.num_threads(),
                "io_counters": (
                    process.io_counters()._asdict() if process.io_counters() else None
                ),
                "system_cpu_percent": psutil.cpu_percent(interval=None),
                "system_memory_percent": psutil.virtual_memory().percent,
                "system_disk_usage": psutil.disk_usage("/").percent,
                "uptime": time.time() - self.start_time,
            }

            self.metrics_history.append(metrics)

            # Trim history if it gets too large
            if len(self.metrics_history) > self.max_history_size:
                self.metrics_history = self.metrics_history[-self.max_history_size :]

            return metrics
        except Exception as e:
            self.logger.error(f"Error collecting metrics: {str(e)}")
            return {"error": str(e)}

    def save_metrics(self, filename: Optional[str] = None) -> None:
        """Save collected metrics to a JSON file."""
        if not filename:
            filename = f"metrics_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

        filepath = self.log_dir / filename
        try:
            with open(filepath, "w") as f:
                json.dump(self.metrics_history, f, indent=2)
            self.logger.info(f"Metrics saved to {filepath}")
        except Exception as e:
            self.logger.error(f"Error saving metrics: {str(e)}")

    def generate_report(self) -> Dict:
        """Generate a performance report from collected metrics."""
        try:
            if not self.metrics_history:
                return {"error": "No metrics collected"}

            # Calculate statistics
            cpu_percents = [m["cpu_percent"] for m in self.metrics_history]
            memory_rss = [m["memory_rss"] for m in self.metrics_history]

            report = {
                "timestamp": datetime.now().isoformat(),
                "duration": self.metrics_history[-1]["uptime"],
                "cpu": {
                    "mean": np.mean(cpu_percents),
                    "max": np.max(cpu_percents),
                    "min": np.min(cpu_percents),
                    "std": np.std(cpu_percents),
                },
                "memory": {
                    "mean": np.mean(memory_rss),
                    "max": np.max(memory_rss),
                    "min": np.min(memory_rss),
                    "std": np.std(memory_rss),
                },
                "system": {
                    "cpu_percent": self.metrics_history[-1]["system_cpu_percent"],
                    "memory_percent": self.metrics_history[-1]["system_memory_percent"],
                    "disk_usage": self.metrics_history[-1]["system_disk_usage"],
                },
            }

            return report
        except Exception as e:
            self.logger.error(f"Error generating report: {str(e)}")
            return {"error": str(e)}

    def plot_metrics(self, save_path: Optional[str] = None) -> None:
        """Generate plots of collected metrics."""
        try:
            if not self.metrics_history:
                self.logger.warning("No metrics to plot")
                return

            # Create figure with subplots
            fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))

            # Plot CPU usage
            timestamps = [
                datetime.fromisoformat(m["timestamp"]) for m in self.metrics_history
            ]
            cpu_percents = [m["cpu_percent"] for m in self.metrics_history]
            ax1.plot(timestamps, cpu_percents, label="Process CPU %")
            ax1.set_title("CPU Usage Over Time")
            ax1.set_ylabel("CPU %")
            ax1.grid(True)
            ax1.legend()

            # Plot Memory usage
            memory_rss = [
                m["memory_rss"] / (1024 * 1024) for m in self.metrics_history
            ]  # Convert to MB
            ax2.plot(timestamps, memory_rss, label="RSS Memory")
            ax2.set_title("Memory Usage Over Time")
            ax2.set_xlabel("Time")
            ax2.set_ylabel("Memory (MB)")
            ax2.grid(True)
            ax2.legend()

            plt.tight_layout()

            if save_path:
                plt.savefig(save_path)
                self.logger.info(f"Plot saved to {save_path}")
            else:
                plt.show()

            plt.close()
        except Exception as e:
            self.logger.error(f"Error plotting metrics: {str(e)}")

    def monitor(self, duration: Optional[float] = None) -> None:
        """Monitor performance for a specified duration or until interrupted."""
        try:
            self.logger.info("Starting performance monitoring...")
            start_time = time.time()

            while True:
                metrics = self.collect_metrics()
                self.logger.info(f"Collected metrics: {metrics}")

                if duration and (time.time() - start_time) >= duration:
                    break

                time.sleep(self.sampling_interval)
        except KeyboardInterrupt:
            self.logger.info("Monitoring stopped by user")
        except Exception as e:
            self.logger.error(f"Error during monitoring: {str(e)}")
        finally:
            # Generate and save final report
            report = self.generate_report()
            self.logger.info(f"Final report: {report}")

            # Save metrics and generate plots
            self.save_metrics()
            self.plot_metrics(save_path=str(self.log_dir / "performance_plot.png"))


def main():
    monitor = PerformanceMonitor()

    # Monitor for 60 seconds
    monitor.monitor(duration=60)

    # Generate and print final report
    report = monitor.generate_report()
    print("\nPerformance Report:")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
