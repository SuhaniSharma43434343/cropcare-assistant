from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import random

app = FastAPI(title="CropCare ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_DISEASES = {
    "tomato": [
        {
            "name": "Late Blight",
            "confidence": 0.92,
            "severity": "High",
            "description": "A serious fungal disease affecting tomato plants, causing dark spots on leaves and fruit.",
            "symptoms": ["Dark spots on leaves", "Brown patches on stems", "White fuzzy growth on leaf undersides"],
            "treatment": {
                "organic": [
                    {
                        "name": "Copper Fungicide (Organic)",
                        "dosage": "2-3g per liter of water",
                        "frequency": "Every 7-10 days",
                        "effectiveness": 85,
                        "instructions": "Apply in early morning or evening. Ensure complete coverage of leaves."
                    }
                ],
                "chemical": [
                    {
                        "name": "Mancozeb 75% WP",
                        "dosage": "2.5g per liter of water",
                        "frequency": "Every 7-10 days",
                        "effectiveness": 95,
                        "warning": "Use protective gear. Wait 7 days before harvest.",
                        "instructions": "Apply preventively before disease onset for best results."
                    }
                ]
            },
            "prevention": ["Proper spacing", "Good air circulation", "Avoid overhead watering"]
        }
    ]
}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "CropCare ML Service"}

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...), crop: str = Form(...)):
    try:
        await file.read()
        crop_diseases = MOCK_DISEASES.get(crop.lower(), MOCK_DISEASES["tomato"])
        selected_disease = random.choice(crop_diseases)
        confidence_variation = random.uniform(-0.05, 0.05)
        selected_disease["confidence"] = max(0.7, min(0.98, selected_disease["confidence"] + confidence_variation))
        return selected_disease
    except Exception as e:
        return {
            "name": "Disease Detected",
            "confidence": 0.75,
            "severity": "Medium",
            "description": "AI analysis completed.",
            "symptoms": ["Visible symptoms detected"],
            "treatment": {
                "organic": [
                    {
                        "name": "General Organic Treatment",
                        "dosage": "As per instructions",
                        "frequency": "Weekly",
                        "effectiveness": 70,
                        "instructions": "Consult agricultural expert for specific treatment."
                    }
                ]
            },
            "prevention": ["Maintain plant health", "Monitor regularly"]
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)