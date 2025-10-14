import os
import sys
import json
import logging
import time
import asyncio
import threading
from pathlib import Path
from typing import Dict, Any, Optional, List

try:
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer

    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("[QCityManager] torch/transformers not available, running in minimal mode.")
import requests
import psutil
import platform
import subprocess
from datetime import datetime

# --- FastAPI for web dashboard ---
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import uvicorn


class QCityManager:
    def setup_trading(self):
        self.logger.info("setup_trading called (stub)")
        self.features["trading"] = "trading-feature-stub"

    def setup_whatsapp(self):
        self.logger.info("setup_whatsapp called (stub)")
        self.features["whatsapp"] = "whatsapp-feature-stub"

    def setup_projects(self):
        self.logger.info("setup_projects called (stub)")
        self.features["projects"] = "projects-feature-stub"

    def setup_updates(self):
        self.logger.info("setup_updates called (stub)")
        self.features["updates"] = "updates-feature-stub"

    def setup_cloud(self):
        self.logger.info("setup_cloud called (stub)")
        # Implement cloud setup logic or leave as stub
        self.platforms["cloud"] = "cloud-platform-stub"

    def setup_colab(self):
        self.logger.info("setup_colab called (stub)")
        # Implement colab setup logic or leave as stub
        self.platforms["colab"] = "colab-platform-stub"

    def setup_local(self):
        self.logger.info("setup_local called (stub)")
        # Implement local setup logic or leave as stub
        self.platforms["local"] = "local-platform-stub"

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.setup_logging()
        self.load_config()
        self.setup_platforms()
        self.setup_features()
        self.setup_resources()
        self.running = False
        self.tasks = []

    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[logging.FileHandler("logs/qcity.log"), logging.StreamHandler()],
        )

    def load_config(self):
        """Load Q-city configuration"""
        config_path = Path("config/qcity_config.json")
        if not config_path.exists():
            self.logger.error("Q-city configuration file not found")
            sys.exit(1)

        with open(config_path) as f:
            self.config = json.load(f)

    def setup_platforms(self):
        """Setup and initialize platforms"""
        self.platforms = {}
        # Only try to setup Colab if running in Colab
        if self.config["platforms"]["colab"]:
            try:
                import google.colab

                self.setup_colab()
            except ImportError:
                self.logger.warning(
                    "Colab platform requested but google.colab not available; skipping."
                )
        if self.config["platforms"]["cloud"]:
            self.setup_cloud()
        if self.config["platforms"]["local"]:
            self.setup_local()

    def setup_features(self):
        """Setup and initialize features"""
        self.features = {}

        if self.config["features"]["trading"]:
            self.setup_trading()

        if self.config["features"]["whatsapp"]:
            self.setup_whatsapp()

        if self.config["features"]["projects"]:
            self.setup_projects()

        if self.config["features"]["updates"]:
            self.setup_updates()

    def setup_resources(self):
        """Setup resource management"""
        self.resources = {
            "cpu": psutil.cpu_percent(),
            "memory": psutil.virtual_memory().percent,
            "disk": psutil.disk_usage("/").percent,
            "network": self._get_network_usage(),
        }

    def start(self):
        """Start Q-city"""
        self.running = True
        self.logger.info("Starting Q-city...")

        # Start platform managers
        for platform in self.platforms.values():
            if hasattr(platform, "start") and callable(platform.start):
                platform.start()

        # Start feature managers
        for feature in self.features.values():
            if hasattr(feature, "start") and callable(feature.start):
                feature.start()

        # Start resource monitoring
        self._start_resource_monitoring()

        # Start main loop
        self._main_loop()

    def stop(self):
        """Stop Q-city"""
        self.running = False
        self.logger.info("Stopping Q-city...")

        # Stop platform managers
        for platform in self.platforms.values():
            if hasattr(platform, "stop") and callable(platform.stop):
                platform.stop()

        # Stop feature managers
        for feature in self.features.values():
            if hasattr(feature, "stop") and callable(feature.stop):
                feature.stop()

        # Stop resource monitoring
        self._stop_resource_monitoring()

    def status(self) -> Dict[str, Any]:
        """Get Q-city status"""
        return {
            "running": self.running,
            "platforms": {
                name: platform.status() for name, platform in self.platforms.items()
            },
            "features": {
                name: feature.status() for name, feature in self.features.items()
            },
            "resources": self.resources,
            "tasks": [task.status() for task in self.tasks],
        }

    def configure_platforms(self, config: Dict[str, bool]):
        """Configure platforms"""
        self.config["platforms"].update(config)
        self.setup_platforms()

    def enable_features(self, features: List[str]):
        """Enable features"""
        for feature in features:
            self.config["features"][feature] = True
        self.setup_features()

    def monitor_resources(self):
        """Monitor system resources"""
        while self.running:
            self.resources.update(
                {
                    "cpu": psutil.cpu_percent(),
                    "memory": psutil.virtual_memory().percent,
                    "disk": psutil.disk_usage("/").percent,
                    "network": self._get_network_usage(),
                }
            )

            # Check resource limits
            if self.resources["cpu"] > self.config["resources"]["max_cpu"]:
                self._optimize_cpu()

            if self.resources["memory"] > self.config["resources"]["max_memory"] * 100:
                self._optimize_memory()

            time.sleep(1)

    def _main_loop(self):
        """Main Q-city loop"""
        while self.running:
            try:
                # Check platform health
                self._check_platform_health()

                # Check feature health
                self._check_feature_health()

                # Process tasks
                self._process_tasks()

                # Update status
                self._update_status()

                time.sleep(1)

            except Exception as e:
                self.logger.error(f"Error in main loop: {str(e)}")
                self._handle_error(e)

    def _check_platform_health(self):
        """Check platform health"""
        for name, platform in self.platforms.items():
            # Guard: skip if platform is a string or not an object with is_healthy
            if isinstance(platform, str):
                continue
            if hasattr(platform, "is_healthy") and callable(platform.is_healthy):
                try:
                    if not platform.is_healthy():
                        self.logger.warning(f"Platform {name} is unhealthy")
                        if hasattr(platform, "recover") and callable(platform.recover):
                            platform.recover()
                except Exception as e:
                    self.logger.error(f"Error checking health for platform {name}: {e}")

    def _check_feature_health(self):
        """Check feature health"""
        for name, feature in self.features.items():
            # Guard: skip if feature is a string or not an object with is_healthy
            if isinstance(feature, str):
                continue
            if hasattr(feature, "is_healthy") and callable(feature.is_healthy):
                try:
                    if not feature.is_healthy():
                        self.logger.warning(f"Feature {name} is unhealthy")
                        if hasattr(feature, "recover") and callable(feature.recover):
                            feature.recover()
                except Exception as e:
                    self.logger.error(f"Error checking health for feature {name}: {e}")

    def _process_tasks(self):
        """Process pending tasks"""
        for task in self.tasks[:]:
            if task.is_complete():
                self.tasks.remove(task)
            else:
                task.process()

    def _update_status(self):
        """Update Q-city status"""
        status = self.status()
        with open("logs/qcity_status.json", "w") as f:
            json.dump(status, f, indent=2)

    def _handle_error(self, error: Exception):
        """Handle errors"""
        self.logger.error(f"Error: {str(error)}")

        # Attempt recovery
        try:
            self._recover()
        except Exception as e:
            self.logger.error(f"Recovery failed: {str(e)}")

    def _recover(self):
        """Recover from errors"""
        # Restart platforms
        for name, platform in self.platforms.items():
            # Guard: skip if platform is a string or not an object with restart
            if isinstance(platform, str):
                continue
            if hasattr(platform, "restart") and callable(platform.restart):
                try:
                    platform.restart()
                except Exception as e:
                    self.logger.error(f"Error restarting platform {name}: {e}")
        # Restart features
        for name, feature in self.features.items():
            # Guard: skip if feature is a string or not an object with restart
            if isinstance(feature, str):
                continue
            if hasattr(feature, "restart") and callable(feature.restart):
                try:
                    feature.restart()
                except Exception as e:
                    self.logger.error(f"Error restarting feature {name}: {e}")

        # Clear tasks
        self.tasks.clear()

    def _get_network_usage(self) -> float:
        """Get network usage percentage"""
        try:
            net_io = psutil.net_io_counters()
            return (net_io.bytes_sent + net_io.bytes_recv) / 1024 / 1024  # MB
        except:
            return 0.0

    def _optimize_cpu(self):
        """Optimize CPU usage"""
        # Implement CPU optimization
        pass

    def _optimize_memory(self):
        """Optimize memory usage"""
        # Implement memory optimization
        pass

    def _start_resource_monitoring(self):
        """Start resource monitoring"""
        self.monitor_thread = threading.Thread(target=self.monitor_resources)
        self.monitor_thread.daemon = True
        self.monitor_thread.start()

    def _stop_resource_monitoring(self):
        """Stop resource monitoring"""
        if hasattr(self, "monitor_thread"):
            self.monitor_thread.join()


def start_web_dashboard(manager: QCityManager):
    app = FastAPI()

    @app.get("/")
    def root():
        return {
            "service": "QCityManager",
            "status": "running" if manager.running else "stopped",
        }

    @app.get("/status")
    def status():
        return JSONResponse(content=manager.status())

    @app.get("/resources")
    def resources():
        return JSONResponse(content=manager.resources)

    # Add more endpoints as needed

    # Run FastAPI server in a thread so QCityManager can run
    def run_server():
        uvicorn.run(app, host="127.0.0.1", port=8500, log_level="info")

    t = threading.Thread(target=run_server, daemon=True)
    t.start()


if __name__ == "__main__":
    manager = QCityManager()
    start_web_dashboard(manager)
    try:
        manager.start()
    except KeyboardInterrupt:
        manager.stop()
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        manager.stop()
