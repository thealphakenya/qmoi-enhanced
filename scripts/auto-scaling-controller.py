#!/usr/bin/env python3
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
            
            lines = result.stdout.strip().split('\n')
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
