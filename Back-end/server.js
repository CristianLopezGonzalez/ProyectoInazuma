import dotenv from 'dotenv';
dotenv.config();

import {connectDB} from './src/config/db.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar rutas
import authRoutes from './src/routes/authRoutes.js';
import playerRoutes from './src/routes/playerRoutes.js';
import emblemRoutes from './src/routes/emblemRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Debe ir ANTES de las rutas estáticas
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'src/public')));



// Conectar a la base de datos
connectDB();

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/emblems', emblemRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Ruta no encontrada' 
    });
});

// Manejo de errores general
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT} http://localhost:${PORT}`);
});