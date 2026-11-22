// ShopNow — product-detail.js
// Lab 4, Step 5 — Load one product by the id in the URL (product-detail.html?id=3)

// The Supabase client and categoryImages come from js/supabase-client.js

// Read the id from the query string
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct() {
  const { data: product } = await supabaseClient
    .from("product")
    .select("*, category(category_name)")
    .eq("product_id", productId)
    .single();

  if (!product) {
    document.getElementById("detail").innerHTML = "<p>Product not found.</p>";
    return;
  }

  const categoryName = product.category ? product.category.category_name : "Other";
  const stockLabel = product.stock === 0 ? "Out of Stock"
    : product.stock <= 5 ? "Low Stock" : "In Stock";
  const stockClass = product.stock === 0 ? "out" : product.stock <= 5 ? "low" : "in";

  document.title = `ShopNow — ${product.name}`;
  document.getElementById("detail").innerHTML = `
    <img src="${categoryImages[categoryName] || "images/laptop.svg"}" alt="${product.name}">
    <div class="detail-info">
      <span class="category">${categoryName}</span>
      <h2>${product.name}</h2>
      <p class="desc">${product.description}</p>
      <p class="price">AED ${Number(product.price).toLocaleString()}</p>
      <p class="stock ${stockClass}">${stockLabel} (${product.stock} available)</p>
      <button id="detail-add" ${product.stock === 0 ? "disabled" : ""}>Add to Cart</button>
    </div>`;

  // Lab 5 — Add this product to the cart
  document.getElementById("detail-add").addEventListener("click", () => {
    addToCart({ product_id: product.product_id, name: product.name,
                price: Number(product.price), image: categoryImages[categoryName] || "images/laptop.svg" });
    showToast(`${product.name} added to cart`);
  });
}

loadProduct();
