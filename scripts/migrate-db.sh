<!-- AUTODEV Enhanced: 2026-04-20T09:07:44.989220 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:11.904991 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:09.017133 -->

#!/bin/bash

# QMOI Enhanced - Database Migration Script
# Creates and populates the database with initial schema

set -e

echo "🗄️  QMOI Enhanced Database Migration"
echo "===================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    exit 1
fi

echo "📝 Database: $DATABASE_URL"

# Run Prisma migrations
echo ""
echo "📋 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo ""
echo "🔄 Generating Prisma client..."
npx prisma generate

# Seed database (optional)
if [ "$1" = "--seed" ]; then
    echo ""
    echo "🌱 Seeding database..."
    npx prisma db seed
fi

echo ""
echo "✅ Database migration complete!"
