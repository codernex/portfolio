FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install
COPY . .
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod
COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/main.js"]
