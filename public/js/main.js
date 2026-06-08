document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminLink = document.getElementById("adminLink");
  const cartCount = document.getElementById("cartCount");
  const cartLink = document.getElementById("cartLink");
  const registerButton = document.getElementById("registerButton");
  const registerLink = document.getElementById("registerLink");

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  function getCartKey() {
    if (user && user.id) {
      return `carrito_user_${user.id}`;
    }

    if (user && user.email) {
      return `carrito_user_${user.email}`;
    }

    return "carrito_guest";
  }

  function actualizarContadorCarrito() {
    if (!cartCount) return;

    const cartKey = getCartKey();
    const carrito = JSON.parse(localStorage.getItem(cartKey)) || [];

    const cantidad = carrito.reduce((total, item) => {
      return total + Number(item.quantity || 1);
    }, 0);

    cartCount.textContent = cantidad;
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  actualizarContadorCarrito();

  if (token && user) {
    const nombreUsuario = user.name || user.email || "Usuario";

    if (loginLink) {
      loginLink.textContent = `Hola, ${nombreUsuario}`;
      loginLink.href = user.role === "admin" ? "admin.html" : "productos.html";
      loginLink.classList.remove("btn-nav");
    }

    if (adminLink) {
      if (user.role === "admin") {
        adminLink.classList.remove("hidden");
      } else {
        adminLink.classList.add("hidden");
      }
    }

    if (cartLink) {
      if (user.role === "admin") {
        cartLink.classList.add("hidden");
      } else {
        cartLink.classList.remove("hidden");
      }
    }

    if (registerButton) {
      registerButton.classList.add("hidden");
    }

    if (registerLink) {
      registerLink.classList.add("hidden");
    }

    if (logoutBtn) {
      logoutBtn.classList.remove("hidden");

      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
      });
    }
  } else {
    if (loginLink) {
      loginLink.textContent = "Ingresar";
      loginLink.href = "login.html";
      loginLink.classList.add("btn-nav");
    }

    if (logoutBtn) {
      logoutBtn.classList.add("hidden");
    }

    if (adminLink) {
      adminLink.classList.add("hidden");
    }

    if (cartLink) {
      cartLink.classList.remove("hidden");
    }

    if (registerButton) {
      registerButton.classList.remove("hidden");
    }

    if (registerLink) {
      registerLink.classList.remove("hidden");
    }
  }
});