#!/usr/bin/env python3
"""
QMOI Dashboard - Advanced Real-Time Automation, Health, Docs, and Notification Monitoring
Cloud-offload ready: can run in Colab, DagsHub, or any cloud environment.
"""
from flask import Flask, render_template_string, jsonify, request
import json
from pathlib import Path
import re

LOG_FILE = Path(__file__).parent.parent / "logs" / "qmoi-master-automation.log"
REPORT_FILE = Path(__file__).parent.parent / "logs" / "master-automation-report.json"
DOC_HISTORY_FILE = Path(__file__).parent.parent / "ALLMDFILESREFS.md"

app = Flask(__name__)

@app.route('/')
def index():
    return render_template_string('''
    <html>
    <head>
        <title>QMOI Dashboard</title>
        <meta http-equiv="refresh" content="30">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body { font-family: Arial, sans-serif; background: #181c20; color: #e0e0e0; }
            .log, .report, .docs, .notifications, .preautotest { background: #23272c; padding: 1em; border-radius: 8px; margin-bottom: 1em; }
            h2 { color: #7fffd4; }
            .error { color: #ff6b6b; font-weight: bold; }
            .warning { color: #ffd166; font-weight: bold; }
            .success { color: #7fffd4; }
            .search-bar { margin-bottom: 1em; }
            .pass { color: #7fffd4; font-weight: bold; }
            .fail { color: #ff6b6b; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>QMOI Dashboard - Advanced Real-Time Automation & Health</h1>
        <div class="preautotest">
            <h2>Pre-Autotest Results (Multi-Platform)</h2>
            <div id="preautotest">Loading...</div>
            <canvas id="preautotestChart" width="600" height="150"></canvas>
        </div>
        <div class="report">
            <h2>Automation Report</h2>
            <pre id="report">{{ report }}</pre>
        </div>
        <div class="log">
            <h2>Live Log (last 100 lines)</h2>
            <div class="search-bar">
                <input type="text" id="logSearch" placeholder="Search logs..." oninput="filterLogs()" style="width: 60%; padding: 0.5em;">
            </div>
            <pre id="log">{{ log }}</pre>
        </div>
        <div class="notifications">
            <h2>Notifications (Gmail & Multi-Channel)</h2>
            <div id="notifications">Loading...</div>
            <button onclick="triggerTestNotification()">Send Test Notification</button>
        </div>
        <div class="docs">
            <h2>Documentation Update History</h2>
            <pre id="docHistory">{{ doc_history }}</pre>
        </div>
        <div class="charts">
            <h2>Automation Events & Errors (Live)</h2>
            <canvas id="eventChart" width="600" height="200"></canvas>
        </div>
        <script>
            function highlightLog(log) {
                return log
                    .replace(/(ERROR|\u274c|\u274E|\u26A0)/g, '<span class="error">$1</span>')
                    .replace(/(WARNING|WARN|\u26A0)/g, '<span class="warning">$1</span>')
                    .replace(/(SUCCESS|\u2705)/g, '<span class="success">$1</span>');
            }
            function filterLogs() {
                var search = document.getElementById('logSearch').value.toLowerCase();
                fetch('/api/log?search=' + encodeURIComponent(search)).then(r => r.json()).then(data => {
                    document.getElementById('log').innerHTML = highlightLog(data.log);
                });
            }
            function updateDashboard() {
                fetch('/api/preautotest').then(r => r.json()).then(data => {
                    let html = '';
                    data.results.forEach(res => {
                        html += `<b>${res.platform}:</b> <span class="${res.status === 'PASS' ? 'pass' : 'fail'}">${res.status}</span>`;
                        if (res.error) html += ` <span class="error">(${res.error})</span>`;
                        html += '<br>';
                    });
                    document.getElementById('preautotest').innerHTML = html;
                    updatePreautotestChart(data.history);
                });
                fetch('/api/report').then(r => r.json()).then(data => {
                    document.getElementById('report').textContent = data.report;
                });
                fetch('/api/log').then(r => r.json()).then(data => {
                    document.getElementById('log').innerHTML = highlightLog(data.log);
                });
                fetch('/api/doc-history').then(r => r.json()).then(data => {
                    document.getElementById('docHistory').textContent = data.doc_history;
                });
                fetch('/api/notifications').then(r => r.json()).then(data => {
                    document.getElementById('notifications').textContent = data.notifications;
                });
                fetch('/api/event-stats').then(r => r.json()).then(data => {
                    updateChart(data.labels, data.errors, data.warnings, data.successes);
                });
            }
            function triggerTestNotification() {
                fetch('/api/notifications/test', {method: 'POST'}).then(r => r.json()).then(data => {
                    alert(data.result);
                });
            }
            function updateChart(labels, errors, warnings, successes) {
                if (!window.eventChart) {
                    var ctx = document.getElementById('eventChart').getContext('2d');
                    window.eventChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [
                                { label: 'Errors', data: errors, backgroundColor: '#ff6b6b' },
                                { label: 'Warnings', data: warnings, backgroundColor: '#ffd166' },
                                { label: 'Successes', data: successes, backgroundColor: '#7fffd4' }
                            ]
                        },
                        options: { responsive: false, scales: { y: { beginAtZero: true } } }
                    });
                } else {
                    window.eventChart.data.labels = labels;
                    window.eventChart.data.datasets[0].data = errors;
                    window.eventChart.data.datasets[1].data = warnings;
                    window.eventChart.data.datasets[2].data = successes;
                    window.eventChart.update();
                }
            }
            function updatePreautotestChart(history) {
                if (!window.preautotestChart) {
                    var ctx = document.getElementById('preautotestChart').getContext('2d');
                    window.preautotestChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: history.map(h => h.timestamp),
                            datasets: history[0] ? history[0].platforms.map((p, i) => ({
                                label: p,
                                data: history.map(h => h.results[i].status === 'PASS' ? 1 : 0),
                                borderColor: ['#7fffd4', '#ff6b6b', '#ffd166', '#a0a0ff', '#00e676'][i % 5],
                                fill: false
                            })) : []
                        },
                        options: { responsive: false, scales: { y: { beginAtZero: true, max: 1 } } }
                    });
                } else {
                    window.preautotestChart.data.labels = history.map(h => h.timestamp);
                    history[0] && history[0].platforms.forEach((p, i) => {
                        window.preautotestChart.data.datasets[i].data = history.map(h => h.results[i].status === 'PASS' ? 1 : 0);
                    });
                    window.preautotestChart.update();
                }
            }
            setInterval(updateDashboard, 5000);
            window.onload = updateDashboard;
        </script>
    </body>
    </html>
    ''', report=get_report(), log=highlight_log(get_log()), doc_history=get_doc_history())

@app.route('/api/log')
def api_log():
    search = request.args.get('search', '').lower()
    log = get_log()
    if search:
        log = '\n'.join([line for line in log.splitlines() if search in line.lower()])
    return jsonify({'log': highlight_log(log)})

@app.route('/api/report')
def api_report():
    return jsonify({'report': get_report()})

@app.route('/api/doc-history')
def api_doc_history():
    return jsonify({'doc_history': get_doc_history()})

@app.route('/api/notifications')
def api_notifications():
    # Placeholder: integrate with notification logs/status
    return jsonify({'notifications': 'Gmail and multi-channel notification status will appear here.'})

@app.route('/api/notifications/test', methods=['POST'])
def api_notifications_test():
    # Placeholder: trigger a test notification (integrate with QMOI notification system)
    return jsonify({'result': 'Test notification sent (simulated).'})

@app.route('/api/event-stats')
def api_event_stats():
    # Parse log for error/warning/success counts by time window (e.g., last 10 minutes)
    log = get_log()
    lines = log.splitlines()[-100:]
    labels = []
    errors = []
    warnings = []
    successes = []
    for i in range(0, len(lines), 10):
        chunk = lines[i:i+10]
        labels.append(f'Lines {i+1}-{i+len(chunk)}')
        errors.append(sum(1 for l in chunk if re.search(r'ERROR|\u274c|\u274E|\u26A0', l)))
        warnings.append(sum(1 for l in chunk if re.search(r'WARNING|WARN|\u26A0', l)))
        successes.append(sum(1 for l in chunk if re.search(r'SUCCESS|\u2705', l)))
    return jsonify({'labels': labels, 'errors': errors, 'warnings': warnings, 'successes': successes})

@app.route('/api/preautotest')
def api_preautotest():
    # Simulate multi-platform pre-autotest results and history
    import random, datetime
    platforms = ['GitHub', 'GitLab', 'Vercel', 'HuggingFace', 'QCity']
    results = []
    for p in platforms:
        status = random.choice(['PASS', 'FAIL'])
        error = '' if status == 'PASS' else f"{p} permission error"
        results.append({'platform': p, 'status': status, 'error': error})
    # Simulate history (last 5 runs)
    history = []
    for i in range(5):
        hresults = []
        for p in platforms:
            status = random.choice(['PASS', 'FAIL'])
            hresults.append({'platform': p, 'status': status, 'error': '' if status == 'PASS' else f"{p} error"})
        history.append({'timestamp': (datetime.datetime.now() - datetime.timedelta(minutes=5-i)).strftime('%H:%M'), 'platforms': platforms, 'results': hresults})
    return jsonify({'results': results, 'history': history})

def get_log():
    if LOG_FILE.exists():
        with open(LOG_FILE, 'r', encoding='utf-8', errors='replace') as f:
            lines = f.readlines()[-100:]
        return ''.join(lines)
    return 'No log file found.'

def highlight_log(log):
    # Highlight errors, warnings, successes
    log = re.sub(r'(ERROR|\u274c|\u274E|\u26A0)', r'<span class="error">\1</span>', log)
    log = re.sub(r'(WARNING|WARN|\u26A0)', r'<span class="warning">\1</span>', log)
    log = re.sub(r'(SUCCESS|\u2705)', r'<span class="success">\1</span>', log)
    return log

def get_report():
    if REPORT_FILE.exists():
        try:
            with open(REPORT_FILE, 'r', encoding='utf-8', errors='replace') as f:
                report = json.load(f)
            return json.dumps(report, indent=2)
        except Exception as e:
            return f'Error reading report: {e}'
    return 'No report file found.'

def get_doc_history():
    if DOC_HISTORY_FILE.exists():
        try:
            with open(DOC_HISTORY_FILE, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
            # Extract the update history table
            match = re.search(r'## Documentation Update History(.+?)(---|$)', content, re.DOTALL)
            if match:
                return match.group(1).strip()
            return 'No update history found.'
        except Exception as e:
            return f'Error reading doc history: {e}'
    return 'No documentation history file found.'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5055, debug=True) 