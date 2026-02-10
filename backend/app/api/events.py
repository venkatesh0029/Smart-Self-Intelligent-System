"""
API endpoints for detection events (MongoDB)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from ..database import get_mongo_db
from ..models.events import DetectionEvent

router = APIRouter()

@router.get("/", response_model=List[DetectionEvent])
def get_events(
    event_type: Optional[str] = None,
    shelf_id: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 100,
    skip: int = 0,
    db = Depends(get_mongo_db)
):
    """
    Get detection events from MongoDB
    """
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")
        
    query = {}
    
    if event_type:
        query["event_type"] = event_type
        
    if shelf_id:
        query["shelf_id"] = shelf_id
        
    if start_date or end_date:
        query["timestamp"] = {}
        if start_date:
            query["timestamp"]["$gte"] = start_date
        if end_date:
            query["timestamp"]["$lte"] = end_date
            
    events_cursor = db.detection_events.find(query).sort("timestamp", -1).skip(skip).limit(limit)
    
    events = []
    for event in events_cursor:
        # Convert ObjectId to string
        if "_id" in event:
            event["_id"] = str(event["_id"])
        events.append(event)
        
    return events

@router.get("/{event_id}", response_model=DetectionEvent)
def get_event(event_id: str, db = Depends(get_mongo_db)):
    """
    Get a specific event by ID
    """
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")
        
    from bson.objectid import ObjectId
    try:
        event = db.detection_events.find_one({"_id": ObjectId(event_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid event ID format")
        
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if "_id" in event:
        event["_id"] = str(event["_id"])
        
    return event
