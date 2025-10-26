import express from 'express';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import {
    getAllEscudos,
    getEscudoById,
    createEscudo,
    updateEscudo,
    deleteEscudo
} from '../controllers/emblemController.js';

const router = express.Router();

// GET /api/emblems - Obtener todos los escudos disponibles (público)
router.get('/', getAllEscudos);

// GET /api/emblems/:id - Obtener un escudo específico (público)
router.get('/:id', getEscudoById);

// Rutas protegidas (solo admin)
router.use(protect, isAdmin);

// POST /api/emblems - Crear escudo
router.post('/', createEscudo);

// PUT /api/emblems/:id - Actualizar escudo
router.put('/:id', updateEscudo);

// DELETE /api/emblems/:id - Eliminar escudo
router.delete('/:id', deleteEscudo);

export default router;