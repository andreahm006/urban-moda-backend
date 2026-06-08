document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  function showAdminMessage(text, isError = false) {
    if (!message) return;

    message.textContent = text;

    if (isError) {
      message.classList.add("error");
    } else {
      message.classList.remove("error");
    }
  }

  try {
    const data = await apiRequest("/auth/login", "POST", {
      email,
      password
    });

    const token = data.access_token || data.token;
    const user = data.user;

    if (!token || !user) {
      showAdminMessage("La API respondió, pero no devolvió token o usuario.", true);
      return;
    }

    if (user.role !== "admin") {
      showAdminMessage(
        "Acceso denegado. Este usuario no tiene permisos de administrador.",
        true
      );
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));

    showAdminMessage("Acceso administrador exitoso. Redirigiendo...");

    setTimeout(() => {
      window.location.href = "admin.html";
    }, 700);
  } catch (error) {
    showAdminMessage(
      error.message + " Verifica el correo, contraseña y que el backend esté activo.",
      true
    );
  }
});