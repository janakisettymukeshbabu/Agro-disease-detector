# 🌽 AgroTech AI — Corn/Maize Disease Detector

AI-powered crop disease detection using MobileNetV2 CNN + React + Flask.

---

## 📁 Project Structure
```
agro-disease-detector/
│
├── train_model.py              ← Train CNN model (run once)
├── dataset/                    ← Put your unzipped Kaggle dataset here
│   ├── Blight/
│   ├── Common_Rust/
│   ├── Gray_Leaf_Spot/
│   └── Healthy/
│
├── api/
│   ├── app.py                  ← Flask API server
│   ├── model.h5                ← Generated after training
│   ├── class_indices.json      ← Generated after training
│   ├── disease_data.json       ← Disease info, solutions, prevention
│   └── requirements.txt        ← Python dependencies
│
└── frontend/                   ← React + Vite app
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Predict.jsx     ← Upload image + detect disease
    │   │   └── Diseases.jsx    ← View all diseases
    │   └── components/
    │       ├── Navbar.jsx
    │       └── ResultCard.jsx  ← Shows result + solution + prevention
    └── package.json
```

---

## ▶️ How to Run — Step by Step

### Step 1 — Setup Dataset
Unzip your Kaggle dataset into the `dataset/` folder:
```
agro-disease-detector/
└── dataset/
    ├── Blight/
    ├── Common_Rust/
    ├── Gray_Leaf_Spot/
    └── Healthy/
```

### Step 2 — Install Python dependencies
```bash
cd api
pip install -r requirements.txt
cd ..
```

### Step 3 — Train the model (takes 10-30 mins)
```bash
python train_model.py
```
This creates `api/model.h5` and `api/class_indices.json`

### Step 4 — Start Flask API (Terminal 1)
```bash
cd api
python app.py
```
API runs at: https://agro-disease-detector.onrender.com/predict

### Step 5 — Start React Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: https://agro-disease-detector.onrender.com/predict

---

## 🔌 API Endpoints

| Method | Route       | Description                    |
|--------|-------------|--------------------------------|
| GET    | `/`         | API health check               |
| POST   | `/predict`  | Upload image → get prediction  |
| GET    | `/diseases` | Get all disease info           |

### POST /predict
Send image as `multipart/form-data` with field name `image`

**Response:**
```json
{
  "disease": "Blight",
  "full_name": "Northern/Southern Leaf Blight",
  "crop": "Corn / Maize",
  "confidence": 94.32,
  "severity": "High",
  "description": "...",
  "solution": ["Apply fungicide...", "..."],
  "prevention": ["Use resistant varieties...", "..."]
}
```

---

## 🦠 Diseases Detected
| Disease | Severity |
|---|---|
| Blight | High |
| Common Rust | Medium |
| Gray Leaf Spot | High |
| Healthy | None |
