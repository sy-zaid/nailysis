from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
import requests
from .models import NailDiseasePrediction, NailImage, Patient  # import your models
import json
from django.utils import timezone

class NailAnalysisViewSet(viewsets.ViewSet):
    parser_classes = [MultiPartParser]
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'], url_path='analyze')
    def analyze(self, request):
        if 'images' not in request.FILES:
            return Response({"error": "No image files provided"}, status=400)

        file_objs = request.FILES.getlist('images')
        predictions = []

        highest_confidence = 0
        final_prediction = None

        for file_obj in file_objs:
            max_size = 5 * 1024 * 1024
            if file_obj.size > max_size:
                return Response({"error": f"File {file_obj.name} is too large (max 5MB)"}, status=400)

            try:
                response = requests.post(
                    "http://localhost:8001/predict",
                    files={'file': (file_obj.name, file_obj, file_obj.content_type)},
                    timeout=15
                )
                response.raise_for_status()
                result = response.json()
                predictions.append(result)

                # Track highest confidence prediction
                if result["confidence"] > highest_confidence:
                    highest_confidence = result["confidence"]
                    final_prediction = result["predicted_class"]

            except requests.exceptions.Timeout:
                return Response({"error": "FastAPI service timeout"}, status=504)
            except requests.exceptions.ConnectionError:
                return Response({"error": "Could not connect to FastAPI service"}, status=502)
            except requests.exceptions.HTTPError as e:
                try:
                    error_detail = response.json().get('detail', str(e))
                except:
                    error_detail = str(e)
                return Response({"error": f"FastAPI error: {error_detail}"}, status=response.status_code)
            except Exception as e:
                return Response({"error": f"Internal server error: {str(e)}"}, status=500)

        # 🧠 Save to DB after successful processing
        try:
            patient = getattr(request.user, 'patient', None)
            if not patient:
                # Fallback for unauthenticated users — optional
                patient = Patient.objects.first()

            prediction_obj = NailDiseasePrediction.objects.create(
                patient=patient,
                predicted_class=final_prediction,
                confidence=highest_confidence,
                all_predictions=predictions,
                symptoms=request.data.get('symptoms', ''),
                status='Completed',
                timestamp=timezone.now()
            )

            for index, file_obj in enumerate(file_objs):
                NailImage.objects.create(
                    prediction=prediction_obj,
                    image=file_obj,
                    image_index=index
                )

        except Exception as e:
            print("Failed to save prediction:", str(e))
            # Optionally continue or return error

        return Response(predictions)
