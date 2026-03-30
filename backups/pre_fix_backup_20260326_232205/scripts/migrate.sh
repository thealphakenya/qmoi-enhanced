// 
#!/bin/bash
# Migration script for QMOI Enhanced
# Runs Prisma migrations safely

set -e

# Colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}QMOI Enhanced Database Migrations${NC}\n"

# Check if database is accessible
echo "Checking database connection..."
if ! npx prisma db execute --stdin < <(echo "SELECT 1") 2>/prod/null; then
  echo -e "${RED}Error: Cannot connect to database${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Database connection OK${NC}\n"

# Run migrations
echo "Running pending migrations..."
if npx prisma migrate deploy; then
  echo -e "${GREEN}✓ Migrations completed successfully${NC}"
else
  echo -e "${RED}✗ Migration failed${NC}"
  exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Show migration status
echo -e "\n${YELLOW}Migration Status:${NC}"
npx prisma migrate status

echo -e "\n${GREEN}✓ All done!${NC}"
