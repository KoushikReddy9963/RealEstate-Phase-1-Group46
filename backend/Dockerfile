# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Build and run
FROM node:18-alpine
WORKDIR /app

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 5000

# Generate swagger-output.json and start the app
CMD ["sh", "-c", "node index.js"]
