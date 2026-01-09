#!/bin/bash

# QMOI Service Script
# This script ensures QMOI runs continuously in the background.

LOG_FILE="/workspaces/qmoi-enhanced-new-simtwov/logs/qmoi_service.log"
SCRIPT_PATH="/workspaces/qmoi-enhanced-new-simtwov/qmoi-enhanced/scripts/qmoi_ai_enhancement_engine.py"

# Function to start the QMOI script
start_qmoi() {
    echo "Starting QMOI AI Enhancement Engine..." | tee -a "$LOG_FILE"
    while true; do
        python3 "$SCRIPT_PATH" >> "$LOG_FILE" 2>&1
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 0 ]; then
            echo "QMOI script completed successfully. Exiting..." | tee -a "$LOG_FILE"
            break
        else
            echo "QMOI script crashed with exit code $EXIT_CODE. Restarting..." | tee -a "$LOG_FILE"
            sleep 5
        fi
    done
}

# Run the QMOI script in the background
start_qmoi &
echo "QMOI Service is now running in the background." | tee -a "$LOG_FILE"