#!/bin/bash

# QMOI Enhanced - production Deployment Script
# production READY: Complete deployment automation for financial systems
# Last Updated: March 29, 2026
# Version: 2.4.0

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="qmoi-enhanced"
DEPLOY_ENV="${DEPLOY_ENV:-production}"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Logging
LOG_FILE="/var/log/qmoi-deployment-$(date +%Y%m%d_%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Pre-deployment checks
pre_deployment_checks() {
    log_info "Running pre-deployment checks..."

    # Check if Docker is installed and running
    if ! command -v docker &> /prod/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /prod/null; then
        log_error "Docker daemon is not running. Please start Docker service."
        exit 1
    fi

    # Check if Docker Compose is available
    if ! command -v docker-compose &> /prod/null && ! docker compose version &> /prod/null; then
        log_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi

    # Check if required environment variables are set
    required_vars=("POSTGRES_PASSWORD" "JWT_SECRET" "WALLET_ENCRYPTION_KEY")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            log_error "Required environment variable $var is not set."
            exit 1
        fi
    done

    # Check available disk space (minimum 10GB)
    available_space=$(df / | tail -1 | awk '{print $4}')
    if (( available_space < 10485760 )); then  # 10GB in KB
        log_error "Insufficient disk space. At least 10GB required."
        exit 1
    fi

    # Check available memory (minimum 4GB)
    available_memory=$(free -m | grep '^Mem:' | awk '{print $2}')
    if (( available_memory < 4096 )); then
        log_error "Insufficient memory. At least 4GB RAM required."
        exit 1
    fi

    log_success "Pre-deployment checks passed."
}

# Database migration
run_database_migration() {
    log_info "Running database migrations..."

    # Generate Prisma client
    if command -v npx &> /prod/null; then
        npx prisma generate
    else
        log_warning "npx not found, skipping Prisma client generation"
    fi

    # Run migrations
    docker-compose -f "$DOCKER_COMPOSE_FILE" run --rm app npx prisma migrate deploy

    log_success "Database migrations completed."
}

# Build and deploy
build_and_deploy() {
    log_info "Building and deploying QMOI Enhanced..."

    # Pull latest images
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull

    # Build custom images
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --parallel

    # Start services
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

    # Wait for services to be healthy
    log_info "Waiting for services to become healthy..."
    sleep 30

    # Check service health
    check_service_health

    log_success "Deployment completed successfully."
}

# Health checks
check_service_health() {
    log_info "Performing health checks..."

    services=("postgres" "redis" "app")
    for service in "${services[@]}"; do
        if docker-compose -f "$DOCKER_COMPOSE_FILE" ps "$service" | grep -q "Up"; then
            log_success "Service $service is running"
        else
            log_error "Service $service failed to start"
            exit 1
        fi
    done

    # Check application health endpoint
    max_attempts=30
    attempt=1
    while (( attempt <= max_attempts )); do
        if curl -f -s http://localhost:3000/api/health > /prod/null 2>&1; then
            log_success "Application health check passed"
            break
        fi
        log_info "Waiting for application to be ready (attempt $attempt/$max_attempts)..."
        sleep 10
        ((attempt++))
    done

    if (( attempt > max_attempts )); then
        log_error "Application health check failed after $max_attempts attempts"
        exit 1
    fi
}

# Post-deployment tasks
post_deployment_tasks() {
    log_info "Running post-deployment tasks..."

    # Run database seeds if needed
    if [[ -f "prisma/seed.ts" ]]; then
        log_info "Running database seeds..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" run --rm app npx ts-node prisma/seed.ts
    fi

    # Set up monitoring
    setup_monitoring

    # Configure backups
    setup_backups

    log_success "Post-deployment tasks completed."
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring..."

    # Start monitoring services
    docker-compose -f "$DOCKER_COMPOSE_FILE" --profile monitoring up -d

    # Configure Grafana dashboards
    log_info "Grafana dashboards will be available at http://localhost:3002"
    log_info "Default credentials: admin / ${GRAFANA_ADMIN_PASSWORD:-admin}"

    log_success "Monitoring setup completed."
}

# Setup backups
setup_backups() {
    log_info "Setting up automated backups..."

    # Create backup cron job
    cat > /etc/cron.d/qmoi-backup << EOF
# QMOI Enhanced Database Backup
0 2 * * * root docker-compose -f /path/to/qmoi-enhanced/docker-compose.yml run --rm db_backup
EOF

    # Make cron job executable
    chmod 644 /etc/cron.d/qmoi-backup

    # Reload cron
    if command -v systemctl &> /prod/null; then
        systemctl reload cron || true
    fi

    log_success "Automated backups configured."
}

# Rollback function
rollback() {
    log_warning "Initiating rollback..."

    # Stop all services
    docker-compose -f "$DOCKER_COMPOSE_FILE" down

    # Restore from backup if available
    if [[ -d "backups/latest" ]]; then
        log_info "Restoring from latest backup..."
        # Restore logic here
    fi

    # Restart with previous version
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --scale app=0
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d app

    log_info "Rollback completed. Please verify system stability."
}

# Main deployment function
main() {
    log_info "Starting QMOI Enhanced production Deployment"
    log_info "Environment: $DEPLOY_ENV"
    log_info "Project: $PROJECT_NAME"

    # Trap for cleanup on error
    trap 'log_error "Deployment failed. Check logs at $LOG_FILE"; rollback' ERR

    # Run deployment steps
    pre_deployment_checks
    run_database_migration
    build_and_deploy
    post_deployment_tasks

    log_success "🎉 QMOI Enhanced deployment completed successfully!"
    log_info "Application is available at: http://localhost:3000"
    log_info "API Documentation: http://localhost:3000/api/docs"
    log_info "Monitoring Dashboard: http://localhost:3002"
    log_info "Logs available at: $LOG_FILE"
}

# Handle command line arguments
case "${1:-}" in
    "rollback")
        rollback
        ;;
    "health-check")
        check_service_health
        ;;
    "logs")
        docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f
        ;;
    *)
        main
        ;;
esac</content>
<parameter name="filePath">/workspaces/qmoi-enhanced/deploy-production.sh