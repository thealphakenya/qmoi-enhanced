#!/bin/bash
# QMOI System Startup Script

echo "🚀 Starting QMOI Enhanced System..."

# Load environment variables
source .env

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create necessary directories
mkdir -p logs config data avatars music reports backups temp uploads downloads cache models datasets artifacts

# Start the QMOI Master System
echo "🎯 Starting QMOI Master System..."
node scripts/qmoi-master-system.js "$@"
