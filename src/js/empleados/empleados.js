import $ from "jquery";
import DataTable from "datatables.net-bs5";
import { Modal } from "bootstrap";

import { renderPageWithNavbar } from "../dashboard/dashboard";

import empleadosDash from "../../views/empleados/main.html?raw";
import agregarEmpleadoDash from "../../views/empleados/agregar-modal.html?raw";
import editarEmpleadoDash from "../../views/empleados/editar-modal.html?raw";

/**
 * Datos de la tabla a guardar. Por defecto tendra algunos valores guardados de ejemplo.
 * @type {{id: number; nombre: string;}}
 */
let empleadosData = [
    { id: 1, nombre: "Jose Luis", cargo: "Administrador", area: "Ingeniero" },
    { id: 2, nombre: "Santiago Burbano", cargo: "Medico General", area: "Sala de Atencion" },
    { id: 3, nombre: "Matias Gamer", cargo: "Auxiliar General", area: "Area de Aseo" },
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
    const tableElement = document.getElementById("tabla-empleados");

    if (tableElement) {
        if (dataTableInstance) {
            dataTableInstance.destroy();
        }

        dataTableInstance = new DataTable(tableElement, {
            data: empleadosData,
            columns: [
                {
                    data: null,
                    render: (data, type, row, meta) => {
                        return (meta.row + 1).toString();
                    },
                },
                { data: "nombre" },
                { data: "cargo" },
                { data: "area" },
                {
                    data: null,
                    render: (data, type, row) => {
                        const btnEditar = `
                            <a class="btn-shine btn-editar" data-empleadoID="${row.id}" data-bs-toggle="tooltip" title="Editar Empleado">
                                <i class="bi bi-pencil-fill"></i>
                            </a>
                        `;

                        const btnEliminar = `
                            <a class="btn-shine btn-eliminar" data-empleadoID="${row.id}" data-bs-toggle="tooltip" title="Eliminar Empleado">
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
            const toolTipsList = document.querySelectorAll('#tabla-empleados [data-bs-toggle="tooltip"]');

            toolTipsList.forEach((tooltipEl) => {
                if (window.bootstrap) {
                    new window.bootstrap.Tooltip(tooltipEl);
                }
            });
        });
    }
}

/**
 * Funcion principal encargada de la nueva creacion de nuevos empleados en la pagina de empleados.
 * @returns {void}
 * @author HaJuegos - 17-10-2026
 */
function crearEmpleado() {
    const btnNewEmpleado = document.getElementById("btn-crear-empleado");
    const btnGuardarEmpleado = document.querySelector("#modal-crear-usuario #btn-crear-usuario");
    const formCrear = document.getElementById("form-crear-usuario");

    if (btnNewEmpleado) {
        btnNewEmpleado.onclick = () => {
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

    if (btnGuardarEmpleado) {
        btnGuardarEmpleado.onclick = () => {
            const pNombre = document.getElementById("input-p-nombre")?.value.trim() || "";
            const pApellido = document.getElementById("input-p-apellido")?.value.trim() || "";
            const cargo = document.getElementById("input-cargo")?.value.trim() || "";
            const area = document.getElementById("input-area")?.value.trim() || "";

            if (!pNombre || !pApellido) {
                alert("Por favor ingrese al menos el primer nombre y primer apellido.");
                return;
            }

            const nuevoId = empleadosData.length > 0 ? Math.max(...empleadosData.map((e) => e.id)) + 1 : 1;

            empleadosData.push({
                id: nuevoId,
                nombre: `${pNombre} ${pApellido}`,
                cargo,
                area,
            });

            const modalElement = document.getElementById("modal-crear-usuario");

            if (modalElement) {
                const modal = Modal.getOrCreateInstance(modalElement);

                modal.hide();
            }

            if (dataTableInstance) {
                dataTableInstance.clear();
                dataTableInstance.rows.add(empleadosData);
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
function editarEmpleado() {
    const tableContainer = document.getElementById("tabla-empleados");

    if (tableContainer) {
        tableContainer.onclick = (e) => {
            const btnEditar = e.target.closest(".btn-editar");

            if (btnEditar) {
                const empleadoId = parseInt(btnEditar.getAttribute("data-empleadoID"), 10);
                const empleadoSeleccionado = empleadosData.find((emp) => emp.id == empleadoId);

                if (empleadoSeleccionado) {
                    const inputId = document.getElementById("input-empleado-id");
                    const inputPrioNombre = document.getElementById("input-p-nombre-editar");
                    const inputSecNombre = document.getElementById("input-s-nombre-editar");
                    const inputPrioApellido = document.getElementById("input-p-apellido-editar");
                    const inputSecApellido = document.getElementById("input-s-apellido-editar");
                    const inputCargo = document.getElementById("input-cargo-editar");
                    const inputArea = document.getElementById("input-area-editar");

                    if (inputId) {
                        inputId.value = empleadoSeleccionado.id;
                    }

                    const partesNombre = empleadoSeleccionado.nombre ? empleadoSeleccionado.nombre.split(" ") : [];

                    if (inputPrioNombre) {
                        inputPrioNombre.value = empleadoSeleccionado.pNombre || partesNombre[0] || "";
                    }

                    if (inputSecNombre) {
                        inputSecNombre.value = empleadoSeleccionado.sNombre || partesNombre[1] || "";
                    }

                    if (inputPrioApellido) {
                        inputPrioApellido.value = empleadoSeleccionado.pApellido || partesNombre[2] || "";
                    }

                    if (inputSecApellido) {
                        inputSecApellido.value = empleadoSeleccionado.sApellido || partesNombre[3] || "";
                    }

                    if (inputCargo) {
                        inputCargo.value = empleadoSeleccionado.cargo || "";
                    }

                    if (inputArea) {
                        inputArea.value = empleadoSeleccionado.area || "";
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
                const empleadoId = parseInt(btnEliminar.getAttribute("data-empleadoID"), 10);

                if (confirm(`¿Estás seguro de eliminar el empleado con ID ${empleadoId}?`)) {
                    empleadosData = empleadosData.filter((emp) => emp.id != empleadoId);

                    if (dataTableInstance) {
                        dataTableInstance.clear();
                        dataTableInstance.rows.add(empleadosData);
                        dataTableInstance.draw();
                    }
                }
            }
        };
    }

    const btnGuardarEditar = document.getElementById("btn-editar-usuario");

    if (btnGuardarEditar) {
        btnGuardarEditar.onclick = () => {
            const inputId = document.getElementById("input-empleado-id");
            const inputPrioNombre = document.getElementById("input-p-nombre-editar");
            const inputSecNombre = document.getElementById("input-s-nombre-editar");
            const inputPrioApellido = document.getElementById("input-p-apellido-editar");
            const inputSecApellido = document.getElementById("input-s-apellido-editar");
            const inputCargo = document.getElementById("input-cargo-editar");
            const inputArea = document.getElementById("input-area-editar");

            const id = inputId ? parseInt(inputId.value, 10) : null;
            const pNombre = inputPrioNombre ? inputPrioNombre.value.trim() : "";
            const sNombre = inputSecNombre ? inputSecNombre.value.trim() : "";
            const pApellido = inputPrioApellido ? inputPrioApellido.value.trim() : "";
            const sApellido = inputSecApellido ? inputSecApellido.value.trim() : "";
            const cargo = inputCargo ? inputCargo.value.trim() : "";
            const area = inputArea ? inputArea.value.trim() : "";

            if (!pNombre || !pApellido) {
                alert("El nombre del empleado no puede estar vacío.");
                return;
            }

            const nombreCompleto = [pNombre, sNombre, pApellido, sApellido].filter(Boolean).join(" ");
            const index = empleadosData.findIndex((emp) => emp.id == id);

            if (index != -1) {
                empleadosData[index] = {
                    ...empleadosData[index],
                    nombre: nombreCompleto,
                    pNombre,
                    sNombre,
                    pApellido,
                    sApellido,
                    cargo,
                    area,
                };
            }

            const modalElement = document.getElementById("modal-editar-usuario");

            if (modalElement) {
                const modal = Modal.getOrCreateInstance(modalElement);

                modal.hide();
            }

            if (dataTableInstance) {
                dataTableInstance.clear();
                dataTableInstance.rows.add(empleadosData);
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
export function renderEmpleados() {
    const finalPage = empleadosDash + agregarEmpleadoDash + editarEmpleadoDash;

    return renderPageWithNavbar(finalPage, [startDataTable, crearEmpleado, editarEmpleado]);
}
