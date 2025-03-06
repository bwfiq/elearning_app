# --- Backend Stage ---
FROM docker.io/library/python:3.12-slim as backend-builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend .

# --- Frontend Stage ---
FROM docker.io/library/node:20-alpine as frontend-builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build

# --- Production Stage ---
FROM docker.io/library/python:3.12-slim as production

WORKDIR /app

# Install system dependencies. Note: Alpine doesn't use apt so use apk
RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*
# Copy backend dependencies
COPY --from=backend-builder /app .
RUN pip install --no-cache-dir -r requirements.txt

# Collect static files (this is needed even if you're only serving API)
RUN python manage.py collectstatic --noinput

# Copy the frontend build artifacts
COPY --from=frontend-builder /app/build ./static/frontend

# Create entrypoint
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

# --- Serve static files with Nginx ---
RUN apt-get update && apt-get install -y nginx

# Remove default Nginx config
RUN rm /etc/nginx/sites-available/default
RUN rm /etc/nginx/sites-enabled/default

# Add custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
