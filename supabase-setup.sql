-- ========================================
-- VINCERE E-Commerce: Supabase Setup SQL
-- Run this in Supabase Dashboard → SQL Editor
-- ========================================

-- =====================
-- 1. PRODUCTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT DEFAULT '/placeholder.svg',
  category TEXT NOT NULL,
  is_on_sale BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  description TEXT,
  sizes TEXT[],
  colors TEXT[],
  brand TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON products FOR DELETE USING (true);

-- Seed products
INSERT INTO products (name, price, original_price, image, category, is_on_sale, rating, reviews) VALUES
('Premium Cotton T-Shirt', 49.99, 69.99, '/premium-white-cotton-t-shirt-on-model.jpg', 'Men''s Tops', true, 4.8, 124),
('Elegant Midi Dress', 129.99, NULL, '/elegant-black-midi-dress-on-model.jpg', 'Women''s Dresses', false, 4.9, 89),
('Classic Denim Jacket', 89.99, NULL, '/classic-blue-denim-jacket-on-model.jpg', 'Men''s Tops', false, 4.7, 156),
('Silk Blouse', 79.99, 99.99, '/elegant-silk-blouse-on-model.jpg', 'Women''s Tops', true, 4.6, 73),
('Leather Handbag', 199.99, NULL, '/luxury-leather-handbag.jpg', 'Accessories', false, 4.8, 92),
('Wool Sweater', 89.99, NULL, '/cozy-wool-sweater-on-model.jpg', 'Women''s Tops', false, 4.5, 67);

-- =====================
-- 2. USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete users" ON users FOR DELETE USING (true);

-- Seed admin user (password: admin123)
INSERT INTO users (id, email, name, password_hash, role) VALUES
('admin-001', 'admin@example.com', 'Admin', 'admin123', 'admin');
