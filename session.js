const SESSION_KEY = "dangels_print_studio_authenticated";

if (sessionStorage.getItem(SESSION_KEY) !== "true") {
    window.location.replace("./index.html");
}

function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace("./index.html");
}
