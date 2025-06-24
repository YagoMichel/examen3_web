package com.examen3.SantiagoMichel.repositories;

import com.examen3.SantiagoMichel.models.TransaccionesModel;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransaccionesRepositories {

    List<TransaccionesModel> findAllTransacciones();
    TransaccionesModel findTransaccionById(int id);
    TransaccionesModel save(TransaccionesModel transaccion);
    int update(TransaccionesModel transaccion);
    int delete(int id);
}
