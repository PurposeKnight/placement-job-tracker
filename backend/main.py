from fastapi import FastAPI
from models import JobApplication

app = FastAPI(title="Placement Job Tracker API")

applications = []

@app.get("/")
def home():
    return {"message": "API is running"}

@app.post("/applications")
def add_application(app_data: JobApplication):
    applications.append(app_data)
    return {"message": "Application added"}

@app.get("/applications")
def get_applications():
    return applications
