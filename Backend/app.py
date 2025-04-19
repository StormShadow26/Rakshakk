from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)

# Set absolute path to the trained_model.h5 file
current_dir = os.path.dirname(os.path.abspath(__file__))
model_file = os.path.join(current_dir, "ML", "trained_model.h5")

print("Looking for model file at:", model_file)

# Load the model safely
model = None
if not os.path.exists(model_file):
    print("❌ ERROR: Model file not found at:", model_file)
else:
    try:
        model = load_model(model_file, compile=False)  # compile=False to avoid training-specific config issues
        print("✅ Model loaded successfully!")
    except Exception as e:
        print("❌ Error loading model:", e)

@app.route('/detect', methods=['POST'])
def detect():
    # Ensure model is loaded
    if model is None:
        return jsonify({'error': 'Model is not loaded'}), 500

    # Validate file in request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    try:
        # Image preprocessing (grayscale, resize, normalize)
        img = Image.open(io.BytesIO(file.read()))
        img = img.convert('L')  # Convert to grayscale
        img = img.resize((48, 48))  # Resize to 48x48 as required
        img_array = np.array(img).astype("float32") / 255.0
        img_array = np.expand_dims(img_array, axis=(0, -1))  # Shape: (1, 48, 48, 1)

        # Model prediction
        prediction = model.predict(img_array)
        prediction_list = prediction[0].tolist()
        predicted_class = int(np.argmax(prediction))
        accident_detected = (predicted_class == 0)

        print("✅ Prediction:", prediction_list, "| Accident detected:", accident_detected)

        # Response
        return jsonify({
            'accident': accident_detected,
            'prediction': prediction_list
        })

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({'error': 'Prediction failed'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
