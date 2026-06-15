from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import prediction
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Diabetes Risk Prediction API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router)

@app.get("/")
async def root():
    return {"message": "Diabetes Risk Prediction API is running"}
