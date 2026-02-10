"""
Pydantic models (schemas) for Inventory
"""
from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    sku: str
    name: str
    category: Optional[str] = None
    price: Optional[float] = None

class ShelfCreate(BaseModel):
    shelf_code: str
    location: Optional[str] = None
    zone: Optional[str] = None
    camera_id: Optional[str] = None
    capacity: int = 100

class InventoryUpdate(BaseModel):
    expected_quantity: Optional[int] = None
    actual_quantity: Optional[int] = None
