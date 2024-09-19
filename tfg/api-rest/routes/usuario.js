const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuario");
const check = require("../middlewares/auth");

// Definir rutas
router.get("/prueba-usuario", check.auth, UsuarioController.pruebaUsuario);
router.post("/registro", UsuarioController.registro);
router.post("/login", UsuarioController.login);
router.get("/perfil/:id", check.auth, UsuarioController.perfil);

// Exportar router

module.exports = router;