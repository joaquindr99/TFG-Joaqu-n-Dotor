const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reserva");
const check = require("../middlewares/auth");

// Definir rutas
router.get("/prueba-reserva", ReservaController.pruebaReserva);
router.get("/listar-reservas", check.auth, ReservaController.listarReservas);
router.get("/mis-reservas/:id", check.auth, ReservaController.listarReservasPorUsuario);
router.post("/crear-reserva", check.auth, ReservaController.crearReserva);
router.delete("/cancelar-reserva", check.auth, ReservaController.cancelarReserva);

// Exportar router

module.exports = router;