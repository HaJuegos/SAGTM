import $ from "jquery";
import DataTable from "datatables.net-bs5";
import { Modal } from "bootstrap";

import { renderPageWithNavbar } from "../dashboard/dashboard";

import usuariosDash from "../../views/usuarios/main.html?raw";
import agregarUsuarioDash from "../../views/usuarios/agregar-modal.html?raw";
import editarUsuarioDash from "../../views/usuarios/editar-modal.html?raw";

/**
 * Datos de la tabla a guardar. Por defecto tendra algunos valores guardados de ejemplo.
 * @type {{id: number; nombre: string; usuario: string;}}
 */
let usuariosData = [
    { id: 1, nombre: "Ha", usuario: "superadmin" },
    { id: 2, nombre: "Ramiro Andre", usuario: "ramiroandres" },
    { id: 3, nombre: "Hiro Himada", usuario: "hirohamada" },
];

/**
 * Instanciado de la creacion de la datatable en concreto.
 * @type {DataTable | undefined}
 */
let dataTableInstance = undefined;

/**
 * Funcion principal encargada de controlar y inicializar la tabla principal de los cargos creados.
 * @returns {void}
 * @author HaJuegos - 17-10-2026
 */
function startDataTable() {
    const tableElement = document.getElementById("tabla-usuarios");

    if (tableElement) {
        if (dataTableInstance) {
            dataTableInstance.destroy();
        }

        dataTableInstance = new DataTable(tableElement, {
            data: usuariosData,
            columns: [
                {
                    data: null,
                    render: (data, type, row, meta) => {
                        return (meta.row + 1).toString();
                    },
                },
                { data: "nombre" },
                { data: "usuario" },
                {
                    data: null,
                    render: (data, type, row) => {
                        const btnEditar = `
                            <a class="btn-shine btn-editar" data-usuarioID="${row.id}" data-bs-toggle="tooltip" title="Editar Usuario">
                                <i class="bi bi-pencil-fill"></i>
                            </a>
                        `;

                        const btnEliminar = `
                            <a class="btn-shine btn-eliminar" data-usuarioID="${row.id}" data-bs-toggle="tooltip" title="Eliminar Usuario">
                                <i class="bi bi-trash-fill"></i>
                            </a>
                        `;

                        return `
                            <div class="d-flex gap-2 justify-content-center">
                                ${btnEditar} ${btnEliminar}
                            </div>
                        `;
                    },
                },
            ],
            layout: {
                topStart: "paging",
                top: null,
                topEnd: null,
                bottomEnd: null,
                bottomStart: null,
                bottom: null,
            },
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
            },
            responsive: true,
            destroy: true,
            paging: true,
            pageLength: 10,
            pagingType: "simple_numbers",
            search: false,
            columnDefs: [
                {
                    targets: "_all",
                    className: "text-center",
                },
            ],
        });

        dataTableInstance.on("draw", () => {
            const toolTipsList = document.querySelectorAll('#tabla-usuarios [data-bs-toggle="tooltip"]');

            toolTipsList.forEach((tooltipEl) => {
                if (window.bootstrap) {
                    new window.bootstrap.Tooltip(tooltipEl);
                }
            });
        });
    }
}

/**
 * Funcion principal encargada de la nueva creacion de nuevos usuarios en la pagina de usuarios.
 * @returns {void}
 * @author HaJuegos - 17-10-2026
 */
function crearUsuario() {
    const btnNewUsuario = document.getElementById("btn-crear-usuario");
    const btnGuardarUsuario = document.querySelector("#modal-crear-usuario #btn-crear-usuario");
    const formCrear = document.getElementById("form-crear-usuario");

    if (btnNewUsuario) {
        btnNewUsuario.onclick = () => {
            if (formCrear) {
                formCrear.reset();
            }

            const modalElement = document.getElementById("modal-crear-usuario");

            if (modalElement) {
                const modal = Modal.getOrCreateInstance(modalElement);

                modal.show();
            }
        };
    }

    if (btnGuardarUsuario) {
        btnGuardarUsuario.onclick = () => {
            /**
             * @type {string | undefined}
             */
            const uNombre = document.getElementById("input-usuario")?.value.trim() || "";

            if (!uNombre) {
                alert("Por favor ingrese al menos el nombre.");
                return;
            }

            const nuevoId = usuariosData.length > 0 ? Math.max(...usuariosData.map((e) => e.id)) + 1 : 1;

            usuariosData.push({
                id: nuevoId,
                nombre: uNombre,
                usuario: `${uNombre.toLowerCase()}${nuevoId}`,
            });

            const modalElement = document.getElementById("modal-crear-usuario");

            if (modalElement) {
                const modal = Modal.getOrCreateInstance(modalElement);

                modal.hide();
            }

            if (dataTableInstance) {
                dataTableInstance.clear();
                dataTableInstance.rows.add(usuariosData);
                dataTableInstance.draw();
            }
        };
    }
}

/**
 * Funcion principal encargada de la edicion de usuarios en la pagina de usuarios.
 * @returns {void}
 * @author HaJuegos - 17-10-2026
 */
function editarUsuario() {
    const tableContainer = document.getElementById("tabla-usuarios");

    if (tableContainer) {
        tableContainer.onclick = (e) => {
            const btnEditar = e.target.closest(".btn-editar");

            if (btnEditar) {
                const usuarioId = parseInt(btnEditar.getAttribute("data-usuarioID"), 10);
                const usuarioSeleccionado = usuariosData.find((u) => u.id == usuarioId);

                if (usuarioSeleccionado) {
                    const inputId = document.getElementById("input-usuario-id");
                    const inputNombreUsuario = document.getElementById("input-nombre-usuario");
                    const inputContrasena = document.getElementById("input-contrasena");

                    if (inputId) {
                        inputId.value = usuarioSeleccionado.id;
                    }

                    if (inputNombreUsuario) {
                        inputNombreUsuario.value = usuarioSeleccionado.usuario || "";
                    }

                    if (inputContrasena) {
                        inputContrasena.value = "";
                    }

                    const modalElement = document.getElementById("modal-editar-usuario");

                    if (modalElement) {
                        const modal = Modal.getOrCreateInstance(modalElement);

                        modal.show();
                    }
                }
            }

            const btnEliminar = e.target.closest(".btn-eliminar");

            if (btnEliminar) {
                const usuarioId = parseInt(btnEliminar.getAttribute("data-usuarioID"), 10);

                if (confirm(`¿Estás seguro de eliminar el usuario con ID ${usuarioId}?`)) {
                    usuariosData = usuariosData.filter((u) => u.id != usuarioId);

                    if (dataTableInstance) {
                        dataTableInstance.clear();
                        dataTableInstance.rows.add(usuariosData);
                        dataTableInstance.draw();
                    }
                }
            }
        };
    }

    const btnGuardarEditar = document.getElementById("btn-editar-usuario");

    if (btnGuardarEditar) {
        btnGuardarEditar.onclick = () => {
            const inputId = document.getElementById("input-usuario-id");
            const inputNombreUsuario = document.getElementById("input-nombre-usuario");
            const inputContrasena = document.getElementById("input-contrasena");

            const id = inputId ? parseInt(inputId.value, 10) : null;
            const usuarioNuevo = inputNombreUsuario ? inputNombreUsuario.value.trim() : "";
            const contrasenaNueva = inputContrasena ? inputContrasena.value.trim() : "";

            if (!usuarioNuevo) {
                alert("El nombre de usuario no puede estar vacío.");
                return;
            }

            const index = usuariosData.findIndex((u) => u.id == id);

            if (index != -1) {
                usuariosData[index] = {
                    ...usuariosData[index],
                    usuario: usuarioNuevo,
                    ...(contrasenaNueva && { password: contrasenaNueva }),
                };
            }

            const modalElement = document.getElementById("modal-editar-usuario");

            if (modalElement) {
                const modal = Modal.getOrCreateInstance(modalElement);

                modal.hide();
            }

            if (dataTableInstance) {
                dataTableInstance.clear();
                dataTableInstance.rows.add(usuariosData);
                dataTableInstance.draw();
            }
        };
    }
}

/**
 * Funcion principal que carga la pagina de Usuarios con una plantilla fija ya creada.
 * @returns {Function}
 * @author HaJuegos - 17-10-2026
 */
export function renderUsuarios() {
    const finalPage = usuariosDash + agregarUsuarioDash + editarUsuarioDash;

    return renderPageWithNavbar(finalPage, [startDataTable, crearUsuario, editarUsuario]);
}
