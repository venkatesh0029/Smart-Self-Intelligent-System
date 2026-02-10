"""
Pydantic models for MongoDB Detection Events
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Dict, Any

class DetectionEvent(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    event_type: str  # pick, return, misplace, missing
    shelf_id: str
    camera_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    confidence: float
    
    # Object details
    track_id: int
    class_id: int
    class_name: str
    bbox: List[int]  # [x1, y1, x2, y2]
    
    # Context
    metadata: Dict[str, Any] = {}
    
    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class EventFilter(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    event_type: Optional[str] = None
    shelf_id: Optional[str] = None
    limit: int = 100
    skip: int = 0
