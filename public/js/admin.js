document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("productoForm");

  const adminProducts =
    document.getElementById("adminProducts");

  let productoEditandoId = null;

  async function cargarProductos() {

    const response =
      await fetch("http://localhost:3000/products");

    const productos =
      await response.json();

    adminProducts.innerHTML = "";

    productos.forEach((producto) => {

      adminProducts.innerHTML += `
      
        <div class="product-card">

          <img
            src="${producto.image || 'https://placehold.co/300x400'}"
            alt="${producto.name}"
          >

          <h3>${producto.name}</h3>

          <p>${producto.description}</p>

          <strong>$${producto.price}</strong>

          <br><br>

          <button onclick="editarProducto(
            ${producto.id},
            '${producto.name}',
            ${producto.price},
            ${producto.categoryId},
            '${producto.image || ""}'
          )">
            Editar
          </button>

          <button onclick="eliminarProducto(${producto.id})">
            Eliminar
          </button>

        </div>
      `;
    });
  }

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre =
      document.getElementById("productName").value;

    const categoria =
      document.getElementById("productCategory").value;

    const precio =
      document.getElementById("productPrice").value;

    const imagen =
      document.getElementById("productImage").value;

    let categoryId = 1;

    if (categoria === "camisetas") categoryId = 1;
    if (categoria === "pantalones") categoryId = 2;
    if (categoria === "buzos") categoryId = 3;
    if (categoria === "chaquetas") categoryId = 4;
    if (categoria === "blusas") categoryId = 5;

    const producto = {
      name: nombre,
      description: nombre,
      price: Number(precio),
      stock: 10,
      image: imagen,
      categoryId
    };

    let url = "http://localhost:3000/products";
    let method = "POST";

    if (productoEditandoId) {

      url =
        `http://localhost:3000/products/${productoEditandoId}`;

      method = "PATCH";
    }

    const response = await fetch(url, {

      method,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(producto)
    });

    if (!response.ok) {

      alert("Error guardando producto");

      return;
    }

    alert(
      productoEditandoId
        ? "Producto actualizado"
        : "Producto creado"
    );

    productoEditandoId = null;

    form.reset();

    cargarProductos();
  });

  window.editarProducto = function (
    id,
    nombre,
    precio,
    categoryId,
    imagen
  ) {

    productoEditandoId = id;

    document.getElementById("productName").value =
      nombre;

    document.getElementById("productPrice").value =
      precio;

    document.getElementById("productImage").value =
      imagen || "";

    let categoria = "camisetas";

    if (categoryId === 1) categoria = "camisetas";
    if (categoryId === 2) categoria = "pantalones";
    if (categoryId === 3) categoria = "buzos";
    if (categoryId === 4) categoria = "chaquetas";
    if (categoryId === 5) categoria = "blusas";

    document.getElementById("productCategory").value =
      categoria;
  };

  window.eliminarProducto = async function (id) {

    const confirmar =
      confirm("¿Eliminar producto?");

    if (!confirmar) return;

    await fetch(
      `http://localhost:3000/products/${id}`,
      {
        method: "DELETE"
      }
    );

    cargarProductos();
  };

  cargarProductos();

});