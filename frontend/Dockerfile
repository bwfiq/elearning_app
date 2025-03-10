# Stage 1: Prepare the Node.js build environment
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app
RUN npm run build --production

# Stage 2: Copy over build and run the app
FROM lipanski/docker-static-website:latest

# Copy necessary files from the builder stage
COPY --from=builder /app/build .

CMD ["/busybox-httpd", "-f", "-v", "-p", "3000"]
