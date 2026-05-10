#!/bin/bash

# QMOI Enhanced - Production Setup Automation Script
# This script sets up the complete production environment for QMOI AI

set -e

echo ""
echo "🚀 QMOI Enhanced - Production Setup Automation"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for required tools
check_requirements() {
  echo -e "${BLUE}📋 Checking system requirements...${NC}"
  
  if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "   Install from: https://nodejs.org/"
    exit 1
  fi
  
  if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
  fi
  
  if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
  fi
  
  NODE_VERSION=$(node -v)
  NPM_VERSION=$(npm -v)
  
  echo -e "${GREEN}✅ Node.js: ${NODE_VERSION}${NC}"
  echo -e "${GREEN}✅ npm: ${NPM_VERSION}${NC}"
  echo -e "${GREEN}✅ Git: installed${NC}"
  echo ""
}

# Check PostgreSQL connectivity
check_database() {
  echo -e "${BLUE}📋 Checking database configuration...${NC}"
  
  if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  DATABASE_URL not set in environment${NC}"
    echo "   Set it with: export DATABASE_URL='postgresql://user:pass@localhost:5432/qmoi_db'"
    echo ""
    read -p "   Enter DATABASE_URL (or press Ctrl+C to cancel): " DATABASE_URL
    export DATABASE_URL
  fi
  
  echo -e "${GREEN}✅ Database URL configured${NC}"
  echo ""
}

# Install dependencies
install_dependencies() {
  echo -e "${BLUE}📦 Installing dependencies...${NC}"
  
  if [ ! -d "node_modules" ]; then
    echo "   Running npm install..."
    npm install --verbose
    echo -e "${GREEN}✅ Dependencies installed${NC}"
  else
    echo -e "${GREEN}✅ node_modules already exists${NC}"
  fi
  echo ""
}

# Generate Prisma Client
generate_prisma() {
  echo -e "${BLUE}🔧 Generating Prisma Client...${NC}"
  npx prisma generate
  echo -e "${GREEN}✅ Prisma Client generated${NC}"
  echo ""
}

# Run database migrations
run_migrations() {
  echo -e "${BLUE}🗄️  Running database migrations...${NC}"
  
  echo "   This will create/update your database schema."
  read -p "   Continue? (y/n): " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db push --schema prisma/schema.prisma
    echo -e "${GREEN}✅ Database migrations completed${NC}"
  else
    echo -e "${YELLOW}⏭️  Skipping database migrations${NC}"
  fi
  echo ""
}

# Seed demo data
seed_database() {
  echo -e "${BLUE}🌱 Seeding demo data...${NC}"
  
  echo "   This will create demo users for testing."
  read -p "   Continue? (y/n): " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx ts-node prisma/seed.ts
    echo -e "${GREEN}✅ Demo data seeded${NC}"
  else
    echo -e "${YELLOW}⏭️  Skipping demo data seeding${NC}"
  fi
  echo ""
}

# Build the application
build_application() {
  echo -e "${BLUE}🔨 Building application...${NC}"
  
  npm run build
  echo -e "${GREEN}✅ Application built${NC}"
  echo ""
}

# Verify setup
verify_setup() {
  echo -e "${BLUE}🔍 Verifying setup...${NC}"
  
  # Check key files
  if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
  else
    echo -e "${RED}❌ .env file missing${NC}"
  fi
  
  if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
  else
    echo -e "${RED}❌ Dependencies not installed${NC}"
  fi
  
  if [ -d "prisma" ]; then
    echo -e "${GREEN}✅ Prisma configuration exists${NC}"
  else
    echo -e "${RED}❌ Prisma configuration missing${NC}"
  fi
  
  echo ""
}

# Main setup flow
main() {
  echo -e "${BLUE}🎯 Starting QMOI Enhanced Production Setup...${NC}"
  echo ""
  
  check_requirements
  check_database
  install_dependencies
  generate_prisma
  run_migrations
  seed_database
  build_application
  verify_setup
  
  echo ""
  echo -e "${GREEN}════════════════════════════════════════════${NC}"
  echo -e "${GREEN}✅ Setup Complete!${NC}"
  echo -e "${GREEN}════════════════════════════════════════════${NC}"
  echo ""
  echo -e "${BLUE}📚 Next Steps:${NC}"
  echo ""
  echo "1. Start the development server:"
  echo -e "   ${YELLOW}npm run dev${NC}"
  echo ""
  echo "2. Start the production server:"
  echo -e "   ${YELLOW}npm run prod:start${NC}"
  echo ""
  echo "3. Access the application:"
  echo -e "   ${YELLOW}http://localhost:3000${NC}"
  echo ""
  echo -e "${BLUE}🔐 Demo Credentials:${NC}"
  echo ""
  echo "  Master - Email: master@qmo.ai, Password: MasterPass123!"
  echo "  Sister - Email: sister@qmo.ai, Password: SisterPass123!"
  echo "  Demo   - Email: demo@qmo.ai, Password: demo"
  echo "  User   - Email: user@qmo.ai, Password: TestUser123!"
  echo ""
  echo -e "${BLUE}📖 Documentation:${NC}"
  echo "  - See ALLSERVE.md for production architecture"
  echo "  - See PRODUCTION_AUTH_IMPLEMENTATION.md for auth details"
  echo "  - See lib/auth-service.ts for implementation"
  echo ""
}

# Run main function
main
