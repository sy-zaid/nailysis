from rest_framework import viewsets, permissions,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

import requests
from .models import NailDiseasePrediction, NailImage, Patient
from .serializers import NailDiseasePredictionSerializer
from users.serializers import PatientSerializer
import os
import json
from django.utils import timezone
from django.shortcuts import get_object_or_404
from collections import defaultdict
from .main import CLASS_NAMES

@method_decorator(csrf_exempt, name='dispatch') 
class NailAnalysisViewSet(viewsets.ViewSet):
    parser_classes = [MultiPartParser]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NailDiseasePredictionSerializer
    
    # Apply CSRF exemption at the class level for all actions
    @method_decorator(csrf_exempt, name='dispatch')
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    @action(detail=False, methods=['post'], url_path='analyze')
    def analyze(self, request):
        # Ensure the request is marked as not needing CSRF
        request._dont_enforce_csrf_checks = True
        
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
        disease_confidences = defaultdict(list)
        disease_votes = defaultdict(int)
        all_top_predictions = []
        highest_confidence = 0
        final_prediction = None
        image_data = []  # To store information about all submitted images

        for index, file_obj in enumerate(file_objs):
            max_size = 5 * 1024 * 1024
            if file_obj.size > max_size:
                return Response({"error": f"File {file_obj.name} is too large (max 5MB)"}, status=400)

            # Store basic image info before processing
            image_info = {
                "name": file_obj.name,
                "size": file_obj.size,
                "content_type": file_obj.content_type,
                "index": index,
                "url": None  # Will be filled if saved to DB
            }
            
            # When calling the FastAPI service, add proper headers
            headers = {
            'Referer': 'https://nailysis.onrender.com',
            'Origin': 'https://nailysis.onrender.com',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'NailysisBackend/1.0'
            }
            # Increase timeout for heavy predictions
            try:
                
                response = requests.post(
                    "http://localhost:10000/predict",  # Use internal hostname
                    files={'file': (file_obj.name, file_obj, file_obj.content_type)},
                    headers=headers,
                    timeout=90  # Increase timeout to 90 seconds
                )
                response.raise_for_status()
                result = response.json()

                if result["confidence"] > highest_confidence:
                    highest_confidence = result["confidence"]
                    final_prediction = result["predicted_class"]

                all_predictions = result["all_predictions"]
                
                confidence_class_pairs = [(conf, idx, CLASS_NAMES[idx]) 
                                        for idx, conf in enumerate(all_predictions)]
                confidence_class_pairs.sort(reverse=True, key=lambda x: x[0])

                top_classes = [
                    {"class_index": pair[1], "predicted_class": pair[2], "confidence": pair[0]}
                    for pair in confidence_class_pairs[:3]
                ]
                
                predictions.append({"top_classes": top_classes})
                top_prediction = top_classes[0]["predicted_class"]
                disease_votes[top_prediction] += 1
                
                for pred in top_classes:
                    disease_confidences[pred["predicted_class"]].append(pred["confidence"])
                
                all_top_predictions.extend([(pred["confidence"], pred["predicted_class"], pred["class_index"]) 
                                        for pred in top_classes])

                # Add prediction results to this image's info
                image_info["predictions"] = top_classes
                image_data.append(image_info)

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
                    nail_image = NailImage.objects.create(
                        prediction=prediction_obj,
                        image=file_obj,
                        image_index=index
                    )
                    # Update the corresponding image info with URL
                    image_data[index]["url"] = request.build_absolute_uri(nail_image.image.url)

            except Exception as e:
                return Response({"error":"Failed to save prediction results in database."},status=status.HTTP_400_BAD_REQUEST)

        # Prepare other_details dictionary
        other_details = {
            "current_result": final_results,
            "final_prediction": final_prediction,
            "scanned_on": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            "scanned_by": user.role,
            "total_images": len(file_objs),
            "total_conditions_detected": len(disease_votes)
        }

        return Response({
            "individual_predictions": predictions,
            "combined_result": final_results,
            "patient_details": PatientSerializer(patient).data if patient else None,
            "images": image_data,
            "other_details": other_details
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
        
    def _reconstruct_combined_result(self, prediction):
        """Reconstructs the combined_result from saved prediction data"""
        # Rebuild the data structures that _combine_predictions expects
        disease_votes = defaultdict(int)
        disease_confidences = defaultdict(list)
        all_top_predictions = []
        
        # Check if all_predictions exists and is in correct format
        if not prediction.all_predictions or not isinstance(prediction.all_predictions, list):
            return []
        
        # prediction.all_predictions contains a list of predictions for each image
        for img_prediction in prediction.all_predictions:
            # Skip if this image prediction is malformed
            if not isinstance(img_prediction, dict) or 'top_classes' not in img_prediction:
                continue
                
            # Each img_prediction has a 'top_classes' list with top 3 predictions
            for pred in img_prediction['top_classes']:
                # Skip if prediction is malformed
                if not isinstance(pred, dict) or 'predicted_class' not in pred or 'confidence' not in pred:
                    continue
                    
                disease_votes[pred['predicted_class']] += 1
                disease_confidences[pred['predicted_class']].append(pred['confidence'])
                # Use get() with default -1 for class_index in case it's missing
                all_top_predictions.append((
                    pred['confidence'],
                    pred['predicted_class'],
                    pred.get('class_index', -1)
                ))
        
        # Call the existing combination logic if we have valid data
        if disease_votes:
            return self._combine_predictions(disease_votes, disease_confidences, all_top_predictions)
        return []

    @action(detail=True, methods=['get'], url_path='get-report')
    def get_report(self, request, pk=None):
        try:
            prediction = NailDiseasePrediction.objects.prefetch_related('nail_images').get(pk=pk)
            
            # Verify requesting user has permission to access this report
            requesting_user = request.user
            if not (requesting_user.role == "doctor" or 
                    requesting_user.role == "lab_technician" or
                    str(requesting_user.id) == str(prediction.patient.user.id)):
                return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
            
            individual_predictions = prediction.all_predictions
            combined_result = self._reconstruct_combined_result(prediction)

            patient_data = PatientSerializer(prediction.patient).data if prediction.patient else None

            # Collect image data + try to match what analyze returns
            images = []
            individual_predictions = prediction.all_predictions

            for nail_image in prediction.nail_images.all().order_by('image_index'):
                index = nail_image.image_index

                # Attempt to get prediction for this image index
                image_prediction = None
                if (isinstance(individual_predictions, list) and 
                    index < len(individual_predictions)):
                    image_prediction = individual_predictions[index].get('top_classes')

                image_info = {
                    'url': request.build_absolute_uri(nail_image.image.url),
                    'name': os.path.basename(nail_image.image.name),
                    'index': index,
                    'size': nail_image.image.size,
                    'predictions': image_prediction or []
                }
                images.append(image_info)

            other_details = {
                "current_result": combined_result,
                "final_prediction": prediction.predicted_class,
                "scanned_on": prediction.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "scanned_by": prediction.patient.user.role if prediction.patient else "Unknown",
                "total_images": len(images),
                "total_conditions_detected": len(combined_result)
            }

            return Response({
                "individual_predictions": individual_predictions,
                "combined_result": combined_result,
                "patient_details": patient_data,
                "images": images,
                "other_details": other_details
            })
            
        except NailDiseasePrediction.DoesNotExist:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Error generating report: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    