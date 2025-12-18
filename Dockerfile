# Multi-stage Dockerfile for QMOI (Next.js production)
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only lockfiles/package manifests first for better layer caching
COPY package*.json ./

# Use npm install fallback to handle repos without package-lock.json
RUN npm install --legacy-peer-deps --omit=dev

# Copy rest of repository and build
COPY . .
RUN npm run ci:build

# Final runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production deps in the runtime image (safe fallback)
RUN npm install --legacy-peer-deps --omit=dev --production --no-audit --no-fund || true

EXPOSE 3000
CMD ["npm", "start"]