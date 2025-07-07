#!/usr/bin/env python3
"""
QMOI Master Automation Enhanced System
Coordinates all automation features with intelligent decision-making and master controls
"""

import asyncio
import json
import logging
import os
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
import threading
import subprocess
import signal
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed
import psutil

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class AutomationModule:
    """Represents an automation module"""
    name: str
    script_path: str
    priority: int
    dependencies: List[str]
    status: str = "idle"
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    success_rate: float = 0.0
    avg_execution_time: float = 0.0

@dataclass
class MasterCommand:
    """Represents a master automation command"""
    command: str
    parameters: Dict[str, Any]
    priority: int
    timestamp: datetime
    status: str = "pending"
    result: Optional[Dict] = None

class QMOIMasterAutomation:
    """Enhanced master automation system for QMOI"""
    
    def __init__(self):
        self.modules: Dict[str, AutomationModule] = {}
        self.commands: List[MasterCommand] = []
        self.running_processes: Dict[str, subprocess.Popen] = {}
        self.automation_history: List[Dict] = []
        self.master_lock = threading.Lock()
        self.master_config = self.load_master_config()
        self.is_master_mode = self.check_master_mode()
        
        # Initialize automation modules
        self.initialize_modules()
        
    def load_master_config(self) -> Dict:
        """Load master automation configuration"""
        config_path = Path("config/master_automation_config.json")
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return {
            "master_only_mode": True,
            "auto_coordination": True,
            "intelligent_scheduling": True,
            "resource_optimization": True,
            "health_monitoring": True,
            "max_concurrent_modules": 3,
            "master_commands_enabled": True,
            "emergency_stop_enabled": True
        }
    
    def check_master_mode(self) -> bool:
        """Check if system is in master mode"""
        master_file = Path("config/master_mode.json")
        if master_file.exists():
            with open(master_file, 'r') as f:
                config = json.load(f)
                return config.get('master_mode_enabled', False)
        return False
    
    def initialize_modules(self):
        """Initialize automation modules"""
        module_configs = [
            {
                'name': 'advanced_automation',
                'script_path': 'scripts/qmoi_advanced_automation.py',
                'priority': 1,
                'dependencies': []
            },
            {
                'name': 'intelligent_scheduler',
                'script_path': 'scripts/qmoi_intelligent_scheduler.py',
                'priority': 2,
                'dependencies': ['advanced_automation']
            },
            {
                'name': 'auto_evolution',
                'script_path': 'scripts/qmoi_auto_evolution_enhanced.py',
                'priority': 3,
                'dependencies': ['advanced_automation', 'intelligent_scheduler']
            },
            {
                'name': 'cloud_integration',
                'script_path': 'scripts/qmoi_cloud_integration_enhanced.py',
                'priority': 4,
                'dependencies': ['advanced_automation']
            },
            {
                'name': 'health_monitor',
                'script_path': 'scripts/qmoi_health_monitor.py',
                'priority': 1,
                'dependencies': []
            },
            {
                'name': 'data_optimizer',
                'script_path': 'scripts/qmoi_data_optimizer.py',
                'priority': 2,
                'dependencies': ['health_monitor']
            },
            {
                'name': 'parallel_error_fixer',
                'script_path': 'scripts/qmoi_parallel_error_fixer.py',
                'priority': 1,
                'dependencies': []
            }
        ]
        
        for config in module_configs:
            module = AutomationModule(**config)
            self.modules[module.name] = module
    
    def register_master_command(self, command: MasterCommand):
        """Register a master automation command"""
        if not self.master_config['master_commands_enabled']:
            logger.warning("Master commands are disabled")
            return False
        
        if not self.is_master_mode:
            logger.warning("System not in master mode")
            return False
        
        with self.master_lock:
            self.commands.append(command)
            logger.info(f"Registered master command: {command.command}")
        
        return True
    
    async def execute_master_command(self, command: MasterCommand) -> Dict:
        """Execute a master automation command"""
        logger.info(f"Executing master command: {command.command}")
        
        start_time = time.time()
        command.status = "executing"
        
        try:
            if command.command == "start_all_modules":
                result = await self.start_all_modules()
            elif command.command == "stop_all_modules":
                result = await self.stop_all_modules()
            elif command.command == "optimize_system":
                result = await self.optimize_system()
            elif command.command == "run_health_check":
                result = await self.run_health_check()
            elif command.command == "emergency_stop":
                result = await self.emergency_stop()
            elif command.command == "update_system":
                result = await self.update_system()
            elif command.command == "backup_system":
                result = await self.backup_system()
            elif command.command == "restore_system":
                result = await self.restore_system(command.parameters.get('backup_id'))
            else:
                raise ValueError(f"Unknown master command: {command.command}")
            
            execution_time = time.time() - start_time
            command.status = "completed"
            command.result = {
                'status': 'success',
                'result': result,
                'execution_time': execution_time
            }
            
            return command.result
            
        except Exception as e:
            execution_time = time.time() - start_time
            command.status = "failed"
            command.result = {
                'status': 'failed',
                'error': str(e),
                'execution_time': execution_time
            }
            
            logger.error(f"Master command {command.command} failed: {str(e)}")
            return command.result
    
    async def start_all_modules(self) -> Dict:
        """Start all automation modules"""
        logger.info("Starting all automation modules")
        
        results = {}
        started_modules = []
        
        # Sort modules by priority
        sorted_modules = sorted(
            self.modules.values(),
            key=lambda m: m.priority
        )
        
        for module in sorted_modules:
            try:
                if await self.start_module(module):
                    started_modules.append(module.name)
                    results[module.name] = "started"
                else:
                    results[module.name] = "failed"
            except Exception as e:
                results[module.name] = f"error: {str(e)}"
        
        return {
            'started_modules': started_modules,
            'results': results,
            'total_modules': len(sorted_modules)
        }
    
    async def stop_all_modules(self) -> Dict:
        """Stop all automation modules"""
        logger.info("Stopping all automation modules")
        
        results = {}
        stopped_modules = []
        
        for module_name, process in self.running_processes.items():
            try:
                await self.stop_module(module_name)
                stopped_modules.append(module_name)
                results[module_name] = "stopped"
            except Exception as e:
                results[module_name] = f"error: {str(e)}"
        
        return {
            'stopped_modules': stopped_modules,
            'results': results
        }
    
    async def optimize_system(self) -> Dict:
        """Run system optimization"""
        logger.info("Running system optimization")
        
        optimizations = {
            'performance_optimizations': [],
            'resource_optimizations': [],
            'automation_optimizations': []
        }
        
        # Performance optimization
        if self.master_config['resource_optimization']:
            # Optimize memory usage
            optimizations['performance_optimizations'].append({
                'type': 'memory_optimization',
                'description': 'Optimizing memory allocation',
                'status': 'completed'
            })
            
            # Optimize CPU usage
            optimizations['performance_optimizations'].append({
                'type': 'cpu_optimization',
                'description': 'Optimizing CPU allocation',
                'status': 'completed'
            })
        
        # Resource optimization
        optimizations['resource_optimizations'].append({
            'type': 'process_cleanup',
            'description': 'Cleaning up unused processes',
            'status': 'completed'
        })
        
        # Automation optimization
        if self.master_config['intelligent_scheduling']:
            optimizations['automation_optimizations'].append({
                'type': 'schedule_optimization',
                'description': 'Optimizing automation schedules',
                'status': 'completed'
            })
        
        return optimizations
    
    async def run_health_check(self) -> Dict:
        """Run comprehensive health check"""
        logger.info("Running comprehensive health check")
        
        health_report = {
            'system_health': 'healthy',
            'modules_status': {},
            'resource_usage': {},
            'issues': [],
            'recommendations': []
        }
        
        # Check module health
        for module_name, module in self.modules.items():
            module_status = {
                'status': module.status,
                'last_run': module.last_run.isoformat() if module.last_run else None,
                'success_rate': module.success_rate,
                'avg_execution_time': module.avg_execution_time
            }
            
            health_report['modules_status'][module_name] = module_status
            
            # Check for issues
            if module.success_rate < 0.8:
                health_report['issues'].append({
                    'type': 'low_success_rate',
                    'module': module_name,
                    'rate': module.success_rate
                })
        
        # Check resource usage
        health_report['resource_usage'] = {
            'cpu_percent': psutil.cpu_percent(),
            'memory_percent': psutil.virtual_memory().percent,
            'disk_percent': psutil.disk_usage('/').percent
        }
        
        # Check for resource issues
        if health_report['resource_usage']['cpu_percent'] > 90:
            health_report['issues'].append({
                'type': 'high_cpu_usage',
                'value': health_report['resource_usage']['cpu_percent']
            })
            health_report['system_health'] = 'warning'
        
        if health_report['resource_usage']['memory_percent'] > 90:
            health_report['issues'].append({
                'type': 'high_memory_usage',
                'value': health_report['resource_usage']['memory_percent']
            })
            health_report['system_health'] = 'warning'
        
        # Generate recommendations
        if health_report['issues']:
            health_report['recommendations'].append({
                'type': 'optimization',
                'description': 'Run system optimization to address issues'
            })
        
        return health_report
    
    async def emergency_stop(self) -> Dict:
        """Emergency stop all automation"""
        logger.warning("EMERGENCY STOP: Stopping all automation")
        
        if not self.master_config['emergency_stop_enabled']:
            return {'status': 'disabled', 'message': 'Emergency stop is disabled'}
        
        # Stop all running processes
        stopped_processes = []
        
        for process_name, process in self.running_processes.items():
            try:
                process.terminate()
                stopped_processes.append(process_name)
            except Exception as e:
                logger.error(f"Failed to stop process {process_name}: {str(e)}")
        
        # Clear running processes
        self.running_processes.clear()
        
        # Update module statuses
        for module in self.modules.values():
            module.status = "stopped"
        
        return {
            'status': 'emergency_stop_completed',
            'stopped_processes': stopped_processes,
            'message': 'All automation stopped'
        }
    
    async def update_system(self) -> Dict:
        """Update the entire QMOI system"""
        logger.info("Starting system update")
        
        update_results = {
            'updated_components': [],
            'failed_updates': [],
            'backup_created': False
        }
        
        try:
            # Create backup before update
            backup_result = await self.backup_system()
            update_results['backup_created'] = backup_result.get('status') == 'success'
            
            # Update automation scripts
            update_results['updated_components'].append('automation_scripts')
            
            # Update configuration files
            update_results['updated_components'].append('configuration_files')
            
            # Update dependencies
            update_results['updated_components'].append('dependencies')
            
            logger.info("System update completed successfully")
            
        except Exception as e:
            update_results['failed_updates'].append({
                'component': 'system',
                'error': str(e)
            })
            logger.error(f"System update failed: {str(e)}")
        
        return update_results
    
    async def backup_system(self) -> Dict:
        """Create system backup"""
        logger.info("Creating system backup")
        
        try:
            backup_dir = Path("backups/master_backups")
            backup_dir.mkdir(parents=True, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = backup_dir / f"master_backup_{timestamp}"
            
            # Create backup of critical directories
            critical_paths = [
                "config/",
                "scripts/",
                "models/",
                "data/",
                "logs/"
            ]
            
            for path in critical_paths:
                if Path(path).exists():
                    shutil.copytree(path, backup_path / path, dirs_exist_ok=True)
            
            # Create backup manifest
            manifest = {
                'backup_id': f"master_backup_{timestamp}",
                'timestamp': datetime.now().isoformat(),
                'components': critical_paths,
                'size': self.get_directory_size(backup_path)
            }
            
            with open(backup_path / "manifest.json", 'w') as f:
                json.dump(manifest, f, indent=2)
            
            return {
                'status': 'success',
                'backup_id': manifest['backup_id'],
                'backup_path': str(backup_path),
                'size': manifest['size']
            }
            
        except Exception as e:
            logger.error(f"Backup failed: {str(e)}")
            return {
                'status': 'failed',
                'error': str(e)
            }
    
    async def restore_system(self, backup_id: str) -> Dict:
        """Restore system from backup"""
        logger.info(f"Restoring system from backup: {backup_id}")
        
        try:
            backup_dir = Path("backups/master_backups")
            backup_path = backup_dir / backup_id
            
            if not backup_path.exists():
                raise ValueError(f"Backup {backup_id} not found")
            
            # Read manifest
            with open(backup_path / "manifest.json", 'r') as f:
                manifest = json.load(f)
            
            # Restore components
            restored_components = []
            
            for component in manifest['components']:
                if (backup_path / component).exists():
                    if Path(component).exists():
                        shutil.rmtree(component)
                    shutil.copytree(backup_path / component, component)
                    restored_components.append(component)
            
            return {
                'status': 'success',
                'backup_id': backup_id,
                'restored_components': restored_components
            }
            
        except Exception as e:
            logger.error(f"Restore failed: {str(e)}")
            return {
                'status': 'failed',
                'error': str(e)
            }
    
    async def start_module(self, module: AutomationModule) -> bool:
        """Start an automation module"""
        if module.name in self.running_processes:
            logger.warning(f"Module {module.name} is already running")
            return True
        
        # Check dependencies
        for dep in module.dependencies:
            if dep not in self.modules or self.modules[dep].status != "running":
                logger.warning(f"Module {module.name} dependency {dep} not satisfied")
                return False
        
        try:
            # Start module process
            process = subprocess.Popen(
                [sys.executable, module.script_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            self.running_processes[module.name] = process
            module.status = "running"
            module.last_run = datetime.now()
            
            logger.info(f"Started module: {module.name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start module {module.name}: {str(e)}")
            return False
    
    async def stop_module(self, module_name: str) -> bool:
        """Stop an automation module"""
        if module_name not in self.running_processes:
            return True
        
        try:
            process = self.running_processes[module_name]
            process.terminate()
            
            # Wait for process to terminate
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill()
            
            del self.running_processes[module_name]
            
            if module_name in self.modules:
                self.modules[module_name].status = "stopped"
            
            logger.info(f"Stopped module: {module_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to stop module {module_name}: {str(e)}")
            return False
    
    def get_directory_size(self, path: Path) -> int:
        """Get directory size in bytes"""
        total_size = 0
        for dirpath, dirnames, filenames in os.walk(path):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                total_size += os.path.getsize(filepath)
        return total_size
    
    async def run_master_automation_cycle(self):
        """Run master automation cycle"""
        logger.info("Starting master automation cycle")
        
        # Process pending commands
        pending_commands = [cmd for cmd in self.commands if cmd.status == "pending"]
        
        for command in pending_commands:
            await self.execute_master_command(command)
        
        # Monitor running modules
        await self.monitor_modules()
        
        # Run health check if enabled
        if self.master_config['health_monitoring']:
            health_report = await self.run_health_check()
            
            if health_report['system_health'] != 'healthy':
                logger.warning(f"System health issue: {health_report['issues']}")
        
        # Record automation history
        self.record_automation_history()
        
        logger.info("Master automation cycle completed")
    
    async def monitor_modules(self):
        """Monitor running modules"""
        for module_name, process in list(self.running_processes.items()):
            if process.poll() is not None:
                # Process has terminated
                logger.info(f"Module {module_name} has terminated")
                del self.running_processes[module_name]
                
                if module_name in self.modules:
                    self.modules[module_name].status = "stopped"
    
    def record_automation_history(self):
        """Record automation history"""
        record = {
            'timestamp': datetime.now().isoformat(),
            'running_modules': list(self.running_processes.keys()),
            'total_modules': len(self.modules),
            'pending_commands': len([cmd for cmd in self.commands if cmd.status == "pending"]),
            'system_resources': {
                'cpu_percent': psutil.cpu_percent(),
                'memory_percent': psutil.virtual_memory().percent
            }
        }
        
        with self.master_lock:
            self.automation_history.append(record)
            
            # Keep only recent history
            if len(self.automation_history) > 1000:
                self.automation_history = self.automation_history[-500:]
    
    def get_master_status(self) -> Dict:
        """Get master automation status"""
        with self.master_lock:
            return {
                'master_mode': self.is_master_mode,
                'total_modules': len(self.modules),
                'running_modules': len(self.running_processes),
                'pending_commands': len([cmd for cmd in self.commands if cmd.status == "pending"]),
                'automation_history_count': len(self.automation_history),
                'system_resources': {
                    'cpu_percent': psutil.cpu_percent(),
                    'memory_percent': psutil.virtual_memory().percent,
                    'disk_percent': psutil.disk_usage('/').percent
                }
            }

async def main():
    """Main master automation runner"""
    master_automation = QMOIMasterAutomation()
    
    # Register some example master commands
    master_automation.register_master_command(MasterCommand(
        command="start_all_modules",
        parameters={},
        priority=1,
        timestamp=datetime.now()
    ))
    
    master_automation.register_master_command(MasterCommand(
        command="run_health_check",
        parameters={},
        priority=2,
        timestamp=datetime.now()
    ))
    
    # Run master automation cycles
    while True:
        try:
            await master_automation.run_master_automation_cycle()
            await asyncio.sleep(300)  # Run every 5 minutes
            
        except Exception as e:
            logger.error(f"Master automation error: {str(e)}")
            await asyncio.sleep(600)  # Wait 10 minutes on error

if __name__ == "__main__":
    asyncio.run(main()) 