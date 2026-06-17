# ============================================================
# api/app.py -- Corn/Maize Disease Detection Flask API
# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import json
import os
from PIL import Image
import io

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Load Model & Data
print("Loading model and data...")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.h5")
if not os.path.exists(MODEL_PATH):
    print("model.h5 not found! Run train_model.py first.")
    exit()

model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded!")

CLASS_INDEX_PATH = os.path.join(os.path.dirname(__file__), "class_indices.json")
with open(CLASS_INDEX_PATH, "r") as f:
    class_indices = json.load(f)

index_to_class = {v: k for k, v in class_indices.items()}
print(f"Classes: {index_to_class}")

DISEASE_DATA_PATH = os.path.join(os.path.dirname(__file__), "disease_data.json")
with open(DISEASE_DATA_PATH, "r") as f:
    disease_data = json.load(f)
print("Disease data loaded!")


# Helper: Preprocess image
def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


# Helper: Check if image is a leaf
def is_leaf_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img)

    R = img_array[:, :, 0].astype(float)
    G = img_array[:, :, 1].astype(float)
    B = img_array[:, :, 2].astype(float)

    # Pixel is green if green channel dominates
    green_mask = (
        (G > R * 1.1) &
        (G > B * 1.1) &
        (G > 40)
    )

    total_pixels = 224 * 224
    green_pixels = np.sum(green_mask)
    green_ratio  = green_pixels / total_pixels * 100

    print(f"Green pixel ratio: {green_ratio:.2f}%")

    return green_ratio >= 8, green_ratio


# Route 1: Health check
@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status"  : "running",
        "message" : "Agro Disease Detection API is live!"
    })


# Route 2: Get all diseases
@app.route("/diseases", methods=["GET"])
def get_diseases():
    return jsonify(disease_data)


# Route 3: Predict disease
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Validate input
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded."}), 400

        image_file = request.files["image"]

        if image_file.filename == "":
            return jsonify({"error": "Empty filename."}), 400

        image_bytes = image_file.read()

        # Step 1: Green color check FIRST
        is_leaf, green_ratio = is_leaf_image(image_bytes)

        if not is_leaf:
            print(f"Rejected - only {green_ratio:.2f}% green pixels")
            return jsonify({
                "disease"     : "Invalid Image",
                "full_name"   : "Not a Corn/Maize Leaf",
                "crop"        : "Unknown",
                "confidence"  : 0,
                "severity"    : "None",
                "description" : "The uploaded image does not appear to be a corn or maize leaf. Please upload a clear photo of a corn/maize leaf.",
                "solution"    : [
                    "Upload a clear photo of a corn or maize leaf",
                    "Make sure the leaf fills most of the image",
                    "Use good natural lighting when capturing"
                ],
                "prevention"  : [
                    "Only upload corn or maize leaf images",
                    "Avoid uploading random or unrelated images"
                ]
            })

        # Step 2: Run ML model
        img_array       = preprocess_image(image_bytes)
        predictions     = model.predict(img_array)
        predicted_index = int(np.argmax(predictions))
        confidence      = float(np.max(predictions)) * 100

        print(f"Green ratio : {green_ratio:.2f}%")
        print(f"Confidence  : {confidence:.2f}%")

        # Step 3: Return prediction
        predicted_class = index_to_class[predicted_index]
        disease_info    = disease_data.get(predicted_class, {})

        print(f"Predicted   : {predicted_class}")

        return jsonify({
            "disease"     : disease_info.get("disease",     predicted_class),
            "full_name"   : disease_info.get("full_name",   predicted_class),
            "crop"        : disease_info.get("crop",        "Corn / Maize"),
            "confidence"  : round(confidence, 2),
            "severity"    : disease_info.get("severity",    "Unknown"),
            "description" : disease_info.get("description", ""),
            "solution"    : disease_info.get("solution",    []),
            "prevention"  : disease_info.get("prevention",  [])
        })

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


# Start Server
if __name__ == "__main__":
    print()
    print("Starting Agro Disease Detection API...")
    print("API running at: https://agro-disease-detector.onrender.com/diseases")
    print("React should run at: http://localhost:5173")
    app.run(host="0.0.0.0", port=5000)