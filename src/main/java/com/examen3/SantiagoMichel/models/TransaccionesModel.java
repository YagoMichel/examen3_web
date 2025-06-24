package com.examen3.SantiagoMichel.models;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

public class TransaccionesModel {
    private int id;
    private String cuenta;
    private String tipo;
    private double monto;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date fecha;


    public TransaccionesModel(int id, String cuenta, String tipo, double monto, Date fecha) {
        this.id = id;
        this.cuenta = cuenta;
        this.tipo = tipo;
        this.monto = monto;
        this.fecha = fecha;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCuenta() {
        return cuenta;
    }

    public void setCuenta(String cuenta) {
        this.cuenta = cuenta;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public TransaccionesModel() {
    }


}