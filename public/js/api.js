const API_URL = "https://urban-moda-backend.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
}

async function apiRequest(endpoint, method = "GET", data = null) {
  const headers = {
    "Content-Type": "application/json"
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { method, headers };

  if (data !== null) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  let result = {};
  try {
    result = await response.json();
  } catch (error) {
    result = {};
  }

  if (!response.ok) {
    throw new Error(result.message || "No se pudo completar la petición.");
  }

  return result;
}

function showMessage(text, isError = false) {
  const mensaje = document.getElementById("mensaje");
  if (mensaje) {
    mensaje.textContent = text;
    mensaje.style.color = isError ? "#a64242" : "#526044";
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("#cartCount").forEach((el) => {
    el.textContent = count;
  });
}
