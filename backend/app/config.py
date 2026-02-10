"""
Configuration management for SSIS
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "Smart Shelf Intelligence System"
    APP_VERSION: str = "1.0.0"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # Database URLs
    DATABASE_URL: str = "postgresql://ssis_user:ssis_password_2024@localhost:5432/ssis_inventory"
    MONGODB_URL: str = "mongodb://ssis_admin:ssis_mongo_2024@localhost:27017/ssis_events?authSource=admin"
    REDIS_URL: str = "redis://localhost:6379"
    
    # Video Configuration
    VIDEO_SOURCE: str = "0"  # 0 for webcam, path for video file
    CAMERA_FPS: int = 15
    FRAME_SKIP: int = 3  # Process every Nth frame
    
    # AI Model Configuration
    YOLO_MODEL: str = "yolov8n.pt"
    CONFIDENCE_THRESHOLD: float = 0.5
    IOU_THRESHOLD: float = 0.45
    TRACKING_MAX_AGE: int = 30
    TRACKING_MIN_HITS: int = 3
    
    # Alert Configuration
    ENABLE_EMAIL_ALERTS: bool = True
    ENABLE_WHATSAPP_ALERTS: bool = False
    ENABLE_WEBSOCKET_ALERTS: bool = True
    
    # Email Settings
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    ALERT_EMAIL_TO: Optional[str] = None
    
    # Twilio WhatsApp Settings
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_WHATSAPP_FROM: Optional[str] = None
    TWILIO_WHATSAPP_TO: Optional[str] = None
    
    # Inventory Sync
    SYNC_INTERVAL_SECONDS: int = 10
    MISMATCH_THRESHOLD: int = 2
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/ssis.log"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()