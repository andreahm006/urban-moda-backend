document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const data = await apiRequest("/auth/login", "POST", { email, password });
    const token = data.access_token || data.token;

    if (token) {
      setToken(token);
      showMessage("Inicio de sesión exitoso. Redirigiendo...");
      setTimeout(() => {
        window.location.href = "productos.html";
      }, 700);
    } else {
      showMessage("La API respondió, pero no devolvió token.", true);
    }
  } catch (error) {
    showMessage(error.message + " Verifica que el backend esté encendido.", true);
  }
});
