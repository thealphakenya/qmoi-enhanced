---
quantum-enabled: false
---

# QMOI Enhanced - Complete Deployment Guide

**Last Updated:** May 10, 2026  
**Status:** ✅ Ready for Production Deployment

## Overview

This guide covers end-to-end deployment of QMOI Enhanced from development to production across all platforms. Choose your deployment method based on your infrastructure.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [Cloud Platform Deployment](#cloud-platform-deployment)
5. [Post-Deployment Tasks](#post-deployment-tasks)
6. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, verify:

- [ ] All code is committed and pushed
- [ ] CI/CD pipeline is passing
- [ ] Database is provisioned and accessible
- [ ] Environment variables are configured
- [ ] Secrets are stored securely (not in code)
- [ ] SSL/TLS certificates are valid
- [ ] Backups are configured
- [ ] Monitoring is set up
- [ ] Runbooks are documented
- [ ] Team is trained on deployment procedure

---

## Docker Deployment

### Quick Start with Docker Compose

**Duration:** 5-10 minutes  
**Best for:** Development, testing, single-server deployment

#### Prerequisites

```bash
# Check Docker and Docker Compose are installed
docker --version        # Should be 20.10+
docker-compose --version  # Should be 1.29+
```

#### Deployment Steps

```bash
# 1. Clone repository
git clone https://github.com/thealphakenya/qmoi-enhanced.git
cd qmoi-enhanced

# 2. Create environment file
cp .env.example .env
# Edit .env with production values:
# DATABASE_URL, JWT_SECRET, ENCRYPTION_KEY, etc.

# 3. Start all services (database, Redis, app)
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify services are running
docker-compose -f docker-compose.prod.yml ps

# 5. Check application logs
docker-compose -f docker-compose.prod.yml logs -f qmoi-app

# 6. Run startup verification
docker exec qmoi-enhanced bash scripts/verify-startup.sh
```

#### Accessing the Application

```
# Application URL
http://localhost:3000

# Health check
curl http://localhost:3000/health

# Prometheus metrics
curl http://localhost:9090

# Grafana dashboards
http://localhost:3001 (admin/admin)
```

#### Stopping Services

```bash
# Stop all services (data persists in volumes)
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes (data deleted!)
docker-compose -f docker-compose.prod.yml down -v

# Stop individual service
docker-compose -f docker-compose.prod.yml stop qmoi-app
```

---

### Manual Docker Deployment

**Duration:** 10-15 minutes  
**Best for:** Custom configurations, multiple containers

#### Step 1: Build Docker Image

```bash
# Build production image
docker build -t qmoi-enhanced:latest -f Dockerfile.prod .

# Verify image was created
docker images | grep qmoi-enhanced

# Test image locally
docker run -e DATABASE_URL="..." -p 3000:3000 qmoi-enhanced:latest
```

#### Step 2: Push to Registry

```bash
# Tag image for registry
docker tag qmoi-enhanced:latest your-registry/qmoi-enhanced:latest

# Login to registry
docker login your-registry

# Push image
docker push your-registry/qmoi-enhanced:latest

# Verify it's in registry
docker pull your-registry/qmoi-enhanced:latest
```

#### Step 3: Run Container

```bash
# Run with environment variables
docker run \
  -d \
  --name qmoi-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://user:pass@db-host:5432/qmoi_db" \
  -e REDIS_URL="redis://redis-host:6379" \
  -e JWT_SECRET="your-secret-key" \
  -e ENCRYPTION_KEY="your-encryption-key" \
  -v /var/log/qmoi:/app/logs \
  --restart unless-stopped \
  your-registry/qmoi-enhanced:latest

# Check if container is running
docker ps | grep qmoi-app

# View logs
docker logs -f qmoi-app

# Test health endpoint
curl http://localhost:3000/health
```

#### Step 4: Configure Load Balancer

```nginx
# Nginx configuration
upstream qmoi_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 443 ssl http2;
    server_name ${API_HOST};

    ssl_certificate /etc/ssl/certs/qmoi.crt;
    ssl_certificate_key /etc/ssl/private/qmoi.key;

    location / {
        proxy_pass http://qmoi_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        access_log off;
        proxy_pass http://qmoi_backend;
    }
}
```

---

## Kubernetes Deployment

### Prerequisites

```bash
# Verify kubectl is installed
kubectl version --client

# Verify cluster access
kubectl auth can-i create deployments

# Check cluster resources
kubectl top nodes
kubectl describe nodes
```

### Deployment Steps

#### Step 1: Prepare Secrets

```bash
# Create namespace
kubectl create namespace qmoi

# Create secrets (use actual values)
kubectl create secret generic qmoi-secrets \
  --from-literal=DATABASE_URL="postgresql://user:pass@postgres:5432/qmoi_db" \
  --from-literal=JWT_SECRET="your-secure-jwt-secret" \
  --from-literal=ENCRYPTION_KEY="your-encryption-key" \
  --from-literal=API_KEY_SECRET="your-api-secret" \
  -n qmoi

# Verify secrets were created
kubectl get secrets -n qmoi
```

#### Step 2: Deploy Application

```bash
# Apply namespace (creates if needed)
kubectl apply -f k8s/namespace.yaml

# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Verify deployment
kubectl get deployment qmoi-app -n qmoi

# Watch rollout progress
kubectl rollout status deployment/qmoi-app -n qmoi

# Check pods are running
kubectl get pods -n qmoi
kubectl describe pods -n qmoi
```

#### Step 3: Configure Ingress

```bash
# Install cert-manager (if not already installed)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Wait for cert-manager to be ready
kubectl rollout status deployment/cert-manager -n cert-manager

# Apply ingress configuration
kubectl apply -f k8s/ingress.yaml

# Verify ingress is created
kubectl get ingress -n qmoi

# Check certificate status
kubectl get certificate -n qmoi

# Get ingress IP/hostname
kubectl get ingress -n qmoi -o wide
```

#### Step 4: Verify Deployment

```bash
# Port forward to test locally
kubectl port-forward service/qmoi-app 3000:3000 -n qmoi &

# Test health endpoint
curl http://localhost:3000/health

# View application logs
kubectl logs -f deployment/qmoi-app -n qmoi

# Monitor resource usage
kubectl top pods -n qmoi
kubectl top nodes
```

---

## Cloud Platform Deployment

### AWS Deployment

1. **Create RDS PostgreSQL database**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier qmoi-db \
     --engine postgres \
     --db-instance-class db.t3.micro \
     --allocated-storage 100 \
     --master-username admin \
     --master-user-password "SecurePassword123!"
   ```

2. **Create ElastiCache Redis**
   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id qmoi-redis \
     --engine redis \
     --cache-node-type cache.t3.micro \
     --engine-version 7.0
   ```

3. **Push Docker image to ECR**
   ```bash
   aws ecr create-repository --repository-name qmoi-enhanced
   docker tag qmoi-enhanced:latest [ACCOUNT-ID].dkr.ecr.[REGION].amazonaws.com/qmoi-enhanced:latest
   docker push [ACCOUNT-ID].dkr.ecr.[REGION].amazonaws.com/qmoi-enhanced:latest
   ```

4. **Deploy to ECS/Fargate or EKS**
   - Use CloudFormation templates
   - Or deploy to EKS with kubectl

### Google Cloud Deployment

1. **Create Cloud SQL PostgreSQL**
   ```bash
   gcloud sql instances create qmoi-db \
     --database-version POSTGRES_15 \
     --tier db-t3-micro
   ```

2. **Create Cloud Memorystore Redis**
   ```bash
   gcloud redis instances create qmoi-redis \
     --size=1 \
     --region=[REGION]
   ```

3. **Push Docker image to GCR**
   ```bash
   docker tag qmoi-enhanced:latest gcr.io/[PROJECT-ID]/qmoi-enhanced:latest
   docker push gcr.io/[PROJECT-ID]/qmoi-enhanced:latest
   ```

4. **Deploy to GKE**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/deployment.yaml
   ```

### Azure Deployment

1. **Create Azure Database for PostgreSQL**
   ```bash
   az postgres server create \
     --resource-group qmoi \
     --name qmoi-db \
     --admin-user admin \
     --admin-password "SecurePassword123!"
   ```

2. **Push Docker image to ACR**
   ```bash
   az acr create --resource-group qmoi --name qmoiregistry --sku Basic
   docker tag qmoi-enhanced:latest qmoiregistry.azurecr.io/qmoi-enhanced:latest
   docker push qmoiregistry.azurecr.io/qmoi-enhanced:latest
   ```

3. **Deploy to AKS**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/deployment.yaml
   ```

---

## Post-Deployment Tasks

### Immediate Tasks (First Hour)

```bash
# 1. Verify application is responding
curl ${API_URL}/health

# 2. Check logs for errors
kubectl logs -f deployment/qmoi-app -n qmoi | grep ERROR

# 3. Test authentication
curl -X POST ${API_URL}/api/auth/signin \
  -d '{"email":"demo@qmo.ai","password":"demo"}'

# 4. Verify database connectivity
# Check application logs show successful DB connection

# 5. Test all critical endpoints
npm run ci:smoke
```

### First Day Tasks

- [ ] Monitor application metrics
- [ ] Check error logs for issues
- [ ] Verify automated backups are working
- [ ] Confirm monitoring dashboards are updating
- [ ] Test disaster recovery procedure
- [ ] Document any issues found

### First Week Tasks

- [ ] Run load testing
- [ ] Perform security audit
- [ ] Review performance metrics
- [ ] Plan scaling strategy
- [ ] Update runbooks based on experience
- [ ] Conduct team training

---

## Scaling the Deployment

### Horizontal Scaling (Add Instances)

```bash
# Kubernetes
kubectl scale deployment qmoi-app --replicas=5 -n qmoi

# Docker Compose (multiple containers)
docker-compose -f docker-compose.prod.yml up -d --scale qmoi-app=5

# Manual Docker (multiple machines with load balancer)
# Deploy container to multiple servers
# Configure load balancer to distribute traffic
```

### Vertical Scaling (Increase Resources)

```bash
# Kubernetes
kubectl set resources deployment qmoi-app \
  --limits=memory=3Gi,cpu=2 \
  -n qmoi

# Docker
docker run ... -m 3g --cpus 2 qmoi-enhanced:latest
```

---

## Troubleshooting

### Deployment Fails

```bash
# Check pod status
kubectl describe pod -n qmoi

# Check events
kubectl get events -n qmoi

# View logs
kubectl logs -n qmoi -l app=qmoi

# Common issues:
# - Image not found: Verify image registry and authentication
# - Port conflicts: Check other services using the port
# - Insufficient resources: Add more nodes or increase limits
```

### Application Won't Start

```bash
# Check environment variables are set
kubectl exec -it pod/qmoi-app-xyz -n qmoi -- env | grep DATABASE_URL

# Check database connectivity
kubectl exec -it pod/qmoi-app-xyz -n qmoi -- psql $DATABASE_URL -c "SELECT 1"

# Check migrations ran successfully
kubectl exec -it pod/qmoi-app-xyz -n qmoi -- npx prisma migrate status
```

### Performance Issues

```bash
# Check resource usage
kubectl top pods -n qmoi
kubectl top nodes

# Check database query performance
# See MONITORING_AND_HEALTH_CHECKS.md for detailed debugging

# Scale up if needed
kubectl scale deployment qmoi-app --replicas=5 -n qmoi
```

---

## Related Documentation

- [ALLSERVE.md](ALLSERVE.md) - Production architecture
- [MONITORING_AND_HEALTH_CHECKS.md](MONITORING_AND_HEALTH_CHECKS.md) - Monitoring setup
- [OPERATIONAL_RUNBOOKS.md](OPERATIONAL_RUNBOOKS.md) - Operational procedures
- [PRODUCTION_AUTH_IMPLEMENTATION.md](PRODUCTION_AUTH_IMPLEMENTATION.md) - Auth details

---

## Deployment Checklist

- [ ] All code changes reviewed and tested
- [ ] Documentation updated
- [ ] Secrets are secure (not in repository)
- [ ] Database backups are configured
- [ ] Monitoring is set up and alerting
- [ ] Runbooks are prepared
- [ ] Team is ready for go-live
- [ ] Rollback plan is documented
- [ ] Customer communication plan ready
- [ ] On-call rotation assigned

---

**Ready to Deploy:** ✅ YES - All systems are production-ready

For platform-specific guidance, see:
- AWS: [AWS Deployment Guide](#aws-deployment)
- Kubernetes: [Kubernetes Deployment](#kubernetes-deployment)
- Docker: [Docker Deployment](#docker-deployment)

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T19:07:27.102495Z
- production status: ⚠️ mixed production markers
- status tags: mixed, nonproduction, production, review
- lines: 562
- words: 1643
- characters: 12920
- headings: 116
- links: 13
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
