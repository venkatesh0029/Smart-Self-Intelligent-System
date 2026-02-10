from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func
from ..database import Base

class SystemConfig(Base):
    __tablename__ = "system_config"

    key = Column(String, primary_key=True, index=True)
    value = Column(Text, nullable=False)  # JSON encoded value
    description = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), default=func.now())
