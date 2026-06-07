document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://urban-moda-backend.onrender.com";

  const form = document.getElementById("productoForm");
  const adminProducts = document.getElementById("adminProducts");

  const productName = document.getElementById("productName");
  const productCategory = document.getElementById("productCategory");
  const productPrice = document.getElementById("productPrice");
  const productImage = document.getElementById("productImage");

  let productoEditandoId = null;

  async function cargarProductos() {
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
        const id = producto.id;
        const nombre = producto.name;
        const descripcion = producto.description || producto.name;
        const precio = producto.price || 0;
        const categoria = producto.category || "Sin categoría";
        const categoryId = producto.categoryId;
        const imagen = producto.image || "https://placehold.co/300x400";

        const card = document.createElement("article");
        card.classList.add("product-card");

        card.innerHTML = `
          <div class="product-image">
            <img
              src="${imagen}"
              alt="${nombre}"
              style="width:100%; height:300px; object-fit:cover; border-radius:20px;"
            >
          </div>

          <div class="product-content">
            <h3>${nombre}</h3>
            <p>${descripcion}</p>
            <p><strong>Categoría:</strong> ${categoria}</p>
            <strong>$ ${Number(precio).toLocaleString()}</strong>

            <br><br>

            <button type="button" class="btn-editar">Editar</button>
            <button type="button" class="btn-eliminar">Eliminar</button>
          </div>
        `;

        card.querySelector(".btn-editar").addEventListener("click", () => {
          productoEditandoId = id;

          productName.value = nombre || "";
          productCategory.value = String(categoryId || "");
          productPrice.value = precio || "";
          productImage.value = imagen || "";

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        });

        card.querySelector(".btn-eliminar").addEventListener("click", async () => {
          const confirmar = confirm("¿Eliminar producto?");

          if (!confirmar) return;

          try {
            const response = await fetch(`${API_URL}/products/${id}`, {
              method: "DELETE"
            });

            if (!response.ok) {
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
    const categoryId = Number(productCategory.value);
    const precio = Number(productPrice.value);
    const imagen = productImage.value.trim();

    if (!nombre) {
      alert("Ingresa el nombre del producto");
      return;
    }

    if (!categoryId) {
      alert("Selecciona una categoría");
      return;
    }

    if (!precio) {
      alert("Ingresa el precio del producto");
      return;
    }

    const producto = {
      name: nombre,
      description: nombre,
      price: precio,
      stock: 10,
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

      productoEditandoId = null;
      form.reset();
      cargarProductos();
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("Error guardando producto");
    }
  });

  cargarProductos();
});