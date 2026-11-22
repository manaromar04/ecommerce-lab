// ShopNow — login.js
// Lab 5, Step 5 — Log in with Supabase Auth

document.getElementById("login-form").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("form-message");

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    message.textContent = error.message;
    message.className = "form-message error";
  } else {
    window.location.href = "index.html";
  }
});
