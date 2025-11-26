# Multi-stage Dockerfile for Next.js production build
FROM node:18-alpine AS base
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install only production deps in the final stage; install all here for build
RUN apk add --no-cache libc6-compat

FROM base AS deps
RUN npm ci --only=production || true

FROM base AS builder
COPY . ./
RUN npm install
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "next-start"]
