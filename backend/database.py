import sqlite3

def get_connection():
    conn = sqlite3.connect("applications.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_table():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        location TEXT,
        status TEXT NOT NULL,
        applied_date TEXT NOT NULL,
        notes TEXT
    )
    """)

    conn.commit()
    conn.close()
