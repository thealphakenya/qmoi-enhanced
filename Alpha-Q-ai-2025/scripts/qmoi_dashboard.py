#!/usr/bin/env python3
"""
QMOI Web Dashboard: Displays system health, permission/audit status, and recent notifications.
"""
from flask import Flask, render_template_string, request, Response
import os
import sys
import threading
import json
sys.path.append(os.path.dirname(__file__))
from qmoi-system-controller import QMOISystemController

app = Flask(__name__)
controller = QMOISystemController()

# Load dashboard settings from config
with open(os.path.join(os.path.dirname(__file__), '../config/qmoi_config.json')) as f:
    config = json.load(f)
db_settings = config.get('dashboard_settings', {})
HOST = db_settings.get('host', '127.0.0.1')
PORT = db_settings.get('port', 5000)
ENABLE_AUTH = db_settings.get('enable_auth', False)
AUTH_USERNAME = db_settings.get('auth_username', 'admin')
AUTH_PASSWORD = db_settings.get('auth_password', 'changeme')

def tail_log(log_path, lines=20):
    if not os.path.exists(log_path):
        return []
    with open(log_path, 'r') as f:
        return f.readlines()[-lines:]

# Optional HTTP Basic Auth
def check_auth(username, password):
    return username == AUTH_USERNAME and password == AUTH_PASSWORD

def authenticate():
    return Response(
        'Authentication required', 401,
        {'WWW-Authenticate': 'Basic realm="QMOI Dashboard"'}
    )

def requires_auth(f):
    def decorated(*args, **kwargs):
        if not ENABLE_AUTH:
            return f(*args, **kwargs)
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated

@app.route('/')
@requires_auth
def dashboard():
    health = controller.get_system_health()
    audit_log = tail_log(os.path.join(os.path.dirname(__file__), '../logs/qmoi_permission_audit.log'))
    return render_template_string('''
    <html>
    <head><title>QMOI System Dashboard</title></head>
    <body>
        <h1>QMOI System Health Dashboard</h1>
        <h2>System Health</h2>
        <ul>
            <li>CPU Usage: {{ health['cpu_percent'] }}%</li>
            <li>Memory Usage: {{ health['memory_percent'] }}%</li>
            <li>Disk Usage: {{ health['disk_percent'] }}%</li>
        </ul>
        <h2>Permission Status</h2>
        <table border="1">
            <tr><th>File</th><th>Status</th></tr>
            {% for fname, status in health['permission_status'].items() %}
            <tr><td>{{ fname }}</td><td>{{ status }}</td></tr>
            {% endfor %}
        </table>
        <h2>Recent Permission Audit Log</h2>
        <pre>{{ audit_log|join('') }}</pre>
    </body>
    </html>
    ''', health=health, audit_log=audit_log)

if __name__ == '__main__':
    threading.Thread(target=app.run, kwargs={'host': HOST, 'port': PORT}, daemon=True).start() 