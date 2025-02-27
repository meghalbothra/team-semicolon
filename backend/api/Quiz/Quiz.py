import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# API Router
router = APIRouter()

# Configure Gemini API using key from .env
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

# Pydantic model for health metrics input
class HealthMetrics(BaseModel):
    stress: int
    anxiety: int
    depression: int
    well_being: int
    productivity: int

# Function to get insights from Gemini API
def get_insights_from_metrics(metrics: HealthMetrics) -> str:
    prompt = (
        "Given the following health metrics:\n"
        "- Stress: {stress}\n"
        "- Anxiety: {anxiety}\n"
        "- Depression: {depression}\n"
        "- Well-being: {well_being}\n"
        "- Productivity: {productivity}\n"
        "Please provide insights on these metrics in a supportive and professional manner. "
        "Your insights should consist of 5-7 lines, providing a comprehensive overview of the situation. "
        "Also, include one actionable suggestion in a separate line. "
        "Avoid excessive formatting such as bold text."
    )
    
    response = model.generate_content(prompt.format(
        stress=metrics.stress,
        anxiety=metrics.anxiety,
        depression=metrics.depression,
        well_being=metrics.well_being,
        productivity=metrics.productivity
    ))
    
    if response and response.text:
        return response.text.strip().replace("**", "")  # Remove any bold formatting
    else:
        return "No insights generated. Please try again."

# Insights endpoint
@router.post("/insights/", response_model=dict)
async def get_insights(metrics: HealthMetrics):
    try:
        insights = get_insights_from_metrics(metrics)
        return {"insights": insights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
