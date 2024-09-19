const { Schema, model } = require("mongoose");

const ReservaSchema = Schema({
    aula: {
        type: Schema.ObjectId,
        ref: "Aula",
        required: true
    },
    dia: {
        type: Date,
        required: true
    },
    hora_ini: {
        type: Date,
        required: true
    },
    hora_fin: {
        type: Date,
        required: true
    },
    duracion: {
        type: Number,
        required: true
    },
    usuario: {
        type: Schema.ObjectId,
        ref: "Usuario",
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Reserva", ReservaSchema, "reservas");