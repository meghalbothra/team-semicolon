import os
from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

router = APIRouter()

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    raise Exception("GOOGLE_API_KEY environment variable not set.")

# Configure Google Gemini API
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Initialize FastAPI app
app = FastAPI(title="Mental Health Support API")

# Request model for incoming messages
class UserQuery(BaseModel):
    message: str

# AI Prompt Template for mental health support
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

# Generate AI response using the Gemini model
def get_ai_response(user_message: str) -> str:
    prompt = MENTAL_HEALTH_PROMPT.format(user_input=user_message)
    try:
        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chat endpoint that integrates AI response with sentiment analysis
@router.post("/chat")
async def get_support(query: UserQuery):
    user_message = query.message

    # Generate AI response
    ai_reply = get_ai_response(user_message)
    
    # Analyze the sentiment of the user's message
    sentiment = analyzer.polarity_scores(user_message)
    compound = sentiment.get("compound", 0)
    
    # Print the compound score to the terminal
    print(f"Compound Score: {compound}")
    
    # If compound score is less than -0.5, flag a crisis alert
    crisis_alert = (
        "High distress detected. Please seek help immediately." 
        if compound < -0.5 
        else "No crisis detected."
    )
    
    # Return AI reply, sentiment analysis details (including compound score), and crisis alert
    return {
        "reply": ai_reply,
        "sentiment_scores": sentiment,
        "compound_score": compound,
        "crisis_alert": crisis_alert
    }

# Include the router in the app
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
