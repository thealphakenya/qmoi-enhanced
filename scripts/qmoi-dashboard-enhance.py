#!/usr/bin/env python3
"""
QMOI QCity Enhanced Dashboard with GitLab CI/CD Automation
Real-time monitoring, automatic triggering, and comprehensive visualization
"""

import asyncio
import json
import logging
import os
import subprocess
import sys
import time
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
import webbrowser
import requests
from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
import schedule
import psutil
import git
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi-dashboard.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QMOIDashboardEnhance:
    def __init__(self):
        self.app = Flask(__name__)
        self.socketio = SocketIO(self.app, cors_allowed_origins="*")
        self.port = 3010
        self.running = False
        self.gitlab_ci_running = False
        self.automation_stats = {
            'gitlab_ci_triggers': 0,
            'successful_deployments': 0,
            'failed_deployments': 0,
            'automation_runs': 0,
            'last_trigger': None,
            'current_status': 'idle'
        }
        self.setup_routes()
        self.setup_socket_events()
        self.setup_file_watcher()
        
    def setup_routes(self):
        @self.app.route('/')
        def dashboard():
            return render_template('dashboard.html')
            
        @self.app.route('/api/stats')
        def get_stats():
            return jsonify(self.automation_stats)
            
        @self.app.route('/api/trigger-gitlab-ci', methods=['POST'])
        def trigger_gitlab_ci():
            try:
                self.trigger_gitlab_ci_automation()
                return jsonify({'status': 'success', 'message': 'GitLab CI triggered successfully'})
            except Exception as e:
                logger.error(f"Error triggering GitLab CI: {e}")
                return jsonify({'status': 'error', 'message': str(e)}), 500
                
        @self.app.route('/api/automation-status')
        def automation_status():
            return jsonify({
                'dashboard_running': self.running,
                'gitlab_ci_running': self.gitlab_ci_running,
                'stats': self.automation_stats
            })
            
    def setup_socket_events(self):
        @self.socketio.on('connect')
        def handle_connect():
            logger.info("Client connected to dashboard")
            emit('status_update', self.automation_stats)
            
        @self.socketio.on('request_update')
        def handle_update_request():
            emit('status_update', self.automation_stats)
            
    def setup_file_watcher(self):
        """Setup file system watcher for automatic triggers"""
        class QMOIFileHandler(FileSystemEventHandler):
            def __init__(self, dashboard):
                self.dashboard = dashboard
                
            def on_modified(self, event):
                if not event.is_directory:
                    if event.src_path.endswith(('.py', '.js', '.ts', '.tsx')):
                        logger.info(f"File modified: {event.src_path}")
                        self.dashboard.auto_trigger_gitlab_ci()
                        
        self.file_handler = QMOIFileHandler(self)
        self.observer = Observer()
        self.observer.schedule(self.file_handler, '.', recursive=True)
        self.observer.start()
        
    def auto_trigger_gitlab_ci(self):
        """Automatically trigger GitLab CI when files change"""
        try:
            logger.info("Auto-triggering GitLab CI due to file changes")
            self.trigger_gitlab_ci_automation()
        except Exception as e:
            logger.error(f"Error in auto-trigger: {e}")
            
    def trigger_gitlab_ci_automation(self):
        """Trigger comprehensive GitLab CI/CD automation"""
        try:
            self.gitlab_ci_running = True
            self.automation_stats['current_status'] = 'running'
            self.automation_stats['gitlab_ci_triggers'] += 1
            self.automation_stats['last_trigger'] = datetime.now().isoformat()
            
            logger.info("Starting GitLab CI/CD automation")
            
            # Run comprehensive automation
            self.run_comprehensive_automation()
            
            # Update stats
            self.automation_stats['automation_runs'] += 1
            self.automation_stats['current_status'] = 'completed'
            
            # Emit real-time updates
            self.socketio.emit('automation_update', self.automation_stats)
            
            logger.info("GitLab CI/CD automation completed successfully")
            
        except Exception as e:
            logger.error(f"Error in GitLab CI automation: {e}")
            self.automation_stats['current_status'] = 'failed'
            self.automation_stats['failed_deployments'] += 1
            self.socketio.emit('automation_error', {'error': str(e)})
        finally:
            self.gitlab_ci_running = False
            
    def run_comprehensive_automation(self):
        """Run comprehensive QMOI automation"""
        automation_steps = [
            ('npm run qmoi:setup', 'Setup and dependencies'),
            ('npm run qmoi:test', 'Running tests'),
            ('npm run qmoi:build', 'Building project'),
            ('npm run gitlab:push', 'Pushing to GitLab'),
            ('npm run gitlab:deploy', 'Deploying to GitLab'),
            ('npm run qmoi:health', 'Health checks'),
            ('npm run qmoi:notify', 'Sending notifications')
        ]
        
        for command, description in automation_steps:
            try:
                logger.info(f"Running: {description}")
                result = subprocess.run(command, shell=True, capture_output=True, text=True)
                
                if result.returncode == 0:
                    logger.info(f"✅ {description} completed successfully")
                    self.automation_stats['successful_deployments'] += 1
                else:
                    logger.error(f"❌ {description} failed: {result.stderr}")
                    self.automation_stats['failed_deployments'] += 1
                    
                # Emit progress update
                self.socketio.emit('automation_progress', {
                    'step': description,
                    'status': 'success' if result.returncode == 0 else 'failed',
                    'output': result.stdout if result.returncode == 0 else result.stderr
                })
                
            except Exception as e:
                logger.error(f"Error running {description}: {e}")
                self.automation_stats['failed_deployments'] += 1
                
    def start_scheduled_tasks(self):
        """Start scheduled automation tasks"""
        # Run automation every 30 minutes
        schedule.every(30).minutes.do(self.trigger_gitlab_ci_automation)
        
        # Health check every 5 minutes
        schedule.every(5).minutes.do(self.run_health_check)
        
        # Auto-evolution every hour
        schedule.every().hour.do(self.run_auto_evolution)
        
        def run_scheduler():
            while self.running:
                schedule.run_pending()
                time.sleep(1)
                
        scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
        scheduler_thread.start()
        
    def run_health_check(self):
        """Run comprehensive health check"""
        try:
            logger.info("Running health check")
            result = subprocess.run('npm run qmoi:health', shell=True, capture_output=True, text=True)
            
            health_status = {
                'timestamp': datetime.now().isoformat(),
                'status': 'healthy' if result.returncode == 0 else 'unhealthy',
                'output': result.stdout
            }
            
            self.socketio.emit('health_update', health_status)
            
        except Exception as e:
            logger.error(f"Error in health check: {e}")
            
    def run_auto_evolution(self):
        """Run auto-evolution for continuous improvement"""
        try:
            logger.info("Running auto-evolution")
            result = subprocess.run('python scripts/qmoi-auto-evolution.py', shell=True, capture_output=True, text=True)
            
            evolution_status = {
                'timestamp': datetime.now().isoformat(),
                'status': 'completed' if result.returncode == 0 else 'failed',
                'suggestions': result.stdout
            }
            
            self.socketio.emit('evolution_update', evolution_status)
            
        except Exception as e:
            logger.error(f"Error in auto-evolution: {e}")
            
    def start(self):
        """Start the enhanced dashboard"""
        try:
            # Create logs directory
            os.makedirs('logs', exist_ok=True)
            
            # Create templates directory
            os.makedirs('templates', exist_ok=True)
            
            # Create dashboard template
            self.create_dashboard_template()
            
            # Start scheduled tasks
            self.start_scheduled_tasks()
            
            # Start the Flask app
            self.running = True
            logger.info(f"Dashboard server started on http://localhost:{self.port}")
            
            # Open dashboard in browser
            webbrowser.open(f'http://localhost:{self.port}')
            
            # Run the server
            self.socketio.run(self.app, host='0.0.0.0', port=self.port, debug=False)
            
        except Exception as e:
            logger.error(f"Error starting dashboard: {e}")
            sys.exit(1)
            
    def create_dashboard_template(self):
        """Create the dashboard HTML template"""
        template_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QMOI QCity Enhanced Dashboard</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-running { background-color: #ffd700; }
        .status-success { background-color: #00ff00; }
        .status-failed { background-color: #ff0000; }
        .status-idle { background-color: #888; }
        .controls {
            text-align: center;
            margin-bottom: 30px;
        }
        .btn {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            margin: 0 10px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        .logs {
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            border-radius: 10px;
            max-height: 400px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
        .log-entry {
            margin-bottom: 5px;
            padding: 5px;
            border-radius: 3px;
        }
        .log-info { background: rgba(0, 255, 0, 0.1); }
        .log-error { background: rgba(255, 0, 0, 0.1); }
        .log-warning { background: rgba(255, 255, 0, 0.1); }
        .chart-container {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 QMOI QCity Enhanced Dashboard</h1>
            <p>Real-time monitoring and GitLab CI/CD automation</p>
        </div>
        
        <div class="controls">
            <button class="btn" onclick="triggerGitLabCI()">Trigger GitLab CI</button>
            <button class="btn" onclick="runHealthCheck()">Health Check</button>
            <button class="btn" onclick="runAutoEvolution()">Auto Evolution</button>
            <button class="btn" onclick="clearLogs()">Clear Logs</button>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>GitLab CI Triggers</h3>
                <p id="gitlab-triggers">0</p>
            </div>
            <div class="stat-card">
                <h3>Successful Deployments</h3>
                <p id="successful-deployments">0</p>
            </div>
            <div class="stat-card">
                <h3>Failed Deployments</h3>
                <p id="failed-deployments">0</p>
            </div>
            <div class="stat-card">
                <h3>Automation Runs</h3>
                <p id="automation-runs">0</p>
            </div>
            <div class="stat-card">
                <h3>Current Status</h3>
                <p><span id="status-indicator" class="status-indicator status-idle"></span><span id="current-status">Idle</span></p>
            </div>
            <div class="stat-card">
                <h3>Last Trigger</h3>
                <p id="last-trigger">Never</p>
            </div>
        </div>
        
        <div class="chart-container">
            <canvas id="automationChart"></canvas>
        </div>
        
        <div class="logs" id="logs">
            <h3>Real-time Logs</h3>
            <div id="log-entries"></div>
        </div>
    </div>
    
    <script>
        const socket = io();
        let automationChart;
        
        // Initialize chart
        function initChart() {
            const ctx = document.getElementById('automationChart').getContext('2d');
            automationChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Successful Deployments',
                        data: [],
                        borderColor: '#00ff00',
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Failed Deployments',
                        data: [],
                        borderColor: '#ff0000',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Automation Performance Over Time',
                            color: 'white'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: 'white' }
                        },
                        x: {
                            ticks: { color: 'white' }
                        }
                    }
                }
            });
        }
        
        // Update stats
        function updateStats(stats) {
            document.getElementById('gitlab-triggers').textContent = stats.gitlab_ci_triggers || 0;
            document.getElementById('successful-deployments').textContent = stats.successful_deployments || 0;
            document.getElementById('failed-deployments').textContent = stats.failed_deployments || 0;
            document.getElementById('automation-runs').textContent = stats.automation_runs || 0;
            document.getElementById('current-status').textContent = stats.current_status || 'Idle';
            document.getElementById('last-trigger').textContent = stats.last_trigger || 'Never';
            
            // Update status indicator
            const indicator = document.getElementById('status-indicator');
            indicator.className = 'status-indicator status-' + (stats.current_status || 'idle');
            
            // Update chart
            updateChart(stats);
        }
        
        // Update chart
        function updateChart(stats) {
            if (!automationChart) return;
            
            const now = new Date().toLocaleTimeString();
            automationChart.data.labels.push(now);
            automationChart.data.datasets[0].data.push(stats.successful_deployments || 0);
            automationChart.data.datasets[1].data.push(stats.failed_deployments || 0);
            
            // Keep only last 20 data points
            if (automationChart.data.labels.length > 20) {
                automationChart.data.labels.shift();
                automationChart.data.datasets[0].data.shift();
                automationChart.data.datasets[1].data.shift();
            }
            
            automationChart.update();
        }
        
        // Add log entry
        function addLogEntry(message, type = 'info') {
            const logContainer = document.getElementById('log-entries');
            const entry = document.createElement('div');
            entry.className = `log-entry log-${type}`;
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logContainer.appendChild(entry);
            
            // Auto-scroll to bottom
            logContainer.scrollTop = logContainer.scrollHeight;
            
            // Keep only last 100 entries
            while (logContainer.children.length > 100) {
                logContainer.removeChild(logContainer.firstChild);
            }
        }
        
        // Socket events
        socket.on('connect', () => {
            addLogEntry('Connected to dashboard server', 'info');
        });
        
        socket.on('status_update', (stats) => {
            updateStats(stats);
        });
        
        socket.on('automation_update', (stats) => {
            updateStats(stats);
            addLogEntry('Automation completed successfully', 'info');
        });
        
        socket.on('automation_error', (error) => {
            addLogEntry(`Automation error: ${error.error}`, 'error');
        });
        
        socket.on('automation_progress', (progress) => {
            addLogEntry(`${progress.step}: ${progress.status}`, progress.status === 'success' ? 'info' : 'error');
        });
        
        socket.on('health_update', (health) => {
            addLogEntry(`Health check: ${health.status}`, health.status === 'healthy' ? 'info' : 'error');
        });
        
        socket.on('evolution_update', (evolution) => {
            addLogEntry(`Auto-evolution: ${evolution.status}`, evolution.status === 'completed' ? 'info' : 'error');
        });
        
        // Control functions
        function triggerGitLabCI() {
            fetch('/api/trigger-gitlab-ci', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    addLogEntry(`GitLab CI trigger: ${data.message}`, data.status === 'success' ? 'info' : 'error');
                })
                .catch(error => {
                    addLogEntry(`Error triggering GitLab CI: ${error}`, 'error');
                });
        }
        
        function runHealthCheck() {
            addLogEntry('Manual health check triggered', 'info');
            socket.emit('request_update');
        }
        
        function runAutoEvolution() {
            addLogEntry('Manual auto-evolution triggered', 'info');
            socket.emit('request_update');
        }
        
        function clearLogs() {
            document.getElementById('log-entries').innerHTML = '';
            addLogEntry('Logs cleared', 'info');
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            initChart();
            addLogEntry('Dashboard initialized', 'info');
            socket.emit('request_update');
        });
    </script>
</body>
</html>
        """
        
        with open('templates/dashboard.html', 'w') as f:
            f.write(template_content)
            
        logger.info("Dashboard template created successfully")

def main():
    """Main function to start the enhanced dashboard"""
    try:
        dashboard = QMOIDashboardEnhance()
        dashboard.start()
    except KeyboardInterrupt:
        logger.info("Dashboard stopped by user")
    except Exception as e:
        logger.error(f"Error in main: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 