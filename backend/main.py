from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.models import JobApplication
from backend.database import get_connection, create_table



app = FastAPI(title="Placement Job Tracker API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

@app.put("/applications/{app_id}")
def update_application(app_id: int, app: JobApplication):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE applications
        SET company = ?, role = ?, location = ?, status = ?, applied_date = ?, notes = ?
        WHERE id = ?
    """, (
        app.company,
        app.role,
        app.location,
        app.status,
        app.applied_date,
        app.notes,
        app_id
    ))

    conn.commit()
    conn.close()

    return {"message": "Application updated successfully"}

@app.delete("/applications/{app_id}")
def delete_application(app_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM applications WHERE id = ?", (app_id,))
    conn.commit()
    conn.close()

    return {"message": "Application deleted successfully"}
