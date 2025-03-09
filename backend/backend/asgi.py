# backend/backend/asgi.py
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.conf import settings  # Import settings
from django.contrib.staticfiles.handlers import StaticFilesHandler # Import StaticFilesHandler
import chat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Get the ASGI application *after* setting the environment variable
django_asgi_app = get_asgi_application()

# Wrap the application with a StaticFilesHandler only in development
if settings.DEBUG:
    application = ProtocolTypeRouter({
        "http": StaticFilesHandler(django_asgi_app),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                chat.routing.websocket_urlpatterns
            )
        ),
    })
else:
    application = ProtocolTypeRouter({
        "http": django_asgi_app,
        "websocket": AuthMiddlewareStack(
            URLRouter(
                chat.routing.websocket_urlpatterns
            )
        ),
    })
