## Multi-stage Dockerfile for QMOI production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build --if-present

FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
# Multi-stage Dockerfile for QMOI (Next.js production)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# install deps
RUN npm ci --only=production
COPY . .
# build application
RUN npm run ci:build

# Final image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Install only production deps
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]