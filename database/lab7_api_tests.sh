# ShopNow — Lab 7: REST API tests with curl
# Run these in the Codespace terminal ONE BLOCK AT A TIME (copy, paste, Enter).
# -w prints the HTTP status code at the end of each response.

# ---- 0. Save the project URL and anon key in two variables (run once) ----
URL="https://azvheolbnkwdzdjqmiqn.supabase.co/rest/v1"
KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dmhlb2xibmt3ZHpkanFtaXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMjQyMzQsImV4cCI6MjEwNzgwMDIzNH0.0DzriW1-w53GjrwuI6WN24zMP6xFth1Hjh4ZIFKklmc"

# ---- 1. GET: all products (only 3 columns, so the output is readable) ----
curl -s "$URL/product?select=product_id,name,price&order=product_id.asc" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -w "\nHTTP status: %{http_code}\n"

# ---- 2. GET with filters ----
# 2a. price less than 1000
curl -s "$URL/product?select=name,price&price=lt.1000" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -w "\nHTTP status: %{http_code}\n"
# 2b. category 3 (Phones), ordered by price, most expensive first
curl -s "$URL/product?select=name,price&category_id=eq.3&order=price.desc" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -w "\nHTTP status: %{http_code}\n"

# ---- 3. POST: try to create a product ----
curl -s -X POST "$URL/product" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"name": "USB-C Hub", "price": 149, "stock": 20, "category_id": 2}' \
  -w "\nHTTP status: %{http_code}\n"

# ---- 4. PATCH: try to change the stock of product 1 ----
curl -s -X PATCH "$URL/product?product_id=eq.1" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"stock": 5}' \
  -w "\nHTTP status: %{http_code}\n"

# ---- 5. DELETE: try to delete product 20 ----
curl -s -X DELETE "$URL/product?product_id=eq.20" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  -H "Prefer: return=representation" \
  -w "\nHTTP status: %{http_code}\n"

# ---- 6. GET again: check that product 1 and product 20 did not change ----
curl -s "$URL/product?select=product_id,name,stock&product_id=in.(1,20)" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -w "\nHTTP status: %{http_code}\n"

# ---- 7. A 4xx error on purpose: a table that does not exist ----
curl -s "$URL/products" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -w "\nHTTP status: %{http_code}\n"
