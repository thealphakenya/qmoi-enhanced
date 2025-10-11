#!/usr/bin/env python3
"""
QMOI Intelligent Task Scheduler
Uses ML to optimize task execution order and resource allocation
"""

import asyncio
import json
import logging
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import threading
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class TaskProfile:
    """Profile of a task's execution characteristics"""
    name: str
    avg_execution_time: float
    success_rate: float
    resource_usage: Dict[str, float]
    priority: int
    dependencies: List[str]
    frequency: int
    last_execution: Optional[datetime] = None
    next_scheduled: Optional[datetime] = None

class IntelligentScheduler:
    """ML-powered intelligent task scheduler"""
    
    def __init__(self):
        self.task_profiles: Dict[str, TaskProfile] = {}
        self.ml_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.execution_history: List[Dict] = []
        self.is_trained = False
        self.scheduler_lock = threading.Lock()
        
    def add_task_profile(self, profile: TaskProfile):
        """Add a task profile to the scheduler"""
        with self.scheduler_lock:
            self.task_profiles[profile.name] = profile
            logger.info(f"Added task profile: {profile.name}")
    
    def record_execution(self, task_name: str, execution_time: float, 
                        success: bool, resources_used: Dict[str, float]):
        """Record task execution for ML training"""
        record = {
            'task_name': task_name,
            'execution_time': execution_time,
            'success': success,
            'timestamp': datetime.now().isoformat(),
            'resources_used': resources_used,
            'system_load': self.get_system_load()
        }
        
        with self.scheduler_lock:
            self.execution_history.append(record)
            
            # Update task profile
            if task_name in self.task_profiles:
                profile = self.task_profiles[task_name]
                profile.last_execution = datetime.now()
                
                # Update average execution time
                executions = [r for r in self.execution_history if r['task_name'] == task_name]
                if executions:
                    profile.avg_execution_time = np.mean([e['execution_time'] for e in executions])
                    profile.success_rate = np.mean([e['success'] for e in executions])
    
    def get_system_load(self) -> Dict[str, float]:
        """Get current system load metrics"""
        import psutil
        return {
            'cpu_percent': psutil.cpu_percent(),
            'memory_percent': psutil.virtual_memory().percent,
            'disk_percent': psutil.disk_usage('/').percent,
            'load_average': psutil.getloadavg()[0] if hasattr(psutil, 'getloadavg') else 0
        }
    
    def prepare_training_data(self) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare data for ML model training"""
        if len(self.execution_history) < 10:
            return np.array([]), np.array([])
        
        # Create features from execution history
        features = []
        targets = []
        
        for record in self.execution_history:
            # Feature engineering
            feature_vector = [
                record['execution_time'],
                float(record['success']),
                record['resources_used'].get('cpu_percent', 0),
                record['resources_used'].get('memory_percent', 0),
                record['system_load']['cpu_percent'],
                record['system_load']['memory_percent'],
                record['system_load']['disk_percent'],
                record['system_load']['load_average']
            ]
            
            features.append(feature_vector)
            targets.append(record['execution_time'])  # Predict execution time
        
        return np.array(features), np.array(targets)
    
    def train_model(self):
        """Train the ML model on execution history"""
        features, targets = self.prepare_training_data()
        
        if len(features) < 10:
            logger.warning("Insufficient data for training")
            return
        
        # Scale features
        features_scaled = self.scaler.fit_transform(features)
        
        # Train model
        self.ml_model.fit(features_scaled, targets)
        self.is_trained = True
        
        logger.info(f"Trained ML model on {len(features)} [PRODUCTION IMPLEMENTATION REQUIRED]s")
    
    def predict_execution_time(self, task_name: str, current_resources: Dict) -> float:
        """Predict execution time for a task"""
        if not self.is_trained or task_name not in self.task_profiles:
            return self.task_profiles.get(task_name, TaskProfile("", 0, 0, {}, 0, [], 0)).avg_execution_time
        
        profile = self.task_profiles[task_name]
        
        # Create feature vector for prediction
        feature_vector = [
            profile.avg_execution_time,
            profile.success_rate,
            profile.resource_usage.get('cpu_percent', 0),
            profile.resource_usage.get('memory_percent', 0),
            current_resources['cpu_percent'],
            current_resources['memory_percent'],
            current_resources['disk_percent'],
            current_resources['load_average']
        ]
        
        # Scale and predict
        feature_scaled = self.scaler.transform([feature_vector])
        predicted_time = self.ml_model.predict(feature_scaled)[0]
        
        return max(0, predicted_time)
    
    def optimize_task_order(self, pending_tasks: List[str], 
                          current_resources: Dict) -> List[str]:
        """Optimize task execution order using ML predictions"""
        if not pending_tasks:
            return []
        
        # Calculate priority scores for each task
        task_scores = []
        
        for task_name in pending_tasks:
            if task_name not in self.task_profiles:
                continue
                
            profile = self.task_profiles[task_name]
            
            # Predict execution time
            predicted_time = self.predict_execution_time(task_name, current_resources)
            
            # Calculate priority score
            priority_score = (
                profile.priority * 10 +  # Priority weight
                (1 / (predicted_time + 1)) * 5 +  # Faster tasks get higher score
                profile.success_rate * 3 +  # Higher success rate
                (1 / (profile.frequency + 1)) * 2  # Less frequent tasks
            )
            
            task_scores.append((task_name, priority_score, predicted_time))
        
        # Sort by priority score (descending)
        task_scores.sort(key=lambda x: x[1], reverse=True)
        
        return [task[0] for task in task_scores]
    
    def should_execute_task(self, task_name: str, current_resources: Dict) -> bool:
        """Determine if a task should execute based on current conditions"""
        if task_name not in self.task_profiles:
            return True
        
        profile = self.task_profiles[task_name]
        
        # Check resource availability
        required_cpu = profile.resource_usage.get('cpu_percent', 0)
        required_memory = profile.resource_usage.get('memory_percent', 0)
        
        available_cpu = 100 - current_resources['cpu_percent']
        available_memory = 100 - current_resources['memory_percent']
        
        if required_cpu > available_cpu or required_memory > available_memory:
            return False
        
        # Check if task is due for execution
        if profile.next_scheduled and datetime.now() < profile.next_scheduled:
            return False
        
        return True
    
    def update_schedule(self, task_name: str, interval_minutes: int):
        """Update task schedule"""
        if task_name in self.task_profiles:
            with self.scheduler_lock:
                self.task_profiles[task_name].next_scheduled = (
                    datetime.now() + timedelta(minutes=interval_minutes)
                )
    
    def get_task_recommendations(self) -> List[Dict]:
        """Get ML-based task recommendations"""
        if not self.is_trained:
            return []
        
        current_resources = self.get_system_load()
        recommendations = []
        
        for task_name, profile in self.task_profiles.items():
            predicted_time = self.predict_execution_time(task_name, current_resources)
            should_execute = self.should_execute_task(task_name, current_resources)
            
            recommendations.append({
                'task_name': task_name,
                'predicted_execution_time': predicted_time,
                'should_execute': should_execute,
                'priority_score': profile.priority,
                'success_rate': profile.success_rate,
                'last_execution': profile.last_execution.isoformat() if profile.last_execution else None
            })
        
        return sorted(recommendations, key=lambda x: x['priority_score'], reverse=True)
    
    def save_model(self, filepath: str):
        """Save the trained model"""
        if self.is_trained:
            model_data = {
                'model': self.ml_model,
                'scaler': self.scaler,
                'task_profiles': self.task_profiles,
                'execution_history': self.execution_history
            }
            joblib.dump(model_data, filepath)
            logger.info(f"Saved model to {filepath}")
    
    def load_model(self, filepath: str):
        """Load a trained model"""
        if Path(filepath).exists():
            model_data = joblib.load(filepath)
            self.ml_model = model_data['model']
            self.scaler = model_data['scaler']
            self.task_profiles = model_data['task_profiles']
            self.execution_history = model_data['execution_history']
            self.is_trained = True
            logger.info(f"Loaded model from {filepath}")

class TaskExecutor:
    """Execute tasks with intelligent scheduling"""
    
    def __init__(self):
        self.scheduler = IntelligentScheduler()
        self.running_tasks: Dict[str, asyncio.Task] = {}
        self.task_functions: Dict[str, callable] = {}
        
    def register_task(self, name: str, function: callable, profile: TaskProfile):
        """Register a task with the executor"""
        self.task_functions[name] = function
        self.scheduler.add_task_profile(profile)
        logger.info(f"Registered task: {name}")
    
    async def execute_task(self, task_name: str, *args, **kwargs):
        """Execute a task with monitoring"""
        if task_name not in self.task_functions:
            raise ValueError(f"Task {task_name} not registered")
        
        start_time = time.time()
        current_resources = self.scheduler.get_system_load()
        
        try:
            # Execute task
            if asyncio.iscoroutinefunction(self.task_functions[task_name]):
                result = await self.task_functions[task_name](*args, **kwargs)
            else:
                result = self.task_functions[task_name](*args, **kwargs)
            
            execution_time = time.time() - start_time
            
            # Record execution
            self.scheduler.record_execution(
                task_name, execution_time, True, current_resources
            )
            
            return result
            
        except Exception as e:
            execution_time = time.time() - start_time
            self.scheduler.record_execution(
                task_name, execution_time, False, current_resources
            )
            raise e
    
    async def run_optimized_schedule(self):
        """Run tasks with optimized scheduling"""
        while True:
            try:
                # Get current resources
                current_resources = self.scheduler.get_system_load()
                
                # Get pending tasks
                pending_tasks = [
                    name for name in self.task_functions.keys()
                    if self.scheduler.should_execute_task(name, current_resources)
                ]
                
                # Optimize task order
                optimized_order = self.scheduler.optimize_task_order(
                    pending_tasks, current_resources
                )
                
                # Execute tasks in optimized order
                for task_name in optimized_order[:3]:  # Limit concurrent tasks
                    if task_name not in self.running_tasks:
                        task = asyncio.create_task(self.execute_task(task_name))
                        self.running_tasks[task_name] = task
                        
                        # Clean up completed tasks
                        task.add_done_callback(
                            lambda t, name=task_name: self.running_tasks.pop(name, None)
                        )
                
                # Retrain model periodically
                if len(self.scheduler.execution_history) % 50 == 0:
                    self.scheduler.train_model()
                
                await asyncio.sleep(60)  # Check every minute
                
            except Exception as e:
                logger.error(f"Scheduler error: {str(e)}")
                await asyncio.sleep(300)

# Example usage
async def example_task_1():
    """Example task 1"""
    await asyncio.sleep(2)
    return "Task 1 completed"

async def example_task_2():
    """Example task 2"""
    await asyncio.sleep(1)
    return "Task 2 completed"

async def example_task_3():
    """Example task 3"""
    await asyncio.sleep(3)
    return "Task 3 completed"

def main():
    """Main function to [PRODUCTION IMPLEMENTATION REQUIRED]nstrate intelligent scheduling"""
    executor = TaskExecutor()
    
    # Register tasks with profiles
    executor.register_task(
        "task_1",
        example_task_1,
        TaskProfile(
            name="task_1",
            avg_execution_time=2.0,
            success_rate=0.95,
            resource_usage={'cpu_percent': 10, 'memory_percent': 5},
            priority=1,
            dependencies=[],
            frequency=10
        )
    )
    
    executor.register_task(
        "task_2",
        example_task_2,
        TaskProfile(
            name="task_2",
            avg_execution_time=1.0,
            success_rate=0.98,
            resource_usage={'cpu_percent': 5, 'memory_percent': 3},
            priority=2,
            dependencies=[],
            frequency=15
        )
    )
    
    executor.register_task(
        "task_3",
        example_task_3,
        TaskProfile(
            name="task_3",
            avg_execution_time=3.0,
            success_rate=0.90,
            resource_usage={'cpu_percent': 15, 'memory_percent': 8},
            priority=3,
            dependencies=[],
            frequency=5
        )
    )
    
    # Run optimized schedule
    asyncio.run(executor.run_optimized_schedule())

if __name__ == "__main__":
    main() 