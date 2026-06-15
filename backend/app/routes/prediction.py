from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
import os

router = APIRouter()

class PredictionRequest(BaseModel):
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree_function: float
    age: int

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    main_factors: List[str]
    message: str

# Load model and scaler
MODEL_PATH = "ml/model.pkl"
SCALER_PATH = "ml/scaler.pkl"

def get_model():
    if not os.path.exists(MODEL_PATH):
        return None
    return joblib.load(MODEL_PATH)

def get_scaler():
    if not os.path.exists(SCALER_PATH):
        return None
    return joblib.load(SCALER_PATH)

@router.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    model = get_model()
    scaler = get_scaler()
    
    if not model or not scaler:
        return PredictionResponse(
            prediction="High Risk",
            confidence=0.85,
            main_factors=["Glucose", "BMI"],
            message="[DUMMY] Model not trained yet. This is a placeholder response."
        )

    # Prepare data
    data = np.array([[
        request.pregnancies,
        request.glucose,
        request.blood_pressure,
        request.skin_thickness,
        request.insulin,
        request.bmi,
        request.diabetes_pedigree_function,
        request.age
    ]])
    
    # Scale data
    data_scaled = scaler.transform(data)
    
    # Predict
    prob = model.predict_proba(data_scaled)[0][1]
    prediction = "High Risk" if prob > 0.5 else "Low Risk"
    
    # Placeholder for SHAP
    main_factors = ["Glucose", "BMI", "Age"]
    
    message = "The model estimates a high diabetes risk. Please consult a healthcare professional." if prediction == "High Risk" else "The model estimates a low diabetes risk. Maintain a healthy lifestyle."

    # Note: In the Firebase stack, the frontend handles Firestore saving for simplicity
    # but the backend could also use firebase-admin if needed for verified server-side saves.

    return PredictionResponse(
        prediction=prediction,
        confidence=float(prob),
        main_factors=main_factors,
        message=message
    )
