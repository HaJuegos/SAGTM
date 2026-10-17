import $ from "jquery";
import DataTable from "datatables.net-bs5";
import { Modal } from "bootstrap";

import { renderPageWithNavbar } from "../dashboard/dashboard";

import cargosDash from "../../views/cargos/main.html?raw";
import agregarCargoDash from "../../views/cargos/agregar-modal.html?raw";
import editarCargoDash from "../../views/cargos/editar-modal.html?raw";

/**
 * Datos de la tabla a guardar. Por defecto tendra algunos valores guardados de ejemplo.
 * @type {{id: number; nombre: string;}}
 */
let cargosData = [
    { id: 1, nombre: "Jefe" },
    { id: 2, nombre: "Administrador" },
    { id: 3, nombre: "Usuario" },
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
    const tableElement = document.getElementById("tabla-cargo");

    if (tableElement) {
        if (dataTableInstance) {
            dataTableInstance.destroy();
        }

        dataTableInstance = new DataTable(tableElement, {
            data: cargosData,
            columns: [
                {
                    data: null,
                    render: (data, type, row, meta) => {
                        return (meta.row + 1).toString();
                    },
                },
                { data: "nombre" },
                {
                    data: null,
                    render: (data, type, row) => {
                        const btnEditar = `
                            <a class="btn-shine btn-editar" data-cargoID="${row.id}" data-bs-toggle="tooltip" title="Editar Cargo">
                                <i class="bi bi-pencil-fill"></i>
                            </a>
                        `;

                        const btnEliminar = `
                            <a class="btn-shine btn-eliminar" data-cargoID="${row.id}" data-bs-toggle="tooltip" title="Eliminar Cargo">
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
            const toolTipsList = document.querySelectorAll('#tabla-cargo [data-bs-toggle="tooltip"]');

            toolTipsList.forEach((tooltipEl) => {
                if (window.bootstrap) {
                    new window.bootstrap.Tooltip(tooltipEl);
                }
            });
        });
    }
}

/**
 * Funcion principal encargada de la nueva creacion de cargos en la pagina de cargos.
 * @returns {void}
 * @author HaJuegos - 17-10-2026
 */
function crearCargo() {
    const btnNewCargo = document.getElementById("btn-crear-cargo");
    const btnGuardarCargo = document.querySelector("#modal-crear-cargo #btn-crear-cargo");
    const formCrear = document.getElementById("form-crear-cargo");

    if (btnNewCargo) {
        btnNewCargo.onclick = () => {
            if (formCrear) {
                formCrear.reset();
            }

            const modalElement = document.getElementById("modal-crear-cargo");

            if (modalElement) {
                const modal = Modal.getOrCreateInstance(modalElement);

                modal.show();
            }
        };
    }

    if (btnGuardarCargo) {
        btnGuardarCargo.onclick = () => {
            const inputNombre = document.getElementById("input-nueva-cargo");
            const nombre = inputNombre ? inputNombre.value.trim() : "";

            if (!nombre) {
                alert("Por favor ingrese el nombre del cargo.");
                return;
            }

            const nuevoId = cargosData.length > 0 ? Math.max(...cargosData.map((c) => c.id)) + 1 : 1;

            cargosData.push({ id: nuevoId, nombre });

            const modalElement = document.getElementById("modal-crear-cargo");
            const modal = Modal.getOrCreateInstance(modalElement);

            modal.hide();

            if (dataTableInstance) {
                dataTableInstance.clear();
                dataTableInstance.rows.add(cargosData);
                dataTableInstance.draw();
            }
        };
    }
}

/**
 * Funcion principal encargada de la edicion de cargos en la pagina de cargos.
 * @returns {void}
 * @author HaJuegos - 17-10-2026
 */
function editarCargo() {
    const tableContainer = document.getElementById("tabla-cargo");

    if (tableContainer) {
        tableContainer.onclick = (e) => {
            const btnEditar = e.target.closest(".btn-editar");

            if (btnEditar) {
                const cargoId = parseInt(btnEditar.getAttribute("data-cargoID"), 10);
                const cargoSeleccionado = cargosData.find((c) => c.id == cargoId);

                if (cargoSeleccionado) {
                    const inputId = document.getElementById("input-cargo-id-editar");
                    const inputNombre = document.getElementById("editar-input-cargo");

                    if (inputId) {
                        inputId.value = cargoSeleccionado.id;
                    }

                    if (inputNombre) {
                        inputNombre.value = cargoSeleccionado.nombre;
                    }

                    const modalElement = document.getElementById("modal-editar-cargo");

                    if (modalElement) {
                        const modal = Modal.getOrCreateInstance(modalElement);

                        modal.show();
                    }
                }
            }

            const btnEliminar = e.target.closest(".btn-eliminar");

            if (btnEliminar) {
                const cargoId = parseInt(btnEliminar.getAttribute("data-cargoID"), 10);

                if (confirm(`¿Estás seguro de eliminar el cargo con ID ${cargoId}?`)) {
                    cargosData = cargosData.filter((c) => c.id != cargoId);

                    if (dataTableInstance) {
                        dataTableInstance.clear();
                        dataTableInstance.rows.add(cargosData);
                        dataTableInstance.draw();
                    }
                }
            }
        };
    }

    const btnGuardarEditar = document.getElementById("btn-editar-cargo");

    if (btnGuardarEditar) {
        btnGuardarEditar.onclick = () => {
            const inputId = document.getElementById("input-cargo-id-editar");
            const inputNombre = document.getElementById("editar-input-cargo");

            const id = inputId ? parseInt(inputId.value, 10) : null;
            const nuevoNombre = inputNombre ? inputNombre.value.trim() : "";

            if (!nuevoNombre) {
                alert("El nombre del cargo no puede estar vacío.");
                return;
            }

            const index = cargosData.findIndex((c) => c.id == id);

            if (index != -1) {
                cargosData[index].nombre = nuevoNombre;
            }

            const modalElement = document.getElementById("modal-editar-cargo");

            if (modalElement) {
                const modal = Modal.getOrCreateInstance(modalElement);

                modal.hide();
            }

            if (dataTableInstance) {
                dataTableInstance.clear();
                dataTableInstance.rows.add(cargosData);
                dataTableInstance.draw();
            }
        };
    }
}

/**
 * Funcion principal que carga la pagina de Cargos con una plantilla fija ya creada.
 * @returns {Function}
 * @author HaJuegos - 17-10-2026
 */
export function renderCargos() {
    const finalPage = cargosDash + agregarCargoDash + editarCargoDash;

    return renderPageWithNavbar(finalPage, [startDataTable, crearCargo, editarCargo]);
}
