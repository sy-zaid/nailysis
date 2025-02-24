import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.exceptions import ObjectDoesNotExist
from .models import EHR  # Import the EHR model
from .serializers import EHRSerializer  # Import the EHR serializer

class EHRConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connected")
        """Runs when a user connects to the WebSocket"""
        self.room_name = "ehr_updates"
        self.room_group_name = "ehr_updates"  

        # Join the WebSocket group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        print("WebSocket disconnected")
        """Runs when the WebSocket disconnects"""
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
            """Handles incoming WebSocket messages from the client"""
            
            data = json.loads(text_data)
            print("🔥 Received WebSocket Data:", data)

            action = data.get("action")
            ehr_id = data.get("id")

            # Fetch the full EHR record if it's a "create" action
            ehr_data = None
            if action == "create" and ehr_id:
                try:
                    ehr_record = EHR.objects.get(id=ehr_id)
                    ehr_data = EHRSerializer(ehr_record).data  # Serialize full EHR record
                except ObjectDoesNotExist:
                    print(f"⚠️ EHR record with ID {ehr_id} not found.")

            # Ensure `ehr_data` is JSON-serializable before sending
            ehr_data_json = json.dumps(ehr_data) if ehr_data else None

            # Send the WebSocket update with `ehr_data`
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "ehr_update",
                    "action": action,  
                    "id": ehr_id,
                    "message": data.get("message"),
                    "ehr_data": ehr_data_json,  # Now in JSON format
                }
            )

    async def ehr_update(self, event):
        """Sends updates to all WebSocket users"""
        print("🔥 WebSocket Broadcast ->", event)

        # Deserialize `ehr_data` before sending it to the frontend
        ehr_data = event.get("ehr_data")  # No need to deserialize again

        await self.send(text_data=json.dumps({
            "action": event["action"],
            "id": event.get("id"),
            "message": event["message"],
            "ehr_data": ehr_data,  # Now correctly formatted for frontend
        }))