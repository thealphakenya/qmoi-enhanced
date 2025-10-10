#!/usr/bin/env python3
"""
QMOI Cloud Services Startup Script
"""
import subprocess
import sys
import os

def start_cloud_services():
    """Start all cloud services"""
    services = [
        "qmoi_cloud_monitor",
        "qmoi_cloud_sync",
        "qmoi_cloud_optimizer"
    ]
    
    for service in services:
        subprocess.Popen([sys.executable, f"scripts/{service}.py"])

if __name__ == "__main__":
    start_cloud_services()
