#!/usr/bin/env python3
"""
QMOI Master Automation Script
Orchestrates all QMOI automation tasks, monitoring, optimization, and enhancement processes
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
from datetime import datetime, timedelta
import argparse
import asyncio
import schedule

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi_master_automation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QMOIMasterAutomation:
    def __init__(self, mode: str = 'full', continuous: bool = False):
        self.mode = mode
        self.continuous = continuous
        self.root_dir = Path(__file__).parent.parent.parent
        self.logs_dir = self.root_dir / 'logs'
        self.reports_dir = self.root_dir / 'reports'
        
        # Ensure directories exist
        self.logs_dir.mkdir(exist_ok=True)
        self.reports_dir.mkdir(exist_ok=True)
        
        # Automation state
        self.automation_state = {
            'start_time': datetime.now().isoformat(),
            'tasks_completed': [],
            'tasks_failed': [],
            'current_task': None,
            'last_status_check': None,
            'performance_metrics': {}
        }
        
        # Load automation configuration
        self.config = self.load_automation_config()
        
        # Task registry
        self.task_registry = self.register_tasks()

    def load_automation_config(self) -> Dict[str, Any]:
        """Load automation configuration"""
        config_path = self.root_dir / 'config' / 'master_automation_config.json'
        if config_path.exists():
            try:
                with open(config_path, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading automation config: {e}")
        
        # Default configuration
        return {
            'schedules': {
                'health_check': '*/15 * * * *',  # Every 15 minutes
                'performance_monitoring': '*/5 * * * *',  # Every 5 minutes
                'system_optimization': '0 */6 * * *',  # Every 6 hours
                'enhancement_check': '0 */2 * * *',  # Every 2 hours
                'deployment_check': '0 */4 * * *',  # Every 4 hours
                'backup': '0 2 * * *',  # Daily at 2 AM
                'cleanup': '0 3 * * *'  # Daily at 3 AM
            },
            'task_priorities': {
                'critical': ['health_check', 'performance_monitoring', 'error_fix'],
                'high': ['system_optimization', 'enhancement_check', 'deployment_check'],
                'medium': ['backup', 'cleanup', 'report_generation'],
                'low': ['maintenance', 'documentation_update']
            },
            'automation_modes': {
                'minimal': ['health_check', 'performance_monitoring'],
                'standard': ['health_check', 'performance_monitoring', 'system_optimization', 'enhancement_check'],
                'full': ['health_check', 'performance_monitoring', 'system_optimization', 'enhancement_check', 'deployment_check', 'backup', 'cleanup'],
                'aggressive': ['health_check', 'performance_monitoring', 'system_optimization', 'enhancement_check', 'deployment_check', 'backup', 'cleanup', 'error_fix', 'maintenance']
            }
        }

    def register_tasks(self) -> Dict[str, Any]:
        """Register all automation tasks"""
        return {
            'health_check': {
                'function': self.run_health_check,
                'description': 'Check system health and component status',
                'timeout': 300,
                'retry_count': 3,
                'critical': True
            },
            'performance_monitoring': {
                'function': self.run_performance_monitoring,
                'description': 'Monitor system performance and resource usage',
                'timeout': 180,
                'retry_count': 2,
                'critical': True
            },
            'system_optimization': {
                'function': self.run_system_optimization,
                'description': 'Optimize system performance and resources',
                'timeout': 600,
                'retry_count': 2,
                'critical': False
            },
            'enhancement_check': {
                'function': self.run_enhancement_check,
                'description': 'Check for system enhancements and updates',
                'timeout': 900,
                'retry_count': 2,
                'critical': False
            },
            'deployment_check': {
                'function': self.run_deployment_check,
                'description': 'Check deployment status and health',
                'timeout': 300,
                'retry_count': 3,
                'critical': False
            },
            'backup': {
                'function': self.run_backup,
                'description': 'Create system backup',
                'timeout': 1800,
                'retry_count': 1,
                'critical': False
            },
            'cleanup': {
                'function': self.run_cleanup,
                'description': 'Clean up temporary files and logs',
                'timeout': 300,
                'retry_count': 2,
                'critical': False
            },
            'error_fix': {
                'function': self.run_error_fix,
                'description': 'Automatically fix detected errors',
                'timeout': 600,
                'retry_count': 3,
                'critical': True
            },
            'maintenance': {
                'function': self.run_maintenance,
                'description': 'Perform system maintenance tasks',
                'timeout': 1200,
                'retry_count': 1,
                'critical': False
            },
            'report_generation': {
                'function': self.run_report_generation,
                'description': 'Generate comprehensive system reports',
                'timeout': 300,
                'retry_count': 1,
                'critical': False
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

    def run_health_check(self) -> Dict[str, Any]:
        """Run system health check"""
        logger.info("Running system health check...")
        
        try:
            # Run system status monitor
            status_result = self.run_command([
                'python', 'scripts/monitoring/system_status_monitor.py', '--once'
            ])
            
            if status_result['success']:
                # Parse the output to get health status
                output = status_result['stdout']
                if 'System Health: excellent' in output or 'System Health: good' in output:
                    health_status = 'healthy'
                elif 'System Health: fair' in output:
                    health_status = 'warning'
                else:
                    health_status = 'critical'
                
                return {
                    'status': 'success',
                    'health_status': health_status,
                    'output': output,
                    'execution_time': status_result['execution_time']
                }
            else:
                return {
                    'status': 'failed',
                    'error': status_result['stderr'],
                    'execution_time': status_result['execution_time']
                }
                
        except Exception as e:
            logger.error(f"Error running health check: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def run_performance_monitoring(self) -> Dict[str, Any]:
        """Run performance monitoring"""
        logger.info("Running performance monitoring...")
        
        try:
            # Run performance monitor
            perf_result = self.run_command([
                'python', 'scripts/monitoring/performance_monitoring.py', '--once'
            ])
            
            if perf_result['success']:
                return {
                    'status': 'success',
                    'output': perf_result['stdout'],
                    'execution_time': perf_result['execution_time']
                }
            else:
                return {
                    'status': 'failed',
                    'error': perf_result['stderr'],
                    'execution_time': perf_result['execution_time']
                }
                
        except Exception as e:
            logger.error(f"Error running performance monitoring: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def run_system_optimization(self) -> Dict[str, Any]:
        """Run system optimization"""
        logger.info("Running system optimization...")
        
        try:
            # Run advanced optimization
            opt_result = self.run_command([
                'python', 'scripts/optimization/advanced_optimization.py'
            ])
            
            if opt_result['success']:
                return {
                    'status': 'success',
                    'output': opt_result['stdout'],
                    'execution_time': opt_result['execution_time']
                }
            else:
                return {
                    'status': 'failed',
                    'error': opt_result['stderr'],
                    'execution_time': opt_result['execution_time']
                }
                
        except Exception as e:
            logger.error(f"Error running system optimization: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def run_enhancement_check(self) -> Dict[str, Any]:
        """Run enhancement check"""
        logger.info("Running enhancement check...")
        
        try:
            # Run QMOI auto-development
            enhance_result = self.run_command([
                'python', 'scripts/models/qmoi_autodev.py', '--enhance'
            ])
            
            if enhance_result['success']:
                return {
                    'status': 'success',
                    'output': enhance_result['stdout'],
                    'execution_time': enhance_result['execution_time']
                }
            else:
                return {
                    'status': 'failed',
                    'error': enhance_result['stderr'],
                    'execution_time': enhance_result['execution_time']
                }
                
        except Exception as e:
            logger.error(f"Error running enhancement check: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def run_deployment_check(self) -> Dict[str, Any]:
        """Run deployment check"""
        logger.info("Running deployment check...")
        
        try:
            # Run auto-deployment
            deploy_result = self.run_command([
                'python', 'scripts/deployment/auto_deploy.py', '--environment', 'production'
            ])
            
            if deploy_result['success']:
                return {
                    'status': 'success',
                    'output': deploy_result['stdout'],
                    'execution_time': deploy_result['execution_time']
                }
            else:
                return {
                    'status': 'failed',
                    'error': deploy_result['stderr'],
                    'execution_time': deploy_result['execution_time']
                }
                
        except Exception as e:
            logger.error(f"Error running deployment check: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def run_backup(self) -> Dict[str, Any]:
        """Run system backup"""
        logger.info("Running system backup...")
        
        try:
            # Create backup directory
            backup_dir = self.root_dir / 'backups' / datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_dir.mkdir(parents=True, exist_ok=True)
            
            # Backup important directories
            important_dirs = ['config', 'models', 'scripts', 'docs']
            backed_up_dirs = []
            
            for dir_name in important_dirs:
                source_dir = self.root_dir / dir_name
                if source_dir.exists():
                    import shutil
                    dest_dir = backup_dir / dir_name
                    shutil.copytree(source_dir, dest_dir)
                    backed_up_dirs.append(dir_name)
            
            # Create backup manifest
            manifest = {
                'backup_time': datetime.now().isoformat(),
                'backed_up_directories': backed_up_dirs,
                'backup_size_mb': self.get_directory_size(backup_dir) / (1024**2)
            }
            
            with open(backup_dir / 'manifest.json', 'w') as f:
                json.dump(manifest, f, indent=2)
            
            return {
                'status': 'success',
                'backup_location': str(backup_dir),
                'backed_up_dirs': backed_up_dirs,
                'backup_size_mb': manifest['backup_size_mb'],
                'execution_time': 0
            }
            
        except Exception as e:
            logger.error(f"Error running backup: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def run_cleanup(self) -> Dict[str, Any]:
        """Run system cleanup"""
        logger.info("Running system cleanup...")
        
        try:
            # Clean up old logs
            log_files = list(self.logs_dir.glob('*.log'))
            cleaned_files = 0
            
            for log_file in log_files:
                # Keep only logs from last 7 days
                file_age = time.time() - log_file.stat().st_mtime
                if file_age > 7 * 24 * 3600:  # 7 days
                    log_file.unlink()
                    cleaned_files += 1
            
            # Clean up old reports
            report_files = list(self.reports_dir.glob('*.json'))
            cleaned_reports = 0
            
            for report_file in report_files:
                # Keep only reports from last 30 days
                file_age = time.time() - report_file.stat().st_mtime
                if file_age > 30 * 24 * 3600:  # 30 days
                    report_file.unlink()
                    cleaned_reports += 1
            
            return {
                'status': 'success',
                'cleaned_logs': cleaned_files,
                'cleaned_reports': cleaned_reports,
                'execution_time': 0
            }
            
        except Exception as e:
            logger.error(f"Error running cleanup: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def run_error_fix(self) -> Dict[str, Any]:
        """Run automatic error fixing"""
        logger.info("Running automatic error fixing...")
        
        try:
            # Check for errors in logs
            error_patterns = ['error', 'fail', 'exception', 'critical']
            error_count = 0
            
            for log_file in self.logs_dir.glob('*.log'):
                try:
                    with open(log_file, 'r') as f:
                        for line in f:
                            if any(pattern in line.lower() for pattern in error_patterns):
                                error_count += 1
                except Exception:
                    continue
            
            if error_count > 0:
                # Attempt to fix common errors
                fix_actions = []
                
                # Try to restart services
                restart_result = self.run_command(['npm', 'run', 'dev'])
                if restart_result['success']:
                    fix_actions.append('restarted_services')
                
                # Try to reinstall dependencies
                install_result = self.run_command(['npm', 'install'])
                if install_result['success']:
                    fix_actions.append('reinstalled_dependencies')
                
                return {
                    'status': 'success',
                    'errors_found': error_count,
                    'fix_actions': fix_actions,
                    'execution_time': 0
                }
            else:
                return {
                    'status': 'success',
                    'errors_found': 0,
                    'fix_actions': [],
                    'execution_time': 0
                }
                
        except Exception as e:
            logger.error(f"Error running error fix: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def run_maintenance(self) -> Dict[str, Any]:
        """Run system maintenance"""
        logger.info("Running system maintenance...")
        
        try:
            maintenance_actions = []
            
            # Update dependencies
            update_result = self.run_command(['npm', 'update'])
            if update_result['success']:
                maintenance_actions.append('updated_dependencies')
            
            # Run tests
            test_result = self.run_command(['npm', 'test'])
            if test_result['success']:
                maintenance_actions.append('ran_tests')
            
            # Check for security vulnerabilities
            audit_result = self.run_command(['npm', 'audit'])
            if audit_result['success']:
                maintenance_actions.append('security_audit')
            
            return {
                'status': 'success',
                'maintenance_actions': maintenance_actions,
                'execution_time': 0
            }
            
        except Exception as e:
            logger.error(f"Error running maintenance: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def run_report_generation(self) -> Dict[str, Any]:
        """Run report generation"""
        logger.info("Running report generation...")
        
        try:
            # Generate comprehensive report
            report = {
                'timestamp': datetime.now().isoformat(),
                'automation_state': self.automation_state,
                'system_health': self.run_health_check(),
                'performance': self.run_performance_monitoring(),
                'recommendations': self.generate_recommendations()
            }
            
            # Save report
            report_file = self.reports_dir / f'master_automation_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2, default=str)
            
            return {
                'status': 'success',
                'report_file': str(report_file),
                'execution_time': 0
            }
            
        except Exception as e:
            logger.error(f"Error running report generation: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def get_directory_size(self, directory: Path) -> int:
        """Get directory size in bytes"""
        total_size = 0
        try:
            for file_path in directory.rglob('*'):
                if file_path.is_file():
                    total_size += file_path.stat().st_size
        except Exception:
            pass
        return total_size

    def generate_recommendations(self) -> List[Dict]:
        """Generate automation recommendations"""
        recommendations = []
        
        try:
            # Analyze automation state
            tasks_completed = len(self.automation_state['tasks_completed'])
            tasks_failed = len(self.automation_state['tasks_failed'])
            
            if tasks_failed > 0:
                recommendations.append({
                    'category': 'reliability',
                    'priority': 'high',
                    'title': 'Fix Failed Tasks',
                    'description': f'{tasks_failed} tasks have failed recently',
                    'actions': ['Review failed task logs', 'Check system resources', 'Verify task configurations']
                })
            
            # Check for optimization opportunities
            if tasks_completed > 10:
                recommendations.append({
                    'category': 'performance',
                    'priority': 'medium',
                    'title': 'Optimize Task Scheduling',
                    'description': 'Many tasks completed, consider optimization',
                    'actions': ['Review task schedules', 'Optimize task execution', 'Consider parallel processing']
                })
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
        
        return recommendations

    def execute_task(self, task_name: str) -> Dict[str, Any]:
        """Execute a single task"""
        if task_name not in self.task_registry:
            return {
                'status': 'error',
                'error': f'Unknown task: {task_name}',
                'execution_time': 0
            }
        
        task = self.task_registry[task_name]
        self.automation_state['current_task'] = task_name
        
        logger.info(f"Executing task: {task_name} - {task['description']}")
        
        try:
            # Execute task with timeout
            start_time = time.time()
            result = task['function']()
            execution_time = time.time() - start_time
            
            # Update automation state
            if result['status'] == 'success':
                self.automation_state['tasks_completed'].append({
                    'task': task_name,
                    'timestamp': datetime.now().isoformat(),
                    'execution_time': execution_time
                })
            else:
                self.automation_state['tasks_failed'].append({
                    'task': task_name,
                    'timestamp': datetime.now().isoformat(),
                    'error': result.get('error', 'Unknown error'),
                    'execution_time': execution_time
                })
            
            self.automation_state['current_task'] = None
            
            return result
            
        except Exception as e:
            logger.error(f"Error executing task {task_name}: {e}")
            self.automation_state['current_task'] = None
            
            self.automation_state['tasks_failed'].append({
                'task': task_name,
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'execution_time': 0
            })
            
            return {
                'status': 'error',
                'error': str(e),
                'execution_time': 0
            }

    def run_automation_cycle(self) -> Dict[str, Any]:
        """Run one automation cycle"""
        logger.info(f"Starting automation cycle (mode: {self.mode})")
        
        # Get tasks for current mode
        mode_tasks = self.config['automation_modes'].get(self.mode, [])
        
        cycle_results = {
            'timestamp': datetime.now().isoformat(),
            'mode': self.mode,
            'tasks_executed': [],
            'tasks_successful': 0,
            'tasks_failed': 0,
            'total_execution_time': 0
        }
        
        for task_name in mode_tasks:
            if task_name in self.task_registry:
                result = self.execute_task(task_name)
                cycle_results['tasks_executed'].append({
                    'task': task_name,
                    'result': result
                })
                
                if result['status'] == 'success':
                    cycle_results['tasks_successful'] += 1
                else:
                    cycle_results['tasks_failed'] += 1
                
                cycle_results['total_execution_time'] += result.get('execution_time', 0)
        
        logger.info(f"Automation cycle complete. Successful: {cycle_results['tasks_successful']}, Failed: {cycle_results['tasks_failed']}")
        
        return cycle_results

    def start_continuous_automation(self) -> None:
        """Start continuous automation"""
        logger.info(f"Starting continuous automation (mode: {self.mode})")
        
        try:
            while True:
                cycle_result = self.run_automation_cycle()
                
                # Wait before next cycle
                time.sleep(3600)  # 1 hour between cycles
                
        except KeyboardInterrupt:
            logger.info("Continuous automation stopped by user")
        except Exception as e:
            logger.error(f"Continuous automation error: {e}")

    def save_automation_state(self) -> None:
        """Save automation state to file"""
        try:
            state_file = self.reports_dir / 'automation_state.json'
            with open(state_file, 'w') as f:
                json.dump(self.automation_state, f, indent=2, default=str)
            logger.info(f"Automation state saved to {state_file}")
        except Exception as e:
            logger.error(f"Error saving automation state: {e}")

def main():
    parser = argparse.ArgumentParser(description='QMOI Master Automation Script')
    parser.add_argument('--mode', '-m',
                       choices=['minimal', 'standard', 'full', 'aggressive'],
                       default='full',
                       help='Automation mode (default: full)')
    parser.add_argument('--continuous', '-c',
                       action='store_true',
                       help='Run continuous automation')
    parser.add_argument('--task', '-t',
                       help='Run specific task')
    parser.add_argument('--list-tasks', '-l',
                       action='store_true',
                       help='List available tasks')
    
    args = parser.parse_args()
    
    automation = QMOIMasterAutomation(
        mode=args.mode,
        continuous=args.continuous
    )
    
    try:
        if args.list_tasks:
            # List available tasks
            print("Available tasks:")
            for task_name, task_info in automation.task_registry.items():
                print(f"  {task_name}: {task_info['description']}")
        elif args.task:
            # Run specific task
            result = automation.execute_task(args.task)
            print(json.dumps(result, indent=2, default=str))
        elif args.continuous:
            # Run continuous automation
            automation.start_continuous_automation()
        else:
            # Run one cycle
            result = automation.run_automation_cycle()
            print(json.dumps(result, indent=2, default=str))
        
        # Save automation state
        automation.save_automation_state()
        
    except KeyboardInterrupt:
        logger.info("Automation stopped by user")
        automation.save_automation_state()
    except Exception as e:
        logger.error(f"Automation error: {e}")
        automation.save_automation_state()
        sys.exit(1)

if __name__ == '__main__':
    main() 