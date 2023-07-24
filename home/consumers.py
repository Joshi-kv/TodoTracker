from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def websocket_connect(self, message):
        print("Connecting ",message)
        
        user = self.scope['user'].id
        self.room_name = f'user-{user}'
        
        print(self.room_name)
        
        self.room_group_name = f'notification_{self.room_name}'
        
        await self.channel_layer.group_add(
            self.room_group_name, 
            self.channel_name,
        )
        
        await self.accept()
    
    async def websocket_receive(self, event):
        print("Receiving ",event)
    
    async def websocket_disconnect(self, event):
        print('Disconnecting',event)