-- Drop existing tables if they exist
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

-- 1. CATEGORIES TABLE
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for Categories
CREATE POLICY "Allow public read access to categories" ON categories
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to categories" ON categories
    FOR ALL TO authenticated USING (true);


-- 2. PRODUCTS TABLE
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    category TEXT REFERENCES categories(id) ON DELETE SET NULL,
    image TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    brand TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    is_promo BOOLEAN DEFAULT FALSE,
    promo_price NUMERIC(10, 2),
    count_in_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies for Products
CREATE POLICY "Allow public read access to products" ON products
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to products" ON products
    FOR ALL TO authenticated USING (true);


-- 3. CONTACT MESSAGES TABLE
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for Contact Messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for Contact Messages
CREATE POLICY "Allow public insert access to contact_messages" ON contact_messages
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin read access to contact_messages" ON contact_messages
    FOR SELECT TO authenticated USING (true);


-- 4. ORDERS TABLE (For Admin Tracking)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_email TEXT,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pendiente', -- pendiente, entregado, cancelado
    items JSONB NOT NULL, -- list of items in the order
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for Orders
CREATE POLICY "Allow admin full access to orders" ON orders
    FOR ALL TO authenticated USING (true);
