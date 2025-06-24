package com.examen3.SantiagoMichel.controllers;


import com.examen3.SantiagoMichel.models.TransaccionesModel;
import com.examen3.SantiagoMichel.services.TransaccionesServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Controller
public class TransaccionesController {

    @Autowired
    private TransaccionesServices transaccionService;

    @GetMapping("/transacciones")
    public String transacciones() {
        return "transacciones"; // Vista en templates/transacciones.html
    }

    @GetMapping("/v1/api/transacciones")
    public ResponseEntity<Map<String, Object>> getAllTransacciones() {
        List<TransaccionesModel> transacciones = transaccionService.findAllTransacciones();
        return ResponseEntity.ok(Map.of(
                "estado", 1,
                "mensaje", "Listado de transacciones",
                "transacciones", transacciones
        ));
    }

    @PostMapping("/v1/api/transacciones")
    public ResponseEntity<Map<String, Object>> transaccionPost(@RequestBody Map<String, Object> objetoTransaccion) {
        try {
            TransaccionesModel transaccion = new TransaccionesModel(
                    0,
                    objetoTransaccion.get("cuenta").toString(),
                    objetoTransaccion.get("tipo").toString(),
                    Double.parseDouble(objetoTransaccion.get("monto").toString()),
                    new SimpleDateFormat("yyyy-MM-dd").parse(objetoTransaccion.get("fecha").toString())
            );
            TransaccionesModel transaccionGuardada = transaccionService.save(transaccion);
            if (transaccionGuardada != null)
                return ResponseEntity.ok(Map.of(
                        "estado", 1,
                        "mensaje", "Transacción guardada correctamente",
                        "transaccion", transaccionGuardada
                ));
            else
                return ResponseEntity.ok(Map.of(
                        "estado", 0,
                        "mensaje", "Error: No se pudo guardar la transacción",
                        "transaccion", objetoTransaccion
                ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "estado", 0,
                    "mensaje", "Error al procesar la transacción: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/v1/api/transacciones/eliminar")
    public ResponseEntity<Map<String, Object>> transaccionDelete(@RequestBody Map<String, Object> objetoTransaccion) {
        int id = Integer.parseInt(objetoTransaccion.get("id").toString());
        if (transaccionService.delete(id) > 0) {
            return ResponseEntity.ok(Map.of(
                    "estado", 1,
                    "mensaje", "Transacción eliminada"
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                    "estado", 0,
                    "mensaje", "No se pudo eliminar la transacción"
            ));
        }
    }

    @GetMapping("/v1/api/transacciones/actualizar/{id}")
    public ResponseEntity<Map<String, Object>> transaccionActualizar(@PathVariable int id) {
        TransaccionesModel transaccion = transaccionService.findTransaccionById(id);
        return ResponseEntity.ok(Map.of(
                "estado", 1,
                "mensaje", "Transacción encontrada",
                "transaccion", transaccion
        ));
    }

    @PostMapping("/v1/api/transacciones/actualizar/{id}")
    public ResponseEntity<Map<String, Object>> transaccionActualizarDatos(
            @PathVariable int id,
            @RequestBody Map<String, Object> objetoTransaccion) {
        try {
            TransaccionesModel transaccion = new TransaccionesModel(
                    id,
                    objetoTransaccion.get("cuenta").toString(),
                    objetoTransaccion.get("tipo").toString(),
                    Double.parseDouble(objetoTransaccion.get("monto").toString()),
                    new SimpleDateFormat("yyyy-MM-dd").parse(objetoTransaccion.get("fecha").toString())
            );

            if (transaccionService.update(transaccion) > 0)
                return ResponseEntity.ok(Map.of(
                        "estado", 1,
                        "mensaje", "Transacción actualizada correctamente",
                        "transaccion", transaccion
                ));
            else
                return ResponseEntity.ok(Map.of(
                        "estado", 0,
                        "mensaje", "Error: No se pudo actualizar la transacción",
                        "transaccion", objetoTransaccion
                ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "estado", 0,
                    "mensaje", "Error al procesar la actualización: " + e.getMessage()
            ));
        }
    }
}


