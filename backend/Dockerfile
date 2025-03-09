FROM python:3.12

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && apt-get install --no-install-recommends -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port 8000
EXPOSE 8000
EXPOSE 8001

# Start the application with gunicorn and daphne
CMD gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3 --threads 2 & \
    daphne backend.asgi:application --bind 0.0.0.0:8001
