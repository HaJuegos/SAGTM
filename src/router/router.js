import { renderPageWithNavbar } from "../js/dashboard/dashboard";
import { renderCargos } from "../js/cargos/cargos";
import { renderLogin } from "../js/login/login";
import { renderEmpleados } from "../js/empleados/empleados";
import { renderUsuarios } from "../js/usuarios/usuarios";

/**
 * Lista de rutas disponibles en la aplicacion.
 * @type {Record<string, Function>}
 * @author HaJuegos - 16-10-2026
 */
const routes = {
    "#/": renderLogin,
    "#/dashboard": renderPageWithNavbar,
    "#/empleados": renderEmpleados,
    "#/cargos": renderCargos,
    "#/usuarios": renderUsuarios,
};

/**
 * Funcion principal que controla los eventos de las rutas permitidas en la aplicacion en concreto.
 * @returns {void}
 * @author HaJuegos - 16-10-2026
 */
export function startRoutes() {
    const appContainer = document.getElementById("app");

    /**
     * Funcion auxiliar que obtiene todas las vistas indexadas para mostrar el contenido por ruta establecida.
     * @returns {void}
     * @author HaJuegos - 16-10-2026
     */
    const manageRoutes = () => {
        const path = window.location.hash || "#/";
        const renderPage =
            routes[path] ||
            (() => {
                page: "";
                events: [];
            });

        const viewData = renderPage();

        appContainer.innerHTML = viewData.page;

        if (viewData.events && Array.isArray(viewData.events)) {
            viewData.events.forEach((ev) => {
                ev();
            });
        }
    };

    window.addEventListener("hashchange", manageRoutes);
    manageRoutes();
}
