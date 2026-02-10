"""
Analytics API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Dict, Any, List

from ..database import get_db, get_mongo_db
from ..models.inventory import Alert, Inventory

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    mongo_db = Depends(get_mongo_db)
) -> Dict[str, Any]:
    """
    Get aggregated statistics for the dashboard
    """
    # SQLite/Postgres Stats
    total_alerts = db.query(Alert).filter(Alert.is_resolved == False).count()
    total_mismatches = db.query(Inventory).filter(Inventory.actual_quantity != Inventory.expected_quantity).count()
    
    # MongoDB Stats (Events from last 24h)
    last_24h = datetime.utcnow() - timedelta(hours=24)
    if mongo_db is not None:
        today_events = mongo_db.detection_events.count_documents({"timestamp": {"$gte": last_24h}})
        
        # Aggregation for event types
        pipeline = [
            {"$match": {"timestamp": {"$gte": last_24h}}},
            {"$group": {"_id": "$event_type", "count": {"$sum": 1}}}
        ]
        event_types = list(mongo_db.detection_events.aggregate(pipeline))
        event_counts = {item["_id"]: item["count"] for item in event_types}
    else:
        today_events = 0
        event_counts = {}
    
    return {
        "active_alerts": total_alerts,
        "mismatches": total_mismatches,
        "events_24h": today_events,
        "event_distribution": event_counts,
        "timestamp": datetime.utcnow()
    }

@router.get("/anomalies")
def get_anomalies(
    db: Session = Depends(get_db),
    mongo_db = Depends(get_mongo_db)
):
    """Get detected inventory anomalies"""
    from ..services.analytics_service import AnalyticsService
    service = AnalyticsService(db, mongo_db)
    return service.detect_anomalies()

@router.get("/predictions")
def get_predictions(
    db: Session = Depends(get_db),
    mongo_db = Depends(get_mongo_db)
):
    """Get restocking predictions"""
    from ..services.analytics_service import AnalyticsService
    service = AnalyticsService(db, mongo_db)
    return service.get_restocking_predictions()

@router.get("/behavior")
def get_behavior(
    db: Session = Depends(get_db),
    mongo_db = Depends(get_mongo_db)
):
    """Get customer behavior analytics"""
    from ..services.analytics_service import AnalyticsService
    service = AnalyticsService(db, mongo_db)
    return service.get_customer_behavior()

