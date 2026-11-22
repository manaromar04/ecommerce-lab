-- ShopNow — Lab 6: Checkout and Orders
-- Run this whole script ONCE in Supabase: SQL Editor → + New query → paste → Run

-- =========================================================
-- Schema adjustment: link orders to Supabase Auth users (UUID)
-- In Lab 3, order.customer_id was an INTEGER pointing to the customer table.
-- Supabase Auth user ids are UUIDs, so the column type has to change.
-- The 6 sample orders from Lab 3 belonged to sample customers (1–5), not to real
-- logged-in users, so their customer_id becomes empty (NULL).
-- =========================================================
ALTER TABLE "order" DROP CONSTRAINT IF EXISTS order_customer_id_fkey;
ALTER TABLE "order" ALTER COLUMN customer_id TYPE UUID USING NULL;
ALTER TABLE "order" ADD CONSTRAINT order_customer_id_fkey
  FOREIGN KEY (customer_id) REFERENCES auth.users(id);

-- =========================================================
-- Step 3 — RLS: customers can only create and view their own orders
-- =========================================================
ALTER TABLE "order" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can insert their own orders" ON "order"
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can view their own orders" ON "order"
  FOR SELECT USING (auth.uid() = customer_id);

ALTER TABLE order_item ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can insert their own order items" ON order_item
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "order" WHERE order_id = order_item.order_id AND customer_id = auth.uid())
  );

CREATE POLICY "Customers can view their own order items" ON order_item
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "order" WHERE order_id = order_item.order_id AND customer_id = auth.uid())
  );
