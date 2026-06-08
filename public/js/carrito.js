document.addEventListener("DOMContentLoaded", () => {
  const carritoLista = document.getElementById("carritoLista");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const aplicarCuponBtn = document.getElementById("aplicarCupon");
  const finalizarCompraBtn = document.getElementById("finalizarCompra");
  const vaciarCarritoBtn = document.getElementById("vaciarCarrito");
  const cuponInput = document.getElementById("cupon");
  const cartCount = document.getElementById("cartCount");
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

  function saveCart(carrito) {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(carrito));
  }

  function formatPrice(value) {
    return "$ " + Number(value || 0).toLocaleString();
  }

  function actualizarContadorCarrito() {
    const carrito = getCart();

    if (cartCount) {
      const cantidad = carrito.reduce((total, item) => {
        return total + Number(item.quantity || 1);
      }, 0);

      cartCount.textContent = cantidad;
    }
  }

  function calcularSubtotal(carrito) {
    return carrito.reduce((total, item) => {
      const precio = Number(item.price || item.precio || 0);
      const cantidad = Number(item.quantity || 1);

      return total + precio * cantidad;
    }, 0);
  }

  function renderCarrito() {
    const carrito = getCart();

    if (!carritoLista) return;

    carritoLista.innerHTML = "";

    if (carrito.length === 0) {
      carritoLista.innerHTML = `
        <p style="padding: 20px;">
          Tu carrito está vacío.
        </p>
      `;

      if (subtotalEl) subtotalEl.textContent = formatPrice(0);
      if (totalEl) totalEl.textContent = formatPrice(0);

      actualizarContadorCarrito();
      return;
    }

    carrito.forEach((item, index) => {
      const nombre = item.name || item.nombre || "Producto";
      const precio = Number(item.price || item.precio || 0);
      const cantidad = Number(item.quantity || 1);
      const imagen = item.image || item.imagen || "https://placehold.co/120x120";
      const subtotalProducto = precio * cantidad;

      const itemDiv = document.createElement("article");
      itemDiv.classList.add("cart-item");

      itemDiv.innerHTML = `
        <div style="display:flex; gap:16px; align-items:center;">
          <img 
            src="${imagen}" 
            alt="${nombre}" 
            style="width:90px; height:90px; object-fit:cover; border-radius:16px;"
          >

          <div>
            <h3>${nombre}</h3>
            <p>Precio: ${formatPrice(precio)}</p>
            <p>Cantidad: ${cantidad}</p>
            <strong>Subtotal: ${formatPrice(subtotalProducto)}</strong>
          </div>
        </div>

        <div style="display:flex; gap:8px; align-items:center;">
          <button type="button" onclick="disminuirCantidad(${index})">-</button>
          <button type="button" onclick="aumentarCantidad(${index})">+</button>
          <button type="button" onclick="eliminarProductoCarrito(${index})">Eliminar</button>
        </div>
      `;

      carritoLista.appendChild(itemDiv);
    });

    const subtotal = calcularSubtotal(carrito);
    const total = subtotal - descuento;

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (totalEl) totalEl.textContent = formatPrice(total < 0 ? 0 : total);

    actualizarContadorCarrito();
  }

  function mostrarInfoPago() {
    if (!paymentMethod || !paymentInfo) return;

    const metodo = paymentMethod.value;

    if (metodo === "contraentrega") {
      paymentInfo.textContent =
        "Pagarás el pedido al momento de recibirlo.";
    } else if (metodo === "online") {
      paymentInfo.textContent =
        "Al finalizar serás redirigido a la pasarela de pagos simulada.";
    } else {
      paymentInfo.textContent = "";
    }
  }

  window.aumentarCantidad = function (index) {
    const carrito = getCart();

    if (!carrito[index]) return;

    carrito[index].quantity = Number(carrito[index].quantity || 1) + 1;

    saveCart(carrito);
    renderCarrito();
  };

  window.disminuirCantidad = function (index) {
    const carrito = getCart();

    if (!carrito[index]) return;

    carrito[index].quantity = Number(carrito[index].quantity || 1) - 1;

    if (carrito[index].quantity <= 0) {
      carrito.splice(index, 1);
    }

    saveCart(carrito);
    renderCarrito();
  };

  window.eliminarProductoCarrito = function (index) {
    const carrito = getCart();

    carrito.splice(index, 1);

    saveCart(carrito);
    renderCarrito();
  };

  if (paymentMethod) {
    paymentMethod.addEventListener("change", mostrarInfoPago);
  }

  if (aplicarCuponBtn) {
    aplicarCuponBtn.addEventListener("click", () => {
      const cupon = cuponInput ? cuponInput.value.trim().toUpperCase() : "";

      if (cupon === "URBAN10") {
        const subtotal = calcularSubtotal(getCart());
        descuento = subtotal * 0.1;
        alert("Cupón aplicado: 10% de descuento");
      } else {
        descuento = 0;
        alert("Cupón inválido");
      }

      renderCarrito();
    });
  }

  if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener("click", () => {
      const confirmar = confirm("¿Deseas vaciar el carrito?");

      if (!confirmar) return;

      saveCart([]);
      descuento = 0;
      renderCarrito();
    });
  }

  if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener("click", () => {
      const carrito = getCart();

      if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
      }

      const user = getUser();

      if (!user) {
        const irLogin = confirm(
          "Para finalizar la compra debes iniciar sesión o registrarte. Tu carrito se conservará."
        );

        if (irLogin) {
          localStorage.setItem("redirectAfterLogin", "carrito.html");
          window.location.href = "login.html";
        }

        return;
      }

      const metodoPago = paymentMethod ? paymentMethod.value : "";

      if (!metodoPago) {
        alert("Selecciona un método de pago antes de finalizar la compra");
        return;
      }

      const subtotal = calcularSubtotal(carrito);
      const total = subtotal - descuento;

      const orden = {
        usuario: user,
        productos: carrito,
        metodoPago,
        subtotal,
        descuento,
        total: total < 0 ? 0 : total,
        fecha: new Date().toLocaleString()
      };

      localStorage.setItem("ordenPendiente", JSON.stringify(orden));

      if (metodoPago === "online") {
        window.location.href = "pasarela.html";
        return;
      }

      if (metodoPago === "contraentrega") {
        alert("Compra finalizada correctamente. Pagarás al recibir tu pedido.");

        saveCart([]);
        descuento = 0;
        localStorage.removeItem("ordenPendiente");
        renderCarrito();
      }
    });
  }

  renderCarrito();
});