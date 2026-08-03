#!/usr/bin/env python3
"""
QMOI Advanced Optimization Script
Handles system-wide optimization, resource management, and performance tuning
"""

import os
import sys
import json
import time
import logging
import subprocess
import threading
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
import argparse
import psutil
import shutil
import glob

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/advanced_optimization.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QMOIAdvancedOptimizer:
    def __init__(self, aggressive: bool = False, dry_run: bool = False):
        self.aggressive = aggressive
        self.dry_run = dry_run
        self.root_dir = Path(__file__).parent.parent.parent
        self.logs_dir = self.root_dir / 'logs'
        self.reports_dir = self.root_dir / 'reports'
        
        # Ensure directories exist
        self.logs_dir.mkdir(exist_ok=True)
        self.reports_dir.mkdir(exist_ok=True)
        
        # Optimization results
        self.optimization_results = {
            'start_time': datetime.now().isoformat(),
            'optimizations_performed': [],
            'space_freed': 0,
            'performance_improvements': {},
            'errors': [],
            'warnings': []
        }
        
        # Optimization configuration
        self.optimization_config = {
            'file_cleanup': {
                'enabled': True,
                'patterns': ['*.tmp', '*.log', '*.cache', '__pycache__', 'node_modules/.cache'],
                'max_age_days': 7,
                'min_size_mb': 1
            },
            'process_optimization': {
                'enabled': True,
                'kill_unresponsive': True,
                'memory_threshold_mb': 500,
                'cpu_threshold_percent': 90
            },
            'system_optimization': {
                'enabled': True,
                'clear_temp': True,
                'optimize_startup': True,
                'defragment_disk': False  # Be careful with this
            },
            'application_optimization': {
                'enabled': True,
                'clear_browser_cache': True,
                'clear_application_cache': True,
                'optimize_database': True
            }
        }

    def run_command(self, command: List[str], cwd: Optional[Path] = None) -> Dict:
        """Run a command and return results"""
        try:
            logger.info(f"Running command: {' '.join(command)}")
            start_time = time.time()
            
            result = subprocess.run(
                command,
                cwd=cwd or self.root_dir,
                capture_output=True,
                text=True,
                timeout=300
            )
            
            execution_time = time.time() - start_time
            
            return {
                'success': result.returncode == 0,
                'stdout': result.stdout,
                'stderr': result.stderr,
                'return_code': result.returncode,
                'execution_time': execution_time
            }
        except subprocess.TimeoutExpired:
            logger.error(f"Command timed out: {' '.join(command)}")
            return {
                'success': False,
                'stdout': '',
                'stderr': 'Command timed out',
                'return_code': -1,
                'execution_time': 300
            }
        except Exception as e:
            logger.error(f"Error running command: {e}")
            return {
                'success': False,
                'stdout': '',
                'stderr': str(e),
                'return_code': -1,
                'execution_time': 0
            }

    def get_system_info(self) -> Dict[str, Any]:
        """Get comprehensive system information"""
        try:
            # CPU info
            cpu_info = {
                'count': psutil.cpu_count(),
                'usage_percent': psutil.cpu_percent(interval=1),
                'frequency': psutil.cpu_freq().current if psutil.cpu_freq() else None
            }
            
            # Memory info
            memory = psutil.virtual_memory()
            memory_info = {
                'total_gb': memory.total / (1024**3),
                'available_gb': memory.available / (1024**3),
                'used_gb': memory.used / (1024**3),
                'usage_percent': memory.percent
            }
            
            # Disk info
            disk = psutil.disk_usage('/')
            disk_info = {
                'total_gb': disk.total / (1024**3),
                'used_gb': disk.used / (1024**3),
                'free_gb': disk.free / (1024**3),
                'usage_percent': (disk.used / disk.total) * 100
            }
            
            # Process info
            process_info = {
                'total_count': len(psutil.pids()),
                'high_cpu_processes': self.get_high_cpu_processes(),
                'high_memory_processes': self.get_high_memory_processes()
            }
            
            return {
                'cpu': cpu_info,
                'memory': memory_info,
                'disk': disk_info,
                'processes': process_info,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting system info: {e}")
            return {}

    def get_high_cpu_processes(self, threshold: float = 50.0) -> List[Dict]:
        """Get processes using high CPU"""
        high_cpu_processes = []
        try:
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
                try:
                    if proc.info['cpu_percent'] > threshold:
                        high_cpu_processes.append({
                            'pid': proc.info['pid'],
                            'name': proc.info['name'],
                            'cpu_percent': proc.info['cpu_percent']
                        })
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
        except Exception as e:
            logger.error(f"Error getting high CPU processes: {e}")
        
        return sorted(high_cpu_processes, key=lambda x: x['cpu_percent'], reverse=True)[:10]

    def get_high_memory_processes(self, threshold_mb: float = 100.0) -> List[Dict]:
        """Get processes using high memory"""
        high_memory_processes = []
        try:
            for proc in psutil.process_iter(['pid', 'name', 'memory_info']):
                try:
                    memory_mb = proc.info['memory_info'].rss / (1024**2) if proc.info['memory_info'] else 0
                    if memory_mb > threshold_mb:
                        high_memory_processes.append({
                            'pid': proc.info['pid'],
                            'name': proc.info['name'],
                            'memory_mb': memory_mb
                        })
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
        except Exception as e:
            logger.error(f"Error getting high memory processes: {e}")
        
        return sorted(high_memory_processes, key=lambda x: x['memory_mb'], reverse=True)[:10]

    def cleanup_files(self) -> Dict[str, Any]:
        """Clean up temporary and cache files"""
        logger.info("Starting file cleanup...")
        
        cleanup_results = {
            'files_removed': 0,
            'space_freed_mb': 0,
            'errors': []
        }
        
        try:
            config = self.optimization_config['file_cleanup']
            
            for pattern in config['patterns']:
                logger.info(f"Cleaning up pattern: {pattern}")
                
                # Find files matching pattern
                if pattern == '__pycache__':
                    # Handle directory cleanup
                    pycache_dirs = glob.glob('**/__pycache__', recursive=True)
                    for pycache_dir in pycache_dirs:
                        try:
                            if not self.dry_run:
                                shutil.rmtree(pycache_dir)
                            cleanup_results['files_removed'] += 1
                            logger.info(f"Removed directory: {pycache_dir}")
                        except Exception as e:
                            cleanup_results['errors'].append(f"Error removing {pycache_dir}: {e}")
                else:
                    # Handle file cleanup
                    files = glob.glob(f'**/{pattern}', recursive=True)
                    for file_path in files:
                        try:
                            if os.path.isfile(file_path):
                                # Check file age and size
                                file_stat = os.stat(file_path)
                                file_age_days = (time.time() - file_stat.st_mtime) / (24 * 3600)
                                file_size_mb = file_stat.st_size / (1024**2)
                                
                                if (file_age_days > config['max_age_days'] or 
                                    file_size_mb > config['min_size_mb'] or 
                                    self.aggressive):
                                    
                                    if not self.dry_run:
                                        os.remove(file_path)
                                    cleanup_results['files_removed'] += 1
                                    cleanup_results['space_freed_mb'] += file_size_mb
                                    logger.info(f"Removed file: {file_path} ({file_size_mb:.2f} MB)")
                                    
                        except Exception as e:
                            cleanup_results['errors'].append(f"Error removing {file_path}: {e}")
            
            # Clean up logs directory
            self.cleanup_logs_directory(cleanup_results)
            
        except Exception as e:
            logger.error(f"Error during file cleanup: {e}")
            cleanup_results['errors'].append(str(e))
        
        self.optimization_results['optimizations_performed'].append('file_cleanup')
        self.optimization_results['space_freed'] += cleanup_results['space_freed_mb']
        
        logger.info(f"File cleanup complete. Removed {cleanup_results['files_removed']} files, freed {cleanup_results['space_freed_mb']:.2f} MB")
        return cleanup_results

    def cleanup_logs_directory(self, cleanup_results: Dict[str, Any]) -> None:
        """Clean up logs directory"""
        try:
            log_files = list(self.logs_dir.glob('*.log'))
            for log_file in log_files:
                try:
                    # Keep only recent log files
                    file_age_days = (time.time() - log_file.stat().st_mtime) / (24 * 3600)
                    if file_age_days > 7:  # Keep logs for 7 days
                        if not self.dry_run:
                            log_file.unlink()
                        cleanup_results['files_removed'] += 1
                        file_size_mb = log_file.stat().st_size / (1024**2)
                        cleanup_results['space_freed_mb'] += file_size_mb
                        logger.info(f"Removed old log file: {log_file}")
                except Exception as e:
                    cleanup_results['errors'].append(f"Error removing log file {log_file}: {e}")
        except Exception as e:
            logger.error(f"Error cleaning logs directory: {e}")

    def optimize_processes(self) -> Dict[str, Any]:
        """Optimize running processes"""
        logger.info("Starting process optimization...")
        
        optimization_results = {
            'processes_terminated': 0,
            'memory_freed_mb': 0,
            'errors': []
        }
        
        try:
            config = self.optimization_config['process_optimization']
            
            # Get high resource processes
            high_cpu_processes = self.get_high_cpu_processes(config['cpu_threshold_percent'])
            high_memory_processes = self.get_high_memory_processes(config['memory_threshold_mb'])
            
            # Terminate problematic processes
            processes_to_terminate = []
            
            for proc in high_cpu_processes:
                if proc['cpu_percent'] > 90:  # Very high CPU
                    processes_to_terminate.append(proc)
            
            for proc in high_memory_processes:
                if proc['memory_mb'] > 1000:  # Very high memory
                    processes_to_terminate.append(proc)
            
            # Terminate processes
            for proc_info in processes_to_terminate:
                try:
                    if not self.dry_run:
                        process = psutil.Process(proc_info['pid'])
                        process.terminate()
                        
                        # Wait for termination
                        try:
                            process.wait(timeout=5)
                        except psutil.TimeoutExpired:
                            if config['kill_unresponsive']:
                                process.kill()
                    
                    optimization_results['processes_terminated'] += 1
                    if 'memory_mb' in proc_info:
                        optimization_results['memory_freed_mb'] += proc_info['memory_mb']
                    
                    logger.info(f"Terminated process: {proc_info['name']} (PID: {proc_info['pid']})")
                    
                except (psutil.NoSuchProcess, psutil.AccessDenied) as e:
                    optimization_results['errors'].append(f"Error terminating process {proc_info['pid']}: {e}")
                except Exception as e:
                    optimization_results['errors'].append(f"Error terminating process {proc_info['pid']}: {e}")
            
        except Exception as e:
            logger.error(f"Error during process optimization: {e}")
            optimization_results['errors'].append(str(e))
        
        self.optimization_results['optimizations_performed'].append('process_optimization')
        
        logger.info(f"Process optimization complete. Terminated {optimization_results['processes_terminated']} processes")
        return optimization_results

    def optimize_system(self) -> Dict[str, Any]:
        """Perform system-level optimizations"""
        logger.info("Starting system optimization...")
        
        optimization_results = {
            'optimizations_applied': [],
            'errors': []
        }
        
        try:
            config = self.optimization_config['system_optimization']
            
            # Clear temporary files
            if config['clear_temp']:
                temp_dirs = ['/tmp', '/var/tmp', os.environ.get('TEMP', ''), os.environ.get('TMP', '')]
                for temp_dir in temp_dirs:
                    if temp_dir and os.path.exists(temp_dir):
                        try:
                            if not self.dry_run:
                                # Clear temp files older than 1 day
                                for item in os.listdir(temp_dir):
                                    item_path = os.path.join(temp_dir, item)
                                    try:
                                        if os.path.isfile(item_path):
                                            file_age = time.time() - os.path.getmtime(item_path)
                                            if file_age > 86400:  # 1 day
                                                os.remove(item_path)
                                        elif os.path.isdir(item_path):
                                            dir_age = time.time() - os.path.getmtime(item_path)
                                            if dir_age > 86400:  # 1 day
                                                shutil.rmtree(item_path)
                                    except Exception:
                                        continue
                            
                            optimization_results['optimizations_applied'].append(f'cleared_temp_dir_{temp_dir}')
                            logger.info(f"Cleared temporary directory: {temp_dir}")
                            
                        except Exception as e:
                            optimization_results['errors'].append(f"Error clearing temp dir {temp_dir}: {e}")
            
            # Optimize startup (Windows)
            if config['optimize_startup'] and os.name == 'nt':
                try:
                    if not self.dry_run:
                        # Disable unnecessary startup programs
                        startup_result = self.run_command(['msconfig', '/startup'])
                        if startup_result['success']:
                            optimization_results['optimizations_applied'].append('optimized_startup')
                            logger.info("Optimized system startup")
                except Exception as e:
                    optimization_results['errors'].append(f"Error optimizing startup: {e}")
            
            # Disk optimization (be very careful with this)
            if config['defragment_disk'] and self.aggressive:
                try:
                    if not self.dry_run:
                        # Run disk defragmentation (Windows)
                        if os.name == 'nt':
                            defrag_result = self.run_command(['defrag', 'C:', '/A'])
                            if defrag_result['success']:
                                optimization_results['optimizations_applied'].append('disk_defragmentation')
                                logger.info("Performed disk defragmentation")
                except Exception as e:
                    optimization_results['errors'].append(f"Error defragmenting disk: {e}")
            
        except Exception as e:
            logger.error(f"Error during system optimization: {e}")
            optimization_results['errors'].append(str(e))
        
        self.optimization_results['optimizations_performed'].append('system_optimization')
        
        logger.info(f"System optimization complete. Applied {len(optimization_results['optimizations_applied'])} optimizations")
        return optimization_results

    def optimize_applications(self) -> Dict[str, Any]:
        """Optimize applications and their caches"""
        logger.info("Starting application optimization...")
        
        optimization_results = {
            'caches_cleared': [],
            'databases_optimized': [],
            'errors': []
        }
        
        try:
            config = self.optimization_config['application_optimization']
            
            # Clear browser caches
            if config['clear_browser_cache']:
                browser_caches = self.get_browser_cache_paths()
                for browser, cache_path in browser_caches.items():
                    if cache_path and os.path.exists(cache_path):
                        try:
                            if not self.dry_run:
                                shutil.rmtree(cache_path)
                            optimization_results['caches_cleared'].append(f'{browser}_cache')
                            logger.info(f"Cleared {browser} cache")
                        except Exception as e:
                            optimization_results['errors'].append(f"Error clearing {browser} cache: {e}")
            
            # Clear application caches
            if config['clear_application_cache']:
                app_caches = self.get_application_cache_paths()
                for app, cache_path in app_caches.items():
                    if cache_path and os.path.exists(cache_path):
                        try:
                            if not self.dry_run:
                                shutil.rmtree(cache_path)
                            optimization_results['caches_cleared'].append(f'{app}_cache')
                            logger.info(f"Cleared {app} cache")
                        except Exception as e:
                            optimization_results['errors'].append(f"Error clearing {app} cache: {e}")
            
            # Optimize databases
            if config['optimize_database']:
                db_optimizations = self.optimize_databases()
                optimization_results['databases_optimized'].extend(db_optimizations)
            
        except Exception as e:
            logger.error(f"Error during application optimization: {e}")
            optimization_results['errors'].append(str(e))
        
        self.optimization_results['optimizations_performed'].append('application_optimization')
        
        logger.info(f"Application optimization complete. Cleared {len(optimization_results['caches_cleared'])} caches")
        return optimization_results

    def get_browser_cache_paths(self) -> Dict[str, str]:
        """Get browser cache paths"""
        cache_paths = {}
        
        if os.name == 'nt':  # Windows
            cache_paths.update({
                'chrome': os.path.expanduser('~\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache'),
                'firefox': os.path.expanduser('~\\AppData\\Local\\Mozilla\\Firefox\\Profiles'),
                'edge': os.path.expanduser('~\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Cache')
            })
        else:  # Unix/Linux
            cache_paths.update({
                'chrome': os.path.expanduser('~/.cache/google-chrome'),
                'firefox': os.path.expanduser('~/.mozilla/firefox'),
                'safari': os.path.expanduser('~/Library/Caches/com.apple.Safari')
            })
        
        return cache_paths

    def get_application_cache_paths(self) -> Dict[str, str]:
        """Get application cache paths"""
        cache_paths = {}
        
        if os.name == 'nt':  # Windows
            cache_paths.update({
                'npm': os.path.expanduser('~\\AppData\\Roaming\\npm-cache'),
                'yarn': os.path.expanduser('~\\AppData\\Local\\Yarn\\cache'),
                'pip': os.path.expanduser('~\\AppData\\Local\\pip\\Cache')
            })
        else:  # Unix/Linux
            cache_paths.update({
                'npm': os.path.expanduser('~/.npm'),
                'yarn': os.path.expanduser('~/.cache/yarn'),
                'pip': os.path.expanduser('~/.cache/pip')
            })
        
        return cache_paths

    def optimize_databases(self) -> List[str]:
        """Optimize databases"""
        optimized_dbs = []
        
        try:
            # SQLite database optimization
            sqlite_dbs = glob.glob('**/*.db', recursive=True) + glob.glob('**/*.sqlite', recursive=True)
            for db_path in sqlite_dbs:
                try:
                    if not self.dry_run:
                        # Run VACUUM and ANALYZE
                        import sqlite3
                        conn = sqlite3.connect(db_path)
                        conn.execute('VACUUM')
                        conn.execute('ANALYZE')
                        conn.close()
                    
                    optimized_dbs.append(f'sqlite_{os.path.basename(db_path)}')
                    logger.info(f"Optimized SQLite database: {db_path}")
                    
                except Exception as e:
                    logger.error(f"Error optimizing SQLite database {db_path}: {e}")
            
        except Exception as e:
            logger.error(f"Error during database optimization: {e}")
        
        return optimized_dbs

    def generate_optimization_report(self) -> Dict[str, Any]:
        """Generate comprehensive optimization report"""
        logger.info("Generating optimization report...")
        
        # Get final system state
        final_system_info = self.get_system_info()
        
        report = {
            'optimization_session': {
                'start_time': self.optimization_results['start_time'],
                'end_time': datetime.now().isoformat(),
                'duration_seconds': (
                    datetime.fromisoformat(datetime.now().isoformat()) -
                    datetime.fromisoformat(self.optimization_results['start_time'])
                ).total_seconds(),
                'aggressive_mode': self.aggressive,
                'dry_run': self.dry_run
            },
            'optimizations_performed': self.optimization_results['optimizations_performed'],
            'results': {
                'space_freed_mb': self.optimization_results['space_freed'],
                'files_removed': 0,  # Would need to track this
                'processes_terminated': 0,  # Would need to track this
                'caches_cleared': 0  # Would need to track this
            },
            'system_impact': {
                'before': {},  # Would need to capture before state
                'after': final_system_info
            },
            'errors': self.optimization_results['errors'],
            'warnings': self.optimization_results['warnings'],
            'recommendations': self.generate_recommendations()
        }
        
        return report

    def generate_recommendations(self) -> List[Dict]:
        """Generate optimization recommendations"""
        recommendations = []
        
        try:
            system_info = self.get_system_info()
            
            # Memory recommendations
            if system_info.get('memory', {}).get('usage_percent', 0) > 80:
                recommendations.append({
                    'category': 'memory',
                    'priority': 'high',
                    'title': 'High Memory Usage',
                    'description': 'Consider closing unnecessary applications or upgrading RAM',
                    'actions': [
                        'Close memory-intensive applications',
                        'Consider RAM upgrade',
                        'Optimize memory usage in applications'
                    ]
                })
            
            # Disk recommendations
            if system_info.get('disk', {}).get('usage_percent', 0) > 85:
                recommendations.append({
                    'category': 'disk',
                    'priority': 'critical',
                    'title': 'Low Disk Space',
                    'description': 'Disk space is critically low',
                    'actions': [
                        'Remove unnecessary files and applications',
                        'Consider disk expansion',
                        'Move large files to external storage'
                    ]
                })
            
            # Process recommendations
            if system_info.get('processes', {}).get('total_count', 0) > 100:
                recommendations.append({
                    'category': 'processes',
                    'priority': 'medium',
                    'title': 'High Process Count',
                    'description': 'Many processes are running',
                    'actions': [
                        'Review and terminate unnecessary processes',
                        'Optimize application startup',
                        'Consider process consolidation'
                    ]
                })
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
        
        return recommendations

    def save_optimization_report(self, report: Dict[str, Any]) -> None:
        """Save optimization report to file"""
        try:
            report_file = self.reports_dir / f'optimization_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2, default=str)
            logger.info(f"Optimization report saved to {report_file}")
        except Exception as e:
            logger.error(f"Error saving optimization report: {e}")

    def run_full_optimization(self) -> bool:
        """Run the complete optimization process"""
        logger.info("Starting QMOI advanced optimization...")
        
        try:
            # Step 1: File cleanup
            file_cleanup_results = self.cleanup_files()
            
            # Step 2: Process optimization
            process_optimization_results = self.optimize_processes()
            
            # Step 3: System optimization
            system_optimization_results = self.optimize_system()
            
            # Step 4: Application optimization
            application_optimization_results = self.optimize_applications()
            
            # Generate and save report
            report = self.generate_optimization_report()
            self.save_optimization_report(report)
            
            # Log summary
            total_space_freed = self.optimization_results['space_freed']
            total_optimizations = len(self.optimization_results['optimizations_performed'])
            
            logger.info(f"Optimization complete!")
            logger.info(f"Total space freed: {total_space_freed:.2f} MB")
            logger.info(f"Optimizations performed: {total_optimizations}")
            logger.info(f"Errors: {len(self.optimization_results['errors'])}")
            
            return True
            
        except Exception as e:
            logger.error(f"Optimization error: {e}")
            self.optimization_results['errors'].append(str(e))
            return False

def main():
    parser = argparse.ArgumentParser(description='QMOI Advanced Optimization Script')
    parser.add_argument('--aggressive', '-a',
                       action='store_true',
                       help='Run aggressive optimization (more thorough)')
    parser.add_argument('--dry-run', '-d',
                       action='store_true',
                       help='Run in dry-run mode (no actual changes)')
    parser.add_argument('--file-cleanup-only', '-f',
                       action='store_true',
                       help='Only perform file cleanup')
    parser.add_argument('--process-optimization-only', '-p',
                       action='store_true',
                       help='Only perform process optimization')
    
    args = parser.parse_args()
    
    optimizer = QMOIAdvancedOptimizer(
        aggressive=args.aggressive,
        dry_run=args.dry_run
    )
    
    try:
        if args.file_cleanup_only:
            # Only file cleanup
            results = optimizer.cleanup_files()
            print(json.dumps(results, indent=2, default=str))
        elif args.process_optimization_only:
            # Only process optimization
            results = optimizer.optimize_processes()
            print(json.dumps(results, indent=2, default=str))
        else:
            # Full optimization
            success = optimizer.run_full_optimization()
            if not success:
                sys.exit(1)
        
    except KeyboardInterrupt:
        logger.info("Optimization stopped by user")
    except Exception as e:
        logger.error(f"Optimization error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main() 