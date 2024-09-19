const express = require("express");
const router = express.Router();
const AulaController = require("../controllers/aula");
const check = require("../middlewares/auth");

// Definir rutas
router.get("/prueba-aula", AulaController.pruebaAula);
router.get("/obtener-aula", AulaController.obtenerAula);
router.get("/listar-aulas", AulaController.listarAulas);
router.post("/crear-aula", check.auth, AulaController.crearAula);
router.post("/actualizar-horarios", check.auth, AulaController.actualizarHorarios);
router.delete("/eliminar-aula", check.auth, AulaController.eliminarAula);

// Exportar router

module.exports = router;