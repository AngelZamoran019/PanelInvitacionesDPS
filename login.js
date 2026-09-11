const LOGIN_USER = "dangelsps";

/*
 * Local development only.
 * Set the password in your local copy. Do not commit the real password.
 */
const LOGIN_PASSWORD = "CAMBIA_ESTA_CONTRASENA_LOCALMENTE";
const SESSION_KEY = "dangels_print_studio_authenticated";

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const error = document.getElementById("loginError");

    error.textContent = "";

    if (username === LOGIN_USER && password === LOGIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, "true");
        window.location.href = "./panel.html";
        return;
    }

    error.textContent = "Usuario o contraseña incorrectos.";
});
