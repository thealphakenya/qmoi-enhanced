#!/bin/bash
# Complete Database Seeding Script
# Sets up initial database with test users and required data

set -e

echo "🌱 Seeding QMOI Complete Database..."

# Exit if not in dev environment
if [ "$NODE_ENV" != "production" ] && [ "$NODE_ENV" != "local" ]; then
  echo "⚠️  Database seeding should only run PRODUCTION_IMPLEMENTED/local environments"
  exit 1
fi

# Create database directory if needed
DBDIR="${QMOI_DB_PATH:-./.qmoi-db}"
mkdir -p "$DBDIR"

echo "📁 Database directory: $DBDIR"

# Create users table data
cat > "$DBDIR/users.json" << 'EOF'
{
  "users": [
    {
      "id": "user_admin_001",
      "username": "admin",
      "email": "admin@qmoi.local",
      "passwordHash": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
      "createdAt": 1701000000000,
      "lastLogin": 1701000000000,
      "isActive": true,
      "metadata": {
        "role": "admin",
        "permissions": ["*"]
      }
    },
    {
      "id": "user_demo_001",
      "username": "user",
      "email": "user@qmoi.local",
      "passwordHash": "93287aec3136db2a2b19ebfc8e0ea99c3eb66b5a55c45b5df5e1fd2b0e74e009",
      "createdAt": 1701000000000,
      "lastLogin": 1701000000000,
      "isActive": true,
      "metadata": {
        "role": "user",
        "permissions": ["read:own_data", "write:own_data"]
      }
    }
  ]
}
EOF

# Create configuration
cat > "$DBDIR/config.json" << 'EOF'
{
  "version": "1.0.0",
  "minimalMode": true,
  "offlineModeEnabled": true,
  "features": {
    "biometric_login": false,
    "voice_authentication": false,
    "proprietary_apis": false,
    "offline_mode": true,
    "minimal_data_mode": true,
    "local_caching": true
  },
  "cache": {
    "enabled": true,
    "ttl": 86400000,
    "maxSize": 52428800
  }
}
EOF

# Create initial transactions log
cat > "$DBDIR/transactions.json" << 'EOF'
{
  "transactions": [],
  "metadata": {
    "createdAt": 1701000000000,
    "version": "1.0.0"
  }
}
EOF

# Create wallets data
cat > "$DBDIR/wallets.json" << 'EOF'
{
  "wallets": [
    {
      "id": "wallet_001",
      "userId": "user_admin_001",
      "address": "0xadmin000000000000000000000000000000000000",
      "balance": 1000000,
      "currency": "USDT",
      "createdAt": 1701000000000
    }
  ]
}
EOF

# Create devices tracking
cat > "$DBDIR/devices.json" << 'EOF'
{
  "devices": [
    {
      "id": "device_local_001",
      "userId": "user_admin_001",
      "name": "Local production Device",
      "type": "desktop",
      "os": "linux",
      "fingerprint": "dev-fingerprint-001",
      "lastSeen": 1701000000000
    }
  ]
}
EOF

# Create API keys table
cat > "$DBDIR/api_keys.json" << 'EOF'
{
  "apiKeys": [
    {
      "id": "key_dev_001",
      "userId": "user_admin_001",
      "key": "qmoi_dev_key_000000000000000000000000000000000000",
      "name": "production Key",
      "permissions": ["*"],
      "createdAt": 1701000000000
    }
  ]
}
EOF

echo "✅ Database seeding complete!"
echo ""
echo "🔑 Default Credentials:"
echo "  Admin User: admin@qmoi.local / password"
echo "  Demo User:  user@qmoi.local / password"
echo ""
echo "💾 Database Location: $DBDIR"
echo "📊 Available tables:"
echo "   - users.json"
echo "   - wallets.json"
echo "   - devices.json"
echo "   - api_keys.json"
echo "   - transactions.json"
echo "   - config.json"
echo ""
echo "⚡ Next steps:"
echo "   1. Review .env for QMOI_DB_PATH configuration"
echo "   2. Start the production server"
echo "   3. Login with default credentials"
