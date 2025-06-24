package com.examen3.SantiagoMichel.services;

import com.examen3.SantiagoMichel.models.TransaccionesModel;
import com.examen3.SantiagoMichel.repositories.TransaccionesRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Service
public class TransaccionesServices implements TransaccionesRepositories {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<TransaccionesModel> findAllTransacciones() {
        return jdbcTemplate.query("SELECT * FROM transacciones",
                new BeanPropertyRowMapper<>(TransaccionesModel.class));
    }

    @Override
    public TransaccionesModel findTransaccionById(int id) {
        return jdbcTemplate.query("SELECT * FROM transacciones WHERE id=?",
                        new BeanPropertyRowMapper<>(TransaccionesModel.class), id)
                .stream().findFirst().orElse(new TransaccionesModel());
    }

    @Override
    public TransaccionesModel save(TransaccionesModel transaccion) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO transacciones(cuenta, tipo, monto, fecha) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, transaccion.getCuenta());
            ps.setString(2, transaccion.getTipo());
            ps.setDouble(3, transaccion.getMonto());
            ps.setDate(4, new java.sql.Date(transaccion.getFecha().getTime()));

            return ps;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();
        if (generatedId != null) {
            transaccion.setId(generatedId.intValue());
        } else {
            transaccion.setId(0);
        }

        return transaccion;
    }

    @Override
    public int update(TransaccionesModel transaccion) {
        return jdbcTemplate.update(
                "INSERT INTO transacciones(cuenta, tipo, monto, fecha) VALUES (?, ?, ?, ?)",
                transaccion.getCuenta(),
                transaccion.getTipo(),
                transaccion.getMonto(),
                transaccion.getFecha()
        );
    }

    @Override
    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM transacciones WHERE id=?", id);
    }
}
