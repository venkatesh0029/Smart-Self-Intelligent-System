"""
SQLAlchemy models for inventory management
"""
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..database import Base


class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100))
    barcode = Column(String(100))
    image_url = Column(Text)
    price = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    inventory_items = relationship("Inventory", back_populates="product")


class Shelf(Base):
    __tablename__ = "shelves"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shelf_code = Column(String(50), unique=True, nullable=False, index=True)
    location = Column(String(255))
    zone = Column(String(100))
    camera_id = Column(String(50))
    capacity = Column(Integer, default=100)
    status = Column(String(50), default='active')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    inventory_items = relationship("Inventory", back_populates="shelf")
    alerts = relationship("Alert", back_populates="shelf")


class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"))
    shelf_id = Column(UUID(as_uuid=True), ForeignKey("shelves.id", ondelete="CASCADE"))
    expected_quantity = Column(Integer, default=0)
    actual_quantity = Column(Integer, default=0)
    last_restocked_at = Column(DateTime)
    last_synced_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    product = relationship("Product", back_populates="inventory_items")
    shelf = relationship("Shelf", back_populates="inventory_items")
    
    @property
    def mismatch(self):
        """Calculate inventory mismatch"""
        return self.expected_quantity - self.actual_quantity
    
    @property
    def mismatch_percentage(self):
        """Calculate mismatch percentage"""
        if self.expected_quantity == 0:
            return 0
        return (self.mismatch / self.expected_quantity) * 100


class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    alert_type = Column(String(50), nullable=False)  # mismatch, low_stock, misplaced, missing
    severity = Column(String(20), default='medium')  # low, medium, high, critical
    shelf_id = Column(UUID(as_uuid=True), ForeignKey("shelves.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    message = Column(Text, nullable=False)
    expected_quantity = Column(Integer)
    actual_quantity = Column(Integer)
    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime)
    resolved_by = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    shelf = relationship("Shelf", back_populates="alerts")


class Camera(Base):
    __tablename__ = "cameras"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    camera_id = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255))
    location = Column(String(255))
    rtsp_url = Column(Text)
    status = Column(String(50), default='active')
    fps = Column(Integer, default=30)
    resolution = Column(String(20), default='1920x1080')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)