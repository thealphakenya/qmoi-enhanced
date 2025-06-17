import logging
import psutil
import os
import gc
import threading
import time
from typing import Dict, Any, List, Optional
from pathlib import Path
import json
from datetime import datetime
import shutil
import tempfile
import subprocess
import platform

class ResourceOptimizer:
    def __init__(self, config_path: str = 'config/optimizer_config.json'):
        self.logger = logging.getLogger(__name__)
        self.setup_logging()
        self.load_config(config_path)
        self.running = False
        self.optimization_thread = None
        self.last_optimization = None
        self.optimization_history: List[Dict[str, Any]] = []
        self.max_history_size = self.config.get('max_history_size', 1000)
        self.setup_optimization_storage()

    def setup_logging(self):
        """Setup optimization logging configuration"""
        log_dir = Path('logs')
        log_dir.mkdir(exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/optimizer.log'),
                logging.StreamHandler()
            ]
        )

    def load_config(self, config_path: str):
        """Load optimization configuration"""
        try:
            with open(config_path) as f:
                self.config = json.load(f)
        except FileNotFoundError:
            self.logger.warning(f"Optimizer config not found at {config_path}, using defaults")
            self.config = {
                'optimization_interval': 300,  # 5 minutes
                'cpu_threshold': 80,
                'memory_threshold': 80,
                'disk_threshold': 80,
                'temp_file_age': 86400,  # 24 hours
                'cache_cleanup': True,
                'log_rotation': True,
                'process_priority': True
            }

    def setup_optimization_storage(self):
        """Setup optimization storage directory"""
        storage_dir = Path('data/optimization')
        storage_dir.mkdir(parents=True, exist_ok=True)

    def start(self):
        """Start resource optimization"""
        if self.running:
            return

        self.running = True
        self.optimization_thread = threading.Thread(target=self._optimization_loop)
        self.optimization_thread.daemon = True
        self.optimization_thread.start()
        self.logger.info("Resource optimization started")

    def stop(self):
        """Stop resource optimization"""
        self.running = False
        if self.optimization_thread:
            self.optimization_thread.join()
        self.logger.info("Resource optimization stopped")

    def _optimization_loop(self):
        """Main optimization loop"""
        while self.running:
            try:
                # Check if optimization is needed
                if self._should_optimize():
                    self._perform_optimization()

                time.sleep(self.config.get('optimization_interval', 300))

            except Exception as e:
                self.logger.error(f"Error in optimization loop: {str(e)}")

    def _should_optimize(self) -> bool:
        """Check if optimization is needed"""
        try:
            cpu_usage = psutil.cpu_percent()
            memory_usage = psutil.virtual_memory().percent
            disk_usage = psutil.disk_usage('/').percent

            return (
                cpu_usage > self.config.get('cpu_threshold', 80) or
                memory_usage > self.config.get('memory_threshold', 80) or
                disk_usage > self.config.get('disk_threshold', 80)
            )
        except Exception as e:
            self.logger.error(f"Error checking optimization need: {str(e)}")
            return False

    def _perform_optimization(self):
        """Perform resource optimization"""
        try:
            optimization_start = time.time()
            optimization_results = {
                'timestamp': datetime.now().isoformat(),
                'actions': []
            }

            # Optimize CPU
            if self._optimize_cpu():
                optimization_results['actions'].append('cpu_optimization')

            # Optimize Memory
            if self._optimize_memory():
                optimization_results['actions'].append('memory_optimization')

            # Optimize Disk
            if self._optimize_disk():
                optimization_results['actions'].append('disk_optimization')

            # Clean up temporary files
            if self._cleanup_temp_files():
                optimization_results['actions'].append('temp_cleanup')

            # Clean up cache
            if self.config.get('cache_cleanup', True):
                if self._cleanup_cache():
                    optimization_results['actions'].append('cache_cleanup')

            # Rotate logs
            if self.config.get('log_rotation', True):
                if self._rotate_logs():
                    optimization_results['actions'].append('log_rotation')

            # Optimize process priorities
            if self.config.get('process_priority', True):
                if self._optimize_process_priorities():
                    optimization_results['actions'].append('process_priority')

            # Record optimization results
            optimization_results['duration'] = time.time() - optimization_start
            self._store_optimization_results(optimization_results)
            self.last_optimization = datetime.now()

            self.logger.info(f"Optimization completed: {json.dumps(optimization_results, indent=2)}")

        except Exception as e:
            self.logger.error(f"Error performing optimization: {str(e)}")

    def _optimize_cpu(self) -> bool:
        """Optimize CPU usage"""
        try:
            # Set process priority
            if platform.system() == 'Windows':
                import win32api, win32process, win32con
                pid = os.getpid()
                handle = win32api.OpenProcess(win32con.PROCESS_ALL_ACCESS, True, pid)
                win32process.SetPriorityClass(handle, win32process.BELOW_NORMAL_PRIORITY_CLASS)
            else:
                os.nice(10)

            # Limit CPU affinity
            process = psutil.Process()
            process.cpu_affinity([0])  # Use only first CPU core

            return True
        except Exception as e:
            self.logger.error(f"Error optimizing CPU: {str(e)}")
            return False

    def _optimize_memory(self) -> bool:
        """Optimize memory usage"""
        try:
            # Force garbage collection
            gc.collect()

            # Clear memory caches
            if platform.system() == 'Linux':
                subprocess.run(['sync'])
                with open('/proc/sys/vm/drop_caches', 'w') as f:
                    f.write('3')

            return True
        except Exception as e:
            self.logger.error(f"Error optimizing memory: {str(e)}")
            return False

    def _optimize_disk(self) -> bool:
        """Optimize disk usage"""
        try:
            # Clean up temporary files
            temp_dir = tempfile.gettempdir()
            for item in os.listdir(temp_dir):
                item_path = os.path.join(temp_dir, item)
                try:
                    if os.path.isfile(item_path):
                        os.unlink(item_path)
                    elif os.path.isdir(item_path):
                        shutil.rmtree(item_path)
                except Exception as e:
                    self.logger.warning(f"Error cleaning up {item_path}: {str(e)}")

            return True
        except Exception as e:
            self.logger.error(f"Error optimizing disk: {str(e)}")
            return False

    def _cleanup_temp_files(self) -> bool:
        """Clean up temporary files"""
        try:
            temp_dir = Path('temp')
            if not temp_dir.exists():
                return True

            current_time = time.time()
            for item in temp_dir.glob('*'):
                try:
                    if current_time - item.stat().st_mtime > self.config.get('temp_file_age', 86400):
                        if item.is_file():
                            item.unlink()
                        elif item.is_dir():
                            shutil.rmtree(item)
                except Exception as e:
                    self.logger.warning(f"Error cleaning up {item}: {str(e)}")

            return True
        except Exception as e:
            self.logger.error(f"Error cleaning up temp files: {str(e)}")
            return False

    def _cleanup_cache(self) -> bool:
        """Clean up cache files"""
        try:
            cache_dir = Path('cache')
            if not cache_dir.exists():
                return True

            for item in cache_dir.glob('*'):
                try:
                    if item.is_file():
                        item.unlink()
                    elif item.is_dir():
                        shutil.rmtree(item)
                except Exception as e:
                    self.logger.warning(f"Error cleaning up cache {item}: {str(e)}")

            return True
        except Exception as e:
            self.logger.error(f"Error cleaning up cache: {str(e)}")
            return False

    def _rotate_logs(self) -> bool:
        """Rotate log files"""
        try:
            log_dir = Path('logs')
            if not log_dir.exists():
                return True

            for log_file in log_dir.glob('*.log'):
                try:
                    if log_file.stat().st_size > 10 * 1024 * 1024:  # 10MB
                        # Create backup
                        backup_file = log_file.with_suffix('.log.1')
                        if backup_file.exists():
                            backup_file.unlink()
                        log_file.rename(backup_file)
                        # Create new log file
                        log_file.touch()
                except Exception as e:
                    self.logger.warning(f"Error rotating log {log_file}: {str(e)}")

            return True
        except Exception as e:
            self.logger.error(f"Error rotating logs: {str(e)}")
            return False

    def _optimize_process_priorities(self) -> bool:
        """Optimize process priorities"""
        try:
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
                try:
                    if proc.info['cpu_percent'] > 50:  # High CPU usage
                        process = psutil.Process(proc.info['pid'])
                        if platform.system() == 'Windows':
                            import win32api, win32process, win32con
                            handle = win32api.OpenProcess(win32con.PROCESS_ALL_ACCESS, True, proc.info['pid'])
                            win32process.SetPriorityClass(handle, win32process.BELOW_NORMAL_PRIORITY_CLASS)
                        else:
                            process.nice(10)
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                    pass

            return True
        except Exception as e:
            self.logger.error(f"Error optimizing process priorities: {str(e)}")
            return False

    def _store_optimization_results(self, results: Dict[str, Any]):
        """Store optimization results"""
        try:
            self.optimization_history.append(results)
            if len(self.optimization_history) > self.max_history_size:
                self.optimization_history.pop(0)

            # Save to file
            results_file = Path('data/optimization') / f"optimization_{datetime.now().strftime('%Y%m%d')}.json"
            with open(results_file, 'a') as f:
                json.dump(results, f)
                f.write('\n')
        except Exception as e:
            self.logger.error(f"Error storing optimization results: {str(e)}")

    def get_optimization_history(self, start_time: Optional[str] = None, end_time: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get optimization history within a time range"""
        try:
            if not start_time and not end_time:
                return self.optimization_history

            filtered_history = []
            for result in self.optimization_history:
                timestamp = result['timestamp']
                if start_time and timestamp < start_time:
                    continue
                if end_time and timestamp > end_time:
                    continue
                filtered_history.append(result)

            return filtered_history
        except Exception as e:
            self.logger.error(f"Error getting optimization history: {str(e)}")
            return []

    def get_last_optimization(self) -> Optional[Dict[str, Any]]:
        """Get last optimization results"""
        try:
            if not self.optimization_history:
                return None
            return self.optimization_history[-1]
        except Exception as e:
            self.logger.error(f"Error getting last optimization: {str(e)}")
            return None 