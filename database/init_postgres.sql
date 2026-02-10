-- Smart Shelf Intelligence System - PostgreSQL Schema

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    barcode VARCHAR(100),
    image_url TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shelves table
CREATE TABLE shelves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shelf_code VARCHAR(50) UNIQUE NOT NULL,
    location VARCHAR(255),
    zone VARCHAR(100),
    camera_id VARCHAR(50),
    capacity INT DEFAULT 100,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table (expected quantity from POS/ERP)
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    shelf_id UUID REFERENCES shelves(id) ON DELETE CASCADE,
    expected_quantity INT DEFAULT 0,
    actual_quantity INT DEFAULT 0,
    last_restocked_at TIMESTAMP,
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, shelf_id)
);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) NOT NULL, -- 'mismatch', 'low_stock', 'misplaced', 'missing'
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    shelf_id UUID REFERENCES shelves(id),
    product_id UUID REFERENCES products(id),
    message TEXT NOT NULL,
    expected_quantity INT,
    actual_quantity INT,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cameras table
CREATE TABLE cameras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    camera_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    location VARCHAR(255),
    rtsp_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    fps INT DEFAULT 30,
    resolution VARCHAR(20) DEFAULT '1920x1080',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table (for dashboard metrics)
CREATE TABLE analytics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    shelf_id UUID REFERENCES shelves(id),
    total_picks INT DEFAULT 0,
    total_returns INT DEFAULT 0,
    total_misplacements INT DEFAULT 0,
    total_alerts INT DEFAULT 0,
    avg_accuracy DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, shelf_id)
);

-- Indexes for performance
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_shelf ON inventory(shelf_id);
CREATE INDEX idx_alerts_shelf ON alerts(shelf_id);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX idx_alerts_unresolved ON alerts(is_resolved) WHERE is_resolved = FALSE;
CREATE INDEX idx_analytics_date ON analytics_daily(date DESC);

-- Insert sample data
INSERT INTO products (sku, name, category, price) VALUES
('BREAD001', 'White Bread 400g', 'Bakery', 2.99),
('BREAD002', 'Wheat Bread 400g', 'Bakery', 3.49),
('MILK001', 'Full Cream Milk 1L', 'Dairy', 1.99),
('MILK002', 'Skimmed Milk 1L', 'Dairy', 2.29),
('CHIPS001', 'Potato Chips Classic', 'Snacks', 1.49),
('SODA001', 'Cola 2L', 'Beverages', 2.49);

INSERT INTO shelves (shelf_code, location, zone, camera_id, capacity) VALUES
('A-01', 'Aisle A - Left', 'Zone 1', 'CAM-001', 50),
('A-02', 'Aisle A - Right', 'Zone 1', 'CAM-001', 50),
('B-01', 'Aisle B - Left', 'Zone 2', 'CAM-002', 60),
('B-02', 'Aisle B - Right', 'Zone 2', 'CAM-002', 60);

INSERT INTO cameras (camera_id, name, location, status) VALUES
('CAM-001', 'Aisle A Camera', 'Aisle A - Center Top', 'active'),
('CAM-002', 'Aisle B Camera', 'Aisle B - Center Top', 'active');

-- Initialize inventory with sample data
INSERT INTO inventory (product_id, shelf_id, expected_quantity, actual_quantity) 
SELECT p.id, s.id, 20, 20
FROM products p, shelves s
WHERE s.shelf_code = 'A-01' AND p.sku IN ('BREAD001', 'BREAD002');

INSERT INTO inventory (product_id, shelf_id, expected_quantity, actual_quantity)
SELECT p.id, s.id, 15, 15
FROM products p, shelves s
WHERE s.shelf_code = 'B-01' AND p.sku IN ('MILK001', 'MILK002');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shelves_updated_at BEFORE UPDATE ON shelves
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cameras_updated_at BEFORE UPDATE ON cameras
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();