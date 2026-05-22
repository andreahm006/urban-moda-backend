document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  let productos = [];

  function actualizarContadorCarrito() {
    const cartCount = document.getElementById("cartCount");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (cartCount) {
      const cantidad = carrito.reduce((total, item) => {
        return total + Number(item.quantity || 1);
      }, 0);

      cartCount.textContent = cantidad;
    }
  }

  async function cargarProductos() {
    const response = await fetch("http://localhost:3000/products");
    productos = await response.json();
    mostrarProductos(productos);
    actualizarContadorCarrito();
  }

  function mostrarProductos(lista) {
    productsGrid.innerHTML = "";

    lista.forEach((producto) => {
      const nombre = producto.name || producto.nombre;
      const descripcion = producto.description || producto.descripcion || "Producto Urban Moda";
      const precio = producto.price || producto.precio || 0;
      const stock = producto.stock || 0;
      const categoria = producto.category || producto.nombre_categoria || "Ropa";
      const imagen = producto.image || producto.imagen || "https://placehold.co/300x400";
      const id = producto.id || producto.id_producto;

      const card = document.createElement("article");
      card.classList.add("product-card");

      card.innerHTML = `
        <div class="product-image">
          <img src="${imagen}" alt="${nombre}" style="width:100%; height:320px; object-fit:cover; border-radius:20px;">
        </div>

        <div class="product-content">
          <h3>${nombre}</h3>
          <div class="product-meta">
            <span>${categoria}</span>
            <span>Stock: ${stock}</span>
          </div>
          <p>${descripcion}</p>
          <div class="product-footer">
            <strong>$ ${Number(precio).toLocaleString()}</strong>
            <button onclick="agregarAlCarrito(${id})">Agregar al carrito</button>
          </div>
        </div>
      `;

      productsGrid.appendChild(card);
    });
  }

  function filtrarProductos() {
    const texto = searchInput.value.toLowerCase();
    const categoriaFiltro = categoryFilter.value;

    const filtrados = productos.filter((producto) => {
      const nombre = producto.name || producto.nombre || "";
      const categoria = producto.category || producto.nombre_categoria || "";

      return (
        nombre.toLowerCase().includes(texto) &&
        (
          categoriaFiltro === "todos" ||
          categoria.toLowerCase() === categoriaFiltro.toLowerCase()
        )
      );
    });

    mostrarProductos(filtrados);
  }

  window.agregarAlCarrito = function (id) {
    const producto = productos.find((p) => {
      return Number(p.id || p.id_producto) === Number(id);
    });

    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productoEnCarrito = carrito.find((item) => {
      return Number(item.id || item.id_producto) === Number(id);
    });

    if (productoEnCarrito) {
      productoEnCarrito.quantity = Number(productoEnCarrito.quantity || 1) + 1;
    } else {
      carrito.push({
        ...producto,
        quantity: 1
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();

    alert(`${producto.name || producto.nombre} agregado al carrito`);
  };

  searchInput.addEventListener("input", filtrarProductos);
  categoryFilter.addEventListener("change", filtrarProductos);

  actualizarContadorCarrito();
  cargarProductos();
});