from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io
import tensorflow as tf

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your Keras model
model = tf.keras.models.load_model('../models/your_nail_model.h5')

@app.post("/predict")
async def predict_nail_condition(file: UploadFile = File(...)):
    # Read image file
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert('RGB')
    
    # Preprocess image (adjust based on your model requirements)
    image = image.resize((224, 224))  # Example size
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    
    # Make prediction
    predictions = model.predict(image_array)
    predicted_class = np.argmax(predictions, axis=1)[0]
    confidence = float(np.max(predictions))
    
    return {
        "class": int(predicted_class), 
        "confidence": confidence,
        "class_name": get_class_name(predicted_class)  # Implement this function
    }

def get_class_name(class_idx):
    # Map your class indices to human-readable names
    class_names = {0: "Healthy", 1: "Fungal", 2: "Psoriasis"}  # Example
    return class_names.get(class_idx, "Unknown")