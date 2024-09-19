const {Schema, model} = require("mongoose");

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "alumno"
    }
});

module.exports = model("Usuario", UsuarioSchema, "usuarios");