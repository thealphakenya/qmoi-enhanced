#!/bin/bash

# QMOI Enhanced - Authentication System
# API key management and user authentication

echo "🔐 QMOI Enhanced - Authentication System"
echo "========================================"

# Configuration
AUTH_CONFIG_FILE="auth_config.json"
API_KEYS_FILE="api_keys.json"
USERS_FILE="users.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Default configuration
DEFAULT_AUTH_CONFIG='{
    "enabled": true,
    "api_key_required": true,
    "rate_limiting": {
        "enabled": true,
        "requests_per_minute": 60,
        "requests_per_hour": 1000
    },
    "session_timeout": 3600,
    "max_api_keys_per_user": 5,
    "require_https": false
}'

DEFAULT_USERS='{
    "admin": {
        "password_hash": "admin123",
        "role": "administrator",
        "email": "admin@qmoi-enhanced.local",
        "active": true,
        "created_at": "2026-04-20T01:15:00Z",
        "last_login": null
    }
}'

# Function to initialize authentication system
init_auth() {
    log "🔐 Initializing authentication system..."

    # Create auth configuration if it doesn't exist
    if [ ! -f "$AUTH_CONFIG_FILE" ]; then
        echo "$DEFAULT_AUTH_CONFIG" > "$AUTH_CONFIG_FILE"
        success "Created authentication configuration"
    fi

    # Create users file if it doesn't exist
    if [ ! -f "$USERS_FILE" ]; then
        echo "$DEFAULT_USERS" > "$USERS_FILE"
        success "Created users database"
    fi

    # Create API keys file if it doesn't exist
    if [ ! -f "$API_KEYS_FILE" ]; then
        echo "{}" > "$API_KEYS_FILE"
        success "Created API keys database"
    fi

    # Create default admin API key
    if ! python3 -c "
import json
with open('$API_KEYS_FILE', 'r') as f:
    keys = json.load(f)
if 'admin' not in keys:
    import secrets
    api_key = secrets.token_urlsafe(32)
    keys['admin'] = {
        'key': api_key,
        'user': 'admin',
        'created_at': '2026-04-20T01:15:00Z',
        'last_used': None,
        'active': True,
        'permissions': ['read', 'write', 'admin']
    }
    with open('$API_KEYS_FILE', 'w') as f:
        json.dump(keys, f, indent=2)
    print('Generated admin API key:', api_key)
" 2>/dev/null; then
        warning "Could not generate admin API key"
    fi

    success "Authentication system initialized"
}

# Function to generate API key
generate_api_key() {
    local user="$1"
    local permissions="${2:-read,write}"

    if [ -z "$user" ]; then
        error "User name required"
        echo "Usage: $0 generate-key <username> [permissions]"
        exit 1
    fi

    log "🔑 Generating API key for user: $user"

    # Check if user exists
    if ! python3 -c "
import json
with open('$USERS_FILE', 'r') as f:
    users = json.load(f)
if '$user' not in users:
    print('ERROR: User not found')
    exit(1)
" 2>/dev/null; then
        error "User '$user' not found"
        exit 1
    fi

    # Generate API key
    local api_key=$(python3 -c "
import json
import secrets
from datetime import datetime

# Load existing keys
with open('$API_KEYS_FILE', 'r') as f:
    keys = json.load(f)

# Check max keys per user
user_keys = [k for k, v in keys.items() if v.get('user') == '$user']
if len(user_keys) >= 5:
    print('ERROR: Maximum API keys per user reached')
    exit(1)

# Generate new key
api_key = secrets.token_urlsafe(32)
key_id = f'key_{len(keys) + 1}'

keys[key_id] = {
    'key': api_key,
    'user': '$user',
    'created_at': datetime.now().isoformat(),
    'last_used': None,
    'active': True,
    'permissions': '$permissions'.split(',')
}

# Save keys
with open('$API_KEYS_FILE', 'w') as f:
    json.dump(keys, f, indent=2)

print(api_key)
" 2>/dev/null)

    if [ $? -eq 0 ] && [ -n "$api_key" ]; then
        success "API key generated for user '$user'"
        echo "API Key: $api_key"
        echo "Permissions: $permissions"
        echo ""
        echo "⚠️  IMPORTANT: Save this API key securely. It will not be shown again."
    else
        error "Failed to generate API key"
    fi
}

# Function to list API keys
list_api_keys() {
    log "📋 Listing API keys..."

    python3 -c "
import json
from datetime import datetime

with open('$API_KEYS_FILE', 'r') as f:
    keys = json.load(f)

print('API Keys:')
print('=' * 80)
for key_id, key_data in keys.items():
    status = '✅ ACTIVE' if key_data.get('active', False) else '❌ INACTIVE'
    last_used = key_data.get('last_used', 'Never')
    permissions = ','.join(key_data.get('permissions', []))
    print(f'ID: {key_id}')
    print(f'User: {key_data.get(\"user\", \"Unknown\")}')
    print(f'Key: {key_data.get(\"key\", \"N/A\")[:20]}...')
    print(f'Permissions: {permissions}')
    print(f'Status: {status}')
    print(f'Created: {key_data.get(\"created_at\", \"Unknown\")}')
    print(f'Last Used: {last_used}')
    print('-' * 40)
" 2>/dev/null || error "Could not list API keys"
}

# Function to revoke API key
revoke_api_key() {
    local key_id="$1"

    if [ -z "$key_id" ]; then
        error "API key ID required"
        echo "Usage: $0 revoke-key <key_id>"
        exit 1
    fi

    log "🚫 Revoking API key: $key_id"

    if python3 -c "
import json

with open('$API_KEYS_FILE', 'r') as f:
    keys = json.load(f)

if '$key_id' in keys:
    keys['$key_id']['active'] = False
    with open('$API_KEYS_FILE', 'w') as f:
        json.dump(keys, f, indent=2)
    print('SUCCESS: API key revoked')
else:
    print('ERROR: API key not found')
" 2>/dev/null; then
        success "API key '$key_id' revoked"
    else
        error "Failed to revoke API key"
    fi
}

# Function to validate API key
validate_api_key() {
    local api_key="$1"

    if [ -z "$api_key" ]; then
        error "API key required"
        echo "Usage: $0 validate-key <api_key>"
        exit 1
    fi

    python3 -c "
import json
from datetime import datetime

with open('$API_KEYS_FILE', 'r') as f:
    keys = json.load(f)

# Find key
found = False
for key_id, key_data in keys.items():
    if key_data.get('key') == '$api_key':
        found = True
        active = key_data.get('active', False)
        user = key_data.get('user', 'Unknown')
        permissions = key_data.get('permissions', [])

        if active:
            print('✅ VALID')
            print(f'User: {user}')
            print(f'Permissions: {','.join(permissions)}')
            # Update last used
            key_data['last_used'] = datetime.now().isoformat()
            with open('$API_KEYS_FILE', 'w') as f:
                json.dump(keys, f, indent=2)
        else:
            print('❌ REVOKED')
        break

if not found:
    print('❌ INVALID')
" 2>/dev/null
}

# Function to create user
create_user() {
    local username="$1"
    local password="$2"
    local email="$3"
    local role="${4:-user}"

    if [ -z "$username" ] || [ -z "$password" ]; then
        error "Username and password required"
        echo "Usage: $0 create-user <username> <password> [email] [role]"
        exit 1
    fi

    log "👤 Creating user: $username"

    if python3 -c "
import json
from datetime import datetime

with open('$USERS_FILE', 'r') as f:
    users = json.load(f)

if '$username' in users:
    print('ERROR: User already exists')
    exit(1)

users['$username'] = {
    'password_hash': '$password',
    'role': '$role',
    'email': '$email',
    'active': True,
    'created_at': datetime.now().isoformat(),
    'last_login': None
}

with open('$USERS_FILE', 'w') as f:
    json.dump(users, f, indent=2)

print('SUCCESS: User created')
" 2>/dev/null; then
        success "User '$username' created successfully"
    else
        error "Failed to create user"
    fi
}

# Function to show authentication status
show_auth_status() {
    log "📊 Authentication System Status"

    echo ""
    echo "Configuration:"
    if [ -f "$AUTH_CONFIG_FILE" ]; then
        python3 -c "
import json
with open('$AUTH_CONFIG_FILE', 'r') as f:
    config = json.load(f)
print(f'  Authentication: {\"Enabled\" if config.get(\"enabled\", False) else \"Disabled\"}')
print(f'  API Keys Required: {config.get(\"api_key_required\", False)}')
print(f'  Rate Limiting: {config.get(\"rate_limiting\", {}).get(\"enabled\", False)}')
" 2>/dev/null
    fi

    echo ""
    echo "Users:"
    if [ -f "$USERS_FILE" ]; then
        python3 -c "
import json
with open('$USERS_FILE', 'r') as f:
    users = json.load(f)
print(f'  Total Users: {len(users)}')
for username, user_data in users.items():
    status = '✅ Active' if user_data.get('active', False) else '❌ Inactive'
    role = user_data.get('role', 'user')
    print(f'    {username} ({role}) - {status}')
" 2>/dev/null
    fi

    echo ""
    echo "API Keys:"
    if [ -f "$API_KEYS_FILE" ]; then
        python3 -c "
import json
with open('$API_KEYS_FILE', 'r') as f:
    keys = json.load(f)
active_keys = sum(1 for k in keys.values() if k.get('active', False))
print(f'  Total Keys: {len(keys)}')
print(f'  Active Keys: {active_keys}')
" 2>/dev/null
    fi
}

# Function to log messages
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Main script logic
case "$1" in
    "init")
        init_auth
        ;;
    "generate-key"|"gen-key")
        generate_api_key "$2" "$3"
        ;;
    "list-keys")
        list_api_keys
        ;;
    "revoke-key")
        revoke_api_key "$2"
        ;;
    "validate-key")
        validate_api_key "$2"
        ;;
    "create-user")
        create_user "$2" "$3" "$4" "$5"
        ;;
    "status")
        show_auth_status
        ;;
    *)
        echo "QMOI Enhanced - Authentication System"
        echo "======================================"
        echo ""
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Authentication Management:"
        echo "  init                    Initialize authentication system"
        echo "  create-user <user> <pass> [email] [role]  Create new user"
        echo "  status                  Show authentication status"
        echo ""
        echo "API Key Management:"
        echo "  generate-key <user> [perms]  Generate API key for user"
        echo "  list-keys               List all API keys"
        echo "  revoke-key <key_id>     Revoke API key"
        echo "  validate-key <api_key>  Validate API key"
        echo ""
        echo "Examples:"
        echo "  $0 init"
        echo "  $0 create-user john password123 john@example.com admin"
        echo "  $0 generate-key john read,write"
        echo "  $0 list-keys"
        echo "  $0 validate-key abc123..."
        echo ""
        exit 1
        ;;
esac