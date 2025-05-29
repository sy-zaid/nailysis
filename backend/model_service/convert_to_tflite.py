import tensorflow as tf

# Load the original Keras model
model = tf.keras.models.load_model("D:/UNI/FYP\App/backend/model_service/cnn_model_final-v1.keras")


# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save to file
with open("cnn_model_final-v1.tflite", "wb") as f:
    f.write(tflite_model)

print("✅ Model successfully converted to cnn_model_final-v1.tflite")
