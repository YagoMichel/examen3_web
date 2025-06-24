// Variables globales
let idTransaccionEliminar = 0;
let idTransaccionActualizar = 0;
$(document).ready(function() {
    obtenerTransacciones();
});



function obtenerTransacciones() {
    $.ajax({
        method: "GET",
        url: "/v1/api/transacciones",
        success: function (resultado) {
            if (resultado.estado === 1) {
                let tabla = $('#example').DataTable();
                let transacciones = resultado.transacciones;

                // Limpia la tabla antes de volver a agregar (opcional si refrescas datos)
                tabla.clear();

                transacciones.forEach(transaccion => {
                    let botones = `
                        <div class="flex space-x-3 rtl:space-x-reverse">
                            <button class="action-btn btn-outline-light" type="button" data-bs-toggle="modal" data-bs-target="#view_degree_modal" onclick="verTransaccion(${transaccion.id})">
                                <iconify-icon icon="heroicons:eye"></iconify-icon>
                            </button>
                            <button class="action-btn btn-outline-primary" type="button" data-bs-toggle="modal" data-bs-target="#edit_degree_modal" onclick="seleccionarTransaccionActualizar(${transaccion.id})">
                                <iconify-icon icon="heroicons:pencil-square"></iconify-icon>
                            </button>
                            <button class="action-btn btn-outline-danger" type="button" data-bs-toggle="modal" data-bs-target="#delete_degree_modal" onclick="seleccionarTransaccionEliminar(${transaccion.id}, '${transaccion.cuenta}')">
                                <iconify-icon icon="heroicons:trash"></iconify-icon>
                            </button>
                        </div>
                    `;

                    tabla.row.add([
                        transaccion.id,
                        `<span class="flex">
                            <span class="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none">
                                <img src="assets/images/all-img/customer_1.png" alt="${transaccion.cuenta}" class="object-cover w-full h-full rounded-full" />
                            </span>
                            <span class="text-sm text-slate-600 dark:text-slate-300 capitalize">${transaccion.cuenta}</span>
                        </span>`,
                        transaccion.monto.toFixed(2),
                        `<div class="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                            ${transaccion.tipo}
                        </div>`,
                        transaccion.fecha,
                        botones
                    ]).node().id = 'renglon_' + transaccion.id;
                });

                tabla.draw();
            }
        },
        error: function (xhr, error, mensaje) {
            alert("Error al obtener transacciones: " + mensaje);
        }
    });
}


function guardarTransaccion() {
    let cuenta = $('#cuenta').val();
    let tipo = $('#tipo').val();
    let monto = parseFloat($('#monto').val()).toFixed(2);
    let fecha = $('#fecha').val();

    if (cuenta && tipo && monto > 0 && fecha) {
        $.ajax({
            url: "/v1/api/transacciones",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({
                cuenta: cuenta,
                tipo: tipo,
                monto: monto,
                fecha: fecha
            }),
            success: function (resultado) {
                if (resultado.estado === 1) {
                    let tabla = $('#example').DataTable();
                    let transaccion = resultado.transaccion;

                    let botones = `
                      <div class="flex space-x-3 rtl:space-x-reverse">
                        <button class="action-btn btn-outline-light" type="button" data-bs-toggle="modal" data-bs-target="#view_degree_modal" onclick="verTransaccion(${transaccion.id})">
                          <iconify-icon icon="heroicons:eye"></iconify-icon>
                        </button>
                        <button class="action-btn btn-outline-primary" type="button" data-bs-toggle="modal" data-bs-target="#edit_degree_modal" onclick="seleccionarTransaccionActualizar(${transaccion.id})">
                          <iconify-icon icon="heroicons:pencil-square"></iconify-icon>
                        </button>
                        <button class="action-btn btn-outline-danger" type="button" data-bs-toggle="modal" data-bs-target="#delete_degree_modal" onclick="seleccionarTransaccionEliminar(${transaccion.id}, '${transaccion.cuenta}')">
                          <iconify-icon icon="heroicons:trash"></iconify-icon>
                        </button>
                      </div>`;

                    tabla.row.add([
                        transaccion.id,
                        `<span class="flex">
                            <span class="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none">
                                <img src="assets/images/all-img/customer_1.png" alt="${transaccion.id}" class="object-cover w-full h-full rounded-full" />
                            </span>
                            <span class="text-sm text-slate-600 dark:text-slate-300 capitalize">${transaccion.cuenta}</span>
                        </span>`,
                        monto,
                        `<div class="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                            ${transaccion.tipo}
                        </div>`,
                        transaccion.fecha,
                        botones
                    ]).node().id = 'renglon_' + transaccion.id;

                    tabla.draw();

                    alert(resultado.mensaje);
                } else {
                    alert(resultado.mensaje);
                }
            },
            error: function (xhr, error, mensaje) {
                alert("Error al guardar transacción: " + mensaje);
            }
        });
    } else {
        alert("Llena todos los campos correctamente.");
    }
}



function seleccionarTransaccionActualizar(id) {
    idTransaccionActualizar = id;
    $.ajax({
        method: "GET",
        url: "/v1/api/transacciones/actualizar/" + id,
        success: function (resultado) {
            if (resultado.estado === 1) {
                let t = resultado.transaccion;
                $('#cuenta_editar').val(t.cuenta);
                $('#tipo_editar').val(t.tipo).selectpicker('refresh');
                $('#monto_editar').val(t.monto);
                $('#fecha_editar').val(t.fecha.substring(0, 10));
            } else {
                alert(resultado.mensaje);
            }
        },
        error: function (xhr, error, mensaje) {
            alert("Error al cargar transacción: " + mensaje);
        }
    });
}

function actualizarTransaccion() {
    let cuenta = $('#cuenta_editar').val();
    let tipo = $('#tipo_editar').val();
    let monto = $('#monto_editar').val();
    let fecha = $('#fecha_editar').val();

    if (cuenta && tipo && monto > 0 && fecha) {
        $.ajax({
            url: "/v1/api/transacciones/actualizar/" + idTransaccionActualizar,
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({
                cuenta: cuenta,
                tipo: tipo,
                monto: monto,
                fecha: fecha
            }),
            success: function (resultado) {
                if (resultado.estado === 1) {
                    let tabla = $('#example').DataTable();
                    let datos = tabla.row("#renglon_" + idTransaccionActualizar).data();

                    datos[1] = cuenta;
                    datos[2] = tipo;
                    datos[3] = monto;
                    datos[4] = fecha;

                    tabla.row("#renglon_" + idTransaccionActualizar).data(datos);
                    tabla.draw();

                    alert(resultado.mensaje);
                } else {
                    alert(resultado.mensaje);
                }
            },
            error: function (xhr, error, mensaje) {
                alert("Error de comunicación: " + mensaje);
            }
        });
    } else {
        alert("Llena todos los campos correctamente.");
    }
}



function seleccionarTransaccionEliminar(id, cuenta) {
    // Guardamos el ID de la transacción a eliminar
    idTransaccionEliminar = id;

    // Mostramos la cuenta o tipo para confirmación
    document.getElementById("nombre_transaccion_eliminar").textContent = cuenta;
}

function eliminarTransaccion() {
    $.ajax({
        method: "POST",
        url: "/v1/api/transaccion/eliminar",
        contentType: "application/json",
        data: JSON.stringify({
            id: idTransaccionEliminar
        }),
        success: function (resultado) {
            if (resultado.estado === 1) {
                $('#example').DataTable().row('#renglon_' + idTransaccionEliminar).remove().draw();
                alert(resultado.mensaje);
            } else {
                alert(resultado.mensaje);
            }
        },
        error: function (xhr, error, mensaje) {
            alert("Error de comunicación: " + error);
        }
    });


}
