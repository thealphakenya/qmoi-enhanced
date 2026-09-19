#!/bin/bash
# QMOI Auto Startup Keepalive Script
# Ensures qmoi_auto_startup.py is always running, even if offline

SCRIPT="/workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_auto_startup.py"
LOG="/workspaces/qmoi-enhanced/qmoi-enhanced/scripts/logs/qmoi_auto_startup_keepalive.log"

while true; do
    if ! pgrep -f "$SCRIPT" > /dev/null; then
        echo "[$(date)] Restarting QMOI Auto Startup..." >> "$LOG"
        nohup python3 "$SCRIPT" >> "$LOG" 2>&1 &
    fi
    sleep 30
done
