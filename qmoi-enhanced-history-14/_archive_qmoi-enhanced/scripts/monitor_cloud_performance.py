#!/usr/bin/env python3
"""
QMOI Cloud Performance Monitor
"""
import time
import psutil
import requests

def monitor_cloud_performance():
    """Monitor cloud performance"""
    while True:
        # Monitor system resources
        cpu_percent = psutil.cpu_percent()
        memory_percent = psutil.virtual_memory().percent
        
        # Send metrics to cloud
        metrics = {
            "cpu_usage": cpu_percent,
            "memory_usage": memory_percent,
            "timestamp": time.time()
        }
        
        # Log metrics
        print(f"CPU: {cpu_percent}%, Memory: {memory_percent}%")
        
        time.sleep(60)

if __name__ == "__main__":
    monitor_cloud_performance()
