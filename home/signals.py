from django.db.models.signals import post_save
from django.dispatch import receiver
from . models import Notification
from django.contrib.auth.models import User
import json

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=Notification)
def notification_count_update(sender, instance, created, **kwargs) :
    if created :
            channel_layer = get_channel_layer()
            
            user_id = instance.user.id
            user = instance.user
            notifications = []

            for notification in Notification.objects.filter(user=user):
                notifications.append({
                    'user':notification.user.username,
                    'task_title':notification.task_title,
                    'task_description':notification.task_description,
                    'task_duedate':notification.task_duedate
                })
                    
            data = {
                'receiver':user_id,
                'counted_notification':Notification.objects.filter(user=user).count(),
                'notifications':notifications
            }
            
            print(data)

            async_to_sync(channel_layer.group_send)(
                f'{user_id}',
                {
                    'type': 'notification_count_update',
                    'value': json.dumps(data,default=str)
                }
            )