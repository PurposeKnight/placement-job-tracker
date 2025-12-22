from pydantic import BaseModel
from typing import Optional

class JobApplication(BaseModel):
    company: str
    role: str
    location: Optional[str] = None
    status: str
    applied_date: str
    notes: Optional[str] = None
