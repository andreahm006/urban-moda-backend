document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const data = await apiRequest("/auth/login", "POST", {
      email,
      password
    });

    const token = data.access_token || data.token;
    const user = data.user;

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showMessage("Inicio de sesión exitoso. Redirigiendo...");

      setTimeout(() => {
        if (user.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "productos.html";
        }
      }, 700);
    } else {
      showMessage("La API respondió, pero no devolvió token o usuario.", true);
    }
  } catch (error) {
    showMessage(error.message + " Verifica que el backend esté encendido.", true);
  }
});