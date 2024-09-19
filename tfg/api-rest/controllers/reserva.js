// Importar modelo
const Reserva = require("../models/reserva");
const Aula = require('../models/aula');


// Acciones de prueba
const pruebaReserva = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/reserva.js"
    });
}


// Función para que un alumno cree una reserva
const crearReserva = async (req, res) => {
    try {
        // Verificar el rol del usuario
        const { role } = req.usuario;
        if (role !== "alumno" && role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Acceso denegado. Solo los alumnos pueden realizar reservas."
            });
        }

        // Extraer los datos de la reserva del cuerpo de la solicitud
        const { aulaId, dia, hora_ini, hora_fin, duracion } = req.body;

        // Buscar el aula por ID
        const aula = await Aula.findById(aulaId);
        if (!aula) {
            return res.status(404).json({
                status: "error",
                message: "Aula no encontrada"
            });
        }

        // Comprobar si el horario ya está reservado
        const diaDate = new Date(dia);
        const horaIniDate = new Date(hora_ini);
        const horaFinDate = new Date(hora_fin);

        let horarioEncontrado = false;

        for (let i = 0; i < aula.horariosDisponibles.length; i++) {
            let horario = aula.horariosDisponibles[i];
            if (horario.dia.getTime() === diaDate.getTime() && horario.horaInicio.getTime() === horaIniDate.getTime() && horario.horaFin.getTime() === horaFinDate.getTime()) {
                horarioEncontrado = true;
                if (!horario.disponible) {
                    return res.status(400).json({
                        status: "error",
                        message: "El aula ya está reservada en este horario."
                    });
                }
                // Actualizar el estado de disponibilidad
                aula.horariosDisponibles[i].disponible = false;
            }
        }

        if (!horarioEncontrado) {
            return res.status(400).json({
                status: "error",
                message: "El horario no está disponible para reservar."
            });
        }

        // Indicar a Mongoose que el array 'horariosDisponibles' ha sido modificado
        aula.markModified('horariosDisponibles');

        // Guardar los cambios en el aula
        await aula.save();


        // Crear una nueva instancia de Reserva con los datos proporcionados
        const nuevaReserva = new Reserva({
            aula: aulaId,
            dia,
            hora_ini,
            hora_fin,
            duracion,
            usuario: req.usuario.id,
            created_at: Date.now()
        });

        // Guardar la reserva en la base de datos
        await nuevaReserva.save();

        // Devolver una respuesta de éxito
        return res.status(201).json({
            status: "success",
            message: "Reserva creada correctamente",
            reserva: nuevaReserva
        });
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la creación de la reserva
        console.error("Error al crear la reserva:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al crear la reserva"
        });
    }
}


// Función para cancelar reserva
const cancelarReserva = async (req, res) => {
    try {
        // Verificar el rol del usuario
        const { role } = req.usuario;
        if (role !== "alumno" && role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Acceso denegado. Solo los alumnos pueden cancelar reservas."
            });
        }

        // Extraer el ID de la reserva del cuerpo de la solicitud
        const { reservaId } = req.body;

        // Buscar la reserva por ID
        const reserva = await Reserva.findById(reservaId);
        if (!reserva) {
            return res.status(404).json({
                status: "error",
                message: "Reserva no encontrada"
            });
        }

        // Comprobar si el usuario tiene permiso para cancelar la reserva    !!!modificación sin comprobar correcto funcionamiento -> && req.usuario.role !== "admin"
        if (req.usuario.id !== reserva.usuario.toString() && req.usuario.role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "No tienes permiso para cancelar esta reserva."
            });
        }

        // Buscar el aula de la reserva
        const aula = await Aula.findById(reserva.aula);
        if (!aula) {
            return res.status(404).json({
                status: "error",
                message: "Aula no encontrada"
            });
        }

        // Cambiar el horario de la reserva a disponible
        const diaDate = new Date(reserva.dia);
        const horaIniDate = new Date(reserva.hora_ini);
        const horaFinDate = new Date(reserva.hora_fin);

        for (let i = 0; i < aula.horariosDisponibles.length; i++) {
            let horario = aula.horariosDisponibles[i];
            if (horario.dia.getTime() === diaDate.getTime() && horario.horaInicio.getTime() === horaIniDate.getTime() && horario.horaFin.getTime() === horaFinDate.getTime()) {
                // Actualizar el estado de disponibilidad
                aula.horariosDisponibles[i].disponible = true;
            }
        }

        // Indicar a Mongoose que el array 'horariosDisponibles' ha sido modificado
        aula.markModified('horariosDisponibles');

        // Guardar los cambios en el aula
        await aula.save();

        // Eliminar la reserva
        await Reserva.findByIdAndDelete(reservaId);

        // Devolver una respuesta de éxito
        return res.status(200).json({
            status: "success",
            message: "Reserva cancelada correctamente"
        });
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la cancelación de la reserva
        console.error("Error al cancelar la reserva:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al cancelar la reserva"
        });
    }
}

// Función para listar reservas
const listarReservas = async (req, res) => {
    try {
        // Verificar el rol del usuario
        const { role } = req.usuario;
        if (role !== "profesor" && role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Acceso denegado. Solo los profesores pueden ver todas las reservas."
            });
        }

        // Buscar todas las reservas
        const reservas = await Reserva.find().populate('aula').populate('usuario');

        // Devolver una respuesta con las reservas
        return res.status(200).json({
            status: "success",
            message: "Reservas obtenidas correctamente",
            reservas
        });
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la obtención de las reservas
        console.error("Error al obtener las reservas:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al obtener las reservas"
        });
    }
}


// Función para listar sólo las reservas de cada usuario
const listarReservasPorUsuario = async (req, res) => {
    try {
        // Extraer el ID del usuario de los parámetros de ruta
        const usuarioId = req.params.id;

        // Verificar el rol del usuario
        const { id, role } = req.usuario;
        if (role !== "admin" && id !== usuarioId) {
            return res.status(403).json({
                status: "error",
                message: "Acceso denegado. Solo el propietario o un administrador pueden ver las reservas."
            });
        }

        // Buscar todas las reservas del usuario
        const reservas = await Reserva.find({ usuario: usuarioId }).populate('aula').populate('usuario');

        // Devolver una respuesta con las reservas
        return res.status(200).json({
            status: "success",
            message: "Reservas obtenidas correctamente",
            reservas
        });
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la obtención de las reservas
        console.error("Error al obtener las reservas:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al obtener las reservas"
        });
    }
}




// Exportar acciones
module.exports = {
    pruebaReserva,
    crearReserva,
    cancelarReserva,
    listarReservas,
    listarReservasPorUsuario
}