from flask import Flask, request, jsonify
from sklearn.ensemble import IsolationForest
import numpy as np
import re
import os
from sklearn.preprocessing import StandardScaler
import threading
import time
import requests

app = Flask(__name__)

# Example: parse /var/log/auth.log for failed logins (timestamp, IP)
def parse_auth_log(log_path="/var/log/auth.log"):
    if not os.path.exists(log_path):
        return []
    with open(log_path, "r") as f:
        lines = f.readlines()
    failed = []
    for line in lines:
        m = re.search(r"(\w{3} \d+ \d+:\d+:\d+) [^ ]+ sshd\[\d+\]: Failed password for .* from ([\d.]+)", line)
        if m:
            failed.append({"timestamp": m.group(1), "ip": m.group(2)})
    return failed

@app.route("/detect-anomaly", methods=["POST"])
def detect_anomaly():
    # Accepts a list of failed login events (timestamps, IPs)
    data = request.json
    events = data.get("events", [])
    if not events:
        return jsonify({"anomaly": False, "score": 0, "msg": "No events"})
    # Enhanced: use both number of events per IP and time clustering as features
    ip_counts = {}
    times = []
    for e in events:
        ip = e["ip"]
        ip_counts[ip] = ip_counts.get(ip, 0) + 1
        times.append(e["timestamp"])
    # Feature 1: login attempts per IP
    X1 = np.array([[c] for c in ip_counts.values()])
    # Feature 2: time clustering (number of events in last 10 minutes)
    # For demo, just use total events as a second feature
    X2 = np.full((len(ip_counts), 1), len(events))
    X = np.hstack([X1, X2])
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(X_scaled)
    scores = model.decision_function(X_scaled)
    anomaly = (scores < 0).any()
    return jsonify({
        "anomaly": bool(anomaly),
        "score": float(scores.min()),
        "ip_counts": ip_counts,
        "msg": "Anomaly detected" if anomaly else "No anomaly"
    })

@app.route("/parse-log", methods=["GET"])
def parse_log():
    failed = parse_auth_log()
    return jsonify({"events": failed})

@app.route("/analytics", methods=["GET"])
def analytics():
    # Compute analytics from the last 1000 events in the log
    failed = parse_auth_log()
    ip_counts = {}
    for e in failed:
        ip = e["ip"]
        ip_counts[ip] = ip_counts.get(ip, 0) + 1
    top_ips = sorted(ip_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    total_events = len(failed)
    return jsonify({
        "total_events": total_events,
        "unique_ips": len(ip_counts),
        "top_ips": top_ips,
    })

@app.route("/export-analytics", methods=["GET"])
def export_analytics():
    # Export analytics as CSV
    failed = parse_auth_log()
    lines = ["timestamp,ip"] + [f'{e["timestamp"]},{e["ip"]}' for e in failed]
    csv = "\n".join(lines)
    return (csv, 200, {'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=analytics.csv'})

@app.route("/alert", methods=["POST"])
def external_alert():
    data = request.json or {}
    message = data.get("message", "Security alert!")
    webhook = data.get("webhook")
    if webhook:
        try:
            resp = requests.post(webhook, json={"text": message})
            return jsonify({"status": "sent", "response": resp.text})
        except Exception as e:
            return jsonify({"status": "failed", "error": str(e)}), 500
    return jsonify({"status": "no webhook provided"}), 400

auto_monitoring = {
    "enabled": False,
    "interval": 60,  # seconds
    "last_result": None,
}

# --- Automated alerting on anomaly detection ---
ALERT_WEBHOOK = os.environ.get("ALERT_WEBHOOK")  # Set this env var to enable auto-alerts

def send_alert(message):
    if ALERT_WEBHOOK:
        try:
            requests.post(ALERT_WEBHOOK, json={"text": message})
        except Exception as e:
            print(f"Failed to send alert: {e}")

# Modify monitor_loop to send alert on anomaly
def monitor_loop():
    while auto_monitoring["enabled"]:
        failed = parse_auth_log()
        if failed:
            with app.test_request_context():
                with app.test_client() as c:
                    resp = c.post("/detect-anomaly", json={"events": failed})
                    result = resp.get_json()
                    auto_monitoring["last_result"] = result
                    if result.get("anomaly"):
                        msg = f"[ALERT] Anomaly detected! Score: {result.get('score')}, IPs: {result.get('ip_counts')}"
                        send_alert(msg)
        time.sleep(auto_monitoring["interval"])

@app.route("/monitor", methods=["POST"])
def start_monitor():
    data = request.json or {}
    enable = data.get("enable", True)
    interval = data.get("interval", 60)
    auto_monitoring["interval"] = interval
    auto_monitoring["enabled"] = enable
    if enable:
        t = threading.Thread(target=monitor_loop, daemon=True)
        t.start()
        return jsonify({"status": "started", "interval": interval})
    else:
        return jsonify({"status": "stopped"})

@app.route("/monitor/status", methods=["GET"])
def monitor_status():
    return jsonify({
        "enabled": auto_monitoring["enabled"],
        "interval": auto_monitoring["interval"],
        "last_result": auto_monitoring["last_result"]
    })

# --- More analytics: failed logins per hour ---
@app.route("/analytics/hourly", methods=["GET"])
def analytics_hourly():
    failed = parse_auth_log()
    from collections import Counter
    hours = [e["timestamp"][:6] for e in failed]  # e.g. 'Jun 08'
    hour_counts = Counter(hours)
    return jsonify(dict(hour_counts))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
