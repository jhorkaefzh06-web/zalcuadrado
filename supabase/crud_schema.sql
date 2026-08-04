-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS shipping_rates CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- 1. SUBCATEGORIES TABLE
CREATE TABLE subcategories (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to subcategories" ON subcategories
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to subcategories" ON subcategories
    FOR ALL TO authenticated USING (true);


-- 2. WAREHOUSES TABLE
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin full access to warehouses" ON warehouses
    FOR ALL TO authenticated USING (true);


-- 3. INVENTORY TABLE
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    stock INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to inventory" ON inventory
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to inventory" ON inventory
    FOR ALL TO authenticated USING (true);


-- 4. SHIPPING RATES TABLE
CREATE TABLE shipping_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department TEXT NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to shipping_rates" ON shipping_rates
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to shipping_rates" ON shipping_rates
    FOR ALL TO authenticated USING (true);


-- 5. ORDERS TABLE (WhatsApp Focused)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_number TEXT NOT NULL,
    client_name TEXT NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pendiente', -- pendiente, entregado, cancelado
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert access to orders" ON orders
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin full access to orders" ON orders
    FOR ALL TO authenticated USING (true);


-- 6. DYNAMIC SQL TUNNEL FUNCTION (For future migrations)
CREATE OR REPLACE FUNCTION execute_sql(query text)
RETURNS void AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
