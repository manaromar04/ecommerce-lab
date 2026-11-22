// ShopNow — supabase-client.js
// Lab 5: one shared Supabase client for every page (moved here from app.js)
// The anon public key is meant to be visible; security comes from RLS policies.
const SUPABASE_URL = "https://azvheolbnkwdzdjqmiqn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dmhlb2xibmt3ZHpkanFtaXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMjQyMzQsImV4cCI6MjEwNzgwMDIzNH0.0DzriW1-w53GjrwuI6WN24zMP6xFth1Hjh4ZIFKklmc";

// Named supabaseClient because the CDN library already uses the global name "supabase"
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Product images, chosen by category (the database stores no image column)
const categoryImages = {
  Computers: "images/laptop.svg",
  Phones: "images/phone.svg",
  Audio: "images/headphones.svg",
  Accessories: "images/keyboard.svg",
  Wearables: "images/smartwatch.svg",
};
