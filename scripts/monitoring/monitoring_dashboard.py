#!/usr/bin/env python3
"""
QMOI Monitoring Dashboard
Real-time monitoring dashboard with interactive charts, status indicators, and alert management.
Provides comprehensive visualization of all QMOI monitoring systems.
"""

import os
import sys
import json
import time
import logging
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from flask import Flask, render_template, jsonify, request
import requests


class MonitoringDashboard:
    def __init__(self):
        self.logger = self.setup_logging()
        self.config = self.load_config()
        self.app = Flask(__name__)
        self.dashboard_data = {}
        self.alert_history = []
        self.performance_history = []

    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler("logs/monitoring_dashboard.log"),
                logging.StreamHandler(),
            ],
        )
        return logging.getLogger(__name__)

    def load_config(self) -> Dict[str, Any]:
        """Load dashboard configuration"""
        config = {
            "dashboard": {
                "port": 8080,
                "host": "0.0.0.0",
                "debug": False,
                "refresh_interval": 30,
            },
            "monitoring_endpoints": {
                "master": "http://localhost:8080/api/status",
                "system_health": "logs/system_health_latest.json",
                "performance": "logs/performance_latest.json",
                "security": "logs/security_latest.json",
                "revenue": "logs/revenue_latest.json",
                "employment": "logs/employment_latest.json",
                "cloud_resources": "logs/cloud_resources_latest.json",
                "api_endpoints": "logs/api_endpoints_latest.json",
                "backup": "logs/backup_latest.json",
                "notifications": "logs/notification_latest.json",
            },
            "charts": {
                "performance_history_hours": 24,
                "alert_history_hours": 48,
                "update_interval": 30,
            },
        }

        # Load from config file if exists
        config_file = "config/dashboard_config.json"
        if os.path.exists(config_file):
            try:
                with open(config_file, "r") as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                self.logger.error(f"Error loading config: {e}")

        return config

    def setup_routes(self):
        """Setup Flask routes"""

        @self.app.route("/")
        def dashboard():
            """Main dashboard page"""
            return self.render_dashboard()

        @self.app.route("/api/status")
        def api_status():
            """API status endpoint"""
            return jsonify(self.get_dashboard_data())

        @self.app.route("/api/components")
        def api_components():
            """Component status endpoint"""
            return jsonify(self.get_component_status())

        @self.app.route("/api/alerts")
        def api_alerts():
            """Alerts endpoint"""
            return jsonify(self.get_alerts())

        @self.app.route("/api/performance")
        def api_performance():
            """Performance data endpoint"""
            return jsonify(self.get_performance_data())

        @self.app.route("/api/health")
        def api_health():
            """Health check endpoint"""
            return jsonify(
                {"status": "healthy", "timestamp": datetime.now().isoformat()}
            )

        @self.app.route("/api/restart/<component>")
        def api_restart_component(component):
            """Restart component endpoint"""
            return jsonify(self.restart_component(component))

    def render_dashboard(self) -> str:
        """Render the main dashboard HTML"""
        dashboard_html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QMOI Monitoring Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        
        .header h1 {
            color: #2c3e50;
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-healthy { background-color: #27ae60; }
        .status-warning { background-color: #f39c12; }
        .status-critical { background-color: #e74c3c; }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding: 10px;
            background: rgba(52, 152, 219, 0.1);
            border-radius: 8px;
        }
        
        .metric-label {
            font-weight: 500;
            color: #34495e;
        }
        
        .metric-value {
            font-weight: bold;
            color: #2c3e50;
        }
        
        .chart-container {
            position: relative;
            height: 300px;
            margin-top: 15px;
        }
        
        .alert-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .alert-item {
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .alert-critical {
            background: rgba(231, 76, 60, 0.1);
            border-left-color: #e74c3c;
        }
        
        .alert-warning {
            background: rgba(243, 156, 18, 0.1);
            border-left-color: #f39c12;
        }
        
        .alert-info {
            background: rgba(52, 152, 219, 0.1);
            border-left-color: #3498db;
        }
        
        .refresh-button {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s ease;
        }
        
        .refresh-button:hover {
            background: #2980b9;
        }
        
        .timestamp {
            text-align: center;
            color: #7f8c8d;
            font-size: 0.9em;
            margin-top: 10px;
        }
        
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 QMOI Monitoring Dashboard</h1>
            <div style="text-align: center;">
                <span class="status-indicator" id="overall-status"></span>
                <span id="overall-status-text">Loading...</span>
                <button class="refresh-button" onclick="refreshData()">🔄 Refresh</button>
            </div>
        </div>
        
        <div class="grid">
            <!-- System Health -->
            <div class="card">
                <h3>🏥 System Health</h3>
                <div id="system-health-metrics"></div>
            </div>
            
            <!-- Performance -->
            <div class="card">
                <h3>⚡ Performance</h3>
                <div id="performance-metrics"></div>
                <div class="chart-container">
                    <canvas id="performance-chart"></canvas>
                </div>
            </div>
            
            <!-- Security -->
            <div class="card">
                <h3>🔒 Security</h3>
                <div id="security-metrics"></div>
            </div>
            
            <!-- Alerts -->
            <div class="card">
                <h3>🚨 Active Alerts</h3>
                <div id="alerts-list" class="alert-list"></div>
            </div>
            
            <!-- Revenue -->
            <div class="card">
                <h3>💰 Revenue</h3>
                <div id="revenue-metrics"></div>
            </div>
            
            <!-- Employment -->
            <div class="card">
                <h3>👥 Employment</h3>
                <div id="employment-metrics"></div>
            </div>
            
            <!-- Cloud Resources -->
            <div class="card">
                <h3>☁️ Cloud Resources</h3>
                <div id="cloud-metrics"></div>
            </div>
            
            <!-- API Endpoints -->
            <div class="card">
                <h3>🌐 API Endpoints</h3>
                <div id="api-metrics"></div>
            </div>
            
            <!-- Backup Status -->
            <div class="card">
                <h3>💾 Backup Status</h3>
                <div id="backup-metrics"></div>
            </div>
            
            <!-- Notifications -->
            <div class="card">
                <h3>📢 Notifications</h3>
                <div id="notification-metrics"></div>
            </div>
        </div>
        
        <div class="timestamp" id="last-updated">
            Last updated: Loading...
        </div>
    </div>
    
    <script>
        let performanceChart;
        
        function updateStatusIndicator(status) {
            const indicator = document.getElementById('overall-status');
            const text = document.getElementById('overall-status-text');
            
            indicator.className = 'status-indicator';
            if (status === 'healthy') {
                indicator.classList.add('status-healthy');
                text.textContent = 'System Healthy';
            } else if (status === 'warning') {
                indicator.classList.add('status-warning');
                text.textContent = 'System Warning';
            } else {
                indicator.classList.add('status-critical');
                text.textContent = 'System Critical';
            }
        }
        
        function updateMetrics(containerId, metrics) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            
            for (const [label, value] of Object.entries(metrics)) {
                const metricDiv = document.createElement('div');
                metricDiv.className = 'metric';
                metricDiv.innerHTML = `
                    <span class="metric-label">${label}</span>
                    <span class="metric-value">${value}</span>
                `;
                container.appendChild(metricDiv);
            }
        }
        
        function updateAlerts(alerts) {
            const container = document.getElementById('alerts-list');
            container.innerHTML = '';
            
            if (alerts.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #7f8c8d;">No active alerts</div>';
                return;
            }
            
            alerts.forEach(alert => {
                const alertDiv = document.createElement('div');
                alertDiv.className = `alert-item alert-${alert.severity || 'info'}`;
                alertDiv.innerHTML = `
                    <strong>${alert.service || 'System'}</strong><br>
                    ${alert.message}<br>
                    <small>${new Date(alert.timestamp).toLocaleString()}</small>
                `;
                container.appendChild(alertDiv);
            });
        }
        
        function updatePerformanceChart(data) {
            const ctx = document.getElementById('performance-chart').getContext('2d');
            
            if (performanceChart) {
                performanceChart.destroy();
            }
            
            performanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels || [],
                    datasets: [{
                        label: 'CPU Usage (%)',
                        data: data.cpu || [],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Memory Usage (%)',
                        data: data.memory || [],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
        
        async function refreshData() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                
                updateStatusIndicator(data.overall_status);
                
                if (data.system_health) {
                    updateMetrics('system-health-metrics', data.system_health);
                }
                
                if (data.performance) {
                    updateMetrics('performance-metrics', data.performance);
                }
                
                if (data.security) {
                    updateMetrics('security-metrics', data.security);
                }
                
                if (data.revenue) {
                    updateMetrics('revenue-metrics', data.revenue);
                }
                
                if (data.employment) {
                    updateMetrics('employment-metrics', data.employment);
                }
                
                if (data.cloud_resources) {
                    updateMetrics('cloud-metrics', data.cloud_resources);
                }
                
                if (data.api_endpoints) {
                    updateMetrics('api-metrics', data.api_endpoints);
                }
                
                if (data.backup) {
                    updateMetrics('backup-metrics', data.backup);
                }
                
                if (data.notifications) {
                    updateMetrics('notification-metrics', data.notifications);
                }
                
                if (data.alerts) {
                    updateAlerts(data.alerts);
                }
                
                if (data.performance_chart) {
                    updatePerformanceChart(data.performance_chart);
                }
                
                document.getElementById('last-updated').textContent = 
                    `Last updated: ${new Date().toLocaleString()}`;
                    
            } catch (error) {
                console.error('Error refreshing data:', error);
            }
        }
        
        // Auto-refresh every 30 seconds
        setInterval(refreshData, 30000);
        
        // Initial load
        refreshData();
    </script>
</body>
</html>
        """
        return dashboard_html

    def get_dashboard_data(self) -> Dict[str, Any]:
        """Get comprehensive dashboard data"""
        try:
            data = {
                "timestamp": datetime.now().isoformat(),
                "overall_status": "healthy",
                "system_health": {},
                "performance": {},
                "security": {},
                "revenue": {},
                "employment": {},
                "cloud_resources": {},
                "api_endpoints": {},
                "backup": {},
                "notifications": {},
                "alerts": [],
                "performance_chart": {"labels": [], "cpu": [], "memory": []},
            }

            # Load data from monitoring endpoints
            for endpoint_name, endpoint_path in self.config[
                "monitoring_endpoints"
            ].items():
                try:
                    if endpoint_path.startswith("http"):
                        # HTTP endpoint
                        response = requests.get(endpoint_path, timeout=5)
                        if response.status_code == 200:
                            endpoint_data = response.json()
                        else:
                            endpoint_data = {
                                "status": "error",
                                "message": f"HTTP {response.status_code}",
                            }
                    else:
                        # File endpoint
                        if os.path.exists(endpoint_path):
                            with open(endpoint_path, "r") as f:
                                endpoint_data = json.load(f)
                        else:
                            endpoint_data = {"status": "no_data"}

                    # Process endpoint data
                    if endpoint_name == "system_health":
                        data["system_health"] = self.extract_system_health_metrics(
                            endpoint_data
                        )
                    elif endpoint_name == "performance":
                        data["performance"] = self.extract_performance_metrics(
                            endpoint_data
                        )
                    elif endpoint_name == "security":
                        data["security"] = self.extract_security_metrics(endpoint_data)
                    elif endpoint_name == "revenue":
                        data["revenue"] = self.extract_revenue_metrics(endpoint_data)
                    elif endpoint_name == "employment":
                        data["employment"] = self.extract_employment_metrics(
                            endpoint_data
                        )
                    elif endpoint_name == "cloud_resources":
                        data["cloud_resources"] = self.extract_cloud_metrics(
                            endpoint_data
                        )
                    elif endpoint_name == "api_endpoints":
                        data["api_endpoints"] = self.extract_api_metrics(endpoint_data)
                    elif endpoint_name == "backup":
                        data["backup"] = self.extract_backup_metrics(endpoint_data)
                    elif endpoint_name == "notifications":
                        data["notifications"] = self.extract_notification_metrics(
                            endpoint_data
                        )

                except Exception as e:
                    self.logger.error(f"Error loading {endpoint_name} data: {e}")

            # Collect alerts from all sources
            data["alerts"] = self.collect_alerts()

            # Generate performance chart data
            data["performance_chart"] = self.generate_performance_chart_data()

            # Determine overall status
            data["overall_status"] = self.determine_overall_status(data)

            return data

        except Exception as e:
            self.logger.error(f"Error getting dashboard data: {e}")
            return {"error": str(e)}

    def extract_system_health_metrics(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Extract system health metrics"""
        try:
            metrics = {}

            if "system_metrics" in data:
                system = data["system_metrics"].get("system", {})
                metrics["CPU Usage"] = f"{system.get('cpu_percent', 0):.1f}%"
                metrics["Memory Usage"] = f"{system.get('memory_percent', 0):.1f}%"
                metrics["Disk Usage"] = f"{system.get('disk_percent', 0):.1f}%"

            if "overall_health" in data:
                metrics["Overall Status"] = data["overall_health"].title()

            return metrics

        except Exception as e:
            self.logger.error(f"Error extracting system health metrics: {e}")
            return {"Status": "Error"}

    def extract_performance_metrics(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Extract performance metrics"""
        try:
            metrics = {}

            if "summary" in data:
                summary = data["summary"]
                metrics["Avg Response Time"] = (
                    f"{summary.get('avg_response_time', 0):.2f}ms"
                )
                metrics["Throughput"] = f"{summary.get('throughput', 0):.0f} req/s"
                metrics["Error Rate"] = f"{summary.get('error_rate', 0):.2f}%"

            return metrics

        except Exception as e:
            self.logger.error(f"Error extracting performance metrics: {e}")
            return {"Status": "Error"}

    def extract_security_metrics(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Extract security metrics"""
        try:
            metrics = {}

            if "summary" in data:
                summary = data["summary"]
                metrics["Threats Detected"] = str(summary.get("threats_detected", 0))
                metrics["Security Score"] = f"{summary.get('security_score', 0):.0f}%"
                metrics["Last Scan"] = summary.get("last_scan", "Unknown")

            return metrics

        except Exception as e:
            self.logger.error(f"Error extracting security metrics: {e}")
            return {"Status": "Error"}

    def extract_revenue_metrics(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Extract revenue metrics"""
        try:
            metrics = {}

            if "summary" in data:
                summary = data["summary"]
                metrics["Total Revenue"] = f"${summary.get('total_revenue', 0):,.2f}"
                metrics["Monthly Growth"] = f"{summary.get('monthly_growth', 0):.1f}%"
                metrics["Active Sources"] = str(summary.get("active_sources", 0))

            return metrics

        except Exception as e:
            self.logger.error(f"Error extracting revenue metrics: {e}")
            return {"Status": "Error"}

    def extract_employment_metrics(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Extract employment metrics"""
        try:
            metrics = {}

            if "summary" in data:
                summary = data["summary"]
                metrics["Total Earnings"] = f"${summary.get('total_earnings', 0):,.2f}"
                metrics["Active Jobs"] = str(summary.get("active_jobs", 0))
                metrics["Success Rate"] = f"{summary.get('success_rate', 0):.1f}%"

            return metrics

        except Exception as e:
            self.logger.error(f"Error extracting employment metrics: {e}")
            return {"Status": "Error"}

    def extract_cloud_metrics(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Extract cloud resources metrics"""
        try:
            metrics = {}

            if "summary" in data:
                summary = data["summary"]
                metrics["Total Cost"] = f"${summary.get('total_cost_usd', 0):,.2f}"
                metrics["Instances"] = str(summary.get("total_instances", 0))
                metrics["Storage Used"] = f"{summary.get('total_storage_gb', 0):.1f} GB"

            return metrics

        except Exception as e:
            self.logger.error(f"Error extracting cloud metrics: {e}")
            return {"Status": "Error"}

    def extract_api_metrics(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Extract API endpoints metrics"""
        try:
            metrics = {}

            if "summary" in data:
                summary = data["summary"]
                metrics["Availability"] = (
                    f"{summary.get('overall_availability', 0):.1f}%"
                )
                metrics["Avg Response"] = (
                    f"{summary.get('overall_avg_response_time', 0):.2f}ms"
                )
                metrics["Error Rate"] = f"{summary.get('overall_error_rate', 0):.2f}%"

            return metrics

        except Exception as e:
            self.logger.error(f"Error extracting API metrics: {e}")
            return {"Status": "Error"}

    def extract_backup_metrics(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Extract backup metrics"""
        try:
            metrics = {}

            if "summary" in data:
                summary = data["summary"]
                metrics["Last Backup"] = summary.get("last_backup", "Unknown")
                metrics["Backup Size"] = summary.get("total_size", "Unknown")
                metrics["Success Rate"] = f"{summary.get('success_rate', 0):.1f}%"

            return metrics

        except Exception as e:
            self.logger.error(f"Error extracting backup metrics: {e}")
            return {"Status": "Error"}

    def extract_notification_metrics(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Extract notification metrics"""
        try:
            metrics = {}

            if "summary" in data:
                summary = data["summary"]
                metrics["Total Sent"] = str(summary.get("total_notifications", 0))
                metrics["Success Rate"] = f"{summary.get('success_rate', 0):.1f}%"
                metrics["Active Alerts"] = str(summary.get("alerts_count", 0))

            return metrics

        except Exception as e:
            self.logger.error(f"Error extracting notification metrics: {e}")
            return {"Status": "Error"}

    def collect_alerts(self) -> List[Dict[str, Any]]:
        """Collect alerts from all monitoring sources"""
        try:
            alerts = []

            # Check all monitoring reports for alerts
            for endpoint_name, endpoint_path in self.config[
                "monitoring_endpoints"
            ].items():
                try:
                    if os.path.exists(endpoint_path):
                        with open(endpoint_path, "r") as f:
                            data = json.load(f)

                        if "alerts" in data:
                            for alert in data["alerts"]:
                                alerts.append(
                                    {
                                        "service": endpoint_name.replace(
                                            "_", " "
                                        ).title(),
                                        "severity": alert.get("severity", "info"),
                                        "message": alert.get(
                                            "message", "Unknown alert"
                                        ),
                                        "timestamp": alert.get(
                                            "timestamp", datetime.now().isoformat()
                                        ),
                                    }
                                )

                except Exception as e:
                    self.logger.error(
                        f"Error collecting alerts from {endpoint_name}: {e}"
                    )

            # Sort by timestamp (newest first)
            alerts.sort(key=lambda x: x["timestamp"], reverse=True)

            return alerts[:20]  # Return last 20 alerts

        except Exception as e:
            self.logger.error(f"Error collecting alerts: {e}")
            return []

    def generate_performance_chart_data(self) -> Dict[str, Any]:
        """Generate performance chart data"""
        try:
            # This would typically load historical performance data
            # For now, generate sample data
            now = datetime.now()
            labels = []
            cpu_data = []
            memory_data = []

            for i in range(24):
                time_point = now - timedelta(hours=23 - i)
                labels.append(time_point.strftime("%H:%M"))
                cpu_data.append(30 + (i * 2) % 40)  # Sample CPU data
                memory_data.append(50 + (i * 3) % 30)  # Sample memory data

            return {"labels": labels, "cpu": cpu_data, "memory": memory_data}

        except Exception as e:
            self.logger.error(f"Error generating performance chart data: {e}")
            return {"labels": [], "cpu": [], "memory": []}

    def determine_overall_status(self, data: Dict[str, Any]) -> str:
        """Determine overall system status"""
        try:
            # Check for critical alerts
            critical_alerts = [
                a for a in data.get("alerts", []) if a.get("severity") == "critical"
            ]
            if critical_alerts:
                return "critical"

            # Check for warning alerts
            warning_alerts = [
                a for a in data.get("alerts", []) if a.get("severity") == "warning"
            ]
            if warning_alerts:
                return "warning"

            return "healthy"

        except Exception as e:
            self.logger.error(f"Error determining overall status: {e}")
            return "unknown"

    def get_component_status(self) -> Dict[str, Any]:
        """Get component status"""
        try:
            status = {}

            for endpoint_name in self.config["monitoring_endpoints"]:
                endpoint_path = self.config["monitoring_endpoints"][endpoint_name]

                if os.path.exists(endpoint_path):
                    try:
                        with open(endpoint_path, "r") as f:
                            data = json.load(f)

                        status[endpoint_name] = {
                            "status": "active",
                            "last_update": data.get("timestamp", "unknown"),
                            "data_available": True,
                        }
                    except Exception:
                        status[endpoint_name] = {
                            "status": "error",
                            "last_update": "unknown",
                            "data_available": False,
                        }
                else:
                    status[endpoint_name] = {
                        "status": "inactive",
                        "last_update": "unknown",
                        "data_available": False,
                    }

            return status

        except Exception as e:
            self.logger.error(f"Error getting component status: {e}")
            return {}

    def get_alerts(self) -> List[Dict[str, Any]]:
        """Get current alerts"""
        return self.collect_alerts()

    def get_performance_data(self) -> Dict[str, Any]:
        """Get performance data"""
        return self.generate_performance_chart_data()

    def restart_component(self, component: str) -> Dict[str, Any]:
        """Restart a monitoring component"""
        try:
            # This would typically restart the actual monitoring service
            # For now, just return a success response
            return {
                "success": True,
                "message": f"Component {component} restart initiated",
                "timestamp": datetime.now().isoformat(),
            }

        except Exception as e:
            return {
                "success": False,
                "message": f"Error restarting component: {str(e)}",
                "timestamp": datetime.now().isoformat(),
            }

    def start_dashboard(self):
        """Start the monitoring dashboard"""
        try:
            self.logger.info("Starting QMOI Monitoring Dashboard")

            # Setup routes
            self.setup_routes()

            # Start dashboard server
            dashboard_config = self.config["dashboard"]
            self.app.run(
                host=dashboard_config["host"],
                port=dashboard_config["port"],
                debug=dashboard_config["debug"],
            )

        except Exception as e:
            self.logger.error(f"Error starting dashboard: {e}")

    def run(self):
        """Main dashboard loop"""
        try:
            self.logger.info("Starting QMOI Monitoring Dashboard")
            self.start_dashboard()

        except KeyboardInterrupt:
            self.logger.info("Dashboard stopped by user")
        except Exception as e:
            self.logger.error(f"Error in dashboard: {e}")


def main():
    """Main function"""
    dashboard = MonitoringDashboard()
    dashboard.run()


if __name__ == "__main__":
    main()
