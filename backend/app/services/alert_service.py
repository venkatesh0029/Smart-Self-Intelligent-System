"""
Alert Service
"""
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from ..models.inventory import Alert

class AlertService:
    @staticmethod
    def get_alerts(db: Session, unresolved_only: bool = True, limit: int = 50) -> List[Alert]:
        query = db.query(Alert)
        if unresolved_only:
            query = query.filter(Alert.is_resolved == False)
        return query.order_by(Alert.created_at.desc()).limit(limit).all()

    @staticmethod
    def resolve_alert(db: Session, alert_id: str, resolved_by: str) -> Optional[Alert]:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            return None
        
        alert.is_resolved = True
        alert.resolved_at = datetime.utcnow()
        alert.resolved_by = resolved_by
        
        db.commit()
        db.refresh(alert)
        return alert

    @staticmethod
    def create_alert(db: Session, alert_data: dict) -> Alert:
        alert = Alert(**alert_data)
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return alert
