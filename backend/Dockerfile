# backend/Dockerfile
FROM python:3.12

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY backend /app

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Start server
CMD ["gunicorn", "backend.wsgi", "--bind", "0.0.0.0:8000"]
