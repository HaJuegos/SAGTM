import loginHTML from "../../views/login/login.html?raw";

/**
 * Eventos que suceden cuando se da click a iniciar sesion en el login.
 * @returns {void}
 * @author HaJuegos - 16-10-2026
 */
function formLoginEvents() {
    const form = document.getElementById("iniciar-sesion-form");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const userTest = document.getElementById("usuario-input");
            const passTest = document.getElementById("contrasena-input");

            window.location.hash = "#/dashboard";
        });
    }
}

/**
 * Funcion auxiliar que cambia el estado visible del campo de contraseña.
 * @returns {void}
 * @author HaJuegos - 16-10-2026
 */
function viewPassword() {
    const btnToggle = document.getElementById("btn-toggle-pass");
    const passInput = document.getElementById("contrasena-input");

    if (btnToggle && passInput) {
        btnToggle.addEventListener("click", () => {
            const type = passInput.getAttribute("type") == "password" ? "text" : "password";

            passInput.setAttribute("type", type);

            btnToggle.classList.toggle("bi-eye");
            btnToggle.classList.toggle("bi-eye-slash");
        });
    }
}

/**
 * Funcion principal que devuelve el contenido HTML de la pagina de login en formato string para el correcto funcionamiento de la pagina.
 * @returns {{page: string, events: Function[]}}
 * @author HaJuegos - 16-10-2026
 */
export function renderLogin() {
    return {
        page: loginHTML,
        events: [formLoginEvents, viewPassword],
    };
}
