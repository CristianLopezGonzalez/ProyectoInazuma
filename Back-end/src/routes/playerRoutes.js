import express from 'express';
import { query } from 'express-validator';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import {
  getAllPlayers,
  getOnlyPlayers,
  getCoaches,
  getPlayerById,
  createPlayer,
} from '../controllers/playerController.js';

const router = express.Router();

// Validaciones de filtros
const filterValidation = [
  query('role')
    .optional()
    .isIn(['jugador', 'entrenador'])
    .withMessage('El rol debe ser "jugador" o "entrenador"'),
  query('position')
    .optional()
    .isIn(['PR', 'DF', 'MD', 'DL', 'DT'])
    .withMessage('Posición inválida'),
  query('element')
    .optional()
    .isIn(['montaña', 'fuego', 'bosque', 'viento'])
    .withMessage('Elemento inválido'),
  query('gender')
    .optional()
    .isIn(['Masculino', 'Femenino'])
    .withMessage('El género debe ser "Masculino" o "Femenino"'),
  query('gameVersion')
    .optional()
    .isIn(['IE1', 'IE2', 'IE3', 'IEGO', 'IEGOCS', 'Ares/Orion', 'Victory Road'])
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
    .withMessage('El límite debe estar entre 1 y 100'),
];


router.get('/', filterValidation,protect, getAllPlayers);
router.get('/only-players',protect, getOnlyPlayers);
router.get('/coaches',protect, getCoaches);
router.get('/:id',protect, getPlayerById);


router.post('/', protect, isAdmin, createPlayer);

export default router;
