const carritoLista = document.getElementById("carritoLista");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const aplicarCuponBtn = document.getElementById("aplicarCupon");
const finalizarCompraBtn = document.getElementById("finalizarCompra");
const vaciarCarritoBtn = document.getElementById("vaciarCarrito");

let descuento = 0;

function getCart() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function saveCart(cart) {
  localStorage.setItem("carrito", JSON.stringify(cart));
}

function formatPrice(value) {
  return "$ " + Number(value || 0).toLocaleString();
}

function showMessage(message) {
  alert(message);
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");

  if (!cartCount) return;

  const cart = getCart();

  const cantidad = cart.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);

  cartCount.textContent = cantidad;
}

function pintarCarrito() {
  const cart = getCart();
  carritoLista.innerHTML = "";

  if (cart.length === 0) {
    carritoLista.innerHTML = "<p>Tu carrito está vacío. Agrega productos desde el catálogo.</p>";
    actualizarTotales();
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    row.innerHTML = `
      <div class="cart-emoji">
        <img 
          src="${item.image || item.imagen || 'https://placehold.co/100x100'}" 
          alt="${item.name || item.nombre}"
          style="width:90px;height:90px;object-fit:cover;border-radius:12px;"
        >
      </div>

      <div>
        <h3>${item.name || item.nombre}</h3>
        <p>${formatPrice(item.price || item.precio)} c/u</p>

        <div class="qty-controls">
          <button onclick="cambiarCantidad(${item.id || item.id_producto}, -1)">-</button>
          <strong>${item.quantity || 1}</strong>
          <button onclick="cambiarCantidad(${item.id || item.id_producto}, 1)">+</button>
        </div>
      </div>

      <button class="remove-btn" onclick="eliminarItem(${item.id || item.id_producto})">
        Eliminar
      </button>
    `;

    carritoLista.appendChild(row);
  });

  actualizarTotales();
}

function actualizarTotales() {
  const cart = getCart();

  const subtotal = cart.reduce((total, item) => {
    return total + Number(item.price || item.precio || 0) * Number(item.quantity || 1);
  }, 0);

  const total = Math.max(subtotal - descuento, 0);

  subtotalEl.textContent = formatPrice(subtotal);
  totalEl.textContent = formatPrice(total);

  updateCartCount();
}

function cambiarCantidad(id, cambio) {
  const cart = getCart();

  const item = cart.find((producto) => {
    return Number(producto.id || producto.id_producto) === Number(id);
  });

  if (!item) return;

  item.quantity = Number(item.quantity || 1) + cambio;

  if (item.quantity <= 0) {
    const nuevoCart = cart.filter((producto) => {
      return Number(producto.id || producto.id_producto) !== Number(id);
    });

    saveCart(nuevoCart);
  } else {
    saveCart(cart);
  }

  pintarCarrito();
}

function eliminarItem(id) {
  const cart = getCart().filter((item) => {
    return Number(item.id || item.id_producto) !== Number(id);
  });

  saveCart(cart);
  pintarCarrito();
}

aplicarCuponBtn.addEventListener("click", () => {
  const code = document.getElementById("cupon").value.trim().toUpperCase();

  if (!code) {
    showMessage("Escribe un cupón.");
    return;
  }

  if (code === "URBAN10") {
    const subtotal = getCart().reduce((total, item) => {
      return total + Number(item.price || item.precio || 0) * Number(item.quantity || 1);
    }, 0);

    descuento = subtotal * 0.10;

    showMessage("Cupón URBAN10 aplicado con 10% de descuento.");
    actualizarTotales();
    return;
  }

  showMessage("Cupón no válido.");
});

finalizarCompraBtn.addEventListener("click", async () => {
  const cart = getCart();

  if (cart.length === 0) {
    showMessage("El carrito está vacío.");
    return;
  }

  try {
    const response = await fetch("https://urban-moda-backend.onrender.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        clientId: 1,
        status: "pendiente",
        items: cart.map((item) => ({
          id: item.id || item.id_producto,
          quantity: item.quantity || 1,
          price: item.price || item.precio || 0
        }))
      })
    });

    if (!response.ok) {
      throw new Error("Error guardando pedido");
    }

    saveCart([]);
    descuento = 0;
    pintarCarrito();

    showMessage("Compra guardada correctamente en la base de datos.");

  } catch (error) {
    console.error(error);
    showMessage("Error: la compra no se pudo guardar en la base de datos.");
  }
});

vaciarCarritoBtn.addEventListener("click", () => {
  saveCart([]);
  descuento = 0;
  pintarCarrito();
  showMessage("Carrito vacío.");
});

pintarCarrito();