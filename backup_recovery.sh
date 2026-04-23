<!-- AUTODEV Enhanced: 2026-04-20T09:07:01.066856 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:07.220205 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:03.045225 -->
#!/bin/bash

# QMOI Enhanced - Backup and Recovery System
# Automated backup creation and recovery procedures

echo "🔄 QMOI Enhanced - Backup & Recovery System"
echo "==========================================="

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="qmoi_backup_${TIMESTAMP}"
FULL_BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> backup_recovery.log
    echo -e "$1"
}

# Function to create backup
create_backup() {
    log_message "${BLUE}📦 Creating backup: ${BACKUP_NAME}${NC}"

    # Create backup directory
    mkdir -p "$FULL_BACKUP_PATH"

    # Backup configuration files
    log_message "📄 Backing up configuration files..."
    cp -r *.json "$FULL_BACKUP_PATH/" 2>/dev/null || log_message "${YELLOW}⚠️${NC} No JSON config files found"

    # Backup log files (compressed)
    log_message "📝 Backing up log files..."
    tar -czf "${FULL_BACKUP_PATH}/logs.tar.gz" *.log 2>/dev/null || log_message "${YELLOW}⚠️${NC} No log files to backup"

    # Backup AI service data/models (if any)
    log_message "🤖 Backing up AI service data..."
    mkdir -p "${FULL_BACKUP_PATH}/ai_data"
    # Add any AI model files or training data here
    find . -name "*.model" -o -name "*.pkl" -o -name "*training_data*" | head -10 | xargs -I {} cp {} "${FULL_BACKUP_PATH}/ai_data/" 2>/dev/null || log_message "${YELLOW}⚠️${NC} No AI model files found"

    # Backup system state
    log_message "⚙️ Backing up system state..."
    echo "Backup created: $(date)" > "${FULL_BACKUP_PATH}/backup_info.txt"
    echo "System status:" >> "${FULL_BACKUP_PATH}/backup_info.txt"
    ./status.sh >> "${FULL_BACKUP_PATH}/backup_info.txt" 2>/dev/null || echo "Status check failed" >> "${FULL_BACKUP_PATH}/backup_info.txt"

    # Create backup manifest
    cat > "${FULL_BACKUP_PATH}/manifest.txt" << EOF
QMOI Enhanced System Backup
Created: $(date)
Backup ID: ${BACKUP_NAME}
Contents:
- Configuration files (*.json)
- Log files (compressed)
- AI service data
- System state information
EOF

    # Compress the entire backup
    log_message "🗜️ Compressing backup..."
    cd "$BACKUP_DIR"
    tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
    rm -rf "$BACKUP_NAME"
    cd - > /dev/null

    log_message "${GREEN}✅ Backup created successfully: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz${NC}"
}

# Function to list backups
list_backups() {
    log_message "${BLUE}📋 Available backups:${NC}"
    if [ -d "$BACKUP_DIR" ]; then
        ls -la "$BACKUP_DIR"/*.tar.gz 2>/dev/null | while read line; do
            echo "  $line"
        done
    else
        log_message "${YELLOW}⚠️${NC} No backup directory found"
    fi
}

# Function to restore backup
restore_backup() {
    if [ -z "$1" ]; then
        log_message "${RED}❌ Error: Please specify backup file to restore${NC}"
        echo "Usage: $0 restore <backup_file.tar.gz>"
        exit 1
    fi

    BACKUP_FILE="$1"
    if [ ! -f "$BACKUP_FILE" ]; then
        log_message "${RED}❌ Error: Backup file not found: $BACKUP_FILE${NC}"
        exit 1
    fi

    log_message "${YELLOW}⚠️${NC} ${RED}WARNING: This will overwrite existing files!${NC}"
    read -p "Are you sure you want to restore from $BACKUP_FILE? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_message "${YELLOW}🛑 Restore cancelled by user${NC}"
        exit 0
    fi

    log_message "${BLUE}🔄 Restoring from backup: $BACKUP_FILE${NC}"

    # Create temporary directory for extraction
    TEMP_DIR=$(mktemp -d)
    log_message "📂 Extracting backup to temporary directory..."

    # Extract backup
    if tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"; then
        # Find the extracted directory
        EXTRACTED_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)

        if [ -d "$EXTRACTED_DIR" ]; then
            # Restore configuration files
            log_message "📄 Restoring configuration files..."
            cp -r "$EXTRACTED_DIR"/*.json . 2>/dev/null || log_message "${YELLOW}⚠️${NC} No JSON files to restore"

            # Restore AI data
            if [ -d "$EXTRACTED_DIR/ai_data" ]; then
                log_message "🤖 Restoring AI service data..."
                cp -r "$EXTRACTED_DIR/ai_data"/* . 2>/dev/null || log_message "${YELLOW}⚠️${NC} No AI data to restore"
            fi

            # Restore logs if requested
            if [ -f "$EXTRACTED_DIR/logs.tar.gz" ]; then
                log_message "📝 Restoring log files..."
                tar -xzf "$EXTRACTED_DIR/logs.tar.gz" || log_message "${YELLOW}⚠️${NC} Failed to restore logs"
            fi

            log_message "${GREEN}✅ Backup restored successfully${NC}"
        else
            log_message "${RED}❌ Error: Invalid backup structure${NC}"
            exit 1
        fi
    else
        log_message "${RED}❌ Error: Failed to extract backup${NC}"
        exit 1
    fi

    # Cleanup
    rm -rf "$TEMP_DIR"
}

# Function to cleanup old backups
cleanup_backups() {
    if [ -z "$1" ]; then
        DAYS="30"
    else
        DAYS="$1"
    fi

    log_message "${BLUE}🧹 Cleaning up backups older than $DAYS days...${NC}"

    if [ -d "$BACKUP_DIR" ]; then
        find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$DAYS -delete
        log_message "${GREEN}✅ Old backups cleaned up${NC}"
    else
        log_message "${YELLOW}⚠️${NC} No backup directory found"
    fi
}

# Function to verify backup integrity
verify_backup() {
    if [ -z "$1" ]; then
        log_message "${RED}❌ Error: Please specify backup file to verify${NC}"
        echo "Usage: $0 verify <backup_file.tar.gz>"
        exit 1
    fi

    BACKUP_FILE="$1"
    if [ ! -f "$BACKUP_FILE" ]; then
        log_message "${RED}❌ Error: Backup file not found: $BACKUP_FILE${NC}"
        exit 1
    fi

    log_message "${BLUE}🔍 Verifying backup integrity: $BACKUP_FILE${NC}"

    # Check if file is valid tar.gz
    if tar -tzf "$BACKUP_FILE" > /dev/null 2>&1; then
        log_message "${GREEN}✅ Backup file is valid${NC}"

        # List contents
        echo "Backup contents:"
        tar -tzf "$BACKUP_FILE" | head -20

        # Check for manifest
        if tar -tzf "$BACKUP_FILE" | grep -q "manifest.txt"; then
            log_message "${GREEN}✅ Backup manifest found${NC}"
        else
            log_message "${YELLOW}⚠️${NC} No backup manifest found"
        fi
    else
        log_message "${RED}❌ Backup file is corrupted or invalid${NC}"
        exit 1
    fi
}

# Main script logic
case "$1" in
    "create"|"backup")
        create_backup
        ;;
    "list")
        list_backups
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "cleanup")
        cleanup_backups "$2"
        ;;
    "verify")
        verify_backup "$2"
        ;;
    "auto")
        # Automated backup (for cron jobs)
        create_backup > /dev/null 2>&1
        cleanup_backups 30 > /dev/null 2>&1
        ;;
    *)
        echo "QMOI Enhanced - Backup & Recovery System"
        echo "========================================="
        echo ""
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  create, backup    Create a new backup"
        echo "  list              List available backups"
        echo "  restore <file>    Restore from backup file"
        echo "  cleanup [days]    Remove backups older than N days (default: 30)"
        echo "  verify <file>     Verify backup file integrity"
        echo "  auto              Automated backup (for cron jobs)"
        echo ""
        echo "Examples:"
        echo "  $0 create"
        echo "  $0 list"
        echo "  $0 restore ./backups/qmoi_backup_20260420_011034.tar.gz"
        echo "  $0 cleanup 7"
        echo "  $0 verify ./backups/qmoi_backup_20260420_011034.tar.gz"
        echo ""
        exit 1
        ;;
esac

log_message "${GREEN}🎯 Backup operation completed${NC}"