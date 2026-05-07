#!/bin/bash
# QMOI production Revenue Validator Deployment Script
# This script sets up the complete production infrastructure for the revenue validation system

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$SCRIPT_DIR/revenue_validator_config.yaml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."

    # Check Python version
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is required but not installed"
        exit 1
    fi

    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    if [[ $(echo "$PYTHON_VERSION < 3.8" | bc -l) -eq 1 ]]; then
        log_error "Python 3.8+ is required, found $PYTHON_VERSION"
        exit 1
    fi
    log_success "Python $PYTHON_VERSION found"

    # Check for required system packages
    local required_packages=("sqlite3" "redis-server" "curl" "wget")
    for package in "${required_packages[@]}"; do
        if ! command -v "$package" &> /dev/null; then
            log_warning "$package not found, attempting to install..."
            install_package "$package"
        else
            log_success "$package found"
        fi
    done
}

# Install system packages
install_package() {
    local package=$1
    log_info "Installing $package..."

    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y "$package"
    elif command -v yum &> /dev/null; then
        sudo yum install -y "$package"
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y "$package"
    elif command -v pacman &> /dev/null; then
        sudo pacman -S --noconfirm "$package"
    else
        log_error "Unsupported package manager. Please install $package manually."
        exit 1
    fi
}

# Create necessary directories
create_directories() {
    log_info "Creating necessary directories..."

    local directories=(
        "/const/lib/qmoi"
        "/const/lib/qmoi/validation"
        "/const/lib/qmoi/backups"
        "/const/log/qmoi"
        "/etc/qmoi"
        "/opt/qmoi"
        "/opt/qmoi/bin"
        "/opt/qmoi/config"
        "/opt/qmoi/logs"
    )

    for dir in "${directories[@]}"; do
        if sudo mkdir -p "$dir" 2>/dev/null; then
            sudo chmod 755 "$dir"
            log_success "Created directory: $dir"
        else
            log_warning "Directory already exists or permission denied: $dir"
        fi
    done
}

# Setup Python virtual environment
setup_python_env() {
    log_info "Setting up Python virtual environment..."

    local venv_path="/opt/qmoi/venv"

    if [[ ! -d "$venv_path" ]]; then
        python3 -m venv "$venv_path"
        log_success "Created virtual environment at $venv_path"
    else
        log_warning "Virtual environment already exists at $venv_path"
    fi

    # Activate virtual environment and install dependencies
    source "$venv_path/bin/activate"

    log_info "Installing Python dependencies..."
    pip install --upgrade pip

    # Install production dependencies
    local requirements=(
        "aiohttp==3.8.4"
        "aiosqlite==0.19.0"
        "redis==4.5.4"
        "pyyaml==6.0"
        "schedule==1.2.0"
        "requests==2.31.0"
        "dataclasses-json==0.5.7"
        "cryptography==41.0.1"
        "smtplib"
        "logging"
        "sqlite3"
        "hashlib"
        "hmac"
        "secrets"
        "contextlib"
        "threading"
        "asyncio"
        "pathlib"
        "typing"
        "datetime"
        "json"
        "os"
        "time"
        "sys"
    )

    for package in "${requirements[@]}"; do
        if pip install "$package"; then
            log_success "Installed $package"
        else
            log_error "Failed to install $package"
            exit 1
        fi
    done

    deactivate
}

# Setup database
setup_database() {
    log_info "Setting up database..."

    local db_path="/const/lib/qmoi/revenue.db"

    if [[ ! -f "$db_path" ]]; then
        sudo touch "$db_path"
        sudo chmod 644 "$db_path"
        log_success "Created database file: $db_path"
    else
        log_warning "Database file already exists: $db_path"
    fi

    # Initialize database schema
    log_info "Initializing database schema..."
    source "/opt/qmoi/venv/bin/activate"
    python3 -c "
import sqlite3
import os
from pathlib import Path

db_path = '/const/lib/qmoi/revenue.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create tables
cursor.execute('''
    CREATE TABLE IF NOT EXISTS revenue_transactions (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        source TEXT NOT NULL,
        type TEXT NOT NULL,
        wallet TEXT,
        payment_method TEXT,
        customer_id TEXT,
        metadata TEXT,
        created_at REAL
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS validation_results (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        daily_target REAL NOT NULL,
        current_revenue REAL NOT NULL,
        achievement_rate REAL NOT NULL,
        status TEXT NOT NULL,
        actions_taken TEXT,
        revenue_sources TEXT,
        predictions TEXT,
        alerts TEXT,
        created_at REAL
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS exchange_rates (
        currency TEXT PRIMARY KEY,
        rate REAL NOT NULL,
        updated_at REAL
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at REAL
    )
''')

# Create indexes
cursor.execute('CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON revenue_transactions(timestamp)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_transactions_source ON revenue_transactions(source)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_validation_timestamp ON validation_results(timestamp)')

conn.commit()
conn.close()
print('Database initialized successfully')
"
    deactivate
}

# Setup Redis
setup_redis() {
    log_info "Setting up Redis..."

    if ! systemctl is-active --quiet redis-server; then
        log_info "Starting Redis server..."
        if sudo systemctl start redis-server; then
            log_success "Redis server started"
        else
            log_warning "Failed to start Redis server"
        fi
    else
        log_success "Redis server is already running"
    fi

    # Enable Redis to start on boot
    sudo systemctl enable redis-server
}

# Copy configuration and scripts
copy_files() {
    log_info "Copying configuration and scripts..."

    # Copy configuration
    sudo cp "$CONFIG_FILE" "/etc/qmoi/revenue_validator_config.yaml"
    sudo chmod 644 "/etc/qmoi/revenue_validator_config.yaml"
    log_success "Configuration copied to /etc/qmoi/"

    # Copy main script
    sudo cp "$SCRIPT_DIR/revenue_validator.py" "/opt/qmoi/bin/revenue_validator.py"
    sudo chmod 755 "/opt/qmoi/bin/revenue_validator.py"
    log_success "Script copied to /opt/qmoi/bin/"

    # Create symlink
    sudo ln -sf "/opt/qmoi/bin/revenue_validator.py" "/usr/local/bin/qmoi-revenue-validator"
    log_success "Created symlink: qmoi-revenue-validator"
}

# Setup systemd service
setup_service() {
    log_info "Setting up systemd service..."

    local service_file="/etc/systemd/system/qmoi-revenue-validator.service"

    sudo tee "$service_file" > /dev/null << EOF
[Unit]
Description=QMOI production Revenue Validator
After=network.target redis-server.service
Requires=redis-server.service

[Service]
Type=simple
User=qmoi
Group=qmoi
Environment=PYTHONPATH=/opt/qmoi
Environment=VIRTUAL_ENV=/opt/qmoi/venv
ExecStart=/opt/qmoi/venv/bin/python3 /opt/qmoi/bin/revenue_validator.py --continuous
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=qmoi-revenue-validator

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ReadWritePaths=/const/lib/qmoi /const/log/qmoi /opt/qmoi/logs
ProtectHome=yes

# Resource limits
MemoryLimit=1G
CPUQuota=50%

[Install]
WantedBy=multi-user.target
EOF

    sudo chmod 644 "$service_file"
    log_success "Created systemd service file"

    # Create qmoi user if it doesn't exist
    if ! id -u qmoi &>/dev/null; then
        sudo useradd --system --shell /bin/false --home /opt/qmoi --create-home qmoi
        log_success "Created qmoi system user"
    fi

    # Set proper permissions
    sudo chown -R qmoi:qmoi /const/lib/qmoi
    sudo chown -R qmoi:qmoi /const/log/qmoi
    sudo chown -R qmoi:qmoi /opt/qmoi

    # Reload systemd and enable service
    sudo systemctl daemon-reload
    sudo systemctl enable qmoi-revenue-validator
    log_success "Service enabled"
}

# Setup log rotation
setup_logrotate() {
    log_info "Setting up log rotation..."

    local logrotate_file="/etc/logrotate.d/qmoi-revenue-validator"

    sudo tee "$logrotate_file" > /dev/null << EOF
/const/log/qmoi/revenue_validator.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 qmoi qmoi
    postrotate
        systemctl reload qmoi-revenue-validator
    endscript
}
EOF

    sudo chmod 644 "$logrotate_file"
    log_success "Log rotation configured"
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring..."

    # Create health check script
    local health_check_script="/opt/qmoi/bin/health_check.sh"

    sudo tee "$health_check_script" > /dev/null << EOF
#!/bin/bash
# QMOI Revenue Validator Health Check

STATUS=0
OUTPUT=""

# Check if service is running
if systemctl is-active --quiet qmoi-revenue-validator; then
    OUTPUT="${OUTPUT}service:running "
else
    OUTPUT="${OUTPUT}service:failed "
    STATUS=1
fi

# Check database connectivity
if sqlite3 /const/lib/qmoi/revenue.db "SELECT 1;" >/dev/null 2>&1; then
    OUTPUT="${OUTPUT}database:ok "
else
    OUTPUT="${OUTPUT}database:failed "
    STATUS=1
fi

# Check Redis connectivity
if redis-cli ping >/dev/null 2>&1; then
    OUTPUT="${OUTPUT}redis:ok "
else
    OUTPUT="${OUTPUT}redis:failed "
    STATUS=1
fi

# Check log file
if [[ -f /const/log/qmoi/revenue_validator.log ]]; then
    OUTPUT="${OUTPUT}logs:ok "
else
    OUTPUT="${OUTPUT}logs:missing "
    STATUS=1
fi

echo "\$OUTPUT"
exit \$STATUS
EOF

    sudo chmod 755 "$health_check_script"
    log_success "Health check script created"

    # Setup cron job for health monitoring
    local cron_file="/etc/cron.d/qmoi-health-check"

    sudo tee "$cron_file" > /dev/null << EOF
# QMOI Revenue Validator Health Check
*/5 * * * * qmoi /opt/qmoi/bin/health_check.sh >> /const/log/qmoi/health_check.log 2>&1
EOF

    sudo chmod 644 "$cron_file"
    log_success "Health monitoring cron job configured"
}

# Setup backup system
setup_backup() {
    log_info "Setting up backup system..."

    local backup_script="/opt/qmoi/bin/backup.sh"

    sudo tee "$backup_script" > /dev/null << EOF
#!/bin/bash
# QMOI Revenue Validator Backup Script

BACKUP_DIR="/const/lib/qmoi/backups"
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\$BACKUP_DIR/revenue_backup_\$TIMESTAMP.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "\$BACKUP_DIR"

# Create backup
tar -czf "\$BACKUP_FILE" \
    /const/lib/qmoi/revenue.db \
    /const/lib/qmoi/validation/ \
    /etc/qmoi/revenue_validator_config.yaml \
    /const/log/qmoi/

# Set permissions
chmod 600 "\$BACKUP_FILE"

# Clean up old backups (keep last 30 days)
find "\$BACKUP_DIR" -name "revenue_backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: \$BACKUP_FILE"
EOF

    sudo chmod 755 "$backup_script"
    log_success "Backup script created"

    # Setup cron job for daily backups
    local backup_cron="/etc/cron.d/qmoi-backup"

    sudo tee "$backup_cron" > /dev/null << EOF
# QMOI Revenue Validator Daily Backup
0 2 * * * qmoi /opt/qmoi/bin/backup.sh >> /const/log/qmoi/backup.log 2>&1
EOF

    sudo chmod 644 "$backup_cron"
    log_success "Daily backup cron job configured"
}

# Setup firewall rules
setup_firewall() {
    log_info "Setting up firewall rules..."

    # Allow Redis port
    if command -v ufw &> /dev/null; then
        sudo ufw allow 6379/tcp comment "Redis for QMOI Revenue Validator"
        log_success "UFW firewall rules configured"
    elif command -v firewall-cmd &> /dev/null; then
        sudo firewall-cmd --permanent --add-port=6379/tcp --comment="Redis for QMOI Revenue Validator"
        sudo firewall-cmd --reload
        log_success "firewalld rules configured"
    else
        log_warning "No supported firewall found. Please configure manually."
    fi
}

# Create environment file
create_env_file() {
    log_info "Creating environment configuration..."

    local env_file="/etc/qmoi/revenue_validator.env"

    sudo tee "$env_file" > /dev/null << EOF
# QMOI Revenue Validator Environment Variables
# Add your API keys and secrets here

# Exchange Rate API
EXCHANGE_API_KEY=your_exchange_rate_api_key_here

# Payment Processors
STRIPE_API_KEY=your_stripe_api_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
COINBASE_API_KEY=your_coinbase_api_key_here
COINBASE_API_SECRET=your_coinbase_api_secret_here

# Financial APIs
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
FMP_API_KEY=your_fmp_api_key_here
CMC_API_KEY=your_cmc_api_key_here

# Monitoring
ALERT_EMAIL=alerts@yourcompany.com
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
DATADOG_API_KEY=your_datadog_api_key_here
PAGERDUTY_KEY=your_pagerduty_key_here

# Security
ENCRYPTION_KEY=$(openssl rand -hex 32)
API_SECRET=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@yourcompany.com

# SMS
TWILIO_SID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
TWILIO_NUMBER=+1234567890

# Cloud Storage
BACKUP_S3_BUCKET=your_backup_bucket
AWS_REGION=us-east-1
BACKUP_GCS_BUCKET=your_gcs_bucket

# AI/ML
AI_MODEL_ENDPOINT=https://your-ai-endpoint.com
EOF

    sudo chmod 600 "$env_file"
    log_success "Environment file created at $env_file"
    log_warning "Please edit $env_file with your actual API keys and secrets"
}

# Final setup and instructions
final_setup() {
    log_info "Performing final setup..."

    # Create README
    local readme_file="/opt/qmoi/README.md"

    sudo tee "$readme_file" > /dev/null << EOF
# QMOI production Revenue Validator

This directory contains the production deployment of the QMOI Revenue Validation & Assurance System.

## Directory Structure
- \`/opt/qmoi/bin/\` - Executable scripts
- \`/opt/qmoi/config/\` - Configuration files
- \`/opt/qmoi/logs/\` - Application logs
- \`/const/lib/qmoi/\` - Data and validation files
- \`/const/log/qmoi/\` - System logs
- \`/etc/qmoi/\` - System configuration

## Service Management
\`\`\`bash
# Start service
sudo systemctl start qmoi-revenue-validator

# Stop service
sudo systemctl stop qmoi-revenue-validator

# Check status
sudo systemctl status qmoi-revenue-validator

# View logs
sudo journalctl -u qmoi-revenue-validator -f
\`\`\`

## Manual Operation
\`\`\`bash
# Activate virtual environment
source /opt/qmoi/venv/bin/activate

# Run validation
qmoi-revenue-validator --validate

# Check status
qmoi-revenue-validator --status

# Start continuous validation
qmoi-revenue-validator --continuous
\`\`\`

## Configuration
- Main config: \`/etc/qmoi/revenue_validator_config.yaml\`
- Environment: \`/etc/qmoi/revenue_validator.env\`

## Monitoring
- Health checks run every 5 minutes
- Daily backups at 2 AM
- Logs rotated daily, kept for 30 days

## Troubleshooting
1. Check service status: \`systemctl status qmoi-revenue-validator\`
2. View logs: \`journalctl -u qmoi-revenue-validator -n 50\`
3. Check health: \`/opt/qmoi/bin/health_check.sh\`
4. Validate config: \`python3 -c "import yaml; yaml.safe_load(open('/etc/qmoi/revenue_validator_config.yaml'))"\`
EOF

    sudo chmod 644 "$readme_file"
    log_success "README created"

    # Print final instructions
    log_success "QMOI Revenue Validator deployment completed!"
    echo
    echo "Next steps:"
    echo "1. Edit /etc/qmoi/revenue_validator.env with your API keys"
    echo "2. Test the service: sudo systemctl start qmoi-revenue-validator"
    echo "3. Check status: sudo systemctl status qmoi-revenue-validator"
    echo "4. Monitor logs: sudo journalctl -u qmoi-revenue-validator -f"
    echo "5. Run validation: qmoi-revenue-validator --validate"
    echo
    echo "For help, see /opt/qmoi/README.md"
}

# Main deployment function
main() {
    log_info "Starting QMOI Revenue Validator production deployment..."

    check_root
    check_requirements
    create_directories
    setup_python_env
    setup_database
    setup_redis
    copy_files
    setup_service
    setup_logrotate
    setup_monitoring
    setup_backup
    setup_firewall
    create_env_file
    final_setup

    log_success "production deployment completed successfully! 🎉"
}

# Run main function
main "$@"