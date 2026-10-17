-- ShopNow — Lab 4, Step 3: Row Level Security (RLS)
-- Allow anyone to READ the product catalogue (but not change it)
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON product
  FOR SELECT USING (true);

ALTER TABLE category ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON category
  FOR SELECT USING (true);
