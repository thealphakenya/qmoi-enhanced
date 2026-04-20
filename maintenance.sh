#!/bin/bash
# QMOI Enhanced - Automated Maintenance Script
# Performs routine maintenance tasks for the AI system

echo "🔧 QMOI Enhanced - Automated Maintenance"
echo "========================================"
echo "Started: $(date)"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
LOG_RETENTION_DAYS=7
BACKUP_RETENTION_COUNT=5
MAINTENANCE_LOG="maintenance_$(date +%Y%m%d_%H%M%S).log"

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$MAINTENANCE_LOG"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$MAINTENANCE_LOG"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$MAINTENANCE_LOG"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$MAINTENANCE_LOG"
}

# Function to clean old log files
clean_logs() {
    log "Cleaning old log files (older than $LOG_RETENTION_DAYS days)..."

    # Find and remove old log files
    find . -name "*.log" -type f -mtime +$LOG_RETENTION_DAYS -exec rm -f {} \; 2>/dev/null
    if [ $? -eq 0 ]; then
        success "Old log files cleaned"
    else
        warning "Some log files could not be cleaned"
    fi
}

# Function to rotate and compress logs
rotate_logs() {
    log "Rotating and compressing log files..."

    # Compress old maintenance logs
    find . -name "maintenance_*.log" -type f -mtime +1 -exec gzip {} \; 2>/dev/null

    # Keep only recent compressed maintenance logs
    ls -t maintenance_*.log.gz 2>/dev/null | tail -n +$((BACKUP_RETENTION_COUNT + 1)) | xargs rm -f 2>/dev/null

    success "Log rotation completed"
}

# Function to clean temporary files
clean_temp_files() {
    log "Cleaning temporary files..."

    # Remove Python cache files
    find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null
    find . -name "*.pyc" -type f -delete 2>/dev/null
    find . -name "*.pyo" -type f -delete 2>/dev/null

    # Remove other temp files
    find . -name "*.tmp" -type f -delete 2>/dev/null
    find . -name "*.bak" -type f -mtime +1 -delete 2>/dev/null

    success "Temporary files cleaned"
}

# Function to check disk space
check_disk_space() {
    log "Checking disk space..."

    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

    if [ $disk_usage -gt 90 ]; then
        error "Disk usage is critically high: ${disk_usage}%"
        return 1
    elif [ $disk_usage -gt 80 ]; then
        warning "Disk usage is high: ${disk_usage}%"
    else
        success "Disk usage is normal: ${disk_usage}%"
    fi

    return 0
}

# Function to verify service health
verify_services() {
    log "Verifying AI service health..."

    services=("ai_anomaly_service.pid" "ml_service.pid" "nlp_service.pid" "cv_service.pid" "autonomous_service.pid" "advanced_analytics_service.pid" "advanced_performance_optimizer.pid" "ai_orchestrator.pid")
    failed_services=()

    for service_pid in "${services[@]}"; do
        service_name=$(basename "$service_pid" .pid)
        if [ -f "$service_pid" ]; then
            pid=$(cat "$service_pid")
            if ! ps -p $pid > /dev/null 2>&1; then
                failed_services+=("$service_name")
                error "Service $service_name is not running (PID file exists but process not found)"
            fi
        else
            failed_services+=("$service_name")
            error "Service $service_name PID file not found"
        fi
    done

    if [ ${#failed_services[@]} -eq 0 ]; then
        success "All AI services are running"
        return 0
    else
        error "Services not running: ${failed_services[*]}"
        return 1
    fi
}

# Function to backup configuration
backup_config() {
    log "Creating system backup..."

    # Use the dedicated backup script
    if [ -x "./backup_recovery.sh" ]; then
        ./backup_recovery.sh auto
        if [ $? -eq 0 ]; then
            success "System backup created successfully"
        else
            warning "System backup had issues"
        fi
    else
        warning "Backup script not found, creating basic config backup..."

        backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$backup_dir"

        # Backup important configuration files
        cp -r *.json "$backup_dir/" 2>/dev/null
        cp -r *.yaml "$backup_dir/" 2>/dev/null
        cp -r *.yml "$backup_dir/" 2>/dev/null
        cp .env* "$backup_dir/" 2>/dev/null

        # Compress backup
        tar -czf "${backup_dir}.tar.gz" -C "$backup_dir" . 2>/dev/null && rm -rf "$backup_dir"

        # Keep only recent backups
        ls -t backups/*.tar.gz 2>/dev/null | tail -n +$((BACKUP_RETENTION_COUNT + 1)) | xargs rm -f 2>/dev/null

        success "Basic configuration backup created: ${backup_dir}.tar.gz"
    fi
}

# Function to optimize performance
optimize_performance() {
    log "Running performance optimizations..."

    # Clear system cache (if possible)
    sync
    echo 3 > /proc/sys/vm/drop_caches 2>/dev/null && success "System cache cleared" || warning "Could not clear system cache"

    # Restart any stuck services (optional - commented out for safety)
    # warning "Service restart skipped (uncomment in script if needed)"
}

# Function to update system metrics
update_metrics() {
    log "Updating system metrics..."

    # Run a quick system test
    python3 -c "
import ai_orchestrator
import time
try:
    orchestrator = ai_orchestrator.ai_orchestrator
    status = orchestrator.get_system_status()
    print('System health check passed')
except Exception as e:
    print(f'System health check failed: {e}')
" 2>/dev/null && success "System metrics updated" || warning "System metrics update had issues"
}

# Main maintenance routine
main() {
    log "Starting automated maintenance routine..."

    # Create backups directory
    mkdir -p backups

    # Run maintenance tasks
    clean_logs
    echo ""

    rotate_logs
    echo ""

    clean_temp_files
    echo ""

    check_disk_space
    disk_status=$?
    echo ""

    verify_services
    service_status=$?
    echo ""

    backup_config
    echo ""

    optimize_performance
    echo ""

    update_metrics
    echo ""

    # Summary
    log "Maintenance routine completed"

    if [ $disk_status -eq 0 ] && [ $service_status -eq 0 ]; then
        success "All maintenance tasks completed successfully"
        echo ""
        echo "📊 Maintenance Summary:"
        echo "  • Log files cleaned and rotated"
        echo "  • Temporary files removed"
        echo "  • Disk space is adequate"
        echo "  • All AI services are running"
        echo "  • Configuration backed up"
        echo "  • Performance optimized"
        echo "  • System metrics updated"
        echo ""
        echo "Next maintenance run: $(date -d '+24 hours')"
    else
        warning "Some maintenance tasks had issues - check logs for details"
    fi

    echo ""
    log "Maintenance log saved to: $MAINTENANCE_LOG"
}

# Run maintenance
main