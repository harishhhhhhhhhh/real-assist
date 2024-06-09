FROM node:18-alpine

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

# Disable Next.js anonymous telemetry data at run time
ENV NEXT_TELEMETRY_DISABLED 1

# Start Next.js in development mode 
CMD npm run dev