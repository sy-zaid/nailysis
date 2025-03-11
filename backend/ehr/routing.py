from django.urls import re_path,path
from ehr.consumers import EHRConsumer

websocket_urlpatterns = [
    re_path(r'ws/ehr_updates/$', EHRConsumer.as_asgi()),
]
