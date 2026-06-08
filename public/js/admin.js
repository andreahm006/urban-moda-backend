document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://urban-moda-backend.onrender.com";

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "admin") {
    alert("Acceso permitido solo para administrador");
    window.location.href = "productos.html";
    return;
  }

  const form = document.getElementById("productoForm");
  const adminProducts = document.getElementById("adminProducts");

  const productName = document.getElementById("productName");
  const productDescription = document.getElementById("productDescription");
  const productCategory = document.getElementById("productCategory");
  const productPrice = document.getElementById("productPrice");
  const productStock = document.getElementById("productStock");
  const productImage = document.getElementById("productImage");

  const saveProductBtn = document.getElementById("saveProductBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  let productoEditandoId = null;

  function limpiarFormulario() {
    productoEditandoId = null;
    form.reset();

    if (saveProductBtn) {
      saveProductBtn.textContent = "Guardar producto";
    }

    if (cancelEditBtn) {
      cancelEditBtn.classList.add("hidden");
    }
  }

  async function cargarProductos() {
    if (!adminProducts) return;

    adminProducts.innerHTML = "<p>Cargando productos...</p>";

    try {
      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("No se pudieron cargar los productos");
      }

      const productos = await response.json();

      adminProducts.innerHTML = "";

      if (!productos.length) {
        adminProducts.innerHTML = "<p>No hay productos registrados.</p>";
        return;
      }

      productos.forEach((producto) => {
        const id = producto.id || producto.id_producto;
        const nombre = producto.name || producto.nombre || "Producto";
        const descripcion =
          producto.description ||
          producto.descripcion ||
          "Producto Urban Moda";

        const precio = producto.price || producto.precio || 0;
        const stock = producto.stock || 0;

        const categoria =
          producto.category ||
          producto.nombre_categoria ||
          "Sin categoría";

        const categoryId =
          producto.categoryId ||
          producto.id_categoria ||
          "";

        const imagen =
          producto.image ||
          producto.imagen ||
          "https://placehold.co/300x400";

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

            <p>${descripcion}</p>

            <p>
              <strong>Categoría:</strong> ${categoria}
            </p>

            <p>
              <strong>Stock:</strong> ${stock}
            </p>

            <strong>$ ${Number(precio).toLocaleString()}</strong>

            <br><br>

            <button type="button" class="btn-editar">
              Editar
            </button>

            <button type="button" class="btn-eliminar">
              Eliminar
            </button>
          </div>
        `;

        card.querySelector(".btn-editar").addEventListener("click", () => {
          productoEditandoId = id;

          productName.value = nombre || "";
          productDescription.value = descripcion || "";
          productCategory.value = String(categoryId || "");
          productPrice.value = precio || "";
          productStock.value = stock || "";
          productImage.value = imagen || "";

          if (saveProductBtn) {
            saveProductBtn.textContent = "Actualizar producto";
          }

          if (cancelEditBtn) {
            cancelEditBtn.classList.remove("hidden");
          }

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        });

        card.querySelector(".btn-eliminar").addEventListener("click", async () => {
          const confirmar = confirm(`¿Deseas eliminar el producto "${nombre}"?`);

          if (!confirmar) return;

          try {
            const response = await fetch(`${API_URL}/products/${id}`, {
              method: "DELETE"
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => null);
              console.error("Error del backend:", errorData);
              alert("Error eliminando producto");
              return;
            }

            alert("Producto eliminado correctamente");
            cargarProductos();
          } catch (error) {
            console.error("Error eliminando producto:", error);
            alert("Error eliminando producto");
          }
        });

        adminProducts.appendChild(card);
      });
    } catch (error) {
      console.error("Error cargando productos:", error);
      adminProducts.innerHTML = "<p>Error cargando productos.</p>";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = productName.value.trim();
    const descripcion = productDescription.value.trim();
    const categoryId = Number(productCategory.value);
    const precio = Number(productPrice.value);
    const stock = Number(productStock.value);
    const imagen = productImage.value.trim();

    if (!nombre) {
      alert("Ingresa el nombre del producto");
      return;
    }

    if (!descripcion) {
      alert("Ingresa la descripción del producto");
      return;
    }

    if (!categoryId) {
      alert("Selecciona una categoría");
      return;
    }

    if (!precio || precio <= 0) {
      alert("Ingresa un precio válido");
      return;
    }

    if (stock < 0 || Number.isNaN(stock)) {
      alert("Ingresa un stock válido");
      return;
    }

    const producto = {
      name: nombre,
      description: descripcion,
      price: precio,
      stock: stock,
      categoryId: categoryId,
      image: imagen
    };

    let url = `${API_URL}/products`;
    let method = "POST";

    if (productoEditandoId) {
      url = `${API_URL}/products/${productoEditandoId}`;
      method = "PUT";
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error del backend:", errorData);
        alert("Error guardando producto");
        return;
      }

      alert(
        productoEditandoId
          ? "Producto actualizado correctamente"
          : "Producto creado correctamente"
      );

      limpiarFormulario();
      cargarProductos();
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("Error guardando producto");
    }
  });

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      limpiarFormulario();
    });
  }

  cargarProductos();
});