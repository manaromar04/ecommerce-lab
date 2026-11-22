-- ShopNow — Lab 10: security fixes found in the security review
-- Run this whole script once in Supabase: SQL Editor → + New query → paste → Run

-- =========================================================
-- Risk 1 — The customer table had RLS turned OFF ("Unrestricted"),
-- so anyone with the public anon key could read, change or delete customer names and emails.
-- Fix: turn RLS on. With no policies, the anon key can no longer read or change this table.
-- (The dashboard and the SQL Editor still work, because they bypass RLS.)
-- =========================================================
ALTER TABLE customer ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- Risk 2 — Prices and totals are calculated in the browser and saved as-is.
-- A customer could edit the request (DevTools or curl) and buy a laptop for AED 1.
-- Fix: the database ignores the price sent by the browser and uses the real product price,
-- then recalculates the order total from its items.
-- =========================================================

-- 2a. Always copy the real price from the product table into each order item
CREATE OR REPLACE FUNCTION set_order_item_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  SELECT price INTO NEW.price FROM product WHERE product_id = NEW.product_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_order_item_price ON order_item;
CREATE TRIGGER trg_set_order_item_price
  BEFORE INSERT ON order_item
  FOR EACH ROW EXECUTE FUNCTION set_order_item_price();

-- 2b. Recalculate the order total from its items after items are added
CREATE OR REPLACE FUNCTION recalc_order_total()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE "order"
  SET total = (SELECT COALESCE(SUM(quantity * price), 0) FROM order_item WHERE order_id = NEW.order_id)
  WHERE order_id = NEW.order_id;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_recalc_order_total ON order_item;
CREATE TRIGGER trg_recalc_order_total
  AFTER INSERT ON order_item
  FOR EACH ROW EXECUTE FUNCTION recalc_order_total();

-- =========================================================
-- Risk 3 — Unexpected values: only allow known order statuses and sensible quantities
-- =========================================================
ALTER TABLE "order" DROP CONSTRAINT IF EXISTS order_status_check;
ALTER TABLE "order" ADD CONSTRAINT order_status_check
  CHECK (status IN ('Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'));

ALTER TABLE order_item DROP CONSTRAINT IF EXISTS order_item_quantity_max;
ALTER TABLE order_item ADD CONSTRAINT order_item_quantity_max CHECK (quantity <= 20);
