// ShopNow — app.js
// Lab 2: JavaScript and Dynamic Product Catalogue
// Lab 4: Products now load live from the Supabase database

// Lab 4, Step 2 — Create the Supabase client
// (the anon public key is meant to be visible; security comes from RLS policies)
const SUPABASE_URL = "https://azvheolbnkwdzdjqmiqn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dmhlb2xibmt3ZHpkanFtaXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMjQyMzQsImV4cCI6MjEwNzgwMDIzNH0.0DzriW1-w53GjrwuI6WN24zMP6xFth1Hjh4ZIFKklmc";
// Named supabaseClient because the CDN library already uses the global name "supabase"
// (only pages that load the Supabase CDN script, e.g. products.html, create a client)
const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Product images, chosen by category (the database stores no image column)
const categoryImages = {
  Computers: "images/laptop.svg",
  Phones: "images/phone.svg",
  Audio: "images/headphones.svg",
  Accessories: "images/keyboard.svg",
  Wearables: "images/smartwatch.svg",
};

// Filled from the database by loadProducts() (replaces the Lab 2 hard-coded array)
let products = [];

// Part B — Render product cards from the data
function renderProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p class='no-results'>No products match your search.</p>";
    return;
  }

  list.forEach(prod => {
    const stockLabel = prod.stock === 0 ? "Out of Stock"
      : prod.stock <= 5 ? "Low Stock" : "In Stock";
    const stockClass = prod.stock === 0 ? "out" : prod.stock <= 5 ? "low" : "in";

    container.innerHTML += `
      <div class="product">
        <img src="${prod.image}" alt="${prod.name}">
        <span class="category">${prod.category}</span>
        <h3>${prod.name}</h3>
        <p class="price">AED ${prod.price.toLocaleString()}</p>
        <p class="stock ${stockClass}">${stockLabel}</p>
        <a class="details-link" href="product-detail.html?id=${prod.id}">View details</a>
        <button ${prod.stock === 0 ? "disabled" : ""}>Add to Cart</button>
      </div>`;
  });
}

// Lab 4, Step 4 — Fetch products from the database
async function loadProducts() {
  const { data, error } = await supabaseClient
    .from("product")
    .select("*, category(category_name)")
    .order("name");

  if (error) {
    document.getElementById("product-list").innerHTML =
      `<p class="no-results">Could not load products: ${error.message}</p>`;
    return;
  }

  // Convert database rows into the shape renderProducts() already expects
  products = data.map(row => ({
    id: row.product_id,
    name: row.name,
    category: row.category ? row.category.category_name : "Other",
    price: Number(row.price),
    stock: row.stock,
    image: categoryImages[row.category?.category_name] || "images/laptop.svg",
  }));

  applyFilters();
}

// Part C + Challenge — search, category filter and sort applied together
let searchTerm = "";
let selectedCategory = "All";
let sortOrder = "default";

function applyFilters() {
  // 1. Filter by search term
  let result = products.filter(p => p.name.toLowerCase().includes(searchTerm));

  // 2. Filter by category
  if (selectedCategory !== "All") {
    result = result.filter(p => p.category === selectedCategory);
  }

  // 3. Sort a copy by price (never sort the original array)
  result = [...result];
  if (sortOrder === "low-high") result.sort((a, b) => a.price - b.price);
  if (sortOrder === "high-low") result.sort((a, b) => b.price - a.price);

  renderProducts(result);
  document.getElementById("result-count").textContent =
    `Showing ${result.length} of ${products.length} products`;
}

// Only run the catalogue code on the page that has the product list
if (document.getElementById("product-list")) {
  // Step 3 — Search box
  document.getElementById("search-box").addEventListener("input", e => {
    searchTerm = e.target.value.toLowerCase();
    applyFilters();
  });

  // Step 4 — Category filter buttons
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.dataset.category;
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  // Step 5 — Price sorting
  document.getElementById("sort-select").addEventListener("change", e => {
    sortOrder = e.target.value;
    applyFilters();
  });

  loadProducts(); // replaces the Lab 2 applyFilters() call on the hard-coded array
}
