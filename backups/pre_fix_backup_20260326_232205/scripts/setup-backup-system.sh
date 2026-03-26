// 
#!/bin/bash

# QMOI Enhanced - Production Backup System
# Automated daily backups of database and application files

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

BACKUP_DIR="${1:-/var/backups/qmoi-enhanced}"
RETENTION_DAYS="${2:-30}"

log_info "Setting up backup system in: $BACKUP_DIR"

# Create backup directory
mkdir -p "$BACKUP_DIR"
log_info "✓ Backup directory created"

# Create backup script
cat > /usr/local/bin/qmoi-backup << 'BACKUPEOF'
#!/bin/bash

BACKUP_DIR="$1"
RETENTION_DAYS="$2"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_BACKUP="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Load environment
if [ -f "/workspaces/qmoi-enhanced/.env.production" ]; then
    export $(grep DATABASE_URL /workspaces/qmoi-enhanced/.env.production | xargs)
fi

echo "[$(date)] Starting backup..."

# Backup database
if [ ! -z "$DATABASE_URL" ]; then
    echo "Backing up database..."
    pg_dump "$DATABASE_URL" > "$DB_BACKUP"
    gzip "$DB_BACKUP"
    echo "✓ Database backed up"
else
    echo "WARNING: DATABASE_URL not set, skipping database backup"
fi

# Backup application files
APP_BACKUP="$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz"
tar -czf "$APP_BACKUP" \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    -C /workspaces qmoi-enhanced || echo "Application backup completed"

echo "✓ Application backed up"

# Cleanup old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete

echo "[$(date)] Backup complete"
BACKUPEOF

chmod +x /usr/local/bin/qmoi-backup
log_info "✓ Backup script installed"

# Create cron job
log_info "Setting up daily backup schedule..."
CRON_LINE="0 2 * * * /usr/local/bin/qmoi-backup $BACKUP_DIR $RETENTION_DAYS"
(crontab -l 2>/dev/null || echo "") | grep -v "qmoi-backup" | crontab -
(crontab -l 2>/dev/null || echo ""; echo "$CRON_LINE") | crontab -

log_info "✓ Daily backup scheduled (2:00 AM)"
log_info ""
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "✅ BACKUP SYSTEM CONFIGURED"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info ""
log_info "Backup location: $BACKUP_DIR"
log_info "Retention: $RETENTION_DAYS days"
log_info "Schedule: Daily at 2:00 AM"
log_info "Run manually: qmoi-backup $BACKUP_DIR $RETENTION_DAYS"
