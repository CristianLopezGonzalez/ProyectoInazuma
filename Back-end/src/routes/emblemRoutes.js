import express from 'express';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import {
    getAllEscudos,
    getEscudoById,
    createEscudo,
} from '../controllers/emblemController.js';

const router = express.Router();

// GET /api/emblems - Obtener todos los escudos disponibles (público)
router.get('/', getAllEscudos);

// GET /api/emblems/:id - Obtener un escudo específico (público)
router.get('/:id', getEscudoById);

// Rutas protegidas (solo admin para creación)
router.use(protect, isAdmin);

// POST /api/emblems - Crear escudo
router.post('/', createEscudo);

export default router;
