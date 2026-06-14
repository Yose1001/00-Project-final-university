# Back-end (Express + Prisma) container
FROM node:20-slim

# Prisma needs openssl at runtime/generate time
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install deps first (better layer caching). npm install also runs the
# @prisma/engines postinstall, baking the query + schema engines into the image.
COPY package*.json ./
RUN npm install

# Copy source and generate the Prisma client for this (linux) platform
COPY . .
RUN npx prisma generate

EXPOSE 8889

# Default command; docker-compose overrides this to also push schema + seed.
CMD ["node", "app.js"]
