# syntax=docker/dockerfile:1.6

FROM node:22-bookworm-slim AS base
WORKDIR /app

# Install dependencies (including native modules)
FROM base AS deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates build-essential python3 \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# Build the Next.js application
FROM deps AS builder

# Accept build arguments for NEXT_PUBLIC_ environment variables
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_GOOGLE_MAP_ID
ARG NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

# Set them as environment variables for the build process
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAP_ID=$NEXT_PUBLIC_GOOGLE_MAP_ID
ENV NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=$NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

COPY . .
RUN npm run build

# Create the minimal runtime image
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Install runtime dependencies for better-sqlite3
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r nextjs && useradd -r -g nextjs nextjs

# Copy built application
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/app ./app
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/data ./data

RUN chown -R nextjs:nextjs /app
USER nextjs
CMD ["npm","start"]
