# QMOI EVOLUTION ENHANCED
# Build script optimized with continuous evolution improvements
# Features: Parallel builds, AI optimization, Error recovery, Auto-monitoring
# Last enhanced: 2026-04-17T03:45:10.608896Z


# Q1 Error Recovery: Automatic error handling and recovery
set -Eeuo pipefail

# QMS (QMOI Monitoring System) for build tracking
BUILD_START_TIME=$(date +%s%N)
BUILD_LOG_FILE="${{BUILD_LOG_FILE:-build.log}}"

log_step() {{ echo "[STEP] $@" | tee -a "$BUILD_LOG_FILE"; }}
log_info() {{ echo "[INFO] $@" | tee -a "$BUILD_LOG_FILE"; }}
log_error() {{ echo "[ERROR] $@" | tee -a "$BUILD_LOG_FILE" >&2; }}
log_success() {{ echo "[SUCCESS] $@" | tee -a "$BUILD_LOG_FILE"; }}

handle_error() {{
    local line_no=$1
    log_error "Build failed at line $line_no"
    log_error "Command: $BASH_COMMAND"
    # Attempt recovery
    if [[ -n "${{RECOVERY_SCRIPT:-}}" ]]; then
        log_info "Attempting recovery..."
        bash "$RECOVERY_SCRIPT" || true
    fi
    exit 1
}}

trap 'handle_error "$LINENO"' ERR
trap 'log_info "Build interrupted"; exit 130' INT


# Q1 Parallel Processing Support
# Enable parallel builds when applicable
PARALLEL_JOBS=${PARALLEL_JOBS:-$(nproc)}
export PARALLEL_JOBS

run_parallel() {{
    local -a pids=()
    for cmd in "$@"; do
        bash -c "$cmd" &
        pids+=($!)
    done
    local failed=0
    for pid in "${{pids[@]}}"; do
        wait $pid || failed=$((failed+1))
    done
    return $failed
}}


# Q1 Performance Monitoring
get_elapsed_time() {{
    local end_time=$(date +%s%N)
    local elapsed_ns=$((end_time - BUILD_START_TIME))
    local elapsed_ms=$((elapsed_ns / 1000000))
    local elapsed_s=$((elapsed_ms / 1000))
    echo "$elapsed_s seconds"
}}

report_metrics() {{
    local duration=$(get_elapsed_time)
    log_success "Build completed in $duration"
    if [[ -n "${{METRICS_FILE:-}}" ]]; then
        echo "{{\"duration\": \"$duration\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}}" > "$METRICS_FILE"
    fi
}}


#!/bin/bash
set -e
APP_NAME="qmoi_ai"
ENTRY_SCRIPT="qmoiexe.py"
ICON_FILE="qmoi_ai_icon.ico"
BUILD_DIR="dist"
VENV_DIR="venv"
TIMESTAMP=$(date +"%Y-%m-%d_%H%M%S")
LOG_DIR="build_logs"
LOG_FILE="$LOG_DIR/build_${TIMESTAMP}.log"

mkdir -p "$LOG_DIR"

echo "[🔧] Starting QMOI AI build..." > "$LOG_FILE"

if [ ! -f "$ENTRY_SCRIPT" ]; then
  echo "❌ Entry script $ENTRY_SCRIPT not found!" | tee -a "$LOG_FILE"
  exit 1
fi

# Git pull
echo "[🌍] Pulling latest..." | tee -a "$LOG_FILE"
git pull origin main >> "$LOG_FILE" 2>&1

# Create venv
if [ ! -d "$VENV_DIR" ]; then
  /usr/bin/python3.12 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

# Upgrade tools
pip install --upgrade pip setuptools wheel >> "$LOG_FILE" 2>&1
pip install --force-reinstall pyinstaller >> "$LOG_FILE" 2>&1

# Clean
rm -rf build "$BUILD_DIR"
rm -f *.spec

# Build
echo "[⚙️] Building..." | tee -a "$LOG_FILE"
pyinstaller --noconfirm --onefile --windowed \
  --name "$APP_NAME" \
  --icon "$ICON_FILE" \
  --add-data "app:app" --add-data "backend:backend" \
  "$ENTRY_SCRIPT" >> "$LOG_FILE" 2>&1

# Release if successful
if [ -f "$BUILD_DIR/$APP_NAME" ]; then
  echo "[✅] Build successful: $BUILD_DIR/$APP_NAME" | tee -a "$LOG_FILE"
  gh release delete v1.0.0 --yes || true
  gh release create v1.0.0 "$BUILD_DIR/$APP_NAME" \
    --title "QMOI AI v1.0.0" \
    --notes "Auto-built using QCity automation." >> "$LOG_FILE" 2>&1
else
  echo "[❌] Build failed." | tee -a "$LOG_FILE"
fi

# Git auto push
git add *.py app/ backend/ *.md *.json *.yml *.ico
git commit -m "Auto: QMOI build update $TIMESTAMP" || echo "Nothing to commit"
git push origin main >> "$LOG_FILE" 2>&1

deactivate
