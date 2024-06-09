FROM node:18-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based using package manager
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control."; \
  fi

COPY public ./public
COPY src ./src
COPY components.json .
COPY next.config.mjs .
COPY postcss.config.js .
COPY tailwind.config.ts .
COPY tsconfig.json .

# Environment variables must be present at build time
ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

# Disable Next.js anonymous telemetry data at build time
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js based using package manager
RUN npm run build

# Step 2. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Environment variables must be redefined at run time
ARG NEXT_PUBLIC_OLLAMA_URL
ENV NEXT_PUBLIC_OLLAMA_URL=${NEXT_PUBLIC_OLLAMA_URL}
ARG NEXT_PUBLIC_OLLAMA_MODEL
ENV NEXT_PUBLIC_OLLAMA_MODEL=${NEXT_PUBLIC_OLLAMA_MODEL}

# Disable Next.js anonymous telemetry data at build time
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

CMD ["node", "server.js"]