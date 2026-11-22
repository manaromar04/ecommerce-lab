// ShopNow — register.js
// Lab 5, Step 5 — Create an account with Supabase Auth (Supabase stores the password safely)

document.getElementById("register-form").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("form-message");

  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    message.textContent = error.message;
    message.className = "form-message error";
  } else {
    alert("Account created — you can now log in.");
    window.location.href = "login.html";
  }
});
