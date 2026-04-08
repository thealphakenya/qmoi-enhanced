
#!/bin/bash

# QMOI Enhanced - Docker Deployment
# Builds and runs Docker containers for production/production

set -e

echo "🐳 QMOI Enhanced Docker Deployment"
echo "=================================="

ENVIRONMENT=${1:-production}

if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "❌ Invalid environment. Use 'production' or 'production'"
    exit 1
fi

echo "📝 Environment: $ENVIRONMENT"

# Build Docker image
echo ""
echo "🔨 Building Docker image..."
docker build -t qmoi-enhanced:latest .

if [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    echo "🐳 Starting Docker Compose (production)..."
    docker-compose up -d
    
    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo ""
    echo "✅ production environment is ready!"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    
    echo ""
    echo "🔗 Endpoints:"
    echo "   Application: https://production.qmoi.ai:3000"
    echo "   PostgreSQL:  production.qmoi.ai:5432"
    echo "   Redis:       production.qmoi.ai:6379"
    
elif [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    echo "🚀 Pushing to container registry..."
    docker tag qmoi-enhanced:latest ghcr.io/thestablekenya/qmoi-enhanced:latest
    docker push ghcr.io/thestablekenya/qmoi-enhanced:latest
    
    echo ""
    echo "✅ Docker image pushed to registry!"
fi
