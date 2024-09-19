// Importar dependencias y modulos
const bcrypt = require("bcrypt");

// Importar modelos
const Usuario = require("../models/usuario");

// Importar servicios
const jwt = require("../services/jwt");

// Acciones de prueba
const pruebaUsuario = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/usuario.js",
        usuario: req.usuario
    });
}

// Registro de usuarios
const registro = (req, res) => {
    // Recoger datos de la petición
    let params = req.body;

    // Comporbar que me llegan bien (+ validación)
    if (!params.name || !params.surname || !params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    // Comprobar que el usuario no existe en la base de datos
    Usuario.find({ email: params.email.toLowerCase() })
        .exec()
        .then(async usuarios => {
            if (usuarios && usuarios.length >= 1) {
                return res.status(200).send({
                    status: "success",
                    message: "El usuario ya existe"
                });
            }

            // Cifrar la contraseña
            let pwd = await bcrypt.hash(params.password, 10);
            params.password = pwd;

            // Crear objeto de usuario
            let usuario_guardar = new Usuario(params);

            // Guardar usuario en la base de datos
            return usuario_guardar.save()
                .then(usuarioGuardado => {
                    return res.status(200).json({
                        status: "success",
                        message: "Usuario registrado correctamente",
                        usuario: usuarioGuardado
                    });
                })
                .catch(error => {
                    return res.status(500).send({ status: "error", message: "Error al guardar el usuario" });
                });
        })
        .catch(error => {
            return res.status(500).json({ status: "error", message: "Error en la consulta de usuarios" });
        });
}

const login = async (req, res) => {
    // Recoger parámetros del body
    let params = req.body;
    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    try {
        // Buscar en la base de datos si existe
        const usuario = await Usuario.findOne({ email: params.email }); //.select({ password: 0 })

        if (!usuario) {
            return res.status(404).send({ status: "error", message: "No existe el usuario" });
        }

        // Comprobar su contraseña
        const pwd = bcrypt.compareSync(params.password, usuario.password);

        if (!pwd) {
            return res.status(400).send({
                status: "error",
                message: "Contraseña incorrecta"
            });
        }

        // Conseguir Token
        const token = jwt.createToken(usuario);

        // Devolver datos del usuario
        return res.status(200).send({
            status: "success",
            message: "Te has identificado correctamente",
            usuario: {
                id: usuario._id,
                name: usuario.name,
                surname: usuario.surname,
                role: usuario.role
            },
            token
        });
    } catch (error) {
        return res.status(500).send({ status: "error", message: "Error en la consulta" });
    }
}

const perfil = async (req, res) => {
    try {
        // Recibir el parámetro del id de usuario por la url
        const id = req.params.id;

        // Consulta para sacar los datos del usuario
        const usuarioPerfil = await Usuario.findById(id).select("-password -_id -__v ");

        if (!usuarioPerfil) {
            return res.status(404).send({
                status: "error",
                message: "El usuario no existe o hay un error"
            });
        }

        // Devolver el resultado
        return res.status(200).send({
            status: "success",
            usuario: usuarioPerfil
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar el usuario"
        });
    }
}

// Exportar acciones
module.exports = {
    pruebaUsuario,
    registro,
    login,
    perfil
}