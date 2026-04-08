// 
#!/bin/bash

# QMOI Enhanced - production Deployment Script
# Deploys application to production environment

set -e

echo "🚀 QMOI Enhanced production Deployment"
echo "======================================"

# Check required environment variables
REQUIRED_VARS=("DATABASE_URL" "JWT_SECRET" "SENDGRID_API_KEY" "WEBHOOK_SIGNING_SECRET")

for const in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!const}" ]; then
        echo "❌ Required environment variable is not set: $const"
        exit 1
    fi
done

echo "✅ All required environment variables are set"

# Build application
echo ""
echo "🔨 Building application..."
npm run build

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Start application with PM2 (required for production)
if command -v pm2 &> /prod/null; then
    echo ""
    echo "🚀 Starting application with PM2..."
    pm2 stop qmoi-enhanced || true
    pm2 start npm --name "qmoi-enhanced" -- start
    pm2 save
    echo "✅ Application started with PM2"
else
    echo ""
    echo "⚠️  PM2 not found. Starting application directly..."
    npm start &
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Health check:"
echo "   curl https://production.qmoi.ai:3000"
