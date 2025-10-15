#!/usr/bin/env python3
"""Minimal QMOI dashboard (parser-safe) used during repo cleanup.

This file provides a tiny Flask app that displays stubbed system health so it
can be formatted, parsed and run by automation. It avoids external dependencies
and replaces missing components with safe stubs.
"""

from flask import Flask, render_template_string
import threading
import json
from pathlib import Path


class QMOISystemController:
    def get_system_health(self):
        return {
            "cpu_percent": 0,
            "memory_percent": 0,
            "disk_percent": 0,
            "permission_status": {},
        }


app = Flask(__name__)
controller = QMOISystemController()


@app.route("/")
def dashboard():
    health = controller.get_system_health()
    return render_template_string(
        """
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
            <pre>{{ health['permission_status'] }}</pre>
        </body>
        </html>
        """,
        health=health,
    )


if __name__ == "__main__":
    threading.Thread(
        target=app.run, kwargs={"host": "127.0.0.1", "port": 5000}, daemon=True
    ).start()
