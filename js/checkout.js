// ShopNow — checkout.js
// Lab 5, Step 7 — Checkout is only for logged-in customers
// Lab 6 — Validate shipping details, then create the order and order items in Supabase

async function initCheckout() {
  const user = await requireLogin(); // logged-out visitors are sent to login.html
  if (!user) return;

  document.getElementById("checkout-user").textContent = `Logged in as ${user.email}`;
  const cart = getCart();

  if (cart.length === 0) {
    document.getElementById("checkout-summary").innerHTML =
      `<p>Your cart is empty. <a href="products.html">Browse products</a></p>`;
    document.getElementById("place-order").disabled = true;
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("checkout-summary").innerHTML =
    cart.map(i => `<p>${i.quantity} × ${i.name}<span>AED ${(i.price * i.quantity).toFixed(2)}</span></p>`).join("")
    + `<p class="summary-total">Total<span>AED ${total.toFixed(2)}</span></p>`;
}

// Lab 6, Step 1 — Collect and validate shipping information
document.getElementById("checkout-form").addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !address) {
    alert("Name and address are required.");
    return;
  }
  // Spaces are ignored, so "+971 50 123 4567" is accepted (7–15 digits, optional +)
  if (!/^\+?[0-9]{7,15}$/.test(phone.replace(/\s/g, ""))) {
    alert("Enter a valid phone number.");
    return;
  }
  await placeOrder(name, address, phone);
});

// Lab 6, Step 2 — Create the order and order_item rows
// (a real payment gateway would confirm the payment here, before the insert)
async function placeOrder(name, address, phone) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) { window.location.href = "login.html"; return; }

  const cart = getCart();
  if (cart.length === 0) { alert("Your cart is empty."); return; }
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const button = document.getElementById("place-order");
  button.disabled = true;
  button.textContent = "Placing order...";

  // 1. Create the order (select().single() returns the new row, including order_id)
  const { data: order, error } = await supabaseClient
    .from("order")
    .insert([{ customer_id: user.id, total: subtotal, status: "Paid" }])
    .select()
    .single();

  if (error) {
    alert("Could not place order: " + error.message);
    button.disabled = false;
    button.textContent = "Place Order";
    return;
  }

  // 2. Create one order_item row for each product in the cart
  const items = cart.map(item => ({
    order_id: order.order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));
  const { error: itemsError } = await supabaseClient.from("order_item").insert(items);

  if (itemsError) {
    alert("Order created, but the items could not be saved: " + itemsError.message);
    button.disabled = false;
    button.textContent = "Place Order";
    return;
  }

  // 3. Only clear the cart after both inserts succeeded
  localStorage.removeItem("cart");
  window.location.href = `order-confirmation.html?id=${order.order_id}`;
}

initCheckout();
