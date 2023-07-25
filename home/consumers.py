import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def websocket_connect(self, message):
        print("Connecting ",message)
        
        user = self.scope['user'].id
        self.room_name = f'{user}'
        
        print(self.room_name)
        
        self.room_group_name = self.room_name 
        
        print(self.room_group_name)
        
        await self.channel_layer.group_add(
            self.room_group_name, 
            self.channel_name,
        )
        
        await self.accept()

    async def websocket_receive(self, message):
        print("Received websocket message", message)
    
    async def notification_count_update(self,event):
        print('Receiving notification',event)
        data = json.loads(event['value'])
        user = data['receiver']
        count = data['counted_notification']
        notifications = data['notifications']
        
        await self.send(text_data=json.dumps({
            'count':count,
            'user':user,
            'notifications':notifications
        }))
    
    async def websocket_disconnect(self, event):
        print('Disconnecting',event)