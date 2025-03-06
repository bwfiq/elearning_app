#!/bin/bash

# Apply migrations (in background)
echo "Applying database migrations..."
(python manage.py migrate --noinput) &

# Start the Django web server (in background)
echo "Starting Django server..."
(python manage.py runserver 0.0.0.0:8000) &

# Start Nginx (in background)
echo "Starting Nginx..."
(nginx -g "daemon off;") &

# Keep the container running indefinitely by sleeping or tailing a log
tail -f /dev/null
