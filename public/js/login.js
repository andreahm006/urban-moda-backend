document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  function mergeGuestCartToUser(user) {
    const guestCartKey = "carrito_guest";

    const userCartKey = user && user.id
      ? `carrito_user_${user.id}`
      : `carrito_user_${user.email}`;

    const guestCart = JSON.parse(localStorage.getItem(guestCartKey)) || [];
    const userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    guestCart.forEach((guestItem) => {
      const guestId = Number(guestItem.id || guestItem.id_producto);

      const existingItem = userCart.find((item) => {
        return Number(item.id || item.id_producto) === guestId;
      });

      if (existingItem) {
        existingItem.quantity =
          Number(existingItem.quantity || 1) + Number(guestItem.quantity || 1);
      } else {
        userCart.push(guestItem);
      }
    });

    localStorage.setItem(userCartKey, JSON.stringify(userCart));
    localStorage.removeItem(guestCartKey);
  }

  try {
    const data = await apiRequest("/auth/login", "POST", {
      email,
      password
    });

    const token = data.access_token || data.token;
    const user = data.user;

    if (!token || !user) {
      showMessage("La API respondió, pero no devolvió token o usuario.", true);
      return;
    }

    if (user.role === "admin") {
      showMessage(
        "Este usuario es administrador. Ingresa desde el acceso administrativo.",
        true
      );

      setTimeout(() => {
        window.location.href = "admin-login.html";
      }, 900);

      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));

    mergeGuestCartToUser(user);

    showMessage("Inicio de sesión exitoso. Redirigiendo...");

    const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
    localStorage.removeItem("redirectAfterLogin");

    setTimeout(() => {
      if (redirectAfterLogin) {
        window.location.href = redirectAfterLogin;
        return;
      }

      window.location.href = "productos.html";
    }, 700);
  } catch (error) {
    showMessage(
      error.message + " Verifica el correo, contraseña y que el backend esté activo.",
      true
    );
  }
});