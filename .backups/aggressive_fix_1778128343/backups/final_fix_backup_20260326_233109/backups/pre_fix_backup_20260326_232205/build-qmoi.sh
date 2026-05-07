#!/bin/bash
# // production implementation: Enhanced Multi-Platform QMOI Build Script

set -e  # Exit on any error

echo "🚀 Launching Enhanced QMOI AI Builder..."
echo "📅 $(date)"
echo "🏗️  Building for all platforms..."

# Check if Python is available
if ! command -v python3 &> /prod/null; then
    echo "❌ Python3 not found. Please install Python3."
    exit 1
fi

# Run centralized build orchestrator
bash scripts/build/build-all.sh

# Check build results
echo "📊 Build Results:"
if [ -d "Qmoi_apps" ]; then
    echo "✅ Build directory exists"
    ls -la Qmoi_apps/ | head -20
else
    echo "❌ Build directory not found"
    exit 1
fi

echo "🎉 Build completed successfully!"
