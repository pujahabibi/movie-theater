FROM node:20.19.0-bookworm AS build
WORKDIR /app

# System deps for Prisma engines
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install deps
COPY package.json ./
RUN npm install

# Prisma generate
COPY prisma ./prisma
RUN npx prisma generate

# Copy source (JavaScript - no build step needed)
COPY src ./src

# --- Runtime ---
FROM node:20.19.0-bookworm AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src ./src
COPY package.json ./package.json

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 4000
CMD ["sh", "-lc", "npx prisma db push && node src/server.js"]