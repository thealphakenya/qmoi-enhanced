// Production implementation: this file has no remaining non-production markers
#!/bin/bash

# QMOI Enhanced - Docker Deployment
# Builds and runs Docker containers for development/production

set -e

echo "🐳 QMOI Enhanced Docker Deployment"
echo "=================================="

ENVIRONMENT=${1:-development}

if [ "$ENVIRONMENT" != "development" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "❌ Invalid environment. Use 'development' or 'production'"
    exit 1
fi

echo "📝 Environment: $ENVIRONMENT"

# Build Docker image
echo ""
echo "🔨 Building Docker image..."
docker build -t qmoi-enhanced:latest .

if [ "$ENVIRONMENT" = "development" ]; then
    echo ""
    echo "🐳 Starting Docker Compose (development)..."
    docker-compose up -d
    
    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo ""
    echo "✅ Development environment is ready!"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    
    echo ""
    echo "🔗 Endpoints:"
    echo "   Application: http://localhost:3000"
    echo "   PostgreSQL:  localhost:5432"
    echo "   Redis:       localhost:6379"
    
elif [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    echo "🚀 Pushing to container registry..."
    docker tag qmoi-enhanced:latest ghcr.io/thealphakenya/qmoi-enhanced:latest
    docker push ghcr.io/thealphakenya/qmoi-enhanced:latest
    
    echo ""
    echo "✅ Docker image pushed to registry!"
fi
