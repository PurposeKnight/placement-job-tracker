from fastapi import FastAPI
from models import JobApplication
from database import get_connection, create_table

app = FastAPI(title="Placement Job Tracker API")

create_table()

@app.get("/")
def home():
    return {"message": "API is running"}

@app.post("/applications")
def add_application(app: JobApplication):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO applications 
        (company, role, location, status, applied_date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        app.company,
        app.role,
        app.location,
        app.status,
        app.applied_date,
        app.notes
    ))

    conn.commit()
    conn.close()

    return {"message": "Application added successfully"}


@app.get("/applications")
def get_applications():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM applications")
    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]
