# from fastapi import FastAPI, HTTPException, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# import numpy as np
# from PIL import Image
# import io
# import tensorflow as tf
# from tensorflow.keras.preprocessing.image import img_to_array
# from pathlib import Path

# from fastapi import FastAPI, HTTPException, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.middleware import Middleware
# from fastapi.middleware.trustedhost import TrustedHostMiddleware

# # middleware = [
# #     Middleware(
# #         CORSMiddleware,
# #         allow_origins=["*"],
# #         allow_credentials=True,
# #         allow_methods=["*"],
# #         allow_headers=["*"],
# #         expose_headers=["*"]
# #     ),
# #     Middleware(TrustedHostMiddleware, allowed_hosts=["*"])
# # ]

# # app = FastAPI(middleware=middleware)
# app = FastAPI()


# # For FastAPI (main.py)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["POST", "GET"],
#     allow_headers=["*"],
# )
# # Disable CSRF for FastAPI endpoints (since it's an API service)
# @app.middleware("http")
# async def disable_csrf(request, call_next):
#     response = await call_next(request)
#     response.headers["Access-Control-Allow-Origin"] = "*"
#     response.headers["Access-Control-Allow-Credentials"] = "true"
#     return response

# BASE_DIR = Path(__file__).resolve().parent.parent 
# TFLITE_MODEL_PATH = BASE_DIR / "model_service" / "cnn_model_final-v1.tflite" 

# CLASS_NAMES = [
#     "beaus lines", "bluish nails", "clubbing", "healthy nails", "koilonychia",
#     "melanoma", "muehrckes Lines", "nail pitting", "onychogryphosis",
#     "onycholysis", "onychomycosis", "psoriasis", "terrys nails"
# ]

# # Load the TFLite model only once
# interpreter = tf.lite.Interpreter(model_path=str(TFLITE_MODEL_PATH))

# interpreter.allocate_tensors()

# # Get input and output tensor details
# input_details = interpreter.get_input_details()
# output_details = interpreter.get_output_details()

# def preprocess_image(image, target_size=(256, 256)):
#     image = image.resize(target_size)
#     image_array = img_to_array(image) / 255.0
#     image_array = np.expand_dims(image_array, axis=0).astype(np.float32)
#     return image_array

# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     try:
#         contents = await file.read()
#         img = Image.open(io.BytesIO(contents)).convert('RGB')
#         preprocessed_img = preprocess_image(img)

#         # Set input tensor
#         interpreter.set_tensor(input_details[0]['index'], preprocessed_img)

#         # Run inference
#         interpreter.invoke()

#         # Get output tensor
#         output_data = interpreter.get_tensor(output_details[0]['index'])[0]
#         predicted_index = int(np.argmax(output_data))
#         predicted_class = CLASS_NAMES[predicted_index]
#         confidence = float(output_data[predicted_index])

#         return {
#             "predicted_class": predicted_class,
#             "confidence": confidence,
#             "class_index": predicted_index,
#             "all_predictions": output_data.tolist()
#         }

#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

import tensorflow as tf
import numpy as np
from PIL import Image
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

# Model configuration
BASE_DIR = Path(__file__).resolve().parent.parent
TFLITE_MODEL_PATH = BASE_DIR / "model_service" / "cnn_model_final-v1.tflite"

CLASS_NAMES = [
    "beaus lines", "bluish nails", "clubbing", "healthy nails", "koilonychia",
    "melanoma", "muehrckes Lines", "nail pitting", "onychogryphosis",
    "onycholysis", "onychomycosis", "psoriasis", "terrys nails"
]

# Load the model once when the module is imported
try:
    interpreter = tf.lite.Interpreter(model_path=str(TFLITE_MODEL_PATH))
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

def preprocess_image(image, target_size=(256, 256)):
    """Preprocess image for model prediction"""
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0  # Normalize to [0,1]
    return np.expand_dims(image_array, axis=0).astype(np.float32)

def predict_image(file):
    """
    Make prediction on a single image file
    Args:
        file: Django UploadFile object or file-like object
    Returns:
        Dictionary with prediction results
    """
    try:
        # Open and preprocess image
        img = Image.open(file).convert('RGB')
        input_data = preprocess_image(img)
        
        # Run inference
        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index'])[0]
        
        # Process results
        predicted_index = int(np.argmax(output_data))
        confidence = float(output_data[predicted_index])
        
        return {
            "predicted_class": CLASS_NAMES[predicted_index],
            "confidence": confidence,
            "class_index": predicted_index,
            "all_predictions": output_data.tolist()
        }
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise