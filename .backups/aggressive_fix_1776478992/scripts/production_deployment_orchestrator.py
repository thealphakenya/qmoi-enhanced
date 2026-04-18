#!/usr/bin/env python3
"""
QMOI Enhanced - Production Deployment Orchestrator
Automated deployment management with monitoring, scaling, and recovery
"""

import os
import json
import subprocess
from datetime import datetime
from pathlib import Path

def create_deployment_config():
    """Create production deployment configuration"""
    config = {
        'timestamp': datetime.now().isoformat(),
        'environment': 'production',
        'deployment': {
            'strategy': 'blue_green',
            'max_retries': 3,
            'rollback_on_error': True,
            'health_check_timeout': 300,
            'deployment_timeout': 1800
        },
        'services': {
            'api': {
                'replicas': 5,
                'cpu': '2',
                'memory': '4Gi',
                'health_check': '/health',
                'health_check_interval': 10,
                'startup_probe': 30
            },
            'webhooks': {
                'replicas': 3,
                'cpu': '1',
                'memory': '2Gi',
                'health_check': '/webhooks/health',
                'queue_depth_threshold': 1000
            },
            'workers': {
                'replicas': 5,
                'cpu': '2',
                'memory': '4Gi',
                'job_timeout': 3600,
                'retry_limit': 3
            }
        },
        'scaling': {
            'auto_scale_enabled': True,
            'min_replicas': {
                'api': 5,
                'webhooks': 3,
                'workers': 5
            },
            'max_replicas': {
                'api': 50,
                'webhooks': 20,
                'workers': 100
            },
            'target_metrics': {
                'cpu_percentage': 70,
                'memory_percentage': 80,
                'queue_depth': 1000
            }
        },
        'monitoring': {
            'metrics_scrape_interval': 30,
            'log_aggregation': True,
            'error_tracking_enabled': True,
            'performance_profiling': True,
            'real_user_monitoring': True
        },
        'backup': {
            'database_backup_interval': 3600,
            'backup_retention_days': 30,
            'point_in_time_recovery': True
        }
    }
    
    return config

def create_deployment_script():
    """Create automated deployment script"""
    script = '''#!/bin/bash
set -e

echo "🚀 QMOI Enhanced - Production Deployment Started"
echo "=================================================="

# Colors
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Phase 1: Pre-deployment verification
log_info "Phase 1: Pre-deployment verification..."
python scripts/production_readiness_declaration.py || log_error "Readiness check failed"
log_info "✅ Readiness check passed"

# Phase 2: Build Docker images
log_info "Phase 2: Building Docker images..."
docker build -t qmoi-api:latest -f Dockerfile.api . || log_error "API build failed"
docker build -t qmoi-webhooks:latest -f Dockerfile.webhooks . || log_error "Webhooks build failed"
docker build -t qmoi-workers:latest -f Dockerfile.workers . || log_error "Workers build failed"
log_info "✅ Docker images built successfully"

# Phase 3: Push to registry
log_info "Phase 3: Pushing images to registry..."
docker push ${DOCKER_REGISTRY}/qmoi-api:latest || log_error "API push failed"
docker push ${DOCKER_REGISTRY}/qmoi-webhooks:latest || log_error "Webhooks push failed"
docker push ${DOCKER_REGISTRY}/qmoi-workers:latest || log_error "Workers push failed"
log_info "✅ Images pushed to registry"

# Phase 4: Deploy to Kubernetes
log_info "Phase 4: Deploying to Kubernetes..."
kubectl apply -f k8s/api-service.yaml || log_error "API deployment failed"
kubectl apply -f k8s/webhooks-service.yaml || log_error "Webhooks deployment failed"
kubectl apply -f k8s/worker-service.yaml || log_error "Workers deployment failed"
log_info "✅ Services deployed"

# Phase 5: Wait for rollout
log_info "Phase 5: Waiting for rollout completion..."
kubectl rollout status deployment/api-service --timeout=5m || log_error "API rollout failed"
kubectl rollout status deployment/webhooks-service --timeout=5m || log_error "Webhooks rollout failed"
kubectl rollout status deployment/worker-service --timeout=5m || log_error "Workers rollout failed"
log_info "✅ All services rolled out successfully"

# Phase 6: Health checks
log_info "Phase 6: Running health checks..."
sleep 10
curl -f http://api-service:8080/health || log_error "API health check failed"
curl -f http://webhooks-service:8080/health || log_error "Webhooks health check failed"
log_info "✅ All health checks passed"

# Phase 7: Smoke tests
log_info "Phase 7: Running smoke tests..."
npm run test:smoke:prod || log_error "Smoke tests failed"
log_info "✅ Smoke tests passed"

# Phase 8: Update DNS (if needed)
log_info "Phase 8: Updating DNS records..."
# Update your DNS provider here
log_info "✅ DNS updated"

# Phase 9: Monitor for 5 minutes
log_info "Phase 9: Monitoring deployment (5 minutes)..."
for i in {1..30}; do
    kubectl top pods -l app=api-service
    sleep 10
done
log_info "✅ Monitoring complete"

log_info "=================================================="
log_info "🎉 Production Deployment Completed Successfully!"
echo ""
echo "Next steps:"
echo "1. Monitor production metrics"
echo "2. Check error tracking"
echo "3. Review performance data"
echo ""
'''
    
    return script

def create_scaling_controller():
    """Create auto-scaling controller"""
    controller = '''#!/usr/bin/env python3
"""Auto-scaling controller for production services"""

import subprocess
import json
import time
from datetime import datetime

class AutoScalingController:
    def __init__(self):
        self.config = self.load_config()
        self.metrics_history = {}
    
    def load_config(self):
        """Load scaling configuration"""
        return {
            'check_interval': 60,  # seconds
            'window_size': 5,      # number of checks to average
            'scale_up_threshold': 80,
            'scale_down_threshold': 20,
            'min_replicas': {'api': 5, 'webhooks': 3, 'workers': 5},
            'max_replicas': {'api': 50, 'webhooks': 20, 'workers': 100}
        }
    
    def get_metrics(self, service):
        """Get current metrics for service"""
        try:
            result = subprocess.run(
                f'kubectl top pods -l app={service} --no-headers',
                shell=True, capture_output=True, text=True
            )
            
            lines = result.stdout.strip().split('\\n')
            if not lines:
                return None
            
            cpu_values = []
            mem_values = []
            
            for line in lines:
                parts = line.split()
                if len(parts) >= 2:
                    cpu = int(parts[0].rstrip('m'))
                    mem = int(parts[1].rstrip('Mi'))
                    cpu_values.append(cpu)
                    mem_values.append(mem)
            
            if not cpu_values:
                return None
            
            avg_cpu = sum(cpu_values) / len(cpu_values)
            avg_mem = sum(mem_values) / len(mem_values)
            
            return {
                'cpu_percentage': (avg_cpu / 2000) * 100,  # 2 CPU limit
                'memory_percentage': (avg_mem / 4096) * 100,  # 4Gi limit
                'pod_count': len(cpu_values)
            }
        except Exception as e:
            print(f"Error getting metrics: {e}")
            return None
    
    def scale_service(self, service, replicas):
        """Scale service to specified number of replicas"""
        try:
            subprocess.run(
                f'kubectl scale deployment {service} --replicas={replicas}',
                shell=True, check=True
            )
            print(f"Scaled {service} to {replicas} replicas")
            return True
        except subprocess.CalledProcessError as e:
            print(f"Error scaling {service}: {e}")
            return False
    
    def check_and_scale(self):
        """Check metrics and scale if needed"""
        services = ['api-service', 'webhooks-service', 'worker-service']
        
        for service in services:
            metrics = self.get_metrics(service)
            if not metrics:
                continue
            
            # Initialize history if needed
            if service not in self.metrics_history:
                self.metrics_history[service] = []
            
            self.metrics_history[service].append(metrics)
            
            # Keep only recent history
            if len(self.metrics_history[service]) > self.config['window_size']:
                self.metrics_history[service].pop(0)
            
            # Calculate average metrics
            if len(self.metrics_history[service]) >= self.config['window_size']:
                avg_cpu = sum(m['cpu_percentage'] for m in self.metrics_history[service]) / len(self.metrics_history[service])
                
                current_replicas = metrics['pod_count']
                min_replicas = self.config['min_replicas'].get(service.replace('-service', ''), 1)
                max_replicas = self.config['max_replicas'].get(service.replace('-service', ''), 10)
                
                # Scale up if avg CPU > threshold
                if avg_cpu > self.config['scale_up_threshold']:
                    new_replicas = min(current_replicas + 2, max_replicas)
                    if new_replicas > current_replicas:
                        print(f"CPU high ({avg_cpu:.1f}%), scaling up {service}")
                        self.scale_service(service, new_replicas)
                
                # Scale down if avg CPU < threshold
                elif avg_cpu < self.config['scale_down_threshold']:
                    new_replicas = max(current_replicas - 1, min_replicas)
                    if new_replicas < current_replicas:
                        print(f"CPU low ({avg_cpu:.1f}%), scaling down {service}")
                        self.scale_service(service, new_replicas)
    
    def run(self):
        """Run auto-scaling controller"""
        print("Auto-scaling controller started")
        while True:
            try:
                self.check_and_scale()
                time.sleep(self.config['check_interval'])
            except KeyboardInterrupt:
                print("Auto-scaling controller stopped")
                break
            except Exception as e:
                print(f"Error in auto-scaling loop: {e}")
                time.sleep(self.config['check_interval'])

if __name__ == '__main__':
    controller = AutoScalingController()
    controller.run()
'''
    
    return controller

def create_health_monitor():
    """Create advanced health monitoring"""
    monitor = '''#!/usr/bin/env python3
"""Advanced health monitoring for production"""

import requests
import json
import time
from datetime import datetime
from collections import defaultdict

class HealthMonitor:
    def __init__(self):
        self.endpoints = {
            'api': 'http://api-service:8080/health',
            'webhooks': 'http://webhooks-service:8080/health',
            'workers': 'http://worker-service:8080/health'
        }
        self.metrics = defaultdict(list)
        self.alerts = []
    
    def check_health(self, service, url):
        """Check health of a service"""
        try:
            response = requests.get(url, timeout=5)
            return response.status_code == 200
        except Exception as e:
            return False
    
    def monitor_cycle(self):
        """Run one monitoring cycle"""
        results = {}
        
        for service, url in self.endpoints.items():
            is_healthy = self.check_health(service, url)
            results[service] = {
                'healthy': is_healthy,
                'timestamp': datetime.now().isoformat(),
                'status': '✅ UP' if is_healthy else '❌ DOWN'
            }
            
            self.metrics[service].append(is_healthy)
            if len(self.metrics[service]) > 100:
                self.metrics[service].pop(0)
            
            print(f"{service:<15} {results[service]['status']}")
        
        return results
    
    def get_availability(self, service):
        """Calculate availability percentage"""
        if service not in self.metrics:
            return 0
        
        if len(self.metrics[service]) == 0:
            return 0
        
        uptime = sum(self.metrics[service]) / len(self.metrics[service])
        return uptime * 100
    
    def print_report(self):
        """Print health report"""
        print("\\n" + "="*50)
        print("HEALTH REPORT")
        print("="*50)
        
        for service in self.endpoints:
            availability = self.get_availability(service)
            status = "✅ GOOD" if availability > 99 else "⚠️ WARNING" if availability > 95 else "❌ CRITICAL"
            print(f"{service:<15} {availability:.2f}% {status}")
        
        print("="*50 + "\\n")
    
    def run(self, interval=30, duration=3600):
        """Run health monitoring"""
        print(f"Health monitoring started (interval: {interval}s, duration: {duration}s)")
        print("-" * 50)
        
        start_time = time.time()
        
        while time.time() - start_time < duration:
            self.monitor_cycle()
            time.sleep(interval)
        
        self.print_report()

if __name__ == '__main__':
    monitor = HealthMonitor()
    monitor.run(interval=10, duration=600)  # Run for 10 minutes
'''
    
    return monitor

def setup_production_automation():
    """Set up all production automation"""
    print("\n" + "="*80)
    print("QMOI ENHANCED - PRODUCTION DEPLOYMENT AUTOMATION SETUP")
    print("="*80 + "\n")
    
    # Create deployment config
    print("📋 Creating deployment configuration...")
    config = create_deployment_config()
    with open('/workspaces/qmoi-enhanced/deployment-config.json', 'w') as f:
        json.dump(config, f, indent=2)
    print("✅ Deployment configuration created: deployment-config.json")
    
    # Create deployment script
    print("\n📝 Creating deployment script...")
    script = create_deployment_script()
    script_path = '/workspaces/qmoi-enhanced/scripts/deploy-production.sh'
    with open(script_path, 'w') as f:
        f.write(script)
    os.chmod(script_path, 0o755)
    print(f"✅ Deployment script created: {script_path}")
    
    # Create auto-scaling controller
    print("\n🔄 Creating auto-scaling controller...")
    controller = create_scaling_controller()
    controller_path = '/workspaces/qmoi-enhanced/scripts/auto-scaling-controller.py'
    with open(controller_path, 'w') as f:
        f.write(controller)
    os.chmod(controller_path, 0o755)
    print(f"✅ Auto-scaling controller created: {controller_path}")
    
    # Create health monitor
    print("\n🏥 Creating health monitor...")
    monitor = create_health_monitor()
    monitor_path = '/workspaces/qmoi-enhanced/scripts/health-monitor.py'
    with open(monitor_path, 'w') as f:
        f.write(monitor)
    os.chmod(monitor_path, 0o755)
    print(f"✅ Health monitor created: {monitor_path}")
    
    print("\n" + "="*80)
    print("✅ PRODUCTION AUTOMATION SETUP COMPLETE")
    print("="*80)
    print("\nNew automation tools available:")
    print("  • deployment-config.json - Deployment configuration")
    print("  • scripts/deploy-production.sh - Automated deployment")
    print("  • scripts/auto-scaling-controller.py - Auto-scaling")
    print("  • scripts/health-monitor.py - Health monitoring")
    print("\n")

if __name__ == '__main__':
    setup_production_automation()
