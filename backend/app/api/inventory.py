"""
Inventory management API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.inventory import Product, Shelf, Inventory, Alert
from ..schemas.inventory import ProductCreate, ShelfCreate, InventoryUpdate
from ..services.inventory_service import InventoryService
from ..services.alert_service import AlertService

# Pydantic schemas for Alerts (Response only)
from pydantic import BaseModel
from datetime import datetime

class AlertResponse(BaseModel):
    id: str
    alert_type: str
    severity: str
    message: str
    created_at: datetime
    is_resolved: bool
    
    class Config:
        from_attributes = True

router = APIRouter()

# Products endpoints
@router.get("/products")
def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return InventoryService.get_products(db, skip, limit)

@router.post("/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    return InventoryService.create_product(db, product)

@router.get("/products/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = InventoryService.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Shelves endpoints
@router.get("/shelves")
def get_shelves(db: Session = Depends(get_db)):
    return InventoryService.get_shelves(db)

@router.post("/shelves")
def create_shelf(shelf: ShelfCreate, db: Session = Depends(get_db)):
    return InventoryService.create_shelf(db, shelf)

@router.get("/shelves/{shelf_id}")
def get_shelf(shelf_id: str, db: Session = Depends(get_db)):
    shelf = InventoryService.get_shelf(db, shelf_id)
    if not shelf:
        raise HTTPException(status_code=404, detail="Shelf not found")
    return shelf

@router.get("/shelves/{shelf_id}/inventory")
def get_shelf_inventory(shelf_id: str, db: Session = Depends(get_db)):
    return InventoryService.get_shelf_inventory(db, shelf_id)

# Inventory endpoints
@router.get("/inventory")
def get_inventory(db: Session = Depends(get_db)):
    return InventoryService.get_inventory(db)

@router.get("/inventory/mismatches")
def get_inventory_mismatches(threshold: int = 2, db: Session = Depends(get_db)):
    inventory = InventoryService.get_inventory(db)
    mismatches = [
        {
            **item.__dict__,
            "mismatch": item.mismatch,
            "mismatch_percentage": item.mismatch_percentage
        }
        for item in inventory
        if abs(item.mismatch) >= threshold
    ]
    return mismatches

@router.put("/inventory/{inventory_id}")
def update_inventory(
    inventory_id: str,
    update: InventoryUpdate,
    db: Session = Depends(get_db)
):
    inventory = InventoryService.update_inventory(db, inventory_id, update)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return inventory

@router.post("/inventory/sync")
def sync_inventory_from_detection(
    shelf_id: str,
    product_id: str,
    detected_quantity: int,
    db: Session = Depends(get_db)
):
    result = InventoryService.sync_inventory(db, shelf_id, product_id, detected_quantity)
    if not result:
        raise HTTPException(status_code=404, detail="Inventory record not found")
    return result

# Alerts endpoints
@router.get("/alerts", response_model=List[AlertResponse])
def get_alerts(
    unresolved_only: bool = True,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return AlertService.get_alerts(db, unresolved_only, limit)

@router.post("/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: str, resolved_by: str, db: Session = Depends(get_db)):
    alert = AlertService.resolve_alert(db, alert_id, resolved_by)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert