from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.Aichat.Aichat import router as aichat_router
from api.Quiz.Quiz import router as quiz_router

app = FastAPI()

# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.56.1:3000"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],  # Consider restricting this in production
    allow_headers=["*"],  # Consider restricting this in production
)

# Include routers for different API functionalities
app.include_router(aichat_router)
app.include_router(quiz_router, prefix="/quiz")


@app.get("/")
async def root():
    return {"message": "Welcome to the Mental Health Support Chatbot!"}
