#!/bin/bash

# AUTO-CONTINUE: Keeps Ollama running continuously
# This daemon ensures Ollama never stops running

OLLAMA_PID_FILE="/tmp/ollama.pid"
OLLAMA_LOG_FILE="$HOME/.ollama/logs/auto-continue.log"
MAX_RESTART_ATTEMPTS=5
RESTART_DELAY=5

# Ensure log directory exists
mkdir -p "$(dirname "$OLLAMA_LOG_FILE")"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$OLLAMA_LOG_FILE"
}

check_ollama_health() {
    # Test if Ollama responds to API
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        return 0  # Healthy
    fi
    return 1  # Not responding
}

start_ollama() {
    log_message "Starting Ollama..."
    ollama serve > "$HOME/.ollama/logs/daemon.log" 2>&1 &
    OLLAMA_PID=$!
    echo $OLLAMA_PID > "$OLLAMA_PID_FILE"
    log_message "Ollama started with PID: $OLLAMA_PID"
    sleep 3  # Wait for startup
}

restart_ollama() {
    log_message "Restarting Ollama (attempt $1/$MAX_RESTART_ATTEMPTS)..."
    
    # Kill existing process
    if [ -f "$OLLAMA_PID_FILE" ]; then
        kill $(cat "$OLLAMA_PID_FILE") 2>/dev/null || true
    fi
    pkill -f "ollama serve" 2>/dev/null || true
    
    sleep 2
    start_ollama
}

continuous_monitor() {
    local restart_count=0
    
    log_message "=== AUTO-CONTINUE DAEMON STARTED ==="
    log_message "Monitoring Ollama service on localhost:11434"
    
    while true; do
        if ! check_ollama_health; then
            log_message "⚠️  Ollama health check failed"
            
            if [ $restart_count -lt $MAX_RESTART_ATTEMPTS ]; then
                restart_count=$((restart_count + 1))
                restart_ollama "$restart_count"
            else
                log_message "❌ Max restart attempts reached. Please investigate."
                # Send alert or break
                sleep 60  # Wait before trying again
            fi
        else
            # Reset counter on successful check
            if [ $restart_count -gt 0 ]; then
                log_message "✅ Ollama health check passed. Service recovered."
            fi
            restart_count=0
        fi
        
        sleep 10  # Check every 10 seconds
    done
}

# Trap signals for graceful shutdown
trap 'log_message "Received shutdown signal. Stopping daemon."; exit 0' SIGTERM SIGINT

# Start monitoring
continuous_monitor
