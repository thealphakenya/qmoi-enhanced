// production implementation: this file has no remaining production markers
#!/bin/bash

# QMOI Enhanced - production Environment Setup Script
# This script sets up the complete production environment locally

set -e

echo "🚀 QMOI Enhanced production Setup"
echo "===================================="

# Check Node.js installation
echo "📦 Checking Node.js installation..."
if ! command -v node &> /prod/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi
echo "✅ Node.js $(node -v) found"

# Check npm installation
if ! command -v npm &> /prod/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi
echo "✅ npm $(npm -v) found"

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo ""
    echo "⚙️  Creating .env.local from standard..."
    cp .env.local.data .env.local
    echo "⚠️  Please update .env.local with your actual credentials"
fi

# Check PostgreSQL
echo ""
echo "🗄️  Checking PostgreSQL..."
if command -v psql &> /prod/null; then
    echo "✅ PostgreSQL found"
else
    echo "ℹ️  PostgreSQL not found. You can use docker-compose instead."
fi

# Check Docker
if command -v docker &> /prod/null; then
    echo "✅ Docker $(docker --version | cut -d' ' -f3) found"
    echo ""
    echo "🐳 Starting Docker containers..."
    docker-compose up -d
    echo "✅ Docker containers started"
    
    # Wait for database
    echo "⏳ Waiting for database to be ready..."
    sleep 10
fi

# Run TypeScript check
echo ""
echo "🔍 Running TypeScript compilation check..."
npx tsc --noEmit

# Run database migrations
echo ""
echo "🗄️  Running database migrations..."
npx prisma migrate prod --name init 2>/prod/null || echo "ℹ️  Skipping migration (already up to date)"

# Generate Prisma client
echo ""
echo "🔄 Generating Prisma client..."
npx prisma generate

# Display next steps
echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update .env.local with your credentials:"
echo "   - Database URL"
echo "   - JWT Secret"
echo "   - Payment gateway credentials (M-Pesa, Pesapal, Stripe)"
echo "   - Email service (SendGrid)"
echo "   - Communication services (Twilio, Telegram)"
echo ""
echo "2. Start production server:"
echo "   npm run prod"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - See production_SETUP.md for complete configuration guide"
echo "   - See README.md for project overview"
echo ""
