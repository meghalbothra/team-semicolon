import os
from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

router = APIRouter()

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Google Gemini API
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize FastAPI app
app = FastAPI(title="Mental Health Support API")

# Request model
class UserQuery(BaseModel):
    message: str

# AI Prompt Template
MENTAL_HEALTH_PROMPT = """
You are a compassionate mental health assistant. 
Your goal is to provide supportive, empathetic, and encouraging responses.
- Always validate the user's emotions.
- Offer gentle suggestions and coping strategies.
- Never give medical advice, diagnose, or replace professional help.
- Keep responses concise yet meaningful.

User: {user_input}
Assistant:
"""

# Generate AI response
def get_ai_response(user_message: str):
    prompt = MENTAL_HEALTH_PROMPT.format(user_input=user_message)
    
    try:
        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API Endpoint
@router.post("/chat")
async def get_support(query: UserQuery):
    reply = get_ai_response(query.message)
    return {"reply": reply}

# Run the server using: uvicorn filename:app --reload
