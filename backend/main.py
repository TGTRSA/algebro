from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from pathlib import Path

app = FastAPI()

# CORS for Expo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load equations
with open(Path(__file__).parent / "equations.json") as f:
    equations_data = json.load(f)

class AnswerCheck(BaseModel):
    user_answer: str
    equation_id: int

@app.get("/api/equations")
async def get_equations():
    return equations_data

@app.post("/api/check-answer")
async def check_answer(data: AnswerCheck):
    equation = equations_data["equations"][data.equation_id]
    
    # Normalize answers
    user_norm = data.user_answer.replace(" ", "").lower()
    correct_norm = equation["answer"].replace(" ", "").lower()
    
    is_correct = user_norm == correct_norm
    
    return {
        "correct": is_correct,
        "correct_answer": equation["answer"] if not is_correct else None,
        "message": "Correct! 🎉" if is_correct else "Incorrect. Check the correct answer below."
    }

@app.get("/api/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)