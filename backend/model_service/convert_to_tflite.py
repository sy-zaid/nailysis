import tensorflow as tf

# Path to your Keras model
model_path = "D:/UNI/FYP/App/backend/model_service/cnn_model_final-v1.keras"

# Load the model
model = tf.keras.models.load_model(model_path)

# Set up the converter
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# Apply dynamic range quantization
converter.optimizations = [tf.lite.Optimize.DEFAULT]

# Convert the model
tflite_model = converter.convert()

# Save the quantized model
output_path = "cnn_model_final-v1.tflite"
with open(output_path, "wb") as f:
    f.write(tflite_model)

print(f"✅ Quantized TFLite model saved to: {output_path}")
