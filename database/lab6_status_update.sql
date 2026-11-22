-- ShopNow — Lab 6, Step 5: move an order through its statuses (admin / demo)
-- Run ONE line at a time in the SQL Editor. Replace 7 with your order number.
-- Pending → Paid → Processing → Shipped → Delivered

UPDATE "order" SET status = 'Processing' WHERE order_id = 7;
UPDATE "order" SET status = 'Shipped'    WHERE order_id = 7;
UPDATE "order" SET status = 'Delivered'  WHERE order_id = 7;

-- See the result
SELECT order_id, customer_id, order_date, status, total FROM "order" ORDER BY order_id;
