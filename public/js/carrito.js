document.addEventListener("DOMContentLoaded", () => {
  const carritoLista = document.getElementById("carritoLista");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  const cuponInput = document.getElementById("cuponInput");
  const aplicarCuponBtn = document.getElementById("aplicarCupon");
  const finalizarCompraBtn = document.getElementById("finalizarCompra");
  const vaciarCarritoBtn = document.getElementById("vaciarCarrito");

  const paymentMethod = document.getElementById("paymentMethod");
  const paymentInfo = document.getElementById("paymentInfo");

  let descuento = 0;

  function getUser() {
    return JSON.parse(localStorage.getItem("user") || "null");
  }

  function getCartKey() {
    const user = getUser();

    if (user && user.id) {
      return `carrito_user_${user.id}`;
    }

    if (user && user.email) {
      return `carrito_user_${user.email}`;
    }

    return "carrito_guest";
  }

  function getCart() {
    const cartKey = getCartKey();
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  }

  function saveCart(cart) {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  function formatPrice(value) {
    return Number(value || 0).toLocaleString();
  }

  function actualizarContadorCarrito() {
    const cartCount = document.getElementById("cartCount");
    const carrito = getCart();

    if (cartCount) {
      const cantidad = carrito.reduce((total, item) => {
        return total + Number(item.quantity || 1);
      }, 0);

      cartCount.textContent = cantidad;
    }
  }

  function calcularSubtotal() {
    const carrito = getCart();

    return carrito.reduce((total, item) => {
      const precio = Number(item.price || item.precio || 0);
      const cantidad = Number(item.quantity || 1);

      return total + precio * cantidad;
    }, 0);
  }

  function actualizarTotales() {
    const subtotal = calcularSubtotal();
    const total = Math.max(subtotal - descuento, 0);

    if (subtotalEl) {
      subtotalEl.textContent = formatPrice(subtotal);
    }

    if (totalEl) {
      totalEl.textContent = formatPrice(total);
    }

    actualizarContadorCarrito();
  }

  function renderCarrito() {
    const carrito = getCart();

    if (!carritoLista) return;

    carritoLista.innerHTML = "";

    if (!carrito.length) {
      carritoLista.innerHTML = `
        <p style="padding: 20px;">
          Tu carrito está vacío.
        </p>
      `;

      descuento = 0;
      actualizarTotales();
      return;
    }

    carrito.forEach((item, index) => {
      const nombre = item.name || item.nombre || "Producto";
      const precio = Number(item.price || item.precio || 0);
      const cantidad = Number(item.quantity || 1);
      const imagen = item.image || item.imagen || "https://placehold.co/120x120";
      const subtotalProducto = precio * cantidad;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 18px;">
          <img
            src="${imagen}"
            alt="${nombre}"
            style="width: 90px; height: 90px; object-fit: cover; border-radius: 14px;"
          >

          <div>
            <h3>${nombre}</h3>
            <p>Precio: $ ${formatPrice(precio)}</p>
            <p>Cantidad: ${cantidad}</p>
            <p><strong>Subtotal:</strong> $ ${formatPrice(subtotalProducto)}</p>
          </div>
        </div>

        <div>
          <button type="button" class="btn-restar" data-index="${index}">-</button>
          <button type="button" class="btn-sumar" data-index="${index}">+</button>
          <button type="button" class="btn-eliminar" data-index="${index}">Eliminar</button>
        </div>
      `;

      carritoLista.appendChild(div);
    });

    document.querySelectorAll(".btn-restar").forEach((btn) => {
      btn.addEventListener("click", () => {
        restarProducto(Number(btn.dataset.index));
      });
    });

    document.querySelectorAll(".btn-sumar").forEach((btn) => {
      btn.addEventListener("click", () => {
        sumarProducto(Number(btn.dataset.index));
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", () => {
        eliminarProducto(Number(btn.dataset.index));
      });
    });

    actualizarTotales();
  }

  function sumarProducto(index) {
    const carrito = getCart();

    if (!carrito[index]) return;

    const stock = Number(carrito[index].stock || 0);
    const cantidadActual = Number(carrito[index].quantity || 1);

    if (stock > 0 && cantidadActual >= stock) {
      alert("No hay más unidades disponibles de este producto.");
      return;
    }

    carrito[index].quantity = cantidadActual + 1;

    saveCart(carrito);
    renderCarrito();
  }

  function restarProducto(index) {
    const carrito = getCart();

    if (!carrito[index]) return;

    const cantidadActual = Number(carrito[index].quantity || 1);

    if (cantidadActual <= 1) {
      carrito.splice(index, 1);
    } else {
      carrito[index].quantity = cantidadActual - 1;
    }

    saveCart(carrito);
    renderCarrito();
  }

  function eliminarProducto(index) {
    const carrito = getCart();

    if (!carrito[index]) return;

    carrito.splice(index, 1);

    saveCart(carrito);
    renderCarrito();
  }

  function aplicarCupon() {
    const codigo = cuponInput ? cuponInput.value.trim().toUpperCase() : "";

    const subtotal = calcularSubtotal();

    if (!subtotal) {
      alert("Tu carrito está vacío.");
      return;
    }

    if (codigo === "URBAN10") {
      descuento = Math.round(subtotal * 0.1);
      alert("Cupón aplicado correctamente. Descuento del 10%.");
    } else {
      descuento = 0;
      alert("Cupón no válido.");
    }

    actualizarTotales();
  }

  function actualizarInfoPago() {
    if (!paymentMethod || !paymentInfo) return;

    const metodo = paymentMethod.value;

    if (metodo === "contraentrega") {
      paymentInfo.textContent =
        "Pagarás el pedido al momento de recibirlo.";
      return;
    }

    if (metodo === "online") {
      paymentInfo.textContent =
        "Al finalizar serás redirigido a la pasarela de pagos.";
      return;
    }

    paymentInfo.textContent = "";
  }

  function finalizarCompra() {
    const user = getUser();
    const carrito = getCart();
    const metodoPago = paymentMethod ? paymentMethod.value : "";

    if (!carrito.length) {
      alert("Tu carrito está vacío.");
      return;
    }

    if (!user) {
      alert("Debes iniciar sesión para finalizar la compra.");
      window.location.href = "login.html";
      return;
    }

    if (!metodoPago) {
      alert("Selecciona un método de pago.");
      return;
    }

    const subtotal = calcularSubtotal();
    const total = Math.max(subtotal - descuento, 0);

    const orden = {
      usuario: user,
      productos: carrito,
      subtotal,
      descuento,
      total,
      metodoPago,
      fecha: new Date().toISOString()
    };

    if (metodoPago === "online") {
      localStorage.setItem("ordenPendiente", JSON.stringify(orden));
      window.location.href = "pasarela.html";
      return;
    }

    if (metodoPago === "contraentrega") {
      localStorage.removeItem(getCartKey());
      localStorage.removeItem("ordenPendiente");

      alert("Compra registrada correctamente. Pagarás al recibir tu pedido.");

      window.location.href = "productos.html";
    }
  }

  function vaciarCarrito() {
    const carrito = getCart();

    if (!carrito.length) {
      alert("Tu carrito ya está vacío.");
      return;
    }

    const confirmar = confirm("¿Deseas vaciar el carrito?");

    if (!confirmar) return;

    localStorage.removeItem(getCartKey());
    descuento = 0;

    renderCarrito();
  }

  if (aplicarCuponBtn) {
    aplicarCuponBtn.addEventListener("click", aplicarCupon);
  }

  if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener("click", finalizarCompra);
  }

  if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
  }

  if (paymentMethod) {
    paymentMethod.addEventListener("change", actualizarInfoPago);
  }

  actualizarContadorCarrito();
  actualizarInfoPago();
  renderCarrito();
});