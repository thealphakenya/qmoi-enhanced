#!/bin/bash

# Startup script for Ollama auto-continue daemon
# Automatically started when Codespace loads

set -e

echo "🚀 Starting Ollama Auto-Continue Daemon..."

# Make daemon executable
chmod +x "$(dirname "$0")/auto-continue-daemon.sh"

# Start the daemon in background
"$(dirname "$0")/auto-continue-daemon.sh" > /tmp/auto-continue.log 2>&1 &
DAEMON_PID=$!

echo "✅ Auto-Continue Daemon started (PID: $DAEMON_PID)"
echo "📝 Logs: tail -f $HOME/.ollama/logs/auto-continue.log"

# Save daemon PID for later management
echo $DAEMON_PID > /tmp/auto-continue-daemon.pid

exit 0
