document.addEventListener("DOMContentLoaded", () => {
  const orderSummary = document.getElementById("orderSummary");
  const paymentForm = document.getElementById("paymentForm");
  const message = document.getElementById("message");

  const orden = JSON.parse(localStorage.getItem("ordenPendiente") || "null");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function formatPrice(value) {
    return "$ " + Number(value || 0).toLocaleString();
  }

  function getCartKey() {
    if (user && user.id) {
      return `carrito_user_${user.id}`;
    }

    if (user && user.email) {
      return `carrito_user_${user.email}`;
    }

    return "carrito_guest";
  }

  if (!user) {
    alert("Debes iniciar sesión para realizar el pago.");
    window.location.href = "login.html";
    return;
  }

  if (!orden) {
    alert("No hay una orden pendiente de pago.");
    window.location.href = "carrito.html";
    return;
  }

  if (orderSummary) {
    orderSummary.innerHTML = `
      <div style="margin-bottom: 20px;">
        <p><strong>Cliente:</strong> ${orden.usuario.name || orden.usuario.email}</p>
        <p><strong>Método:</strong> Pago en línea</p>
        <p><strong>Total a pagar:</strong> ${formatPrice(orden.total)}</p>
      </div>
    `;
  }

  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const confirmar = confirm(
        "¿Deseas confirmar el pago y finalizar la compra?"
      );

      if (!confirmar) return;

      localStorage.removeItem(getCartKey());
      localStorage.removeItem("ordenPendiente");

      if (message) {
        message.textContent = "Pago realizado correctamente. Compra finalizada.";
      }

      setTimeout(() => {
        window.location.href = "productos.html";
      }, 1200);
    });
  }
});