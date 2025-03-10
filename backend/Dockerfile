FROM python:3.12-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1 \
    PYTHONUNBUFFERED 1

# Copy requirements file
COPY requirements.txt /
RUN pip install --no-cache-dir -r /requirements.txt

# Copy the backend code
WORKDIR /app
COPY . .
RUN python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput && \
    python setup.py # This populates the db with fake data; remove if not needed

# Expose port 8000 and 8001
EXPOSE 8000
EXPOSE 8001


# Start the application with gunicorn and daphne
CMD gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3 --threads 2 & \
    daphne backend.asgi:application -b 0.0.0.0 -p 8001
