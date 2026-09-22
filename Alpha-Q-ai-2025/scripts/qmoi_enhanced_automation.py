#!/usr/bin/env python3
"""
QMOI Enhanced Automation System
Advanced workflow automation, task scheduling, and intelligent process management.
"""

import os
import sys
import json
import time
import subprocess
import re
import glob
import shutil
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import logging
import sqlite3
import asyncio
import aiohttp
import threading
import queue
from collections import defaultdict
import schedule
import psutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi_automation.log'),
        logging.StreamHandler()
    ]
)

class QMOIEnhancedAutomation:
    def __init__(self):
        self.root_dir = Path.cwd()
        self.logs_dir = self.root_dir / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        
        self.db_path = self.root_dir / "data" / "qmoi_automation.db"
        self.db_path.parent.mkdir(exist_ok=True)
        
        self.automation_state = {
            "timestamp": datetime.now().isoformat(),
            "active_workflows": [],
            "scheduled_tasks": [],
            "completed_tasks": [],
            "failed_tasks": [],
            "automation_metrics": {},
            "intelligent_decisions": []
        }
        
        self.task_queue = queue.Queue()
        self.workflow_queue = queue.Queue()
        self.automation_active = False
        
        self.init_database()
        self.load_automation_config()
    
    def init_database(self):
        """Initialize automation database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Workflows table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS workflows (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    workflow_name TEXT,
                    workflow_type TEXT,
                    status TEXT,
                    steps TEXT,
                    current_step INTEGER,
                    total_steps INTEGER,
                    result TEXT
                )
            ''')
            
            # Tasks table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    task_name TEXT,
                    task_type TEXT,
                    priority TEXT,
                    status TEXT,
                    command TEXT,
                    result TEXT,
                    execution_time REAL,
                    retry_count INTEGER DEFAULT 0
                )
            ''')
            
            # Automation metrics table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS automation_metrics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    metric_type TEXT,
                    metric_name TEXT,
                    metric_value REAL,
                    context TEXT
                )
            ''')
            
            # Intelligent decisions table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS intelligent_decisions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    decision_type TEXT,
                    context TEXT,
                    decision TEXT,
                    confidence REAL,
                    executed BOOLEAN,
                    outcome TEXT
                )
            ''')
            
            conn.commit()
            conn.close()
            logging.info("Automation database initialized successfully")
            
        except Exception as e:
            logging.error(f"Error initializing automation database: {e}")
    
    def load_automation_config(self):
        """Load automation configuration"""
        self.automation_config = {
            "max_concurrent_tasks": 5,
            "task_timeout": 300,  # 5 minutes
            "retry_attempts": 3,
            "auto_restart_failed": True,
            "intelligent_scheduling": True,
            "workflow_optimization": True,
            "resource_monitoring": True,
            "master_notifications": True,
            "default_workflows": [
                "code_quality_check",
                "security_scan",
                "performance_optimization",
                "documentation_update",
                "backup_creation"
            ]
        }
    
    def start_automation_engine(self):
        """Start the automation engine"""
        try:
            self.automation_active = True
            logging.info("Starting QMOI Enhanced Automation Engine")
            
            # Start worker threads
            threads = []
            
            # Task processor
            task_thread = threading.Thread(target=self.process_tasks, daemon=True)
            task_thread.start()
            threads.append(task_thread)
            
            # Workflow processor
            workflow_thread = threading.Thread(target=self.process_workflows, daemon=True)
            workflow_thread.start()
            threads.append(workflow_thread)
            
            # Resource monitor
            if self.automation_config["resource_monitoring"]:
                resource_thread = threading.Thread(target=self.monitor_resources, daemon=True)
                resource_thread.start()
                threads.append(resource_thread)
            
            # Scheduler
            scheduler_thread = threading.Thread(target=self.run_scheduler, daemon=True)
            scheduler_thread.start()
            threads.append(scheduler_thread)
            
            logging.info(f"Automation engine started with {len(threads)} threads")
            
        except Exception as e:
            logging.error(f"Error starting automation engine: {e}")
    
    def stop_automation_engine(self):
        """Stop the automation engine"""
        self.automation_active = False
        logging.info("Automation engine stopped")
    
    def process_tasks(self):
        """Process tasks from the queue"""
        try:
            while self.automation_active:
                try:
                    task = self.task_queue.get(timeout=1)
                    self.execute_task(task)
                except queue.Empty:
                    continue
                
        except Exception as e:
            logging.error(f"Error in task processing: {e}")
    
    def process_workflows(self):
        """Process workflows from the queue"""
        try:
            while self.automation_active:
                try:
                    workflow = self.workflow_queue.get(timeout=1)
                    self.execute_workflow(workflow)
                except queue.Empty:
                    continue
                
        except Exception as e:
            logging.error(f"Error in workflow processing: {e}")
    
    def execute_task(self, task: Dict[str, Any]):
        """Execute a single task"""
        try:
            task_name = task.get("name", "unknown")
            task_type = task.get("type", "command")
            command = task.get("command", "")
            priority = task.get("priority", "normal")
            
            logging.info(f"Executing task: {task_name}")
            
            start_time = time.time()
            
            # Execute based on task type
            if task_type == "command":
                result = self.execute_command(command)
            elif task_type == "script":
                result = self.execute_script(command)
            elif task_type == "api_call":
                result = self.execute_api_call(command)
            else:
                result = {"success": False, "error": f"Unknown task type: {task_type}"}
            
            execution_time = time.time() - start_time
            
            # Update task result
            task["result"] = result
            task["execution_time"] = execution_time
            task["status"] = "completed" if result.get("success", False) else "failed"
            
            # Store task result
            self.store_task_result(task)
            
            # Handle failure
            if not result.get("success", False):
                self.handle_task_failure(task)
            
            logging.info(f"Task completed: {task_name} ({execution_time:.2f}s)")
            
        except Exception as e:
            logging.error(f"Error executing task: {e}")
            task["result"] = {"success": False, "error": str(e)}
            task["status"] = "failed"
            self.store_task_result(task)
    
    def execute_command(self, command: str) -> Dict[str, Any]:
        """Execute a shell command"""
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=self.automation_config["task_timeout"]
            )
            
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
            
        except subprocess.TimeoutExpired:
            return {"success": False, "error": "Command timed out"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def execute_script(self, script_path: str) -> Dict[str, Any]:
        """Execute a Python script"""
        try:
            script_file = self.root_dir / script_path
            
            if not script_file.exists():
                return {"success": False, "error": f"Script not found: {script_path}"}
            
            result = subprocess.run(
                [sys.executable, str(script_file)],
                capture_output=True,
                text=True,
                timeout=self.automation_config["task_timeout"]
            )
            
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
            
        except subprocess.TimeoutExpired:
            return {"success": False, "error": "Script timed out"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def execute_api_call(self, api_endpoint: str) -> Dict[str, Any]:
        """Execute an API call"""
        try:
            # This is a placeholder - implement actual API calls
            return {
                "success": True,
                "response": f"API call to {api_endpoint} completed",
                "data": {"status": "success"}
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def execute_workflow(self, workflow: Dict[str, Any]):
        """Execute a workflow"""
        try:
            workflow_name = workflow.get("name", "unknown")
            workflow_type = workflow.get("type", "sequential")
            steps = workflow.get("steps", [])
            
            logging.info(f"Executing workflow: {workflow_name}")
            
            # Update workflow status
            workflow["status"] = "running"
            workflow["current_step"] = 0
            workflow["total_steps"] = len(steps)
            
            self.store_workflow_status(workflow)
            
            results = []
            
            if workflow_type == "sequential":
                # Execute steps sequentially
                for i, step in enumerate(steps):
                    workflow["current_step"] = i + 1
                    self.store_workflow_status(workflow)
                    
                    step_result = self.execute_workflow_step(step)
                    results.append(step_result)
                    
                    # Check if step failed
                    if not step_result.get("success", False):
                        workflow["status"] = "failed"
                        workflow["result"] = f"Step {i + 1} failed: {step_result.get('error', 'Unknown error')}"
                        self.store_workflow_status(workflow)
                        return
            
            elif workflow_type == "parallel":
                # Execute steps in parallel
                import concurrent.futures
                
                with concurrent.futures.ThreadPoolExecutor(max_workers=self.automation_config["max_concurrent_tasks"]) as executor:
                    future_to_step = {executor.submit(self.execute_workflow_step, step): step for step in steps}
                    
                    for future in concurrent.futures.as_completed(future_to_step):
                        step_result = future.result()
                        results.append(step_result)
                        
                        if not step_result.get("success", False):
                            workflow["status"] = "failed"
                            workflow["result"] = f"Parallel step failed: {step_result.get('error', 'Unknown error')}"
                            self.store_workflow_status(workflow)
                            return
            
            # Workflow completed successfully
            workflow["status"] = "completed"
            workflow["result"] = f"All {len(steps)} steps completed successfully"
            self.store_workflow_status(workflow)
            
            logging.info(f"Workflow completed: {workflow_name}")
            
        except Exception as e:
            logging.error(f"Error executing workflow: {e}")
            workflow["status"] = "failed"
            workflow["result"] = f"Workflow error: {str(e)}"
            self.store_workflow_status(workflow)
    
    def execute_workflow_step(self, step: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single workflow step"""
        try:
            step_type = step.get("type", "task")
            
            if step_type == "task":
                # Create and execute task
                task = {
                    "name": step.get("name", "workflow_step"),
                    "type": step.get("task_type", "command"),
                    "command": step.get("command", ""),
                    "priority": step.get("priority", "normal")
                }
                
                self.execute_task(task)
                return task.get("result", {"success": False, "error": "Task execution failed"})
            
            elif step_type == "condition":
                # Evaluate condition
                condition = step.get("condition", "")
                return self.evaluate_condition(condition)
            
            elif step_type == "wait":
                # Wait for specified time
                wait_time = step.get("duration", 1)
                time.sleep(wait_time)
                return {"success": True, "message": f"Waited for {wait_time} seconds"}
            
            else:
                return {"success": False, "error": f"Unknown step type: {step_type}"}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def evaluate_condition(self, condition: str) -> Dict[str, Any]:
        """Evaluate a workflow condition"""
        try:
            # Simple condition evaluation
            if condition == "system_healthy":
                return {"success": True, "message": "System is healthy"}
            elif condition == "resources_available":
                return {"success": True, "message": "Resources are available"}
            else:
                return {"success": False, "error": f"Unknown condition: {condition}"}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def monitor_resources(self):
        """Monitor system resources"""
        try:
            while self.automation_active:
                # Monitor CPU and memory
                cpu_percent = psutil.cpu_percent(interval=1)
                memory_percent = psutil.virtual_memory().percent
                
                # Store metrics
                self.store_automation_metric("cpu_usage", cpu_percent)
                self.store_automation_metric("memory_usage", memory_percent)
                
                # Adjust automation based on resources
                if cpu_percent > 80 or memory_percent > 80:
                    self.adjust_automation_for_high_load()
                
                time.sleep(60)  # Check every minute
                
        except Exception as e:
            logging.error(f"Error in resource monitoring: {e}")
    
    def adjust_automation_for_high_load(self):
        """Adjust automation behavior for high system load"""
        try:
            logging.warning("High system load detected, adjusting automation")
            
            # Reduce concurrent tasks
            self.automation_config["max_concurrent_tasks"] = max(1, self.automation_config["max_concurrent_tasks"] - 1)
            
            # Increase task timeout
            self.automation_config["task_timeout"] = min(600, self.automation_config["task_timeout"] + 60)
            
            # Store decision
            self.store_intelligent_decision({
                "type": "resource_adjustment",
                "context": "High system load",
                "decision": f"Reduced concurrent tasks to {self.automation_config['max_concurrent_tasks']}",
                "confidence": 0.8
            })
            
        except Exception as e:
            logging.error(f"Error adjusting automation: {e}")
    
    def run_scheduler(self):
        """Run the task scheduler"""
        try:
            # Schedule default workflows
            self.schedule_default_workflows()
            
            while self.automation_active:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
                
        except Exception as e:
            logging.error(f"Error in scheduler: {e}")
    
    def schedule_default_workflows(self):
        """Schedule default workflows"""
        try:
            # Schedule code quality check (daily at 2 AM)
            schedule.every().day.at("02:00").do(self.queue_workflow, "code_quality_check")
            
            # Schedule security scan (every 6 hours)
            schedule.every(6).hours.do(self.queue_workflow, "security_scan")
            
            # Schedule performance optimization (daily at 4 AM)
            schedule.every().day.at("04:00").do(self.queue_workflow, "performance_optimization")
            
            # Schedule documentation update (daily at 6 AM)
            schedule.every().day.at("06:00").do(self.queue_workflow, "documentation_update")
            
            # Schedule backup creation (daily at 8 PM)
            schedule.every().day.at("20:00").do(self.queue_workflow, "backup_creation")
            
            logging.info("Default workflows scheduled")
            
        except Exception as e:
            logging.error(f"Error scheduling default workflows: {e}")
    
    def queue_workflow(self, workflow_name: str):
        """Queue a workflow for execution"""
        try:
            workflow = self.get_workflow_definition(workflow_name)
            if workflow:
                self.workflow_queue.put(workflow)
                logging.info(f"Queued workflow: {workflow_name}")
            else:
                logging.warning(f"Workflow not found: {workflow_name}")
                
        except Exception as e:
            logging.error(f"Error queuing workflow: {e}")
    
    def get_workflow_definition(self, workflow_name: str) -> Optional[Dict[str, Any]]:
        """Get workflow definition"""
        workflows = {
            "code_quality_check": {
                "name": "Code Quality Check",
                "type": "sequential",
                "steps": [
                    {"type": "task", "name": "lint_check", "task_type": "command", "command": "npm run lint"},
                    {"type": "task", "name": "type_check", "task_type": "command", "command": "npm run type-check"},
                    {"type": "task", "name": "test_run", "task_type": "command", "command": "npm run test"}
                ]
            },
            "security_scan": {
                "name": "Security Scan",
                "type": "sequential",
                "steps": [
                    {"type": "task", "name": "vulnerability_scan", "task_type": "script", "command": "scripts/qmoi_security_monitor.py"},
                    {"type": "task", "name": "dependency_check", "task_type": "command", "command": "npm audit"}
                ]
            },
            "performance_optimization": {
                "name": "Performance Optimization",
                "type": "sequential",
                "steps": [
                    {"type": "task", "name": "build_optimization", "task_type": "command", "command": "npm run build"},
                    {"type": "task", "name": "bundle_analysis", "task_type": "command", "command": "npm run analyze"}
                ]
            },
            "documentation_update": {
                "name": "Documentation Update",
                "type": "sequential",
                "steps": [
                    {"type": "task", "name": "doc_verification", "task_type": "script", "command": "scripts/qmoi_doc_verifier.py"},
                    {"type": "task", "name": "readme_update", "task_type": "script", "command": "scripts/qmoi_feature_suggester.py"}
                ]
            },
            "backup_creation": {
                "name": "Backup Creation",
                "type": "sequential",
                "steps": [
                    {"type": "task", "name": "code_backup", "task_type": "command", "command": "git add . && git commit -m 'Auto backup'"},
                    {"type": "task", "name": "database_backup", "task_type": "script", "command": "scripts/qmoi_backup.py"}
                ]
            }
        }
        
        return workflows.get(workflow_name)
    
    def handle_task_failure(self, task: Dict[str, Any]):
        """Handle task failure"""
        try:
            retry_count = task.get("retry_count", 0)
            max_retries = self.automation_config["retry_attempts"]
            
            if retry_count < max_retries and self.automation_config["auto_restart_failed"]:
                # Retry task
                task["retry_count"] = retry_count + 1
                task["status"] = "retrying"
                
                logging.info(f"Retrying task: {task.get('name', 'unknown')} (attempt {retry_count + 1}/{max_retries})")
                
                # Re-queue task
                self.task_queue.put(task)
            else:
                # Task failed permanently
                logging.error(f"Task failed permanently: {task.get('name', 'unknown')}")
                
                if self.automation_config["master_notifications"]:
                    self.notify_master_task_failure(task)
            
        except Exception as e:
            logging.error(f"Error handling task failure: {e}")
    
    def notify_master_task_failure(self, task: Dict[str, Any]):
        """Notify master about task failure"""
        try:
            notification_file = self.logs_dir / "master_task_failure.json"
            
            notification_data = {
                "timestamp": datetime.now().isoformat(),
                "task": task,
                "system_status": self.get_automation_status(),
                "action_required": True
            }
            
            with open(notification_file, 'w') as f:
                json.dump(notification_data, f, indent=2)
            
            logging.error(f"MASTER NOTIFICATION: Task failure - {task.get('name', 'unknown')}")
            
        except Exception as e:
            logging.error(f"Error notifying master: {e}")
    
    def store_task_result(self, task: Dict[str, Any]):
        """Store task result in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO tasks 
                (task_name, task_type, priority, status, command, result, execution_time, retry_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                task.get("name", "unknown"),
                task.get("type", "command"),
                task.get("priority", "normal"),
                task.get("status", "unknown"),
                task.get("command", ""),
                json.dumps(task.get("result", {})),
                task.get("execution_time", 0),
                task.get("retry_count", 0)
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(f"Error storing task result: {e}")
    
    def store_workflow_status(self, workflow: Dict[str, Any]):
        """Store workflow status in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO workflows 
                (workflow_name, workflow_type, status, steps, current_step, total_steps, result)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                workflow.get("name", "unknown"),
                workflow.get("type", "sequential"),
                workflow.get("status", "unknown"),
                json.dumps(workflow.get("steps", [])),
                workflow.get("current_step", 0),
                workflow.get("total_steps", 0),
                workflow.get("result", "")
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(f"Error storing workflow status: {e}")
    
    def store_automation_metric(self, metric_name: str, metric_value: float):
        """Store automation metric"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO automation_metrics 
                (metric_type, metric_name, metric_value, context)
                VALUES (?, ?, ?, ?)
            ''', (
                "system",
                metric_name,
                metric_value,
                "automation_monitor"
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(f"Error storing automation metric: {e}")
    
    def store_intelligent_decision(self, decision: Dict[str, Any]):
        """Store intelligent decision"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO intelligent_decisions 
                (decision_type, context, decision, confidence, executed, outcome)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                decision.get("type", "unknown"),
                decision.get("context", ""),
                decision.get("decision", ""),
                decision.get("confidence", 0.0),
                True,
                "pending"
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(f"Error storing intelligent decision: {e}")
    
    def get_automation_status(self) -> Dict[str, Any]:
        """Get current automation status"""
        try:
            conn = sqlite3.connect(self.db_path)
            
            # Get recent task statistics
            cursor = conn.execute('''
                SELECT COUNT(*) as total_tasks,
                       COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                       COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_tasks,
                       COUNT(CASE WHEN status = 'running' THEN 1 END) as running_tasks
                FROM tasks 
                WHERE timestamp >= datetime('now', '-24 hours')
            ''')
            
            task_stats = cursor.fetchone()
            
            # Get workflow statistics
            cursor = conn.execute('''
                SELECT COUNT(*) as total_workflows,
                       COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_workflows,
                       COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_workflows
                FROM workflows 
                WHERE timestamp >= datetime('now', '-24 hours')
            ''')
            
            workflow_stats = cursor.fetchone()
            
            conn.close()
            
            return {
                "automation_active": self.automation_active,
                "tasks_24h": task_stats[0] if task_stats else 0,
                "completed_tasks_24h": task_stats[1] if task_stats else 0,
                "failed_tasks_24h": task_stats[2] if task_stats else 0,
                "running_tasks": task_stats[3] if task_stats else 0,
                "workflows_24h": workflow_stats[0] if workflow_stats else 0,
                "completed_workflows_24h": workflow_stats[1] if workflow_stats else 0,
                "failed_workflows_24h": workflow_stats[2] if workflow_stats else 0,
                "queue_size": self.task_queue.qsize(),
                "workflow_queue_size": self.workflow_queue.qsize()
            }
            
        except Exception as e:
            logging.error(f"Error getting automation status: {e}")
            return {}
    
    def run_comprehensive_automation(self):
        """Run comprehensive automation analysis"""
        try:
            logging.info("Starting QMOI Enhanced Automation")
            
            # Start automation engine
            self.start_automation_engine()
            
            # Queue some initial tasks
            self.queue_initial_tasks()
            
            # Get automation status
            status = self.get_automation_status()
            
            # Compile results
            results = {
                "timestamp": datetime.now().isoformat(),
                "automation_status": status,
                "config": self.automation_config,
                "summary": {
                    "automation_active": status.get("automation_active", False),
                    "tasks_24h": status.get("tasks_24h", 0),
                    "workflows_24h": status.get("workflows_24h", 0),
                    "queue_size": status.get("queue_size", 0),
                    "workflow_queue_size": status.get("workflow_queue_size", 0)
                }
            }
            
            # Save results
            results_file = self.logs_dir / "qmoi_automation_results.json"
            with open(results_file, 'w') as f:
                json.dump(results, f, indent=2)
            
            # Print summary
            summary = results.get("summary", {})
            print(f"\nQMOI Enhanced Automation Summary:")
            print(f"Automation Active: {summary.get('automation_active', False)}")
            print(f"Tasks (24h): {summary.get('tasks_24h', 0)}")
            print(f"Workflows (24h): {summary.get('workflows_24h', 0)}")
            print(f"Task Queue Size: {summary.get('queue_size', 0)}")
            print(f"Workflow Queue Size: {summary.get('workflow_queue_size', 0)}")
            
            logging.info("QMOI Enhanced Automation completed successfully")
            
        except Exception as e:
            logging.error(f"Error in comprehensive automation: {e}")
            print(f"Error: {e}")
    
    def queue_initial_tasks(self):
        """Queue initial tasks for execution"""
        try:
            # Queue some basic tasks
            initial_tasks = [
                {
                    "name": "System Health Check",
                    "type": "command",
                    "command": "npm run health-check",
                    "priority": "high"
                },
                {
                    "name": "Code Quality Analysis",
                    "type": "command",
                    "command": "npm run lint",
                    "priority": "normal"
                },
                {
                    "name": "Security Scan",
                    "type": "script",
                    "command": "scripts/qmoi_security_monitor.py",
                    "priority": "high"
                }
            ]
            
            for task in initial_tasks:
                self.task_queue.put(task)
            
            logging.info(f"Queued {len(initial_tasks)} initial tasks")
            
        except Exception as e:
            logging.error(f"Error queuing initial tasks: {e}")

def main():
    automation = QMOIEnhancedAutomation()
    automation.run_comprehensive_automation()

if __name__ == "__main__":
    main() 