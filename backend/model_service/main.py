from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
TFLITE_MODEL_PATH = BASE_DIR / "cnn_model_final-v1.tflite"

CLASS_NAMES = [
    "beaus lines", "bluish nails", "clubbing", "healthy nails", "koilonychia",
    "melanoma", "muehrckes Lines", "nail pitting", "onychogryphosis",
    "onycholysis", "onychomycosis", "psoriasis", "terrys nails"
]

# Load the TFLite model only once
interpreter = tf.lite.Interpreter(model_path=str(TFLITE_MODEL_PATH))
interpreter.allocate_tensors()

# Get input and output tensor details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def preprocess_image(image, target_size=(256, 256)):
    image = image.resize(target_size)
    image_array = img_to_array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0).astype(np.float32)
    return image_array

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        preprocessed_img = preprocess_image(img)

        # Set input tensor
        interpreter.set_tensor(input_details[0]['index'], preprocessed_img)

        # Run inference
        interpreter.invoke()

        # Get output tensor
        output_data = interpreter.get_tensor(output_details[0]['index'])[0]
        predicted_index = int(np.argmax(output_data))
        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(output_data[predicted_index])

        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "class_index": predicted_index,
            "all_predictions": output_data.tolist()
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
