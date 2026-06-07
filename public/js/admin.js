document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://urban-moda-backend.onrender.com";

  const form = document.getElementById("productoForm");
  const adminProducts = document.getElementById("adminProducts");

  const productName = document.getElementById("productName");
  const productCategory = document.getElementById("productCategory");
  const productPrice = document.getElementById("productPrice");
  const productImage = document.getElementById("productImage");

  let productoEditandoId = null;

  const categorias = {
    Camisas: 4,
    Pantalones: 3,
    Buzos: 2,
    Chaquetas: 5,
    Blusas: 6,
    Faldas: 7
  };

  async function cargarProductos() {
    try {
      const response = await fetch(`${API_URL}/products`);
      const productos = await response.json();

      adminProducts.innerHTML = "";

      productos.forEach((producto) => {
        const id = producto.id || producto.id_producto;
        const nombre = producto.name || producto.nombre;
        const descripcion = producto.description || producto.descripcion || nombre;
        const precio = producto.price || producto.precio || 0;
        const imagen = producto.image || producto.imagen || "https://placehold.co/300x400";
        const categoria = producto.category || producto.nombre_categoria || "Sin categoría";
        const categoryId = producto.categoryId || producto.id_categoria || categorias[categoria];

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
          editarProducto(id, nombre, precio, categoryId, imagen);
        });

        card.querySelector(".btn-eliminar").addEventListener("click", () => {
          eliminarProducto(id);
        });

        adminProducts.appendChild(card);
      });
    } catch (error) {
      console.error("Error cargando productos:", error);
      alert("Error cargando productos");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = productName.value.trim();
    const precio = Number(productPrice.value);
    const imagen = productImage.value.trim();

    const categoriaSeleccionada =
      productCategory.options[productCategory.selectedIndex].text.trim();

    const idCategoria = Number(productCategory.value) || categorias[categoriaSeleccionada];

    if (!nombre) {
      alert("Ingresa el nombre del producto");
      return;
    }

    if (!idCategoria) {
      alert("Selecciona una categoría válida");
      return;
    }

    if (!precio) {
      alert("Ingresa el precio del producto");
      return;
    }

    const producto = {
      nombre: nombre,
      descripcion: nombre,
      precio: precio,
      stock: 10,
      imagen: imagen,
      id_categoria: idCategoria,

      name: nombre,
      description: nombre,
      price: precio,
      image: imagen,
      categoryId: idCategoria
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

  function editarProducto(id, nombre, precio, categoryId, imagen) {
    productoEditandoId = id;

    productName.value = nombre || "";
    productPrice.value = precio || "";
    productImage.value = imagen || "";
    productCategory.value = String(categoryId || "");
  }

  async function eliminarProducto(id) {
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
  }

  cargarProductos();
});