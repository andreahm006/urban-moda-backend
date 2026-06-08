document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://urban-moda-backend.onrender.com";

  const productsGrid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  const catalogTag = document.getElementById("catalogTag");
  const catalogTitle = document.getElementById("catalogTitle");
  const catalogDescription = document.getElementById("catalogDescription");

  let productos = [];

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function normalizeCategory(value) {
    const categoria = normalizeText(value);

    if (categoria.includes("camisa")) return "camisas";
    if (categoria.includes("pantal")) return "pantalones";
    if (categoria.includes("buzo")) return "buzos";
    if (categoria.includes("chaqueta")) return "chaquetas";
    if (categoria.includes("blusa")) return "blusas";
    if (categoria.includes("falda")) return "faldas";
    if (categoria.includes("outlet")) return "outlet";

    return categoria || "todos";
  }

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

  function obtenerDisponibilidad(stock) {
    const cantidad = Number(stock || 0);

    if (cantidad <= 0) {
      return "Agotado";
    }

    if (cantidad <= 3) {
      return "Últimas unidades";
    }

    return "Disponible";
  }

  function actualizarTituloCatalogo(categoria) {
    if (!catalogTag || !catalogTitle || !catalogDescription) return;

    const categoriaNormalizada = normalizeCategory(categoria);

    if (categoriaNormalizada === "camisas") {
      catalogTag.textContent = "CAMISAS";
      catalogTitle.textContent = "Camisas urbanas";
      catalogDescription.textContent =
        "Básicas, estampadas, urbanas y fáciles de combinar.";
      return;
    }

    if (categoriaNormalizada === "pantalones") {
      catalogTag.textContent = "PANTALONES";
      catalogTitle.textContent = "Pantalones disponibles";
      catalogDescription.textContent =
        "Joggers, jeans y estilos cómodos para el día a día.";
      return;
    }

    if (categoriaNormalizada === "buzos") {
      catalogTag.textContent = "BUZOS";
      catalogTitle.textContent = "Buzos urbanos";
      catalogDescription.textContent =
        "Prendas cómodas, modernas y perfectas para looks casuales.";
      return;
    }

    if (categoriaNormalizada === "chaquetas") {
      catalogTag.textContent = "CHAQUETAS";
      catalogTitle.textContent = "Chaquetas con estilo";
      catalogDescription.textContent =
        "Prendas con actitud para elevar cualquier outfit.";
      return;
    }

    if (categoriaNormalizada === "blusas") {
      catalogTag.textContent = "BLUSAS";
      catalogTitle.textContent = "Blusas disponibles";
      catalogDescription.textContent =
        "Diseños frescos, femeninos y fáciles de combinar.";
      return;
    }

    if (categoriaNormalizada === "faldas") {
      catalogTag.textContent = "FALDAS";
      catalogTitle.textContent = "Faldas urbanas";
      catalogDescription.textContent =
        "Prendas modernas para looks casuales y sofisticados.";
      return;
    }

    if (categoriaNormalizada === "outlet") {
      catalogTag.textContent = "OUTLET";
      catalogTitle.textContent = "Outlet urbano";
      catalogDescription.textContent =
        "Prendas seleccionadas con precios especiales.";
      return;
    }

    catalogTag.textContent = "CATÁLOGO";
    catalogTitle.textContent = "Productos disponibles";
    catalogDescription.textContent =
      "Prendas con estilo urbano, colores neutros y uso familiar.";
  }

  async function cargarProductos() {
    try {
      if (productsGrid) {
        productsGrid.innerHTML = "<p>Cargando productos...</p>";
      }

      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("No se pudieron cargar los productos");
      }

      productos = await response.json();

      const params = new URLSearchParams(window.location.search);
      const categoriaURL = params.get("categoria");
      const categoriaSeleccionada = categoriaURL
        ? normalizeCategory(categoriaURL)
        : "todos";

      if (categoryFilter) {
        categoryFilter.value = categoriaSeleccionada;
      }

      actualizarTituloCatalogo(categoriaSeleccionada);
      filtrarProductos();

      actualizarContadorCarrito();
    } catch (error) {
      console.error("Error cargando productos:", error);

      if (productsGrid) {
        productsGrid.innerHTML = `
          <p style="padding: 20px;">
            No se pudieron cargar los productos. Intenta nuevamente.
          </p>
        `;
      }
    }
  }

  function mostrarProductos(lista) {
    if (!productsGrid) return;

    productsGrid.innerHTML = "";

    if (!lista || lista.length === 0) {
      productsGrid.innerHTML = `
        <p style="padding: 20px;">
          No hay productos disponibles para mostrar.
        </p>
      `;
      return;
    }

    lista.forEach((producto) => {
      const id = producto.id || producto.id_producto;

      const nombre =
        producto.name ||
        producto.nombre ||
        "Producto";

      const descripcion =
        producto.description ||
        producto.descripcion ||
        "Producto Urban Moda";

      const precio =
        producto.price ||
        producto.precio ||
        0;

      const stock = Number(producto.stock || 0);

      const categoria =
        producto.category ||
        producto.nombre_categoria ||
        "Sin categoría";

      const imagen =
        producto.image ||
        producto.imagen ||
        "https://placehold.co/300x400";

      const disponibilidad = obtenerDisponibilidad(stock);

      const card = document.createElement("article");
      card.classList.add("product-card");

      card.innerHTML = `
        <div class="product-image">
          <img
            src="${imagen}"
            alt="${nombre}"
          >
        </div>

        <div class="product-content">
          <h3>${nombre}</h3>

          <div class="product-meta">
            <span>${categoria}</span>
            <span>${disponibilidad}</span>
          </div>

          <p>${descripcion}</p>

          <div class="product-footer">
            <strong>$ ${Number(precio).toLocaleString()}</strong>

            <button
              type="button"
              onclick="agregarAlCarrito(${id})"
              ${stock <= 0 ? "disabled" : ""}
            >
              ${stock <= 0 ? "Agotado" : "Agregar al carrito"}
            </button>
          </div>
        </div>
      `;

      productsGrid.appendChild(card);
    });
  }

  function filtrarProductos() {
    const texto = searchInput ? normalizeText(searchInput.value) : "";

    const categoriaFiltro = categoryFilter
      ? normalizeCategory(categoryFilter.value)
      : "todos";

    actualizarTituloCatalogo(categoriaFiltro);

    const filtrados = productos.filter((producto) => {
      const nombre = normalizeText(
        producto.name ||
        producto.nombre ||
        ""
      );

      const descripcion = normalizeText(
        producto.description ||
        producto.descripcion ||
        ""
      );

      const categoriaProducto = normalizeCategory(
        producto.category ||
        producto.nombre_categoria ||
        ""
      );

      const coincideTexto =
        nombre.includes(texto) ||
        descripcion.includes(texto);

      const coincideCategoria =
        categoriaFiltro === "todos" ||
        categoriaProducto === categoriaFiltro;

      return coincideTexto && coincideCategoria;
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

    const stock = Number(producto.stock || 0);

    if (stock <= 0) {
      alert("Este producto no está disponible");
      return;
    }

    let carrito = getCart();

    const productoEnCarrito = carrito.find((item) => {
      return Number(item.id || item.id_producto) === Number(id);
    });

    if (productoEnCarrito) {
      const nuevaCantidad = Number(productoEnCarrito.quantity || 1) + 1;

      if (nuevaCantidad > stock) {
        alert("No hay más unidades disponibles de este producto");
        return;
      }

      productoEnCarrito.quantity = nuevaCantidad;
    } else {
      carrito.push({
        ...producto,
        quantity: 1
      });
    }

    saveCart(carrito);
    actualizarContadorCarrito();

    alert(`${producto.name || producto.nombre} agregado al carrito`);
  };

  if (searchInput) {
    searchInput.addEventListener("input", filtrarProductos);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      const categoria = normalizeCategory(categoryFilter.value);
      actualizarTituloCatalogo(categoria);
      filtrarProductos();
    });
  }

  actualizarContadorCarrito();
  cargarProductos();
});