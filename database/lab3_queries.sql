-- ShopNow — Lab 3 practice queries
-- Run ONE query at a time in Supabase (select it, then Run) to see its result

-- =========================================================
-- Step 7 — Practice queries
-- =========================================================
-- 1. All products
SELECT * FROM product;

-- 2. Filtering: products under AED 1,000
SELECT name, price FROM product WHERE price < 1000;

-- 3. Grouping: number of products in each category
SELECT category_id, COUNT(*) AS product_count FROM product GROUP BY category_id ORDER BY category_id;

-- 4. JOIN + sorting: products with their category name, most expensive first
SELECT p.name, p.price, c.category_name
FROM product p
JOIN category c ON p.category_id = c.category_id
ORDER BY p.price DESC;

-- 5. Out-of-stock products
SELECT name FROM product WHERE stock = 0;
