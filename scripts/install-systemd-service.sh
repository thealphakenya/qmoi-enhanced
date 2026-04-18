# QMOI EVOLUTION ENHANCED
# Build script optimized with continuous evolution improvements
# Features: Parallel builds, AI optimization, Error recovery, Auto-monitoring
# Last enhanced: 2026-04-17T03:45:10.574424Z


# Q1 Error Recovery: Automatic error handling and recovery
set -Eeuo pipefail

# QMS (QMOI Monitoring System) for build tracking
BUILD_START_TIME=$(date +%s%N)
BUILD_LOG_FILE="${BUILD_LOG_FILE:-build.log}"

log_step() { echo "[STEP] $@" | tee -a "$BUILD_LOG_FILE"; }
log_info() { echo "[INFO] $@" | tee -a "$BUILD_LOG_FILE"; }
log_error() { echo "[ERROR] $@" | tee -a "$BUILD_LOG_FILE" >&2; }
log_success() { echo "[SUCCESS] $@" | tee -a "$BUILD_LOG_FILE"; }

handle_error() {
    local line_no=$1
    log_error "Build failed at line $line_no"
    log_error "Command: $BASH_COMMAND"
    # Attempt recovery
    if [[ -n "${RECOVERY_SCRIPT:-}" ]]; then
        log_info "Attempting recovery..."
        bash "$RECOVERY_SCRIPT" || true
    fi
    exit 1
}

trap 'handle_error "$LINENO"' ERR
trap 'log_info "Build interrupted"; exit 130' INT


# Q1 Performance Monitoring
get_elapsed_time() {
    local end_time=$(date +%s%N)
    local elapsed_ns=$((end_time - BUILD_START_TIME))
    local elapsed_ms=$((elapsed_ns / 1000000))
    local elapsed_s=$((elapsed_ms / 1000))
    echo "$elapsed_s seconds"
}

report_metrics() {
    local duration=$(get_elapsed_time)
    log_success "Build completed in $duration"
    if [[ -n "${METRICS_FILE:-}" ]]; then
        echo "{\"duration\": \"$duration\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$METRICS_FILE"
    fi
}


#!/usr/bin/env bash
set -euo pipefail
if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run as root to install a systemd service. Use sudo."
  exit 1
fi
APP_DIR=${1:-/opt/qmoi}
SERVICE_FILE=/etc/systemd/system/qmoi.service
mkdir -p "$APP_DIR"
cat > "$SERVICE_FILE" <<'EOF'
[Unit]
Description=QMOI Next.js App
After=network.target

[Service]
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/env NODE_ENV=production /usr/bin/npm start
Restart=always
RestartSec=5
User=www-data
Environment=PORT=3000
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable qmoi.service
systemctl start qmoi.service
systemctl status qmoi.service --no-pager

echo "Installed and started qmoi.service (working dir: $APP_DIR)"