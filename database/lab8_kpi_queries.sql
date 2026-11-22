-- ShopNow — Lab 8: E-Commerce Data Analytics (KPI queries)
-- Run ONE query at a time in the Supabase SQL Editor, then export each result as CSV.

-- 1. Total revenue, number of orders, average order value
SELECT SUM(total) AS total_revenue,
       COUNT(*) AS number_of_orders,
       ROUND(AVG(total), 2) AS avg_order_value
FROM "order"
WHERE status != 'Cancelled';

-- 2. Number of customers
-- The 5 sample customers from Lab 3, plus registered (Supabase Auth) customers who placed an order.
-- (Lab 6 linked orders to Supabase Auth users, so the Lab 3 sample orders have no customer_id.)
SELECT (SELECT COUNT(*) FROM customer) AS sample_customers,
       (SELECT COUNT(DISTINCT customer_id) FROM "order" WHERE customer_id IS NOT NULL) AS registered_customers,
       (SELECT COUNT(*) FROM customer)
     + (SELECT COUNT(DISTINCT customer_id) FROM "order" WHERE customer_id IS NOT NULL) AS number_of_customers;

-- 3. Top-selling products
SELECT p.name, SUM(oi.quantity) AS units_sold
FROM order_item oi
JOIN product p ON oi.product_id = p.product_id
GROUP BY p.name
ORDER BY units_sold DESC, p.name
LIMIT 10;

-- 4. Revenue by category
SELECT c.category_name, SUM(oi.quantity * oi.price) AS category_revenue
FROM order_item oi
JOIN product p ON oi.product_id = p.product_id
JOIN category c ON p.category_id = c.category_id
GROUP BY c.category_name
ORDER BY category_revenue DESC;

-- 5. Monthly sales trend
SELECT DATE_TRUNC('month', order_date) AS month, SUM(total) AS monthly_revenue
FROM "order"
WHERE status != 'Cancelled'
GROUP BY month
ORDER BY month;

-- 6. Order-status distribution
SELECT status, COUNT(*) AS orders
FROM "order"
GROUP BY status;

-- 7. (For the insights) Units sold vs. current stock for every product
SELECT p.name, COALESCE(SUM(oi.quantity), 0) AS units_sold, p.stock
FROM product p
LEFT JOIN order_item oi ON oi.product_id = p.product_id
GROUP BY p.name, p.stock
ORDER BY units_sold DESC, p.stock DESC;
