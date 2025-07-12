#!/usr/bin/env python3
"""
QMOI Dashboard Enhancer
Enhances dashboard and notification logic for Hugging Face and all platforms. Visualizes all actions and allows master control.
"""

import os
import json
import time
import threading
from datetime import datetime
from pathlib import Path
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi-dashboard-enhance.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QMOIDashboardEnhancer:
    def __init__(self):
        self.log_files = [
            'logs/qmoi-hf-sync.log',
            'logs/qmoi-hf-test.log',
            'logs/qmoi-platform-manager.log',
            'logs/qmoi-dev-actions.log',
            'logs/qmoi-enhanced-automation.log',
            'logs/real-time-stats.json',
            'logs/notification-stats.json'
        ]
        self.master_control_enabled = True
        self.dashboard_port = 3010

    def aggregate_logs(self):
        logs = []
        for log_file in self.log_files:
            if os.path.exists(log_file):
                with open(log_file, 'r') as f:
                    for line in f:
                        try:
                            logs.append(json.loads(line))
                        except:
                            continue
        logs.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        return logs

    def serve_dashboard(self):
        class DashboardHandler(BaseHTTPRequestHandler):
            def do_GET(self):
                parsed_path = urllib.parse.urlparse(self.path)
                if parsed_path.path == '/':
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    html = self.generate_dashboard_html()
                    self.wfile.write(html.encode())
                elif parsed_path.path == '/api/logs':
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    logs = self.server.dashboard.aggregate_logs()
                    self.wfile.write(json.dumps(logs, indent=2).encode())
                else:
                    self.send_response(404)
                    self.end_headers()

            def generate_dashboard_html(self):
                return f"""
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>QMOI Enhanced Dashboard</title>
    <style>
        body {{ font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }}
        .header {{ background: #222; color: #fff; padding: 20px; text-align: center; }}
        .container {{ max-width: 1200px; margin: 30px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #ccc; padding: 20px; }}
        .log-table {{ width: 100%; border-collapse: collapse; }}
        .log-table th, .log-table td {{ border: 1px solid #ddd; padding: 8px; }}
        .log-table th {{ background: #eee; }}
        .master-controls {{ margin: 20px 0; }}
        .btn {{ padding: 8px 16px; border: none; border-radius: 4px; background: #3498db; color: #fff; cursor: pointer; margin-right: 10px; }}
        .btn:disabled {{ background: #aaa; }}
    </style>
</head>
<body>
    <div class='header'>
        <h1>QMOI Enhanced Dashboard</h1>
        <p>Visualizing all developer actions, syncs, and test results (including Hugging Face)</p>
    </div>
    <div class='container'>
        <div class='master-controls'>
            <button class='btn' onclick='triggerAction("sync_hf")'>Sync Hugging Face</button>
            <button class='btn' onclick='triggerAction("test_hf")'>Test Hugging Face</button>
            <button class='btn' onclick='triggerAction("platform_sync")'>Sync All Platforms</button>
            <button class='btn' onclick='triggerAction("dev_actions")'>Run Dev Actions</button>
        </div>
        <h2>Recent Actions & Logs</h2>
        <table class='log-table' id='log-table'>
            <thead>
                <tr><th>Timestamp</th><th>Action</th><th>Status</th><th>Details</th></tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <script>
        function fetchLogs() {{
            fetch('/api/logs').then(r => r.json()).then(logs => {{
                const tbody = document.getElementById('log-table').querySelector('tbody');
                tbody.innerHTML = '';
                logs.slice(0, 100).forEach(log => {{
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${{log.timestamp || ''}}</td><td>${{log.action || ''}}</td><td>${{log.status || ''}}</td><td>${{log.details || ''}}</td>`;
                    tbody.appendChild(tr);
                }});
            }});
        }}
        function triggerAction(action) {{
            fetch('/api/trigger', {{
                method: 'POST',
                headers: {{ 'Content-Type': 'application/json' }},
                body: JSON.stringify({{ action }})
            }}).then(() => setTimeout(fetchLogs, 2000));
        }}
        fetchLogs();
        setInterval(fetchLogs, 5000);
    </script>
</body>
</html>
"""
        server = HTTPServer(('0.0.0.0', self.dashboard_port), DashboardHandler)
        server.dashboard = self
        logger.info(f"Dashboard server started on http://localhost:{self.dashboard_port}")
        server.serve_forever()

    def run(self):
        self.serve_dashboard()

if __name__ == '__main__':
    QMOIDashboardEnhancer().run() 