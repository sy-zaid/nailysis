"""
FastAPI application for predicting nail diseases using a pre-trained Keras model.

This service exposes a single POST endpoint `/predict` where an image of a fingernail can be uploaded.
The model processes the image and returns a prediction of the nail condition class.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
from pathlib import Path

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for all origins, methods, and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the base directory (where this script is located)
BASE_DIR = Path(__file__).resolve().parent

# Join path to your model
MODEL_PATH = BASE_DIR / 'cnn_model_final-v1.keras'
# Load the trained Keras model
# NOTE: Ensure the path is correct and accessible
# Load the model
model = tf.keras.models.load_model(str(MODEL_PATH))

# Define class names (same as in your training code)
CLASS_NAMES = [
    "beaus lines", 
    "bluish nails", 
    "clubbing", 
    "healthy nails", 
    "koilonychia", 
    "melanoma",
    "muehrckes Lines", 
    "nail pitting", 
    "onychogryphosis", 
    "onycholysis", 
    "onychomycosis",
    "psoriasis", 
    "terrys nails"
]

def preprocess_image(image, target_size=(256, 256)):
    """
    Preprocess an image for prediction (same as in your training code).
    """
    # Resize the image
    image = image.resize(target_size)
    # Convert the image to a numpy array
    image_array = img_to_array(image)
    # Scale pixel values to [0, 1]
    image_array /= 255.0
    # Add a batch dimension
    preprocessed_image = np.expand_dims(image_array, axis=0)
    return preprocessed_image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint to predict nail condition from an uploaded image.
    
    Parameters:
    - file (UploadFile): Image file uploaded via multipart/form-data

    Returns:
    - JSON response with:
        - predicted_class: name of the predicted class
        - confidence: confidence score (0-1)
        - class_index: index of the predicted class
        - all_predictions: array of all class probabilities
    """
    try:
        # Read file contents
        contents = await file.read()
        
        # Open image and convert to RGB
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # Preprocess the image (using same method as training)
        preprocessed_img = preprocess_image(img)
        
        # Make prediction
        predictions = model.predict(preprocessed_img)
        predicted_index = np.argmax(predictions)
        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(predictions[0][predicted_index])
        
        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "class_index": int(predicted_index),
            "all_predictions": predictions.tolist()[0]
        }

    except Exception as e:
        # Handle and return exceptions as HTTP errors
        raise HTTPException(status_code=400, detail=str(e))