// ShopNow — order-confirmation.js
// Lab 6, Step 4 — Show the order that was just placed

const orderId = new URLSearchParams(window.location.search).get("id");

async function loadConfirmation() {
  const user = await requireLogin();
  if (!user) return;

  document.getElementById("order-number").textContent = orderId;

  // RLS only returns this order if it belongs to the logged-in customer
  const { data: order } = await supabaseClient
    .from("order")
    .select("*")
    .eq("order_id", orderId)
    .single();

  const { data: items } = await supabaseClient
    .from("order_item")
    .select("*, product(name)")
    .eq("order_id", orderId);

  if (!order || !items || items.length === 0) {
    document.getElementById("items").innerHTML = "<p>Order not found.</p>";
    return;
  }

  document.getElementById("order-meta").textContent =
    `Status: ${order.status} · Placed on ${new Date(order.order_date).toLocaleString()}`;

  document.getElementById("items").innerHTML = items
    .map(i => `<p>${i.product.name} × ${i.quantity}<span>AED ${(i.price * i.quantity).toFixed(2)}</span></p>`)
    .join("");

  document.getElementById("order-total").textContent = Number(order.total).toFixed(2);
}

loadConfirmation();
