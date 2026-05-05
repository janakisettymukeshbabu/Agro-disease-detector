# ============================================================
# train_model.py — Corn/Maize Disease Detection
# Uses MobileNetV2 (Transfer Learning) to classify leaf images
# into 4 classes: Blight, Common_Rust, Gray_Leaf_Spot, Healthy
# ============================================================

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
import matplotlib.pyplot as plt

# ── Configuration ────────────────────────────────────────────
IMAGE_SIZE   = (224, 224)   # MobileNetV2 expects 224x224
BATCH_SIZE   = 32
EPOCHS       = 20
DATASET_PATH = "./dataset"  # path to your unzipped dataset folder
MODEL_PATH   = "./api/model.h5"
NUM_CLASSES  = 4            # Blight, Common_Rust, Gray_Leaf_Spot, Healthy

print("=" * 55)
print("  🌽 Corn/Maize Disease Detection — Model Training")
print("=" * 55)

# ── Step 1: Check dataset folder ─────────────────────────────
print("\n📂 Checking dataset folder...")
if not os.path.exists(DATASET_PATH):
    print(f"❌ Dataset folder '{DATASET_PATH}' not found!")
    print("   Please unzip your Kaggle dataset into a 'dataset/' folder")
    print("   Expected structure:")
    print("   dataset/")
    print("   ├── Blight/")
    print("   ├── Common_Rust/")
    print("   ├── Gray_Leaf_Spot/")
    print("   └── Healthy/")
    exit()

classes = os.listdir(DATASET_PATH)
print(f"✅ Found classes: {classes}")

# ── Step 2: Data Augmentation & Loading ──────────────────────
# Augmentation helps model generalize better (rotate, flip etc.)
print("\n🔄 Setting up data generators...")

train_datagen = ImageDataGenerator(
    rescale=1./255,           # normalize pixel values 0-1
    rotation_range=20,        # randomly rotate images
    width_shift_range=0.2,    # shift image left/right
    height_shift_range=0.2,   # shift image up/down
    shear_range=0.2,          # shear transformation
    zoom_range=0.2,            # random zoom
    horizontal_flip=True,     # flip left/right
    validation_split=0.2      # 20% for validation
)

# Training data generator
train_generator = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",  # one-hot encoded labels
    subset="training"
)

# Validation data generator
val_generator = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation"
)

print(f"✅ Training samples   : {train_generator.samples}")
print(f"✅ Validation samples : {val_generator.samples}")
print(f"✅ Class mapping      : {train_generator.class_indices}")

# Save class indices so api/predict.py knows the label order
import json
with open("./api/class_indices.json", "w") as f:
    json.dump(train_generator.class_indices, f)
print("✅ Class indices saved to api/class_indices.json")

# ── Step 3: Build Model (MobileNetV2 Transfer Learning) ──────
print("\n🏗️  Building MobileNetV2 model...")

# Load MobileNetV2 without the top classification layer
base_model = MobileNetV2(
    input_shape=(224, 224, 3),  # RGB images
    include_top=False,          # remove original classifier
    weights="imagenet"          # use pretrained ImageNet weights
)

# Freeze base model layers (we only train our custom top layers)
base_model.trainable = False

# Add our custom classification layers on top
x = base_model.output
x = GlobalAveragePooling2D()(x)    # flatten feature maps
x = Dense(128, activation="relu")(x)  # fully connected layer
x = Dropout(0.3)(x)                # dropout to prevent overfitting
output = Dense(NUM_CLASSES, activation="softmax")(x)  # 4-class output

# Create final model
model = Model(inputs=base_model.input, outputs=output)

print(f"✅ Model built!")
print(f"   Total layers     : {len(model.layers)}")
print(f"   Trainable layers : {len([l for l in model.layers if l.trainable])}")

# ── Step 4: Compile Model ─────────────────────────────────────
model.compile(
    optimizer="adam",                        # adaptive learning rate
    loss="categorical_crossentropy",         # for multi-class classification
    metrics=["accuracy"]
)

# ── Step 5: Callbacks ─────────────────────────────────────────
# Save best model automatically during training
checkpoint = ModelCheckpoint(
    MODEL_PATH,
    monitor="val_accuracy",  # save when validation accuracy improves
    save_best_only=True,
    verbose=1
)

# Stop training early if no improvement after 5 epochs
early_stop = EarlyStopping(
    monitor="val_accuracy",
    patience=5,
    restore_best_weights=True,
    verbose=1
)

# ── Step 6: Train the Model ───────────────────────────────────
print(f"\n🌲 Training model for up to {EPOCHS} epochs...")
print("   (This may take 10-30 minutes depending on your system)\n")

history = model.fit(
    train_generator,
    epochs=EPOCHS,
    validation_data=val_generator,
    callbacks=[checkpoint, early_stop]
)

# ── Step 7: Evaluate ──────────────────────────────────────────
print("\n📈 Evaluating model...")
val_loss, val_accuracy = model.evaluate(val_generator)
print(f"   ✅ Validation Accuracy : {val_accuracy * 100:.2f}%")
print(f"   ✅ Validation Loss     : {val_loss:.4f}")

# ── Step 8: Plot Training History ─────────────────────────────
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history["accuracy"], label="Train Accuracy")
plt.plot(history.history["val_accuracy"], label="Val Accuracy")
plt.title("Model Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history["loss"], label="Train Loss")
plt.plot(history.history["val_loss"], label="Val Loss")
plt.title("Model Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.legend()

plt.tight_layout()
plt.savefig("./api/training_history.png")
print("✅ Training graph saved to api/training_history.png")

print("\n🎉 Training complete!")
print(f"   Model saved to: {MODEL_PATH}")
print("   Now run: python api/app.py")