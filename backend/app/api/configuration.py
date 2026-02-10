from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel
import json

from ..database import get_db
from ..models.config import SystemConfig
from ..config import settings

router = APIRouter()

class ConfigUpdate(BaseModel):
    settings: Dict[str, Any]

@router.get("/config", response_model=Dict[str, Any])
def get_config(db: Session = Depends(get_db)):
    """
    Get current configuration. 
    Merges database config over default env config.
    """
    # 1. Start with defaults from env/file
    current_config = {
        "VIDEO_SOURCE": settings.VIDEO_SOURCE,
        "CAMERA_FPS": settings.CAMERA_FPS,
        "FRAME_SKIP": settings.FRAME_SKIP,
        "YOLO_MODEL": settings.YOLO_MODEL,
        "CONFIDENCE_THRESHOLD": settings.CONFIDENCE_THRESHOLD,
        "IOU_THRESHOLD": settings.IOU_THRESHOLD,
        "ENABLE_EMAIL_ALERTS": settings.ENABLE_EMAIL_ALERTS,
        "ENABLE_WHATSAPP_ALERTS": settings.ENABLE_WHATSAPP_ALERTS,
        # Add other safe-to-expose settings here
    }
    
    # 2. Overlay database config
    db_configs = db.query(SystemConfig).all()
    for config in db_configs:
        try:
            val = json.loads(config.value)
            current_config[config.key] = val
        except json.JSONDecodeError:
            current_config[config.key] = config.value
            
    return current_config

@router.post("/config")
def update_config(update_data: ConfigUpdate, db: Session = Depends(get_db)):
    """
    Update configuration settings in database.
    """
    try:
        updated_keys = []
        for key, value in update_data.settings.items():
            # Validate if key exists in standard settings to avoid junk
            if not hasattr(settings, key):
                continue
                
            # Serialize value
            json_val = json.dumps(value)
            
            db_config = db.query(SystemConfig).filter(SystemConfig.key == key).first()
            if db_config:
                db_config.value = json_val
            else:
                db_config = SystemConfig(key=key, value=json_val)
                db.add(db_config)
            
            updated_keys.append(key)
            
        db.commit()
        return {"status": "success", "updated": updated_keys}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
