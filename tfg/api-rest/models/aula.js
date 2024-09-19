const { Schema, model } = require("mongoose");

const HorarioSchema = new Schema({
    dia: {
        type: Date,
        required: true
    },
    horaInicio: {
        type: Date,
        required: true
    },
    horaFin: {
        type: Date,
        required: true
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

const AulaSchema = Schema({
    usuario: {
        type: Schema.ObjectId,
        ref: "Usuario",
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    capacidad: {
        type: Number,
        required: true
    },
    bloque: {
        type: Number,
        required: true
    },
    planta: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        default: "Aula para reservas"
    },
    // Campo para gestionar los horarios disponibles
    horariosDisponibles: [HorarioSchema],
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Aula", AulaSchema, "aulas");