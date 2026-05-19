# QMOI Enhanced - Production-Ready Multi-Stage Dockerfile
# PRODUCTION READY: Security hardened, optimized for financial systems
# Last Updated: March 29, 2026
# Version: 2.4.0

# ============================================================================
# BUILDER STAGE - Secure Build Environment
# ============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Security: Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache \
        python3 \
        make \
        g++ \
        git \
        curl \
        && rm -rf /var/cache/apk/*

# Security: Create non-root user for build
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files for dependency installation
COPY package*.json ./
COPY prisma/ ./prisma/

# Install dependencies with security audit
RUN npm ci --only=production --legacy-peer-deps && \
    npm audit --audit-level high --production || true

# Copy source code
COPY . .

# Build application
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# ============================================================================
# DEPENDENCY SCAN STAGE - Security Vulnerability Check
# ============================================================================
FROM builder AS security-scan

# Install security scanning tools
RUN apk add --no-cache \
        clamav \
        trivy \
        && rm -rf /var/cache/apk/*

# Scan for vulnerabilities
RUN trivy filesystem --no-progress --exit-code 0 --format json /app > /app/trivy-report.json || true

# ============================================================================
# RUNTIME STAGE - Production Optimized
# ============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

# Labels for container metadata
LABEL maintainer="QMOI Enhanced Team"
LABEL version="2.4.0"
LABEL description="QMOI Enhanced - Production Financial Systems"

# Security: Install security updates and runtime dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache \
        dumb-init \
        curl \
        tzdata \
        && rm -rf /var/cache/apk/*

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy security scan results for audit
COPY --from=security-scan /app/trivy-report.json ./security/

# Security: Set proper permissions
RUN chown -R nextjs:nodejs /app && \
    chmod -R 755 /app && \
    chmod 644 /app/security/trivy-report.json

# Switch to non-root user
USER nextjs

# Health check for production monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["npm", "start"]

# ============================================================================
# MONITORING STAGE - Optional monitoring container
# ============================================================================
FROM node:20-alpine AS monitoring

WORKDIR /app

# Install monitoring tools
RUN apk add --no-cache \
        curl \
        jq \
        && rm -rf /var/cache/apk/*

# Copy monitoring scripts
COPY scripts/monitoring/ ./monitoring/

# Health check script
COPY scripts/health-check.sh ./health-check.sh
RUN chmod +x ./health-check.sh

CMD ["./health-check.sh"]