# frontend/Dockerfile
FROM node:16

WORKDIR /app

COPY . .

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
