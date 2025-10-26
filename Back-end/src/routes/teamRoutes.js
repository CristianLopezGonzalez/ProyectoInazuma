import express from 'express';
import { body, param } from 'express-validator';
import { protect } from '../middlewares/authMiddleware.js';
import {
    getAllTeams,
    getMyTeams,
    getTeamById,
    createTeam,
    updateThisTeam,
    deleteTeam,
    togglePublic
} from '../controllers/teamController.js';

const router = express.Router();

// Validaciones
const createTeamValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre del equipo es obligatorio')
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    
    body('emblemId')
        .notEmpty()
        .withMessage('Debes seleccionar un escudo')
        .isMongoId()
        .withMessage('ID de escudo inválido'),
    
    body('coachId')
        .notEmpty()
        .withMessage('Debes seleccionar un entrenador')
        .isMongoId()
        .withMessage('ID de entrenador inválido'),
    
    body('formation')
        .optional()
        .isIn(['4-4-2', '4-3-3', '3-4-3', '3-5-2', '5-3-2', '4-2-4'])
        .withMessage('Formación inválida'),
    
    body('players')
        .isArray({ min: 11, max: 16 })
        .withMessage('Debes seleccionar entre 11 y 16 jugadores'),
    
    body('players.*.playerId')
        .isMongoId()
        .withMessage('ID de jugador inválido'),
    
    body('players.*.position')
        .isIn(['GK', 'DF', 'MF', 'FW', 'SUB'])
        .withMessage('Posición inválida'),
    
    body('players.*.number')
        .isInt({ min: 1, max: 16 })
        .withMessage('El número debe estar entre 1 y 16'),
    
    body('captainId')
        .optional()
        .isMongoId()
        .withMessage('ID de capitán inválido'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede tener más de 500 caracteres')
];

const updateTeamValidation = [
    param('id')
        .isMongoId()
        .withMessage('ID de equipo inválido'),
    
    ...createTeamValidation
];

// GET /api/teams - Obtener equipos públicos (sin autenticación)
router.get('/', getAllTeams);

// Rutas protegidas
router.use(protect);

// GET /api/teams/my-teams - Obtener equipos del usuario autenticado
router.get('/my-teams', getMyTeams);

// GET /api/teams/:id - Obtener un equipo específico
router.get('/:id', getTeamById);

// POST /api/teams - Crear nuevo equipo
router.post('/', createTeamValidation, createTeam);

// PUT /api/teams/:id - Actualizar equipo
router.put('/:id', updateTeamValidation, updateThisTeam);

// DELETE /api/teams/:id - Eliminar equipo
router.delete('/:id', deleteTeam);

// PATCH /api/teams/:id/toggle-public - Cambiar visibilidad del equipo
router.patch('/:id/toggle-public', togglePublic);

export default router;