#!/bin/bash

# AUTO-CONTINUE STATUS DASHBOARD
# Shows real-time status of Ollama + Continue auto-continue system

show_status() {
    clear
    
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║        🚀 OLLAMA AUTO-CONTINUE SYSTEM STATUS DASHBOARD        ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Daemon Status
    echo "📊 DAEMON STATUS"
    echo "────────────────────────────────────────────────────────────────"
    
    if [ -f /tmp/auto-continue-daemon.pid ]; then
        DAEMON_PID=$(cat /tmp/auto-continue-daemon.pid)
        if ps -p $DAEMON_PID > /dev/null 2>&1; then
            echo "✅ Auto-Continue Daemon:  RUNNING (PID: $DAEMON_PID)"
        else
            echo "❌ Auto-Continue Daemon:  STOPPED (PID file stale)"
        fi
    else
        echo "❌ Auto-Continue Daemon:  NOT STARTED"
    fi
    
    echo ""
    
    # Ollama Service Status
    echo "🔧 OLLAMA SERVICE STATUS"
    echo "────────────────────────────────────────────────────────────────"
    
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama Service:        RUNNING"
        echo "✅ API Endpoint:          http://localhost:11434"
        echo "✅ Port 11434:            OPEN"
    else
        echo "❌ Ollama Service:        NOT RESPONDING"
        echo "⚠️  Daemon should auto-restart within 10 seconds"
    fi
    
    # Check for Ollama process
    OLLAMA_PROCS=$(pgrep -f "ollama serve" | wc -l)
    if [ "$OLLAMA_PROCS" -gt 0 ]; then
        echo "✅ Ollama Processes:      $OLLAMA_PROCS running"
    else
        echo "❌ Ollama Processes:      0 running"
    fi
    
    echo ""
    
    # Model Status
    echo "🤖 MODEL STATUS"
    echo "────────────────────────────────────────────────────────────────"
    
    MODELS=$(curl -s http://localhost:11434/api/tags 2>/dev/null | grep -o "qwen2.5-coder:3b" | wc -l)
    if [ "$MODELS" -gt 0 ]; then
        echo "✅ Model qwen2.5-coder:3b: AVAILABLE"
        MODEL_SIZE=$(curl -s http://localhost:11434/api/tags 2>/dev/null | grep -o '"size":[0-9]*' | cut -d':' -f2 | head -1)
        if [ -n "$MODEL_SIZE" ]; then
            SIZE_GB=$((MODEL_SIZE / 1000000000))
            echo "✅ Model Size:            ~${SIZE_GB}GB"
        fi
    else
        echo "⚠️  Model qwen2.5-coder:3b: NOT YET LOADED"
    fi
    
    # Test model responsiveness
    RESPONSE_TIME=$(timeout 5 bash -c 'time (curl -s -X POST http://localhost:11434/api/generate \
        -d "{\"model\":\"qwen2.5-coder:3b\",\"prompt\":\"say ok\",\"stream\":false}" > /dev/null)' 2>&1 | grep real | awk '{print $2}')
    
    if [ -n "$RESPONSE_TIME" ]; then
        echo "✅ Response Time:         $RESPONSE_TIME"
    fi
    
    echo ""
    
    # Continue Extension
    echo "💬 CONTINUE EXTENSION"
    echo "────────────────────────────────────────────────────────────────"
    
    if pgrep -f "code" > /dev/null 2>&1; then
        echo "✅ VS Code:               RUNNING"
        if [ -f "$HOME/.continue/config.json" ]; then
            if grep -q "ollama" "$HOME/.continue/config.json"; then
                echo "✅ Continue Config:       CONFIGURED FOR OLLAMA"
            else
                echo "⚠️  Continue Config:       Not configured for Ollama"
            fi
        else
            echo "ℹ️  Continue Config:       Will be created on first launch"
        fi
    else
        echo "ℹ️  VS Code:               Not currently running"
    fi
    
    echo ""
    
    # Resource Usage
    echo "💻 RESOURCE USAGE"
    echo "────────────────────────────────────────────────────────────────"
    
    MEM_TOTAL=$(free -h | awk 'NR==2 {print $2}')
    MEM_USED=$(free -h | awk 'NR==2 {print $3}')
    MEM_PERCENT=$(free | awk 'NR==2 {printf "%.1f", ($3/$2)*100}')
    
    echo "Memory:  $MEM_USED / $MEM_TOTAL ($MEM_PERCENT%)"
    
    CPU_LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}')
    echo "CPU Load: $CPU_LOAD"
    
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}')
    echo "Disk:     $DISK_USAGE used"
    
    echo ""
    
    # Log Summary
    echo "📝 RECENT LOG ENTRIES"
    echo "────────────────────────────────────────────────────────────────"
    
    if [ -f "$HOME/.ollama/logs/auto-continue.log" ]; then
        tail -5 "$HOME/.ollama/logs/auto-continue.log" | sed 's/^/  /'
    else
        echo "  (No logs yet - daemon starting up)"
    fi
    
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  Press Ctrl+C to exit  │  Logs: tail -f \$HOME/.ollama/logs  ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
}

# Show status once
show_status

# Optional: Loop with refresh
if [ "$1" == "--watch" ]; then
    echo ""
    echo "Refreshing every 5 seconds (Press Ctrl+C to exit)..."
    sleep 2
    
    while true; do
        sleep 5
        show_status
    done
fi
