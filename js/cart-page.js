// ShopNow — cart-page.js
// Lab 5, Step 3 — Show the cart, line totals and subtotal

function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-cart">Your cart is empty. <a href="products.html">Browse products</a></p>`;
    summary.style.display = "none";
    return;
  }

  summary.style.display = "";
  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
    return `
      <div class="cart-row">
        <img src="${item.image}" alt="${item.name}">
        <span class="cart-name">${item.name}<br><small>AED ${item.price.toFixed(2)} each</small></span>
        <input type="number" min="1" value="${item.quantity}"
          onchange="updateQuantity(${item.product_id}, this.value); renderCart();">
        <span class="cart-line">AED ${lineTotal.toFixed(2)}</span>
        <button class="remove-btn" onclick="removeFromCart(${item.product_id}); renderCart();">Remove</button>
      </div>`;
  }).join("");

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
}

// Lab 5, Step 7 — only logged-in customers can go to checkout
document.getElementById("checkout-btn").addEventListener("click", async () => {
  const user = await requireLogin(); // redirects to login.html when logged out
  if (user) window.location.href = "checkout.html";
});

renderCart();
