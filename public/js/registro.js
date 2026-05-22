document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    password: document.getElementById("password").value,
    email: document.getElementById("email").value.trim(),
    role: "client",
    profile: {
      name: document.getElementById("name").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      avatar: "https://cdn.example.com/avatars/default.png"
    },
    client: {
      userId: 1,
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim()
    }
  };

  try {
    await apiRequest("/users", "POST", user);
    showMessage("Usuario creado correctamente. Ya puedes iniciar sesión.");
    e.target.reset();
  } catch (error) {
    showMessage(error.message + " Si no tienes token admin, registra desde Postman o ajusta permisos.", true);
  }
});
