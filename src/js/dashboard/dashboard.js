import navBaseDash from "../../views/dashboard/base.html?raw";
import baseDash from "../../views/dashboard/dashboard.html?raw";

/**
 * Funcion auxiliar que añade dinamicamente el contenido de las tarjetas de la dasboard despues de la navbar.
 * @param {string} data Pagina base a adicciona despues del navbar añadido en cuestion.
 * @param {string} [idContent] (Opcional) ID del div donde iran las tarjetas. Por defecto ya tiene uno asignado.
 * @returns {void}
 * @author HaJuegos - 17-10-2026
 */
function setDataAfterNavbar(data, idContent = "dashboard-contenido") {
    const elementDash = document.getElementById(idContent);

    if (elementDash) {
        elementDash.innerHTML = data;
    }
}

/**
 * Funcion auxiliar principal encarga de hacer funcional el boton de cambiar tema del dashboard
 * @returns {void}
 * @author HaJuegos - 17-10-2026
 */
function changeThemeSensor() {
    const themeBtn = document.getElementById("btn-theme-toggle");

    if (themeBtn) {
        const savedTheme = localStorage.getItem("theme") || document.documentElement.getAttribute("data-bs-theme") || "light";

        document.documentElement.setAttribute("data-bs-theme", savedTheme);

        themeBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-bs-theme");
            const newTheme = currentTheme == "dark" ? "light" : "dark";

            document.documentElement.setAttribute("data-bs-theme", newTheme);

            localStorage.setItem("theme", newTheme);
        });
    }

    const toolTipsList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

    toolTipsList.forEach((tooltipEl) => {
        if (window.bootstrap) {
            new window.bootstrap.Tooltip(tooltipEl);
        }
    });
}

/**
 * Funcion principal auxiliar que carga por defecto una plantilla base con el navbar adiccional por defecto para reusarlo sin tantas complicaciones. Por defecto, cargara la plantilla de la dashboard si no se cambian sus valores.
 * @param {string} [basePage] (Opcional) Contenido base de la pagina a mostrar adiccionalmente al navbar. Por defecto siempre sera el dashboard.
 * @param {Function[]} [aditionalEvents] (Opcional) Eventos adiccionales que se añaden a la plantilla base, si se requiere. Por defecto no se requieren funciones adiccionales a ejecutar. Osea es un array vacio.
 * @returns {{page: string, events: Function[]}}
 * @author HaJuegos - 17-10-2026
 */
export function renderPageWithNavbar(basePage = baseDash, aditionalEvents = []) {
    return {
        page: navBaseDash,
        events: [() => setDataAfterNavbar(basePage), changeThemeSensor, ...aditionalEvents],
    };
}
