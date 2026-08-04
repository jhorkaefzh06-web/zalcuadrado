-- 1. ADD IMAGES ARRAY COLUMN TO PRODUCTS IF NOT EXISTS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'images'
    ) THEN
        ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- 2. CREATE STOCK MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('entrada', 'salida')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid duplicate errors
DROP POLICY IF EXISTS "Allow public read access to stock_movements" ON stock_movements;
DROP POLICY IF EXISTS "Allow admin full access to stock_movements" ON stock_movements;

-- Policies
CREATE POLICY "Allow public read access to stock_movements" ON stock_movements
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to stock_movements" ON stock_movements
    FOR ALL TO authenticated USING (true);


-- 3. TRIGGER FUNCTION TO SYNC INVENTORY ON MOVEMENT
CREATE OR REPLACE FUNCTION update_inventory_on_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if inventory record already exists
    IF EXISTS (
        SELECT 1 FROM inventory 
        WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id
    ) THEN
        -- Update existing stock
        UPDATE inventory 
        SET stock = CASE 
            WHEN NEW.type = 'entrada' THEN stock + NEW.quantity
            ELSE GREATEST(0, stock - NEW.quantity)
        END,
        updated_at = NOW()
        WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id;
    ELSE
        -- Insert new stock mapping (only logical if type is 'entrada')
        INSERT INTO inventory (product_id, warehouse_id, stock)
        VALUES (
            NEW.product_id, 
            NEW.warehouse_id, 
            CASE WHEN NEW.type = 'entrada' THEN NEW.quantity ELSE 0 END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_update_inventory_on_movement ON stock_movements;

-- Create Trigger
CREATE TRIGGER trigger_update_inventory_on_movement
AFTER INSERT ON stock_movements
FOR EACH ROW
EXECUTE FUNCTION update_inventory_on_movement();
