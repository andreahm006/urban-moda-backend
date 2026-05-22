document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");

  if (getToken()) {
    if (loginLink) loginLink.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      removeToken();
      window.location.href = "login.html";
    });
  }
});
