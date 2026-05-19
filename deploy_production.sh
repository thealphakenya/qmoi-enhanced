#!/bin/bash

# QMOI Enhanced production Deployment Script
# This script deploys the QMOI enhanced systems to production

set -e

echo "🚀 Starting QMOI Enhanced production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."

    required_vars=("DB_PASSWORD" "JWT_SECRET" "GRAFANA_PASSWORD")
    missing_vars=()

    for const in "${required_vars[@]}"; do
        if [[ -z "${!const}" ]]; then
            missing_vars+=("$const")
        fi
    done

    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        print_error "Missing required environment variables: ${missing_vars[*]}"
        print_error "Please set these variables before running the deployment."
        exit 1
    fi

    print_status "All required environment variables are set."
}

# Create required directories
create_directories() {
    print_status "Creating required directories..."

    mkdir -p logs
    mkdir -p data
    mkdir -p monitoring/grafana/provisioning/datasources
    mkdir -p monitoring/grafana/provisioning/dashboards
    mkdir -p nginx/ssl
    mkdir -p sql

    print_status "Directories created successfully."
}

# Generate SSL certificates (self-signed for development)
generate_ssl_certs() {
    print_status "Generating SSL certificates..."

    if [[ ! -f nginx/ssl/cert.pem ]] || [[ ! -f nginx/ssl/key.pem ]]; then
        openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=QMOI/CN=qmoi.ai"
        print_status "SSL certificates generated."
    else
        print_status "SSL certificates already exist."
    fi
}

# Create database initialization script
create_db_init() {
    print_status "Creating database initialization script..."

    cat > sql/init.sql << 'EOF'
-- QMOI production Database Initialization

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS qmoi;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS monitoring;

-- Create tables
CREATE TABLE IF NOT EXISTS qmoi.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics.metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monitoring.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_metrics_service_timestamp ON analytics.metrics(service_name, timestamp);
CREATE INDEX IF NOT EXISTS idx_alerts_severity_created ON monitoring.alerts(severity, created_at);

-- Insert sample data
INSERT INTO qmoi.users (email) VALUES ('admin@qmoi.ai') ON CONFLICT (email) DO NOTHING;
EOF

    print_status "Database initialization script created."
}

# Build and start services
deploy_services() {
    print_status "Building and starting production services..."

    # Build custom images
    docker-compose -f docker-compose.production.yml build

    # Start services
    docker-compose -f docker-compose.production.yml up -d

    print_status "Services started successfully."
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to become healthy..."

    # Wait for database
    print_status "Waiting for database..."
    timeout=60
    while [[ $timeout -gt 0 ]]; do
        if docker-compose -f docker-compose.production.yml exec -T database pg_isready -U qmoi_user -d qmoi_production 2>/dev/null; then
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done

    if [[ $timeout -le 0 ]]; then
        print_error "Database failed to start within 60 seconds"
        exit 1
    fi

    # Wait for API server
    print_status "Waiting for API server..."
    timeout=60
    while [[ $timeout -gt 0 ]]; do
        if curl -f https://production-api.qmoi-enhanced.com:8000/health 2>/dev/null; then
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done

    if [[ $timeout -le 0 ]]; then
        print_error "API server failed to start within 60 seconds"
        exit 1
    fi

    print_status "All services are healthy!"
}

# Run post-deployment tests
run_post_deployment_tests() {
    print_status "Running post-deployment tests..."

    # Test API endpoints
    if curl -f https://production-api.qmoi-enhanced.com:8000/health; then
        print_status "✅ API server health check passed"
    else
        print_error "❌ API server health check failed"
        exit 1
    fi

    # Test Grafana
    if curl -f https://production-api.qmoi-enhanced.com:3000/api/health 2>/dev/null; then
        print_status "✅ Grafana health check passed"
    else
        print_warning "⚠️  Grafana health check failed (may take longer to start)"
    fi

    print_status "Post-deployment tests completed."
}

# Display deployment information
show_deployment_info() {
    print_status "🚀 Deployment completed successfully!"
    echo ""
    echo "📊 Service Endpoints:"
    echo "  🌐 API Server:     https://production-api.qmoi-enhanced.com:8000"
    echo "  📊 Grafana:        https://production-api.qmoi-enhanced.com:3000 (admin/${GRAFANA_PASSWORD})"
    echo "  📈 Prometheus:     https://production-api.qmoi-enhanced.com:9090"
    echo "  🐘 Database:       production-api.qmoi-enhanced.com:5432"
    echo "  🔴 Redis:          production-api.qmoi-enhanced.com:6379"
    echo ""
    echo "🔧 Management Commands:"
    echo "  📊 View logs:      docker-compose -f docker-compose.production.yml logs -f"
    echo "  🛑 Stop services:  docker-compose -f docker-compose.production.yml down"
    echo "  🔄 Restart:        docker-compose -f docker-compose.production.yml restart"
    echo "  📈 Scale service:  docker-compose -f docker-compose.production.yml up -d --scale ai-api-server=3"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Configure SSL certificates in nginx/ssl/"
    echo "  2. Set up domain name and DNS"
    echo "  3. Configure monitoring alerts"
    echo "  4. Set up backup procedures"
    echo "  5. Configure auto-scaling policies"
}

# Main deployment function
main() {
    echo "🚀 QMOI Enhanced production Deployment"
    echo "===================================="

    check_env_vars
    create_directories
    generate_ssl_certs
    create_db_init
    deploy_services
    wait_for_services
    run_post_deployment_tests
    show_deployment_info

    print_status "🎉 production deployment completed successfully!"
}

# Run main function
main "$@" 