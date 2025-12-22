from fastapi import FastAPI
from models import JobApplication
from database import create_table

app = FastAPI(title="Placement Job Tracker API")

create_table()

@app.get("/")
def home():
    return {"message": "API is running"}
