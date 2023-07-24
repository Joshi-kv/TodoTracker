from . import consumers
from django.urls import path

websocket_urlpatterns = [
    path('notification/',consumers.NotificationConsumer.as_asgi()),
    
]