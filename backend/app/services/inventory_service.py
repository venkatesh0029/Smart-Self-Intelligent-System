"""
Inventory Service
"""
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from ..models.inventory import Product, Shelf, Inventory, Alert
from ..schemas.inventory import ProductCreate, ShelfCreate, InventoryUpdate

class InventoryService:
    @staticmethod
    def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[Product]:
        return db.query(Product).offset(skip).limit(limit).all()

    @staticmethod
    def create_product(db: Session, product: ProductCreate) -> Product:
        db_product = Product(**product.dict())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def get_product(db: Session, product_id: str) -> Optional[Product]:
        return db.query(Product).filter(Product.id == product_id).first()

    @staticmethod
    def get_shelves(db: Session) -> List[Shelf]:
        return db.query(Shelf).all()

    @staticmethod
    def create_shelf(db: Session, shelf: ShelfCreate) -> Shelf:
        db_shelf = Shelf(**shelf.dict())
        db.add(db_shelf)
        db.commit()
        db.refresh(db_shelf)
        return db_shelf

    @staticmethod
    def get_shelf(db: Session, shelf_id: str) -> Optional[Shelf]:
        return db.query(Shelf).filter(Shelf.id == shelf_id).first()

    @staticmethod
    def get_shelf_inventory(db: Session, shelf_id: str) -> List[Inventory]:
        return db.query(Inventory).filter(Inventory.shelf_id == shelf_id).all()

    @staticmethod
    def get_inventory(db: Session) -> List[Inventory]:
        return db.query(Inventory).all()

    @staticmethod
    def check_and_create_mismatch_alert(db: Session, inventory: Inventory, detected_qty: int) -> Optional[Alert]:
        """Helper to create alert if mismatch threshold exceeded"""
        mismatch = abs(inventory.expected_quantity - detected_qty)
        if mismatch >= 2:
            alert = Alert(
                alert_type="mismatch",
                severity="high" if mismatch >= 5 else "medium",
                shelf_id=inventory.shelf_id,
                product_id=inventory.product_id,
                message=f"Mismatch: Expected {inventory.expected_quantity}, Actual {detected_qty}",
                expected_quantity=inventory.expected_quantity,
                actual_quantity=detected_qty
            )
            db.add(alert)
            return alert
        return None

    @staticmethod
    def update_inventory(db: Session, inventory_id: str, update: InventoryUpdate) -> Optional[Inventory]:
        inventory = db.query(Inventory).filter(Inventory.id == inventory_id).first()
        if not inventory:
            return None
        
        if update.expected_quantity is not None:
            inventory.expected_quantity = update.expected_quantity
        if update.actual_quantity is not None:
            inventory.actual_quantity = update.actual_quantity
        
        inventory.last_synced_at = datetime.utcnow()
        
        # Check mismatch using simple logic here or delegate to internal helper
        # Using existing logic pattern from controller
        if abs(inventory.mismatch) >= 2:
             alert = Alert(
                alert_type="mismatch",
                severity="medium" if abs(inventory.mismatch) < 5 else "high",
                shelf_id=inventory.shelf_id,
                product_id=inventory.product_id,
                message=f"Inventory mismatch: Expected {inventory.expected_quantity}, Actual {inventory.actual_quantity}",
                expected_quantity=inventory.expected_quantity,
                actual_quantity=inventory.actual_quantity
            )
             db.add(alert)
        
        db.commit()
        db.refresh(inventory)
        return inventory

    @staticmethod
    def sync_inventory(db: Session, shelf_id: str, product_id: str, detected_quantity: int) -> dict:
        inventory = db.query(Inventory).filter(
            Inventory.shelf_id == shelf_id,
            Inventory.product_id == product_id
        ).first()
        
        if not inventory:
            return None
        
        old_quantity = inventory.actual_quantity
        inventory.actual_quantity = detected_quantity
        inventory.last_synced_at = datetime.utcnow()
        
        # Logic matches check_and_create_mismatch_alert pattern
        mismatch = abs(inventory.expected_quantity - detected_quantity)
        if mismatch >= 2:
            alert = Alert(
                alert_type="mismatch",
                severity="high" if mismatch >= 5 else "medium",
                shelf_id=shelf_id,
                product_id=product_id,
                message=f"AI detected quantity ({detected_quantity}) differs from expected ({inventory.expected_quantity})",
                expected_quantity=inventory.expected_quantity,
                actual_quantity=detected_quantity
            )
            db.add(alert)
            
        db.commit()
        db.refresh(inventory)
        
        return {
            "inventory": inventory,
            "quantity_change": detected_quantity - old_quantity,
            "mismatch": inventory.mismatch
        }
