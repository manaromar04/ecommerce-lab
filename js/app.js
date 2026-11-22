// ShopNow — app.js
// Lab 2: JavaScript and Dynamic Product Catalogue
// Lab 4: Products now load live from the Supabase database
// Lab 5: "Add to Cart" buttons now add products to the localStorage cart

// The Supabase client (supabaseClient) and categoryImages now live in js/supabase-client.js

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
        <button class="add-to-cart" data-id="${prod.id}" ${prod.stock === 0 ? "disabled" : ""}>Add to Cart</button>
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

  // Lab 5, Step 2 — Add to Cart: find the clicked product by its id and add it to the cart
  document.getElementById("product-list").addEventListener("click", e => {
    const button = e.target.closest(".add-to-cart");
    if (!button) return;
    const prod = products.find(p => p.id === Number(button.dataset.id));
    addToCart({ product_id: prod.id, name: prod.name, price: prod.price, image: prod.image });
    showToast(`${prod.name} added to cart`);
  });

  // Step 5 — Price sorting
  document.getElementById("sort-select").addEventListener("change", e => {
    sortOrder = e.target.value;
    applyFilters();
  });

  loadProducts(); // replaces the Lab 2 applyFilters() call on the hard-coded array
}
