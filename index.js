const express = require('express');
const { dbConection } = require('./database/config');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
// console.log(process.env);

// Crear servidor de express
const app = express();

// Base de datos
dbConection();

// CORS
app.use(cors());

// Directorio público
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Rutas
// TODO: auth // crear, login, renew
app.use('/api/auth', require('./routes/auth'));

// TODO CRUD: Eventos
app.use('/api/events', require('./routes/events'));

// Cualquier solicitud que no coincida con una ruta específica, recibirá el archivo index.html
app.get('/*path', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});