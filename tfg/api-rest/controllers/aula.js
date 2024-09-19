// Importar modelo
const Aula = require("../models/aula");
const mongoose = require('mongoose');

// Acciones de prueba
const pruebaAula = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/aula.js"
    });
}

// Función para crear un nuevo aula (solo para profesores y admins)
const crearAula = async (req, res) => {
    try {
        // Verificar el rol del usuario
        const { role } = req.usuario;

        if (role !== "profesor" && role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Acceso denegado. El usuario no tiene permisos para realizar esta acción."
            });
        }

        // Extraer los datos del cuerpo de la solicitud
        const { nombre, capacidad, bloque, planta, descripcion, horariosDisponibles } = req.body;

        // Comprobar si ya existe una aula con el mismo nombre
        const aulaExistente = await Aula.findOne({ nombre: nombre });
        if (aulaExistente) {
            return res.status(400).json({
                status: "error",
                message: "Ya existe una aula con este nombre."
            });
        }

        // Crear una nueva instancia de Aula con los datos proporcionados
        const nuevaAula = new Aula({
            usuario: req.usuario.id,
            nombre,
            capacidad,
            bloque,
            planta,
            descripcion,
            horariosDisponibles,
            created_at: Date.now()
        });

        // Guardar el aula en la base de datos
        await nuevaAula.save();

        // Devolver una respuesta de éxito
        return res.status(201).json({
            status: "success",
            message: "Aula creada correctamente",
            aula: nuevaAula
        });
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la creación del aula
        console.error("Error al crear el aula:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al crear el aula"
        });
    }
}

// Funcion para obtener aula
const obtenerAula = async (req, res) => {
    try {
        // Extraer el ID del aula del cuerpo de la solicitud
        const { aulaId } = req.body;

        // Buscar el aula por ID
        const aula = await Aula.findById(aulaId);
        if (!aula) {
            return res.status(404).json({
                status: "error",
                message: "Aula no encontrada"
            });
        }

        // Devolver una respuesta de éxito con los detalles del aula
        return res.status(200).json({
            status: "success",
            aula: aula
        });
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda del aula
        console.error("Error al obtener el aula:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al obtener el aula"
        });
    }
}

// Función para eliminar aula
const eliminarAula = async (req, res) => {
    try {
        // Verificar el rol del usuario
        const { role } = req.usuario;
        if (role !== "profesor" && role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Acceso denegado. El usuario no tiene permisos para realizar esta acción."
            });
        }

        // Extraer el ID del aula del cuerpo de la solicitud
        const { aulaId } = req.body;

        // Buscar el aula por ID y eliminarla
        const aula = await Aula.findByIdAndDelete(aulaId);
        if (!aula) {
            return res.status(404).json({
                status: "error",
                message: "Aula no encontrada"
            });
        }

        // Devolver una respuesta de éxito
        return res.status(200).json({
            status: "success",
            message: "Aula eliminada correctamente",
            aula: aula
        });
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la eliminación del aula
        console.error("Error al eliminar el aula:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar el aula"
        });
    }
}


// Función para añadir nuevos horarios disponibles
const actualizarHorarios = async (req, res) => {
    try {
        /*
        // Verificar el rol del usuario
        const { role } = req.usuario;
        if (role !== "profesor" && role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Acceso denegado. El usuario no tiene permisos para realizar esta acción."
            });
        } 
        */

        // Extraer los datos del cuerpo de la solicitud
        const { aulaId, horariosDisponibles } = req.body;

        // Buscar el aula por ID
        const aula = await Aula.findById(aulaId);
        if (!aula) {
            return res.status(404).json({
                status: "error",
                message: "Aula no encontrada"
            });
        }

        // Filtrar los horarios que ya están en el array horariosDisponibles
        const horariosNoDuplicados = horariosDisponibles.filter(horario => {
            return !aula.horariosDisponibles.some(h => 
                h.dia.getTime() === new Date(horario.dia).getTime() &&
                h.horaInicio.getTime() === new Date(horario.horaInicio).getTime() &&
                h.horaFin.getTime() === new Date(horario.horaFin).getTime()
            );
        });

        // Si hay horarios no duplicados, actualizamos el aula
        if (horariosNoDuplicados.length > 0) {
            aula.horariosDisponibles.push(...horariosNoDuplicados);
            await aula.save();
        }

        // Devolver una respuesta de éxito
        return res.status(200).json({
            status: "success",
            message: "Horarios actualizados correctamente",
            aula: aula
        });
    } catch (error) {
        console.error("Error al actualizar los horarios:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar los horarios"
        });
    }
};

// Función para listar aulas
const listarAulas = async (req, res) => {
    try {
        let aulas = await Aula.find();

        // Obtener la fecha actual
        const fechaActual = new Date();

        // Recorre cada aula y actualiza los horarios pasados
        aulas = aulas.map(aula => {
            aula.horariosDisponibles = aula.horariosDisponibles.map(horario => {
                if (new Date(horario.dia) < fechaActual) {
                    horario.disponible = false; // Marcar como no disponible
                }
                return horario;
            });
            return aula;
        });

        // Guarda los cambios automáticamente
        await Promise.all(aulas.map(aula => aula.save()));

        return res.status(200).send({
            status: 'success',
            aulas: aulas
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al listar las aulas.'
        });
    }
}


// Exportar acciones
module.exports = {
    pruebaAula,
    obtenerAula,
    crearAula,
    actualizarHorarios,
    eliminarAula,
    listarAulas
}