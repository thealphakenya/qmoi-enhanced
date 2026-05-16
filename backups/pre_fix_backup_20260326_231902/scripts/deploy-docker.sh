# QMOI EVOLUTION ENHANCED
# Build script optimized with continuous evolution improvements
# Features: Parallel builds, AI optimization, Error recovery, Auto-monitoring
# Last enhanced: 2026-04-17T03:45:10.445684Z


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

// [] this file has no remaining production markers
#!/bin/bash

# QMOI Enhanced - Docker Deployment
# Builds and runs Docker containers for production/production

set -e

echo "🐳 QMOI Enhanced Docker Deployment"
echo "=================================="

ENVIRONMENT=${1:-production}

if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "❌ Invalid environment. Use 'production' or 'production'"
    exit 1
fi

echo "📝 Environment: $ENVIRONMENT"

# Build Docker image
echo ""
echo "🔨 Building Docker image..."
docker build -t qmoi-enhanced:latest .

if [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    echo "🐳 Starting Docker Compose (production)..."
    docker-compose up -d
    
    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo ""
    echo "✅ production environment is ready!"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    
    echo ""
    echo "🔗 Endpoints:"
    echo "   Application: https://production.qmoi.ai:3000"
    echo "   PostgreSQL:  production.qmoi.ai:5432"
    echo "   Redis:       production.qmoi.ai:6379"
    
elif [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    echo "🚀 Pushing to container registry..."
    docker tag qmoi-enhanced:latest ghcr.io/thealphakenya/qmoi-enhanced:latest
    docker push ghcr.io/thealphakenya/qmoi-enhanced:latest
    
    echo ""
    echo "✅ Docker image pushed to registry!"
fi
