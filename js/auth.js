// ShopNow — auth.js
// Lab 5, Part B: show login state in the navbar, log out, and protect checkout

async function updateNavForAuth() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  const navSlot = document.getElementById("auth-nav-slot");
  if (!navSlot) return;
  if (user) {
    // Lab 10 security fix: build the greeting with textContent, not innerHTML,
    // so text from the account (the email) can never be run as HTML/JavaScript
    navSlot.innerHTML = `<span class="nav-user"></span> <a href="#" onclick="logout(); return false;">Log out</a>`;
    navSlot.querySelector(".nav-user").textContent = `Hi, ${user.email}`;
  } else {
    navSlot.innerHTML = `<a href="login.html">Login</a>`;
  }
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

// Lab 5, Step 7 — send visitors who are not logged in to the login page
async function requireLogin() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) window.location.href = "login.html";
  return user;
}

updateNavForAuth();
