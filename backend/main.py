from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys

app = FastAPI()

# CORS for Expo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnswerData(BaseModel):
    user_answer: str
    equation_id: int

@app.post("/api/check")
async def check_answer(data: AnswerData):
    # DEBUG: Print to Python console
    print(f"\n[Python] Received from Expo:")
    print(f"[Python]   - User Answer: {data.user_answer}")
    print(f"[Python]   - Equation ID: {data.equation_id}")
    
    # Simple response for now
    response = {
        "status": "received",
        "your_answer": data.user_answer,
        "message": f"Python received: {data.user_answer}"
    }
    
    print(f"[Python] Sending back: {response}")
    print(f"[Python] " + "="*50)
    
    return response

@app.get("/api/test")
async def test():
    print("\n[Python] Test endpoint called")
    return {"message": "Python backend is running!"}

if __name__ == "__main__":
    import uvicorn
    print("\n[Python] 🚀 Starting FastAPI server...")
    print("[Python] Listening on http://localhost:8000")
    print("[Python] " + "="*50)
    uvicorn.run(app, host="0.0.0.0", port=8000)