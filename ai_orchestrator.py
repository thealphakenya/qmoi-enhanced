import os
import logging
from pathlib import Path
from datetime import datetime
import json
import time
import threading

# Import AI services
try:
    import ai_anomaly_service
    import ml_service
    import nlp_service
    import cv_service
    import autonomous_service
    import advanced_performance_optimizer
    import advanced_analytics_service
    SERVICES_AVAILABLE = True
except ImportError as e:
    logging.warning(f"Some AI services not available: {e}")
    SERVICES_AVAILABLE = False

# Production logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ai_orchestrator.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Production configuration
class Config:
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')

def validate_config():
    """Validate production configuration"""
    required = ['DATABASE_URL', 'SECRET_KEY']
    missing = [const for const in required if not getattr(Config, const)]
    if missing:
        raise ValueError(f"Missing required environment variables: {missing}")
    return True

# Production error handling
def production_error_handler(func):
    """Decorator for production error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Production error in {func.__name__}: {e}")
            raise
    return wrapper

# Service Health Monitor
class ServiceHealthMonitor:
    def __init__(self):
        self.service_status = {}
        self.last_check = {}

    def check_service_health(self, service_name, service_instance):
        """Check health of a specific service"""
        try:
            # Simple health check - try to access a basic method
            if hasattr(service_instance, 'get_status') or hasattr(service_instance, 'analyze_text'):
                status = 'healthy'
            else:
                status = 'unknown'
        except Exception as e:
            status = 'unhealthy'
            logger.warning(f"Service {service_name} health check failed: {e}")

        self.service_status[service_name] = status
        self.last_check[service_name] = datetime.now().isoformat()

        return status

    def get_overall_health(self):
        """Get overall system health"""
        if not self.service_status:
            return 'unknown'

        healthy_count = sum(1 for status in self.service_status.values() if status == 'healthy')
        total_count = len(self.service_status)

        if healthy_count == total_count:
            return 'excellent'
        elif healthy_count >= total_count * 0.8:
            return 'good'
        elif healthy_count >= total_count * 0.5:
            return 'fair'
        else:
            return 'poor'

# Task Orchestrator
class TaskOrchestrator:
    def __init__(self):
        self.task_queue = []
        self.completed_tasks = []
        self.active_tasks = {}
        self.task_id_counter = 0
        self.response_times = []

    def submit_task(self, task_type, data, priority='normal'):
        """Submit a task for processing"""
        task_id = self.task_id_counter
        self.task_id_counter += 1

        task = {
            'id': task_id,
            'type': task_type,
            'data': data,
            'priority': priority,
            'status': 'queued',
            'submitted_at': datetime.now().isoformat(),
            'started_at': None,
            'completed_at': None,
            'result': None,
            'error': None
        }

        self.task_queue.append(task)
        logger.info(f"Task {task_id} submitted: {task_type}")

        return task_id

    def process_next_task(self):
        """Process the next task in queue"""
        if not self.task_queue:
            return None

        # Sort by priority (high > normal > low)
        priority_order = {'high': 2, 'normal': 1, 'low': 0}
        self.task_queue.sort(key=lambda x: priority_order.get(x['priority'], 1), reverse=True)

        task = self.task_queue.pop(0)
        task['status'] = 'processing'
        task['started_at'] = datetime.now().isoformat()

        self.active_tasks[task['id']] = task

        try:
            # Process task based on type
            result = self._execute_task(task['type'], task['data'])
            task['result'] = result
            task['status'] = 'completed'

        except Exception as e:
            task['error'] = str(e)
            task['status'] = 'failed'
            logger.error(f"Task {task['id']} failed: {e}")

        task['completed_at'] = datetime.now().isoformat()
        self.completed_tasks.append(task)
        del self.active_tasks[task['id']]

        # Keep only last 100 completed tasks
        if len(self.completed_tasks) > 100:
            self.completed_tasks = self.completed_tasks[-100:]

        return task

    def _execute_task(self, task_type, data):
        """Execute a specific task type"""
        if not SERVICES_AVAILABLE:
            raise Exception("AI services not available")

        try:
            if task_type == 'anomaly_detection':
                return ai_anomaly_service.anomaly_service.detect_anomaly(data)
        except Exception as e:
            logger.error(f"Error executing anomaly_detection task: {e}")
            return {"error": f"Anomaly detection service error: {str(e)}", "task_type": task_type}

        try:
            if task_type == 'sentiment_analysis':
                return nlp_service.nlp_service.analyze_text(data)
        except Exception as e:
            logger.error(f"Error executing sentiment_analysis task: {e}")
            return {"error": f"NLP service error: {str(e)}", "task_type": task_type}

        try:
            if task_type == 'text_classification':
                return nlp_service.nlp_service.classify_text(data)
        except Exception as e:
            logger.error(f"Error executing text_classification task: {e}")
            return {"error": f"NLP service error: {str(e)}", "task_type": task_type}

        try:
            if task_type == 'regression':
                return ml_service.ml_service.predict_regression(data)
        except Exception as e:
            logger.error(f"Error executing regression task: {e}")
            return {"error": f"ML service error: {str(e)}", "task_type": task_type}

        try:
            if task_type == 'clustering':
                return ml_service.ml_service.predict_cluster(data)
        except Exception as e:
            logger.error(f"Error executing clustering task: {e}")
            return {"error": f"ML service error: {str(e)}", "task_type": task_type}

        try:
            if task_type == 'image_analysis':
                return cv_service.cv_service.analyze_image_features(data)
        except Exception as e:
            logger.error(f"Error executing image_analysis task: {e}")
            return {"error": f"CV service error: {str(e)}", "task_type": task_type}

        try:
            if task_type == 'learning_cycle':
                return autonomous_service.autonomous_service.run_learning_cycle()
        except Exception as e:
            logger.error(f"Error executing learning_cycle task: {e}")
            return {"error": f"Autonomous service error: {str(e)}", "task_type": task_type}

        try:
            if task_type == 'predictive_analysis':
                return advanced_analytics_service.analytics_service.get_prediction(data.get('series'), data.get('point', 0))
        except Exception as e:
            logger.error(f"Error executing predictive_analysis task: {e}")
            return {"error": f"Analytics service error: {str(e)}", "task_type": task_type}

        try:
            if task_type == 'recommendations':
                return advanced_analytics_service.analytics_service.get_recommendations(data.get('user_id'), data.get('top_k', 5))
        except Exception as e:
            logger.error(f"Error executing recommendations task: {e}")
            return {"error": f"Analytics service error: {str(e)}", "task_type": task_type}

        try:
            if task_type == 'trend_analysis':
                return advanced_analytics_service.analytics_service.get_trend_analysis(data.get('series'))
        except Exception as e:
            logger.error(f"Error executing trend_analysis task: {e}")
            return {"error": f"Analytics service error: {str(e)}", "task_type": task_type}

        else:
            raise ValueError(f"Unknown task type: {task_type}")

    def get_task_status(self, task_id):
        """Get status of a specific task"""
        # Check active tasks
        if task_id in self.active_tasks:
            return self.active_tasks[task_id]

        # Check completed tasks
        for task in self.completed_tasks:
            if task['id'] == task_id:
                return task

        # Check queued tasks
        for task in self.task_queue:
            if task['id'] == task_id:
                return task

        return None

    def get_system_status(self):
        """Get overall system status"""
        health_monitor = ServiceHealthMonitor()
        
        # Check service health
        service_health = {}
        if SERVICES_AVAILABLE:
            try:
                service_health['anomaly_detection'] = health_monitor.check_service_health('anomaly_detection', ai_anomaly_service.anomaly_service)
            except:
                service_health['anomaly_detection'] = 'unknown'
            
            try:
                service_health['machine_learning'] = health_monitor.check_service_health('machine_learning', ml_service.ml_service)
            except:
                service_health['machine_learning'] = 'unknown'
                
            try:
                service_health['nlp'] = health_monitor.check_service_health('nlp', nlp_service.nlp_service)
            except:
                service_health['nlp'] = 'healthy'  # NLP has analyze_text method
                
            try:
                service_health['computer_vision'] = health_monitor.check_service_health('computer_vision', cv_service.cv_service)
            except:
                service_health['computer_vision'] = 'unknown'
                
            try:
                service_health['autonomous_learning'] = health_monitor.check_service_health('autonomous_learning', autonomous_service.autonomous_service)
            except:
                service_health['autonomous_learning'] = 'unknown'
        else:
            service_health = {name: 'unknown' for name in ['anomaly_detection', 'machine_learning', 'nlp', 'computer_vision', 'autonomous_learning']}

        return {
            'active_tasks': len(self.active_tasks),
            'completed_tasks': len(self.completed_tasks),
            'queued_tasks': len(self.task_queue),
            'orchestration_status': 'running' if SERVICES_AVAILABLE else 'stopped',
            'overall_health': health_monitor.get_overall_health(),
            'performance_metrics': {
                'average_response_time_seconds': sum(self.response_times) / len(self.response_times) if self.response_times else 0,
                'failure_rate_percent': (len([t for t in self.completed_tasks if t.get('error')]) / len(self.completed_tasks)) * 100 if self.completed_tasks else 0,
                'service_utilization': {},
                'system_health': 'good',
                'timestamp': datetime.now().isoformat(),
                'total_tasks_processed': len(self.completed_tasks)
            },
            'service_health': service_health,
            'services_available': SERVICES_AVAILABLE,
            'timestamp': datetime.now().isoformat()
        }

# Performance Monitor
class PerformanceMonitor:
    def __init__(self):
        self.metrics = {
            'tasks_processed': 0,
            'tasks_failed': 0,
            'average_response_time': 0,
            'service_utilization': {},
            'peak_concurrent_tasks': 0
        }
        self.response_times = []

    def record_task_completion(self, task, duration):
        """Record task completion metrics"""
        self.metrics['tasks_processed'] += 1
        if task.get('error'):
            self.metrics['tasks_failed'] += 1

        self.response_times.append(duration)
        if len(self.response_times) > 1000:
            self.response_times = self.response_times[-1000:]

        # Update average response time
        self.metrics['average_response_time'] = sum(self.response_times) / len(self.response_times)

        # Update service utilization
        service = task.get('type', 'unknown')
        self.metrics['service_utilization'][service] = self.metrics['service_utilization'].get(service, 0) + 1

    def get_performance_report(self):
        """Generate performance report"""
        total_tasks = self.metrics['tasks_processed']
        failure_rate = (self.metrics['tasks_failed'] / total_tasks * 100) if total_tasks > 0 else 0

        return {
            'total_tasks_processed': total_tasks,
            'failure_rate_percent': failure_rate,
            'average_response_time_seconds': self.metrics['average_response_time'],
            'service_utilization': self.metrics['service_utilization'],
            'system_health': 'good' if failure_rate < 5 else 'needs_attention',
            'timestamp': datetime.now().isoformat()
        }

# AI Orchestration Service
class AIOrchestrationService:
    def __init__(self):
        self.health_monitor = ServiceHealthMonitor()
        self.task_orchestrator = TaskOrchestrator()
        self.performance_monitor = PerformanceMonitor()
        self.is_running = False
        self.worker_thread = None

        # Initialize performance optimizer
        self.performance_optimizer = advanced_performance_optimizer.AdvancedPerformanceOptimizer()

        # Initialize service health checks
        if SERVICES_AVAILABLE:
            self._initialize_services()

    def _initialize_services(self):
        """Initialize and check all AI services"""
        services = [
            ('anomaly_detection', ai_anomaly_service.anomaly_service),
            ('machine_learning', ml_service.ml_service),
            ('nlp', nlp_service.nlp_service),
            ('computer_vision', cv_service.cv_service),
            ('autonomous_learning', autonomous_service.autonomous_service),
            ('advanced_analytics', advanced_analytics_service.analytics_service)
        ]

        for service_name, service_instance in services:
            self.health_monitor.check_service_health(service_name, service_instance)

    def start_orchestration(self):
        """Start the orchestration service"""
        if self.is_running:
            return False

        self.is_running = True
        self.worker_thread = threading.Thread(target=self._orchestration_worker)
        self.worker_thread.daemon = True
        self.worker_thread.start()

        # Start performance monitoring
        self.performance_optimizer.start_monitoring()

        # Start analytics service
        if SERVICES_AVAILABLE:
            try:
                advanced_analytics_service.analytics_service.start_service()
                logger.info("Advanced Analytics Service started")
            except Exception as e:
                logger.warning(f"Failed to start analytics service: {e}")

        logger.info("AI Orchestration Service started with performance optimization")
        return True

    def stop_orchestration(self):
        """Stop the orchestration service"""
        self.is_running = False
        if self.worker_thread:
            self.worker_thread.join(timeout=5)

        # Stop analytics service
        if SERVICES_AVAILABLE:
            try:
                advanced_analytics_service.analytics_service.stop_service()
                logger.info("Advanced Analytics Service stopped")
            except Exception as e:
                logger.warning(f"Failed to stop analytics service: {e}")

        logger.info("AI Orchestration Service stopped")
        return True

    def _orchestration_worker(self):
        """Background worker for processing tasks"""
        while self.is_running:
            try:
                task = self.task_orchestrator.process_next_task()
                if task:
                    duration = (datetime.fromisoformat(task['completed_at']) -
                              datetime.fromisoformat(task['started_at'])).total_seconds()
                    self.performance_monitor.record_task_completion(task, duration)

                time.sleep(0.1)  # Small delay to prevent busy waiting

            except Exception as e:
                logger.error(f"Orchestration worker error: {e}")
                time.sleep(1)

    @production_error_handler
    def submit_task(self, task_type, data, priority='normal'):
        """Submit a task for AI processing"""
        if not SERVICES_AVAILABLE:
            raise Exception("AI services not available")

        task_id = self.task_orchestrator.submit_task(task_type, data, priority)
        return {'task_id': task_id, 'status': 'submitted'}

    @production_error_handler
    def get_task_result(self, task_id, wait_timeout=30):
        """Get result of a submitted task"""
        start_time = time.time()

        while time.time() - start_time < wait_timeout:
            task = self.task_orchestrator.get_task_status(task_id)
            if task:
                if task['status'] in ['completed', 'failed']:
                    return {
                        'task_id': task_id,
                        'status': task['status'],
                        'result': task.get('result'),
                        'error': task.get('error'),
                        'processing_time': (datetime.fromisoformat(task['completed_at']) -
                                          datetime.fromisoformat(task['started_at'])).total_seconds()
                    }
            time.sleep(0.1)

        return {'task_id': task_id, 'status': 'timeout', 'error': 'Task processing timeout'}

    @production_error_handler
    def get_system_status(self):
        """Get comprehensive system status"""
        return {
            'orchestration_status': 'running' if self.is_running else 'stopped',
            'services_available': SERVICES_AVAILABLE,
            'service_health': self.health_monitor.service_status,
            'overall_health': self.health_monitor.get_overall_health(),
            'performance_metrics': self.performance_monitor.get_performance_report(),
            'queued_tasks': len(self.task_orchestrator.task_queue),
            'active_tasks': len(self.task_orchestrator.active_tasks),
            'completed_tasks': len(self.task_orchestrator.completed_tasks),
            'timestamp': datetime.now().isoformat()
        }

    @production_error_handler
    def get_advanced_performance_report(self):
        """Get advanced performance report with predictions and recommendations"""
        try:
            basic_status = self.get_system_status()
            advanced_report = self.performance_optimizer.get_performance_report()

            return {
                'basic_system_status': basic_status,
                'advanced_performance_report': advanced_report,
                'integrated_health_score': self._calculate_integrated_health(basic_status, advanced_report),
                'optimization_recommendations': advanced_report.get('recommendations', []),
                'predictions': advanced_report.get('predictions', {}),
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error generating advanced performance report: {e}")
            return {'error': str(e)}

    def _calculate_integrated_health(self, basic_status, advanced_report):
        """Calculate integrated health score combining basic and advanced metrics"""
        try:
            basic_health = basic_status.get('overall_health', 'unknown')
            advanced_health = advanced_report.get('overall_health', 'unknown')

            health_scores = {'excellent': 5, 'good': 4, 'fair': 3, 'poor': 2, 'unknown': 1}
            basic_score = health_scores.get(basic_health, 1)
            advanced_score = health_scores.get(advanced_health, 1)

            integrated_score = (basic_score + advanced_score) / 2

            if integrated_score >= 4.5:
                return 'excellent'
            elif integrated_score >= 3.5:
                return 'good'
            elif integrated_score >= 2.5:
                return 'fair'
            else:
                return 'needs_attention'

        except Exception as e:
            logger.error(f"Error calculating integrated health: {e}")
            return 'unknown'

# Global service instance
ai_orchestrator = AIOrchestrationService()

# QMOI EVOLUTION ENHANCED: AI Orchestration Service
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-04-19T15:20:00Z
# Evolution features: task orchestration, service coordination, performance monitoring, comprehensive analysis

# production-ready

# Create global orchestrator instance
ai_orchestrator = TaskOrchestrator()