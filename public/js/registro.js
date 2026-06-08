document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value.trim();

  const user = {
    password: password,
    email: email,
    role: "client",
    profile: {
      name: document.getElementById("name").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      avatar: "https://cdn.example.com/avatars/default.png"
    },
    client: {
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim()
    }
  };

  function mergeGuestCartToUser(loggedUser) {
    const guestCartKey = "carrito_guest";
    const userCartKey = loggedUser && loggedUser.id
      ? `carrito_user_${loggedUser.id}`
      : `carrito_user_${loggedUser.email}`;

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
    await apiRequest("/users", "POST", user);

    const loginData = await apiRequest("/auth/login", "POST", {
      email,
      password
    });

    const token = loginData.access_token || loginData.token;
    const loggedUser = loginData.user;

    if (token && loggedUser) {
      localStorage.setItem("token", token);
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      mergeGuestCartToUser(loggedUser);

      showMessage("Usuario creado correctamente. Sesión iniciada.");

      const redirectAfterLogin =
        localStorage.getItem("redirectAfterLogin") || null;

      localStorage.removeItem("redirectAfterLogin");

      setTimeout(() => {
        if (redirectAfterLogin) {
          window.location.href = redirectAfterLogin;
          return;
        }

        window.location.href = "productos.html";
      }, 900);
    } else {
      showMessage("Usuario creado, pero no se pudo iniciar sesión automáticamente.", true);
    }
  } catch (error) {
    showMessage(error.message, true);
  }
});