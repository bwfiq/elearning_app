# Stage 1: Prepare the Node.js build environment
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Stage 2: Runtime environment (includes building with env vars)
FROM node:20-alpine

WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY . .
RUN npm install -g serve

# Make the init script executable
RUN chmod +x ./init

EXPOSE 80

CMD ["./init"]
