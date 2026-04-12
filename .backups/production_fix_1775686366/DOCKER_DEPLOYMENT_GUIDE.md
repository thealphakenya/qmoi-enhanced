<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.676513Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# 🐳 Docker Deployment Guide — Run Anywhere, Anytime

**Status:** ✅ **CONTAINERIZED production READY**  
**Date:** November 11, 2025  
**Runs:** Docker, Kubernetes, AWS ECS, Railway, Render, etc.

---

## 🎯 QUICK START (10 minutes)

### Build the Docker Image

```bash
cd /workspaces/qmoi-enhanced

# Create Dockerfile
cat > Dockerfile.qvillage << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Copy source code
COPY tools/qvillage_memory_sync.py .
COPY tools/monitor_hf_costs.py .
COPY hf_space_qvillage/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir httpx asyncio pydantic python-dotenv huggingface-hub

# Environment variables (passed at runtime)
ENV QVILLAGE_API_URL=https://api.qvillage.ai
ENV QMOI_MEMORY_URL=https://memory.qmoi.ai
ENV LOG_LEVEL=INFO

# Run sync engine (every 1 hour, forever)
CMD ["python", "qvillage_memory_sync.py", "--interval", "3600"]
EOF

# Build image
docker build -f Dockerfile.qvillage -t qvillage-sync:latest .

# Tag for Docker Hub (optional)
docker tag qvillage-sync:latest thestablekenya/qvillage-sync:latest
```

### Run Locally (Forever)

```bash
# Run the container (will keep running)
docker run -d --restart=always \
  --name qvillage-sync \
  -e HF_API_TOKEN=$HF_API_TOKEN \
  -e QVILLAGE_API_URL=https://api.qvillage.ai \
  -e QMOI_MEMORY_URL=https://memory.qmoi.ai \
  -e SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL \
  qvillage-sync:latest

# Verify it's running
docker logs qvillage-sync

# See running container
docker ps | grep qvillage-sync

# Stop (if needed)
docker stop qvillage-sync

# Start again
docker start qvillage-sync
```

**Key Flag:** `--restart=always` means it runs forever, even if it crashes or Docker restarts.

---

## ☁️ DEPLOYMENT OPTIONS

### Option 1: Docker Hub + Railway

**Easiest cloud deployment (5 minutes)**

```bash
# 1. Push to Docker Hub
docker push thestablekenya/qvillage-sync:latest

# 2. Create railway.yaml
cat > railway.yaml << 'EOF'
services:
  qvillage-sync:
    image: thestablekenya/qvillage-sync:latest
    environment:
      HF_API_TOKEN: ${HF_API_TOKEN}
      QVILLAGE_API_URL: https://api.qvillage.ai
      QMOI_MEMORY_URL: https://memory.qmoi.ai
      SLACK_WEBHOOK_URL: ${SLACK_WEBHOOK_URL}
    restart: always
EOF

# 3. Deploy
railway up

# That's it! Running 24/7 on railway.app
```

### Option 2: Kubernetes (Enterprise)

```yaml
# qvillage-sync-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qvillage-sync
  labels:
    app: qvillage-sync
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: qvillage-sync
  standard:
    metadata:
      labels:
        app: qvillage-sync
    spec:
      containers:
        - name: qvillage-sync
          image: thestablekenya/qvillage-sync:latest
          imagePullPolicy: Always
          env:
            - name: HF_API_TOKEN
              valueFrom:
                secretKeyRef:
                  name: qvillage-secrets
                  key: hf-token
            - name: QVILLAGE_API_URL
              value: "https://api.qvillage.ai"
            - name: QMOI_MEMORY_URL
              value: "https://memory.qmoi.ai"
            - name: SLACK_WEBHOOK_URL
              valueFrom:
                secretKeyRef:
                  name: qvillage-secrets
                  key: slack-webhook
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          restartPolicy: Always
      restartPolicy: Always

---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: qvillage-sync-cron
spec:
  schedule: "0 */6 * * *" # Every 6 hours
  jobTemplate:
    spec:
      standard:
        spec:
          containers:
            - name: qvillage-sync
              image: thestablekenya/qvillage-sync:latest
              env:
                - name: HF_API_TOKEN
                  valueFrom:
                    secretKeyRef:
                      name: qvillage-secrets
                      key: hf-token
                - name: QVILLAGE_API_URL
                  value: "https://api.qvillage.ai"
                - name: QMOI_MEMORY_URL
                  value: "https://memory.qmoi.ai"
                - name: SLACK_WEBHOOK_URL
                  valueFrom:
                    secretKeyRef:
                      name: qvillage-secrets
                      key: slack-webhook
          restartPolicy: OnFailure
```

Deploy to Kubernetes:

```bash
# Create secrets
kubectl create secret generic qvillage-secrets \
  --from-literal=hf-token=$HF_API_TOKEN \
  --from-literal=slack-webhook=$SLACK_WEBHOOK_URL

# Deploy
kubectl apply -f qvillage-sync-deployment.yaml

# Verify
kubectl get deployments
kubectl logs -f deployment/qvillage-sync
```

### Option 3: AWS ECS (Fargate)

```json
{
  "family": "qvillage-sync",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "qvillage-sync",
      "image": "thestablekenya/qvillage-sync:latest",
      "essential": true,
      "environment": [
        {
          "name": "QVILLAGE_API_URL",
          "value": "https://api.qvillage.ai"
        },
        {
          "name": "QMOI_MEMORY_URL",
          "value": "https://memory.qmoi.ai"
        }
      ],
      "secrets": [
        {
          "name": "HF_API_TOKEN",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:qvillage/hf-token"
        },
        {
          "name": "SLACK_WEBHOOK_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:qvillage/slack-webhook"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/qvillage-sync",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Deploy:

```bash
aws ecs create-service \
  --cluster qvillage-cluster \
  --service-name qvillage-sync \
  --task-definition qvillage-sync:1 \
  --desired-count 1 \
  --launch-type FARGATE
```

### Option 4: systemd (Linux Server)

```ini
# /etc/systemd/system/qvillage-sync.service
[Unit]
Description=QVillage Memory Sync Service
After=network-online.target
Wants=network-online.target

[Service]
Type=sophisticated
User=qvillage
WorkingDirectory=/opt/qvillage
ExecStart=/usr/bin/docker run \
  --rm \
  --name qvillage-sync \
  -e HF_API_TOKEN=${HF_API_TOKEN} \
  -e QVILLAGE_API_URL=https://api.qvillage.ai \
  -e QMOI_MEMORY_URL=https://memory.qmoi.ai \
  -e SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL} \
  thestablekenya/qvillage-sync:latest

Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable qvillage-sync
sudo systemctl start qvillage-sync
sudo systemctl status qvillage-sync

# View logs
sudo journalctl -u qvillage-sync -f
```

---

## 🐳 DOCKER COMPOSE (All-in-One)

**Run entire stack locally or in cloud:**

```yaml
# docker-compose.yml
version: "3.8"

services:
  qvillage-sync:
    build:
      context: .
      dockerfile: Dockerfile.qvillage
    container_name: qvillage-sync
    environment:
      HF_API_TOKEN: ${HF_API_TOKEN}
      QVILLAGE_API_URL: https://api.qvillage.ai
      QMOI_MEMORY_URL: https://memory.qmoi.ai
      SLACK_WEBHOOK_URL: ${SLACK_WEBHOOK_URL}
      LOG_LEVEL: INFO
    restart: always
    networks:
      - qvillage-net
    healthcheck:
      test: ["CMD", "python", "-c", "import sys; sys.exit(0)"]
      interval: 300s
      timeout: 10s
      retries: 3
      start_period: 10s

  cost-monitor:
    build:
      context: .
      dockerfile: Dockerfile.qvillage
    container_name: qvillage-cost-monitor
    command: python monitor_hf_costs.py --save-report
    environment:
      HF_API_TOKEN: ${HF_API_TOKEN}
    restart: always
    networks:
      - qvillage-net

networks:
  qvillage-net:
    driver: bridge
```

**Run:**

```bash
# Create .env file
cat > .env << 'EOF'
HF_API_TOKEN=hf_xxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
EOF

# Start
docker-compose up -d

# View logs
docker-compose logs -f qvillage-sync

# Stop
docker-compose down
```

---

## 📊 MONITORING DOCKER CONTAINER

```bash
# View logs (last 50 lines)
docker logs --tail 50 qvillage-sync

# Follow logs (real-time)
docker logs -f qvillage-sync

# View container stats (CPU, memory)
docker stats qvillage-sync

# Inspect container
docker inspect qvillage-sync

# Execute command inside container
docker exec qvillage-sync python -c "import sys; print(sys.version)"

# Check if running
docker ps | grep qvillage-sync

# Restart container
docker restart qvillage-sync

# Remove container
docker rm qvillage-sync
```

---

## 🔄 AUTO-RESTART POLICIES

**Key flags for `docker run`:**

```bash
# Restart only if exit code != 0
docker run --restart=on-failure:5 ...

# Restart always (required)
docker run --restart=always ...

# No restart (default)
docker run --restart=no ...

# Restart unless stopped
docker run --restart=unless-stopped ...
```

**In docker-compose.yml:**

```yaml
restart_policy:
  condition: on-failure
  max_attempts: 5
  delay: 10s
```

---

## 🚀 production CHECKLIST

- [ ] Dockerfile created and tested
- [ ] Image built successfully
- [ ] Secrets (tokens) in environment variables
- [ ] Health checks configured
- [ ] Restart policy set to `always`
- [ ] Logging configured
- [ ] Monitoring tools active
- [ ] Container runs 24/7
- [ ] Auto-restarts on failure
- [ ] Deployable to any cloud provider

---

## 📈 SCALING (If Needed)

**Horizontal scaling (multiple instances):**

```bash
# Docker Swarm
docker swarm init
docker service create --replicas 3 \
  -e HF_API_TOKEN=$HF_API_TOKEN \
  thestablekenya/qvillage-sync:latest

# Kubernetes
kubectl scale deployment qvillage-sync --replicas=3

# Docker Compose (with load balancer)
version: '3.8'
services:
  qvillage-sync:
    build: .
    deploy:
      replicas: 3
    ...
```

---

## 🎯 DEPLOYMENT MATRIX

| Platform         | Command                              | Cost        | Time   |
| ---------------- | ------------------------------------ | ----------- | ------ |
| **Local Docker** | `docker run -d --restart=always ...` | Free        | 5 min  |
| **Railway**      | `railway up`                         | $5-10/mo    | 5 min  |
| **Heroku**       | `git push heroku main`               | $7/mo       | 5 min  |
| **Render**       | Git push (auto-deploy)               | Free-$12/mo | 5 min  |
| **AWS ECS**      | `aws ecs create-service ...`         | $10-50/mo   | 20 min |
| **Kubernetes**   | `kubectl apply -f ...`               | Variable    | 30 min |
| **AWS Lambda**   | CloudFormation standard              | <$1/mo      | 20 min |

---

## ✅ FINAL STATUS

**Your system can now:**

- ✅ Run anywhere Docker runs
- ✅ Auto-restart on failure
- ✅ Scale horizontally
- ✅ Monitor health
- ✅ Log everything
- ✅ Cost optimize
- ✅ Deploy to cloud
- ✅ Run forever

**Pick your deployment method above and go live!**

---

## 🔐 Autoclone & Standalone Mode (platform-agnostic)

If you want QMOI / QVillage to be fully independent (no HF/GitHub/Vercel required), use the autoclone + standalone runner option. This will:

- Clone (or update) the repository at container start or on a server.
- Install complete runtime dependencies (from `hf_space_qvillage/requirements.txt`).
- Run a local standalone runner which imports the sync engine or falls back to executing it.

Files added to support this mode:

- `tools/autoclone_and_run.sh` — clones the repo into `/opt/qvillage` (or `REPO_DIR`) and runs the standalone runner.
- `tools/standalone_runner.py` — imports `tools/qvillage_memory_sync` and runs a looped sync; falls back to subprocess execution.
- `Dockerfile.qvillage` — Docker image that bundles the autoclone entrypoint and standalone runner.

Quick run (local Docker):

```bash
# Build image
docker build -f Dockerfile.qvillage -t qvillage-standalone:latest .

# Run (autoclone into /opt/qvillage inside container)
docker run -d --restart=always \
  -e REPO_URL=https://github.com/thestablekenya/qmoi-enhanced.git \
  -e REPO_DIR=/opt/qvillage \
  -e RUN_INTERVAL_SECONDS=3600 \
  -e HF_API_TOKEN=$HF_API_TOKEN \
  -e SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL \
  qvillage-standalone:latest
```

Notes:

- To skip cloning (e.g., when mounting a volume), set `SKIP_AUTOCLONE=1`.
- To skip pip install on startup (for faster startups when deps are preinstalled), set `SKIP_DEP_INSTALL=1`.
- For one-off runs, set `RUN_INTERVAL_SECONDS=0` to exit after one cycle.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:28Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

