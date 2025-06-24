let idTransaccionEliminar = 0;
let idTransaccionActualizar = 0;

$(document).ready(function() {
    obtenerTransacciones();

    // Botón dentro del modal de eliminación
    $("#btnConfirmarEliminar").on("click", function() {
        eliminarTransaccion();
    });
    $("#btnActualizarTransaccion").on("click", function () {
        actualizarTransaccion();
    });
});

function obtenerTransacciones() {
    $.ajax({
        method: "GET",
        url: "/v1/api/transacciones",
        success: function(resultado) {
            if (resultado.estado === 1) {
                $("#example tbody").empty();
                resultado.transacciones.forEach(transaccion => {
                    agregarFilaATabla(transaccion);
                });
            }
        },
        error: function(xhr, error, mensaje) {
            console.error("Error al obtener transacciones:", mensaje);
        }
    });
}

function agregarFilaATabla(transaccion) {
    let claseTipo = '';
    switch(transaccion.tipo.toLowerCase()) {
        case 'retiro': claseTipo = 'text-red-500 bg-red-500'; break;
        case 'deposito': claseTipo = 'text-green-500 bg-green-500'; break;
        case 'transferencia': claseTipo = 'text-blue-500 bg-blue-500'; break;
        default: claseTipo = 'text-gray-500 bg-gray-500';
    }

    const nuevaFila = `
        <tr id="renglon_${transaccion.id}">
            <td class="table-td">${transaccion.id}</td>
            <td class="table-td">
                <span class="flex">
                    <span class="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none">
                        <img src="assets/images/all-img/customer_1.png" alt="${transaccion.cuenta}" class="object-cover w-full h-full rounded-full">
                    </span>
                    <span class="text-sm text-slate-600 dark:text-slate-300 capitalize">${transaccion.cuenta}</span>
                </span>
            </td>
            <td class="table-td">${transaccion.monto.toFixed(2)}</td>
            <td class="table-td">
                <div class="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${claseTipo}">
                    ${transaccion.tipo}
                </div>
            </td>
            <td class="table-td">${transaccion.fecha}</td>
            <td class="table-td">
                <div class="flex space-x-3 rtl:space-x-reverse">
                    <button class="action-btn btn-outline-light" onclick="verTransaccion(${transaccion.id})">
                        <iconify-icon icon="heroicons:eye"></iconify-icon>
                    </button>
                    <button class="action-btn btn-outline-primary" onclick="seleccionarTransaccionActualizar(${transaccion.id})">
                        <iconify-icon icon="heroicons:pencil-square"></iconify-icon>
                    </button>
                    <button class="action-btn btn-outline-danger" onclick="seleccionarTransaccionEliminar(${transaccion.id}, '${transaccion.cuenta}')">
                        <iconify-icon icon="heroicons:trash"></iconify-icon>
                    </button>
                </div>
            </td>
        </tr>
    `;
    $("#example tbody").append(nuevaFila);
}

function seleccionarTransaccionActualizar(id) {
    idTransaccionActualizar = id;
    $.ajax({
        method: "GET",
        url: "/v1/api/transacciones/actualizar/" + id,
        success: function(resultado) {
            if (resultado.estado === 1) {
                const t = resultado.transaccion;
                $('#cuenta_editar').val(t.cuenta);
                $('#tipo_editar').val(t.tipo);
                $('#monto_editar').val(t.monto);
                $('#fecha_editar').val(t.fecha.substring(0, 10));
                $('#edit_degree_modal').modal('show');
            }
        }
    });
}
function actualizarTransaccion() {
    const cuenta = $('#cuenta_editar').val();
    const tipo = $('#tipo_editar').val();
    const monto = parseFloat($('#monto_editar').val());
    const fecha = $('#fecha_editar').val();

    if (cuenta && tipo && monto > 0 && fecha) {
        $.ajax({
            url: "/v1/api/transacciones/actualizar/" + idTransaccionActualizar,
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({ cuenta, tipo, monto, fecha }),
            success: function (resultado) {
                if (resultado.estado === 1) {
                    const fila = $(`#renglon_${idTransaccionActualizar}`);

                    let claseTipo = '';
                    switch (tipo.toLowerCase()) {
                        case 'retiro': claseTipo = 'text-red-500 bg-red-500'; break;
                        case 'deposito': claseTipo = 'text-green-500 bg-green-500'; break;
                        case 'transferencia': claseTipo = 'text-blue-500 bg-blue-500'; break;
                        default: claseTipo = 'text-gray-500 bg-gray-500';
                    }

                    fila.find('td:eq(1) .capitalize').text(cuenta);
                    fila.find('td:eq(2)').text(monto.toFixed(2));
                    fila.find('td:eq(3) div')
                        .attr('class', `inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${claseTipo}`)
                        .text(tipo);
                    fila.find('td:eq(4)').text(fecha);

                    // Cierra el modal después de actualizar
                    $('#edit_degree_modal').modal('hide');
                }
            },
            error: function () {
                alert("Error al actualizar la transacción.");
            }
        });
    }
}


function seleccionarTransaccionEliminar(id, cuenta) {
    idTransaccionEliminar = id;
    $('#nombreTransaccionEliminar').text(cuenta);
    $('#delete_degree_modal').modal('show'); // Mostrar modal
}

function eliminarTransaccion() {
    $.ajax({
        method: "POST",
        url: "/v1/api/transacciones/eliminar",
        contentType: "application/json",
        data: JSON.stringify({ id: idTransaccionEliminar }),
        success: function(resultado) {
            if (resultado.estado === 1) {
                $(`#renglon_${idTransaccionEliminar}`).remove();
                $('#delete_degree_modal').modal('hide'); // Cerrar modal
            }
        },
        error: function() {
            alert("Error al eliminar la transacción.");
        }
    });
}

function guardarTransaccion() {
    const cuenta = $('#cuenta').val();
    const tipo = $('#tipo').val();
    const monto = parseFloat($('#monto').val());
    const fecha = $('#fecha').val();

    if (cuenta && tipo && monto > 0 && fecha) {
        $.ajax({
            url: "/v1/api/transacciones",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({ cuenta, tipo, monto, fecha }),
            success: function(resultado) {
                if (resultado.estado === 1) {
                    agregarFilaATabla(resultado.transaccion);
                    $('#add_degree_modal').modal('hide');
                }
            }
        });
    }
}
