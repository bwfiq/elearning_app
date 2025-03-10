FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose port 80
EXPOSE 80

CMD ["./init"]
