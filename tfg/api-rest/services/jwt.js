// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta
const secret = "CLAVE_SECRETA_del_proyecto_987987";

// Crear una función para generar tokens
const createToken = (usuario) => {
    const payload = {
        id: usuario._id,
        name: usuario.name,
        surname: usuario.surname,
        email: usuario.email,
        role: usuario.role,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    // Devolver jwt token codificado
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}