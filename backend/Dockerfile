FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend/package.json ./backend/package.json
COPY packages ./packages

RUN pnpm install --frozen-lockfile=false

COPY backend ./backend

# Generate Prisma client
WORKDIR /app/backend
RUN npx prisma generate 2>/dev/null || true

WORKDIR /app

EXPOSE 3001

CMD ["pnpm", "--filter", "@wellness/backend", "dev"]
