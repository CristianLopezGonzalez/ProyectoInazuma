import express from 'express';
import { query, body, param } from 'express-validator';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamsStats
} from '../controllers/teamController.js';

const router = express.Router();

// Validaciones para filtros
const filterValidation = [
    query('gameVersion')
        .optional()
        .isIn(['IE1', 'IE2', 'IE3', 'IEGO', 'IEGOCS', 'Ares/Orion', 'victory Road'])
        .withMessage('Versión de juego inválida'),

    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('La búsqueda debe tener entre 1 y 50 caracteres'),

    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número mayor a 0'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe estar entre 1 y 100')
];

// Validaciones para crear/actualizar equipo
const teamValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre del equipo es obligatorio')
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    
    body('imageUrl')
        .notEmpty()
        .withMessage('La imagen del equipo es obligatoria')
        .isURL()
        .withMessage('Debe ser una URL válida'),
    
    body('emblemUrl')
        .notEmpty()
        .withMessage('El escudo del equipo es obligatorio')
        .isURL()
        .withMessage('Debe ser una URL válida'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede tener más de 500 caracteres'),

    body('gameVersion')
        .optional()
        .isIn(['IE1', 'IE2', 'IE3', 'IEGO', 'IEGOCS', 'Ares/Orion', 'victory Road'])
        .withMessage('Versión de juego inválida')
];

// GET /api/teams/stats/overview - Obtener estadísticas generales
router.get('/stats/overview', getTeamsStats);

// GET /api/teams - Obtener todos los equipos con filtros
router.get('/', filterValidation, getAllTeams);

// GET /api/teams/:id - Obtener un equipo específico
router.get('/:id', getTeamById);

// Rutas protegidas (solo admin)
router.use(protect);
router.use(isAdmin);

// POST /api/teams - Crear equipo
router.post('/', teamValidation, createTeam);

// PUT /api/teams/:id - Actualizar equipo
router.put('/:id', teamValidation, updateTeam);

// DELETE /api/teams/:id - Eliminar equipo
router.delete('/:id', deleteTeam);

export default router;