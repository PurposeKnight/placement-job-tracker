from fastapi import FastAPI

app = FastAPI(title="Placement Job Tracker API")

@app.get("/")
def home():
    return {"message": "API is running"}
