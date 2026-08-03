#!/usr/bin/env python3
"""
QMOI Real-Time Monitor
Live statistics and progress visualization for QMOI automation
"""

import os
import sys
import json
import time
import threading
import asyncio
import websockets
import psutil
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging
import queue
import signal

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/real-time-monitor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QMOIRealTimeMonitor:
    def __init__(self):
        self.config = self.load_config()
        self.stats = {}
        self.websocket_clients = set()
        self.is_running = True
        self.monitoring_thread = None
        self.websocket_server = None
        self.stats_queue = queue.Queue()
        
    def load_config(self) -> Dict[str, Any]:
        """Load monitoring configuration"""
        config = {
            'websocket_port': 8080,
            'dashboard_port': 3001,
            'monitoring_interval': 2,
            'max_clients': 100,
            'enable_websocket': True,
            'enable_dashboard': True,
            'enable_file_monitoring': True,
            'enable_process_monitoring': True,
            'enable_network_monitoring': True
        }
        
        # Load from config file
        config_file = 'config/qmoi_monitor_config.json'
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                logger.warning(f"Could not load {config_file}: {e}")
        
        return config
    
    def start_monitoring(self):
        """Start real-time monitoring"""
        logger.info("Starting QMOI Real-Time Monitor...")
        
        # Start monitoring thread
        self.monitoring_thread = threading.Thread(target=self._monitoring_loop, daemon=True)
        self.monitoring_thread.start()
        
        # Start WebSocket server
        if self.config.get('enable_websocket', True):
            self.start_websocket_server()
        
        # Start dashboard server
        if self.config.get('enable_dashboard', True):
            self.start_dashboard_server()
        
        logger.info("Real-time monitoring started successfully")
    
    def _monitoring_loop(self):
        """Main monitoring loop"""
        while self.is_running:
            try:
                # Collect system stats
                system_stats = self.collect_system_stats()
                
                # Collect QMOI stats
                qmoi_stats = self.collect_qmoi_stats()
                
                # Collect process stats
                process_stats = self.collect_process_stats()
                
                # Collect network stats
                network_stats = self.collect_network_stats()
                
                # Collect file stats
                file_stats = self.collect_file_stats()
                
                # Combine all stats
                combined_stats = {
                    'timestamp': datetime.now().isoformat(),
                    'system': system_stats,
                    'qmoi': qmoi_stats,
                    'processes': process_stats,
                    'network': network_stats,
                    'files': file_stats
                }
                
                # Update stats
                self.stats = combined_stats
                
                # Send to queue for WebSocket clients
                self.stats_queue.put(combined_stats)
                
                # Save to file
                self.save_stats(combined_stats)
                
                # Print summary
                self.print_summary(combined_stats)
                
                time.sleep(self.config.get('monitoring_interval', 2))
                
            except Exception as e:
                logger.error(f"Monitoring error: {e}")
                time.sleep(5)
    
    def collect_system_stats(self) -> Dict[str, Any]:
        """Collect system statistics"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            return {
                'cpu_percent': cpu_percent,
                'memory_percent': memory.percent,
                'memory_used': memory.used,
                'memory_total': memory.total,
                'disk_percent': disk.percent,
                'disk_used': disk.used,
                'disk_total': disk.total,
                'load_average': psutil.getloadavg() if hasattr(psutil, 'getloadavg') else None
            }
        except Exception as e:
            logger.error(f"Could not collect system stats: {e}")
            return {}
    
    def collect_qmoi_stats(self) -> Dict[str, Any]:
        """Collect QMOI-specific statistics"""
        try:
            qmoi_stats = {}
            
            # Read real-time stats file
            stats_file = 'logs/real-time-stats.json'
            if os.path.exists(stats_file):
                with open(stats_file, 'r') as f:
                    qmoi_stats = json.load(f)
            
            # Read fixes log
            fixes_log = 'logs/fixes-log.json'
            if os.path.exists(fixes_log):
                with open(fixes_log, 'r') as f:
                    fixes = [json.loads(line) for line in f if line.strip()]
                    qmoi_stats['recent_fixes'] = fixes[-10:] if fixes else []
            
            # Read comprehensive report
            report_file = 'logs/comprehensive-report.json'
            if os.path.exists(report_file):
                with open(report_file, 'r') as f:
                    qmoi_stats['comprehensive_report'] = json.load(f)
            
            return qmoi_stats
            
        except Exception as e:
            logger.error(f"Could not collect QMOI stats: {e}")
            return {}
    
    def collect_process_stats(self) -> Dict[str, Any]:
        """Collect process statistics"""
        try:
            processes = []
            
            # Get all processes
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
                try:
                    proc_info = proc.info
                    if proc_info['cpu_percent'] > 0 or proc_info['memory_percent'] > 0:
                        processes.append(proc_info)
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            # Sort by CPU usage
            processes.sort(key=lambda x: x['cpu_percent'], reverse=True)
            
            return {
                'total_processes': len(psutil.pids()),
                'top_processes': processes[:10],
                'qmoi_processes': [p for p in processes if 'qmoi' in p['name'].lower()]
            }
            
        except Exception as e:
            logger.error(f"Could not collect process stats: {e}")
            return {}
    
    def collect_network_stats(self) -> Dict[str, Any]:
        """Collect network statistics"""
        try:
            connections = psutil.net_connections()
            
            return {
                'total_connections': len(connections),
                'established_connections': len([c for c in connections if c.status == 'ESTABLISHED']),
                'listening_connections': len([c for c in connections if c.status == 'LISTEN']),
                'network_interfaces': psutil.net_if_addrs()
            }
            
        except Exception as e:
            logger.error(f"Could not collect network stats: {e}")
            return {}
    
    def collect_file_stats(self) -> Dict[str, Any]:
        """Collect file statistics"""
        try:
            file_counts = {}
            
            # Count files by extension
            for ext in ['.py', '.js', '.ts', '.tsx', '.json', '.md', '.log']:
                count = len(list(Path('.').rglob(f'*{ext}')))
                file_counts[ext] = count
            
            # Get recent log files
            log_files = []
            logs_dir = Path('logs')
            if logs_dir.exists():
                for log_file in logs_dir.glob('*.log'):
                    stat = log_file.stat()
                    log_files.append({
                        'name': log_file.name,
                        'size': stat.st_size,
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                    })
            
            return {
                'file_counts': file_counts,
                'recent_logs': log_files
            }
            
        except Exception as e:
            logger.error(f"Could not collect file stats: {e}")
            return {}
    
    def save_stats(self, stats: Dict[str, Any]):
        """Save statistics to file"""
        try:
            stats_file = 'logs/real-time-monitor-stats.json'
            with open(stats_file, 'w') as f:
                json.dump(stats, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Could not save stats: {e}")
    
    def print_summary(self, stats: Dict[str, Any]):
        """Print monitoring summary"""
        try:
            system = stats.get('system', {})
            qmoi = stats.get('qmoi', {})
            
            print(f"\n{'='*60}")
            print(f"QMOI Real-Time Monitor - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"{'='*60}")
            
            # System stats
            print(f"CPU Usage: {system.get('cpu_percent', 0):.1f}%")
            print(f"Memory Usage: {system.get('memory_percent', 0):.1f}%")
            print(f"Disk Usage: {system.get('disk_percent', 0):.1f}%")
            
            # QMOI stats
            if 'qmoi' in qmoi:
                qmoi_stats = qmoi['qmoi']
                print(f"Fixes Applied: {qmoi_stats.get('fixes_applied', 0)}")
                print(f"Platforms Synced: {qmoi_stats.get('platforms_synced', 0)}")
                print(f"Deployments Successful: {qmoi_stats.get('deployments_successful', 0)}")
                print(f"Notifications Sent: {qmoi_stats.get('notifications_sent', 0)}")
                print(f"Health Checks Passed: {qmoi_stats.get('health_checks_passed', 0)}")
            
            # Process stats
            processes = stats.get('processes', {})
            print(f"Total Processes: {processes.get('total_processes', 0)}")
            print(f"QMOI Processes: {len(processes.get('qmoi_processes', []))}")
            
            # Network stats
            network = stats.get('network', {})
            print(f"Network Connections: {network.get('total_connections', 0)}")
            
            print(f"{'='*60}\n")
            
        except Exception as e:
            logger.error(f"Could not print summary: {e}")
    
    def start_websocket_server(self):
        """Start WebSocket server for real-time updates"""
        try:
            port = self.config.get('websocket_port', 8080)
            
            async def websocket_handler(websocket, path):
                """Handle WebSocket connections"""
                self.websocket_clients.add(websocket)
                logger.info(f"WebSocket client connected. Total clients: {len(self.websocket_clients)}")
                
                try:
                    async for message in websocket:
                        # Handle client messages if needed
                        pass
                except websockets.exceptions.ConnectionClosed:
                    pass
                finally:
                    self.websocket_clients.discard(websocket)
                    logger.info(f"WebSocket client disconnected. Total clients: {len(self.websocket_clients)}")
            
            async def broadcast_stats():
                """Broadcast stats to all connected clients"""
                while self.is_running:
                    try:
                        if not self.stats_queue.empty():
                            stats = self.stats_queue.get_nowait()
                            message = json.dumps(stats)
                            
                            # Send to all connected clients
                            disconnected_clients = set()
                            for client in self.websocket_clients:
                                try:
                                    await client.send(message)
                                except websockets.exceptions.ConnectionClosed:
                                    disconnected_clients.add(client)
                            
                            # Remove disconnected clients
                            self.websocket_clients -= disconnected_clients
                            
                    except Exception as e:
                        logger.error(f"WebSocket broadcast error: {e}")
                    
                    await asyncio.sleep(1)
            
            async def start_server():
                """Start WebSocket server"""
                async with websockets.serve(websocket_handler, "localhost", port):
                    logger.info(f"WebSocket server started on port {port}")
                    await broadcast_stats()
            
            # Start WebSocket server in a separate thread
            def run_websocket_server():
                asyncio.run(start_server())
            
            websocket_thread = threading.Thread(target=run_websocket_server, daemon=True)
            websocket_thread.start()
            
        except Exception as e:
            logger.error(f"Could not start WebSocket server: {e}")
    
    def start_dashboard_server(self):
        """Start dashboard server"""
        try:
            port = self.config.get('dashboard_port', 3001)
            
            # Create simple HTTP server for dashboard
            from http.server import HTTPServer, BaseHTTPRequestHandler
            import urllib.parse
            
            class DashboardHandler(BaseHTTPRequestHandler):
                def do_GET(self):
                    """Handle GET requests"""
                    parsed_path = urllib.parse.urlparse(self.path)
                    
                    if parsed_path.path == '/':
                        self.send_response(200)
                        self.send_header('Content-type', 'text/html')
                        self.end_headers()
                        
                        html = self.generate_dashboard_html()
                        self.wfile.write(html.encode())
                    
                    elif parsed_path.path == '/api/stats':
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        
                        response = json.dumps(self.server.monitor.stats, default=str)
                        self.wfile.write(response.encode())
                    
                    else:
                        self.send_response(404)
                        self.end_headers()
                
                def generate_dashboard_html(self):
                    """Generate dashboard HTML"""
                    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QMOI Real-Time Dashboard</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        .header {{
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }}
        .stat-card {{
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }}
        .stat-title {{
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
        }}
        .stat-value {{
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
        }}
        .websocket-status {{
            background-color: #e74c3c;
            color: white;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .websocket-connected {{
            background-color: #27ae60;
        }}
        .chart-container {{
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>QMOI Real-Time Dashboard</h1>
            <p>Live monitoring of QMOI automation system</p>
        </div>
        
        <div class="websocket-status" id="websocket-status">
            Connecting to real-time updates...
        </div>
        
        <div class="stats-grid" id="stats-grid">
            <div class="stat-card">
                <div class="stat-title">CPU Usage</div>
                <div class="stat-value" id="cpu-usage">--</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Memory Usage</div>
                <div class="stat-value" id="memory-usage">--</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Fixes Applied</div>
                <div class="stat-value" id="fixes-applied">--</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Platforms Synced</div>
                <div class="stat-value" id="platforms-synced">--</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Deployments</div>
                <div class="stat-value" id="deployments">--</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Notifications</div>
                <div class="stat-value" id="notifications">--</div>
            </div>
        </div>
        
        <div class="chart-container">
            <h3>Real-Time Updates</h3>
            <div id="updates-log" style="height: 300px; overflow-y: auto; background-color: #f8f9fa; padding: 10px; border-radius: 3px;"></div>
        </div>
    </div>
    
    <script>
        let ws = null;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        
        function connectWebSocket() {{
            ws = new WebSocket('ws://localhost:8080');
            
            ws.onopen = function() {{
                document.getElementById('websocket-status').textContent = 'Connected to real-time updates';
                document.getElementById('websocket-status').className = 'websocket-status websocket-connected';
                reconnectAttempts = 0;
            }};
            
            ws.onmessage = function(event) {{
                const data = JSON.parse(event.data);
                updateDashboard(data);
            }};
            
            ws.onclose = function() {{
                document.getElementById('websocket-status').textContent = 'Disconnected from real-time updates';
                document.getElementById('websocket-status').className = 'websocket-status';
                
                if (reconnectAttempts < maxReconnectAttempts) {{
                    reconnectAttempts++;
                    setTimeout(connectWebSocket, 2000);
                }}
            }};
            
            ws.onerror = function(error) {{
                console.error('WebSocket error:', error);
            }};
        }}
        
        function updateDashboard(data) {{
            // Update system stats
            if (data.system) {{
                document.getElementById('cpu-usage').textContent = data.system.cpu_percent?.toFixed(1) + '%' || '--';
                document.getElementById('memory-usage').textContent = data.system.memory_percent?.toFixed(1) + '%' || '--';
            }}
            
            // Update QMOI stats
            if (data.qmoi && data.qmoi.qmoi) {{
                const qmoiStats = data.qmoi.qmoi;
                document.getElementById('fixes-applied').textContent = qmoiStats.fixes_applied || 0;
                document.getElementById('platforms-synced').textContent = qmoiStats.platforms_synced || 0;
                document.getElementById('deployments').textContent = qmoiStats.deployments_successful || 0;
                document.getElementById('notifications').textContent = qmoiStats.notifications_sent || 0;
            }}
            
            // Update log
            const logElement = document.getElementById('updates-log');
            const timestamp = new Date().toLocaleTimeString();
            logElement.innerHTML += `<div>[${{timestamp}}] Updated dashboard with new data</div>`;
            logElement.scrollTop = logElement.scrollHeight;
        }}
        
        // Connect on page load
        connectWebSocket();
        
        // Fallback to polling if WebSocket fails
        setInterval(function() {{
            if (!ws || ws.readyState !== WebSocket.OPEN) {{
                fetch('/api/stats')
                    .then(response => response.json())
                    .then(data => updateDashboard(data))
                    .catch(error => console.error('API error:', error));
            }}
        }}, 5000);
    </script>
</body>
</html>
"""
            
            # Create server
            server = HTTPServer(('localhost', port), DashboardHandler)
            server.monitor = self
            
            # Start server in a separate thread
            def run_dashboard_server():
                logger.info(f"Dashboard server started on http://localhost:{port}")
                server.serve_forever()
            
            dashboard_thread = threading.Thread(target=run_dashboard_server, daemon=True)
            dashboard_thread.start()
            
        except Exception as e:
            logger.error(f"Could not start dashboard server: {e}")
    
    def run(self):
        """Run the real-time monitor"""
        try:
            # Set up signal handlers
            signal.signal(signal.SIGINT, self.signal_handler)
            signal.signal(signal.SIGTERM, self.signal_handler)
            
            # Start monitoring
            self.start_monitoring()
            
            # Keep running
            while self.is_running:
                time.sleep(1)
                
        except KeyboardInterrupt:
            logger.info("Monitor interrupted by user")
        except Exception as e:
            logger.error(f"Monitor failed: {e}")
        finally:
            self.cleanup()
    
    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logger.info(f"Received signal {signum}, shutting down...")
        self.is_running = False
    
    def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up monitor...")
        
        # Close WebSocket connections
        if self.websocket_clients:
            for client in self.websocket_clients:
                try:
                    client.close()
                except:
                    pass
        
        logger.info("Monitor cleanup completed")

def main():
    """Main function"""
    monitor = QMOIRealTimeMonitor()
    monitor.run()

if __name__ == "__main__":
    main() 