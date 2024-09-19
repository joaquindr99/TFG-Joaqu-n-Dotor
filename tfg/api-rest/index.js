// Importar dependencias
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Mensaje bienvenida
console.log("API NODE para reserva de aulas arrancada!");

// Conexion a la base de datos
connection();

// Crear servidor node
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

//Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar conf rutas
const UsuarioRoutes = require("./routes/usuario");
const AulaRoutes = require("./routes/aula");
const ReservaRoutes = require("./routes/reserva");

app.use("/api/usuario", UsuarioRoutes);
app.use("/api/aula", AulaRoutes);
app.use("/api/reserva", ReservaRoutes);

// Ruta de prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json(
        {
            "id": 1,
            "nombre": "Joaquin"
        }
    );
})

// Poner servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor de node corriendo en el puerto: ", puerto);
});