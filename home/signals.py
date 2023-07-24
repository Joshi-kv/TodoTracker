from django.db.models.signals import post_save
from django.dispatch import receiver
from . models import Notification
from django.contrib.auth.models import User
import json

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=Notification)
def notification_count(sender, instance, created, **kwargs) :
    if created :
            channel_layer = get_channel_layer()
            
            user_id = instance.user.id
            user = instance.user
            
            data = {
                'receiver':user_id,
                'notification_count':Notification.objects.filter(user=user).count()
            }

            async_to_sync(channel_layer.group_send)(
                f'user_{user_id}',
                {
                    'type': 'notification_count',
                    'data': json.dumps(data)
                }
            )