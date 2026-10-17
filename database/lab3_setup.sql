-- ShopNow — Lab 3: E-Commerce Database Design with Supabase
-- Run this whole script once in Supabase: SQL Editor → + New query → paste → Run

-- =========================================================
-- Part C — Create the tables
-- =========================================================
CREATE TABLE category (
  category_id   SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL
);

CREATE TABLE product (
  product_id  SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id INTEGER REFERENCES category(category_id)
);

CREATE TABLE customer (
  customer_id SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMP DEFAULT now()
);

CREATE TABLE "order" (
  order_id    SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customer(customer_id),
  order_date  TIMESTAMP DEFAULT now(),
  status      TEXT DEFAULT 'Pending',
  total       NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE order_item (
  order_item_id SERIAL PRIMARY KEY,
  order_id      INTEGER REFERENCES "order"(order_id),
  product_id    INTEGER REFERENCES product(product_id),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  price         NUMERIC(10,2) NOT NULL
);

-- =========================================================
-- Part D — Insert sample data (parent tables first)
-- =========================================================
INSERT INTO category (category_name) VALUES
  ('Computers'), ('Accessories'), ('Phones'), ('Audio'), ('Wearables');

INSERT INTO product (name, description, price, stock, category_id) VALUES
  ('Dell Business Laptop',     '14-inch business laptop, 16 GB RAM',   3499, 10, 1),
  ('HP Student Laptop',        '15-inch laptop for everyday study',    2299,  4, 1),
  ('MacBook Air 13-inch',      'M2 chip, 256 GB SSD',                  4299,  0, 1),
  ('Lenovo Gaming Laptop',     'RTX graphics, 144 Hz screen',          5199,  7, 1),
  ('Mechanical Keyboard',      'Backlit keys, Arabic/English layout',   329, 18, 2),
  ('Wireless Mouse',           'Ergonomic wireless mouse',              129, 25, 2),
  ('USB-C Charging Cable',     '2-metre fast charging cable',            49,  5, 2),
  ('Wireless Charger',         '15 W fast wireless charging pad',       149, 30, 2),
  ('Laptop Backpack',          'Water-resistant, fits 15-inch laptops', 159, 12, 2),
  ('Samsung Galaxy S24',       '256 GB, dual SIM',                     3199, 12, 3),
  ('iPhone 15',                '128 GB, 6.1-inch display',             3399,  3, 3),
  ('Google Pixel 8',           '128 GB, 50 MP camera',                 2499,  0, 3),
  ('Xiaomi Redmi Note 13',     '128 GB, 5000 mAh battery',              899, 20, 3),
  ('Wireless Headphones',      'Over-ear, 30-hour battery life',        449, 15, 4),
  ('Noise Cancelling Earbuds', 'Active noise cancelling earbuds',       699,  2, 4),
  ('Bluetooth Speaker',        'Portable and splash-proof',             279,  9, 4),
  ('Smart Home Speaker',       'Voice assistant speaker',               399,  0, 4),
  ('Galaxy Buds',              'True wireless earbuds',                 549,  8, 4),
  ('Smart Watch',              'Heart-rate tracking and GPS',           899,  6, 5),
  ('Fitness Band',             'Step and sleep tracking',               199,  1, 5);

INSERT INTO customer (name, email) VALUES
  ('Ahmed Al Mansoori', 'ahmed.mansoori@example.com'),
  ('Fatima Hassan',     'fatima.hassan@example.com'),
  ('Omar Khalid',       'omar.khalid@example.com'),
  ('Sara Ali',          'sara.ali@example.com'),
  ('Yusuf Ibrahim',     'yusuf.ibrahim@example.com');

INSERT INTO "order" (customer_id, order_date, status) VALUES
  (1, '2026-10-01 10:15', 'Delivered'),
  (2, '2026-10-03 14:40', 'Delivered'),
  (3, '2026-10-05 09:05', 'Shipped'),
  (1, '2026-10-08 19:20', 'Shipped'),
  (4, '2026-10-12 11:30', 'Pending'),
  (5, '2026-10-15 16:45', 'Pending');

INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
  (1,  1, 1, 3499), (1,  6, 1,  129),
  (2, 10, 1, 3199), (2, 14, 1,  449), (2,  7, 2,   49),
  (3,  5, 1,  329), (3,  6, 2,  129),
  (4, 19, 1,  899),
  (5, 13, 1,  899), (5, 16, 2,  279),
  (6,  2, 1, 2299), (6,  9, 1,  159);

-- Set each order's total from its order items
UPDATE "order" o
SET total = (SELECT SUM(oi.quantity * oi.price) FROM order_item oi WHERE oi.order_id = o.order_id);
