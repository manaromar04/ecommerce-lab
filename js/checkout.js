// ShopNow — checkout.js
// Lab 5, Step 7 — Checkout is only for logged-in customers

async function initCheckout() {
  const user = await requireLogin(); // logged-out visitors are sent to login.html
  if (!user) return;

  document.getElementById("checkout-user").textContent = `Logged in as ${user.email}`;
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("checkout-summary").innerHTML = cart.length
    ? cart.map(i => `<p>${i.quantity} × ${i.name} — AED ${(i.price * i.quantity).toFixed(2)}</p>`).join("")
      + `<p><strong>Total: AED ${total.toFixed(2)}</strong></p>`
    : "<p>Your cart is empty.</p>";
}

initCheckout();
