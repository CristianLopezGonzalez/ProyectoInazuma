import express from 'express';
import { query, body, param } from 'express-validator';
import { protect } from '../middlewares/authMiddleware.js';
import {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam
} from '../controllers/teamController.js';

const router = express.Router();

// Validaciones para filtros
const filterValidation = [
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

    body('logo')
        .notEmpty()
        .withMessage('El logo del equipo es obligatorio'),

    body('coach')
        .notEmpty()
        .withMessage('El entrenador es obligatorio'),

    body('players')
        .isArray({ min: 16 })
        .withMessage('El equipo debe tener al menos 16 jugadores'),

    body('formation')
        .notEmpty()
        .isIn(["3-5-2", "4-4-2", "4-3-3", "4-5-1", "3-6-1", "5-4-1"])
        .withMessage('Formación inválida')
];

// GET /api/teams - Obtener todos los equipos con filtros
router.get('/', filterValidation, getAllTeams);

// GET /api/teams/:id - Obtener un equipo específico
router.get('/:id', getTeamById);

// Rutas protegidas (usuarios logueados)
router.use(protect);

// POST /api/teams - Crear equipo
router.post('/', teamValidation, createTeam);

// PUT /api/teams/:id - Actualizar equipo (solo creador)
router.put('/:id', teamValidation, updateTeam);

// DELETE /api/teams/:id - Eliminar equipo (solo creador)
router.delete('/:id', deleteTeam);

export default router;
