// ShopNow — app.js
// Lab 2: JavaScript and Dynamic Product Catalogue

// Part A — Products stored as data (array of objects)
const products = [
  { id: 1,  name: "Dell Business Laptop",     category: "Computers",   price: 3499, stock: 10, image: "images/laptop.svg" },
  { id: 2,  name: "HP Student Laptop",        category: "Computers",   price: 2299, stock: 4,  image: "images/laptop.svg" },
  { id: 3,  name: "MacBook Air 13-inch",      category: "Computers",   price: 4299, stock: 0,  image: "images/laptop.svg" },
  { id: 4,  name: "Lenovo Gaming Laptop",     category: "Computers",   price: 5199, stock: 7,  image: "images/laptop.svg" },
  { id: 5,  name: "Samsung Galaxy S24",       category: "Phones",      price: 3199, stock: 12, image: "images/phone.svg" },
  { id: 6,  name: "iPhone 15",                category: "Phones",      price: 3399, stock: 3,  image: "images/phone.svg" },
  { id: 7,  name: "Google Pixel 8",           category: "Phones",      price: 2499, stock: 0,  image: "images/phone.svg" },
  { id: 8,  name: "Xiaomi Redmi Note 13",     category: "Phones",      price: 899,  stock: 20, image: "images/phone.svg" },
  { id: 9,  name: "Wireless Headphones",      category: "Audio",       price: 449,  stock: 15, image: "images/headphones.svg" },
  { id: 10, name: "Noise Cancelling Earbuds", category: "Audio",       price: 699,  stock: 2,  image: "images/headphones.svg" },
  { id: 11, name: "Bluetooth Speaker",        category: "Audio",       price: 279,  stock: 9,  image: "images/speaker.svg" },
  { id: 12, name: "Smart Home Speaker",       category: "Audio",       price: 399,  stock: 0,  image: "images/speaker.svg" },
  { id: 13, name: "Mechanical Keyboard",      category: "Accessories", price: 329,  stock: 18, image: "images/keyboard.svg" },
  { id: 14, name: "Wireless Mouse",           category: "Accessories", price: 129,  stock: 25, image: "images/keyboard.svg" },
  { id: 15, name: "USB-C Charging Cable",     category: "Accessories", price: 49,   stock: 5,  image: "images/keyboard.svg" },
  { id: 16, name: "Smart Watch",              category: "Wearables",   price: 899,  stock: 6,  image: "images/smartwatch.svg" },
  { id: 17, name: "Fitness Band",             category: "Wearables",   price: 199,  stock: 1,  image: "images/smartwatch.svg" },
];

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
        <button ${prod.stock === 0 ? "disabled" : ""}>Add to Cart</button>
      </div>`;
  });
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

  applyFilters();
}
