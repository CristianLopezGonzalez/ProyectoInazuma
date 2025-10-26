import express from 'express';
import { query } from 'express-validator';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import {
    getAllPlayers,
    getCoaches,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
} from '../controllers/playerController.js';
const router = express.Router();

// Validaciones para filtros
const filterValidation = [
    query('role')
        .optional()
        .isIn(['player', 'coach'])
        .withMessage('El rol debe ser "player" o "coach"'),

    query('position')
        .optional()
        .isIn(['GK', 'DF', 'MF', 'FW'])
        .withMessage('Posición inválida'),

    query('element')
        .optional()
        .isIn(['Fire', 'Wind', 'Wood', 'Mountain'])
        .withMessage('Elemento inválido'),

    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('La búsqueda debe tener entre 1 y 50 caracteres')
];

router.use(protect);

// GET /api/players - Obtener todos los jugadores con filtros
router.get('/', filterValidation, getAllPlayers);

// GET /api/players/coaches - Obtener solo entrenadores
router.get('/coaches', getCoaches);

// GET /api/players/:id - Obtener un jugador específico
router.get('/:id', getPlayerById);

// POST /api/players (solo admin) - Crear jugador
router.post('/',isAdmin ,createPlayer);

// PUT /api/players/:id (solo admin) - Actualizar jugador
router.put('/:id',isAdmin ,updatePlayer);

// DELETE /api/players/:id (solo admin) - Eliminar jugador
router.delete('/:id',isAdmin, deletePlayer);

export default router;