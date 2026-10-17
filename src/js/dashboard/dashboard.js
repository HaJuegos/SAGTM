import navBaseDash from "../../views/dashboard/base.html?raw";
import baseDash from "../../views/dashboard/dashboard.html?raw";

/**
 * Funcion auxiliar que añade dinamicamente el contenido de las tarjetas de la dasboard despues de la navbar.
 * @param {string} [idContent] (Opcional) ID del div donde iran las tarjetas. Por defecto ya tiene uno asignado.
 * @returns {void}
 * @author HaJuegos - 17-10-2026
 */
function getContentDash(idContent = "dashboard-contenido") {
    const elementDash = document.getElementById(idContent);

    if (elementDash) {
        elementDash.innerHTML = baseDash;
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
 * Funcion principal que devuelve el contenido HTML de la pagina del dashboard en formato string para el correcto funcionamiento de la pagina.
 * @returns {{page: string, events: Function[]}}
 * @author HaJuegos - 17-10-2026
 */
export function renderDashboard() {
    return {
        page: navBaseDash,
        events: [getContentDash, changeThemeSensor],
    };
}
