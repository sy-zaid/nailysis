from rest_framework import viewsets, permissions,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
import requests
from .models import NailDiseasePrediction, NailImage, Patient  # import your models
import json
from django.utils import timezone
from django.shortcuts import get_object_or_404
from collections import defaultdict
from .main import CLASS_NAMES
class NailAnalysisViewSet(viewsets.ViewSet):
    parser_classes = [MultiPartParser]
    permission_classes = [permissions.IsAuthenticated]
    
    
    @action(detail=False, methods=['post'], url_path='analyze')
    def analyze(self, request):
        user = self.request.user
        # If user is not a patient, doctor or technician
        if user.role not in ["patient","doctor","lab_technician"]:
            return Response({"error":"Not authorized to perform nail analysis."},status=status.HTTP_401_UNAUTHORIZED)
        # If user is a patient, get its object
        if user.role == "patient":
            patient = get_object_or_404(Patient,user=user)
        
        patient_id = request.data.get("patient_id")
        
        if user.role == "doctor" or user.role == "lab_technician":
            if patient_id:
                patient = get_object_or_404(Patient,user_id = patient_id)
            else:
                patient = None
                
        if 'images' not in request.FILES:
            return Response({"error": "No image files provided"}, status=400)

        file_objs = request.FILES.getlist('images')
        if len(file_objs) < 1 or len(file_objs) > 5:
            return Response({"error": "Please provide between 3 to 5 images"}, status=400)

        predictions = []
        disease_confidences = defaultdict(list)  # Stores all confidence scores per disease
        disease_votes = defaultdict(int)  # Counts how many times each disease was top prediction
        all_top_predictions = []  # Stores all top predictions from all images

        # Track highest confidence prediction overall (for DB)
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

                # Track highest confidence prediction | PER IMAGE
                if result["confidence"] > highest_confidence:
                    highest_confidence = result["confidence"]
                    final_prediction = result["predicted_class"]

                # Get all predictions
                all_predictions = result["all_predictions"]
                
                # Create list of (confidence, index, class_name) and sort | contains more than 3 predictions at this point
                confidence_class_pairs = [(conf, idx, CLASS_NAMES[idx]) 
                                        for idx, conf in enumerate(all_predictions)]
                confidence_class_pairs.sort(reverse=True, key=lambda x: x[0])
                print("\n1. Confidence Class Pairs",confidence_class_pairs)

                # Get top 3 predictions for this image
                top_classes = [
                    {"class_index": pair[1], "predicted_class": pair[2], "confidence": pair[0]}
                    for pair in confidence_class_pairs[:3]
                ]
                
                # Store this image's predictions
                predictions.append({"top_classes": top_classes})
                print("\n2. Predictions",predictions)
                
                # Add top prediction to vote count
                top_prediction = top_classes[0]["predicted_class"]
                disease_votes[top_prediction] += 1
                
                # Aggregate all confidence scores per disease
                for pred in top_classes:
                    disease_confidences[pred["predicted_class"]].append(pred["confidence"])
                
                # Store all top predictions for final analysis
                all_top_predictions.extend([(pred["confidence"], pred["predicted_class"], pred["class_index"]) 
                                          for pred in top_classes])

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

        # Determine final result using combined strategy
        final_results = self._combine_predictions(disease_votes, disease_confidences, all_top_predictions)

        # If patient object available, save the results in DB
        if patient:
            try:
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
                return Response({"message":"Successfully saved prediction results in database."},status=status.HTTP_200_OK)

            except Exception as e:
                print("Failed to save prediction:", str(e))
                return Response({"error":"Failed to save prediction results in database."},status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "individual_predictions": predictions,
            "combined_result": final_results
        })

    def _combine_predictions(self, disease_votes, disease_confidences, all_top_predictions):
        """
        Combine predictions using multiple strategies:
        1. Voting: Count how many times each disease was the top prediction
        2. Average confidence: Average confidence for each disease across all predictions
        3. Maximum confidence: Highest confidence score for each disease
        """
        combined_results = []
        
        # Get unique diseases from all top predictions
        unique_diseases = {pred[1] for pred in all_top_predictions}
        
        for disease in unique_diseases:
            votes = disease_votes.get(disease, 0)
            confidences = disease_confidences.get(disease, [])
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            max_confidence = max(confidences) if confidences else 0
            
            # Find class index for this disease
            class_index = next((pred[2] for pred in all_top_predictions if pred[1] == disease), -1)
            
            combined_results.append({
                "class_index": class_index,
                "predicted_class": disease,
                "vote_count": votes,
                "average_confidence": avg_confidence,
                "max_confidence": max_confidence,
                "occurrence_count": len(confidences)
            })
        
        # Sort by multiple criteria (votes first, then average confidence)
        combined_results.sort(
            key=lambda x: (-x['vote_count'], -x['average_confidence'], -x['max_confidence'])
        )
        
        # Return top 3 results with all relevant information
        top_results = combined_results[:3]
        
        # Format the final output
        return [{
            "class_index": res["class_index"],
            "predicted_class": res["predicted_class"],
            "confidence": res["average_confidence"],  # Using average as main confidence
            "vote_count": res["vote_count"],
            "max_confidence": res["max_confidence"]
        } for res in top_results]