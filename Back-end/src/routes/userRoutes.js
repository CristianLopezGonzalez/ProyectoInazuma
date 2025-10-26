import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middlewares/authMiddleware.js';
import {
    getProfile,
    updateProfile,
    changePassword,
    getUserTeams,
    deleteAccount
} from '../controllers/userController.js';

const router = express.Router();

// Validaciones
const updateProfileValidation = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('El username debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El username solo puede contener letras, números y guiones bajos'),
    
    body('profile.favoriteCharacter')
        .optional()
        .isMongoId()
        .withMessage('ID de personaje inválido'),
    
    body('profile.favoriteElement')
        .optional()
        .isIn(['Fire', 'Wind', 'Wood', 'Mountain'])
        .withMessage('Elemento inválido'),
    
    body('profile.bio')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('La biografía no puede tener más de 200 caracteres')
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('La contraseña actual es obligatoria'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('La nueva contraseña debe ser diferente a la actual');
            }
            return true;
        })
];

const deleteAccountValidation = [
    body('password')
        .notEmpty()
        .withMessage('Debes confirmar tu contraseña para eliminar la cuenta')
];

// Rutas protegidas
router.use(protect);

// GET /api/users/profile - Obtener perfil del usuario autenticado
router.get('/profile', getProfile);

// PUT /api/users/profile - Actualizar perfil
router.put('/profile', updateProfileValidation, updateProfile);

// PUT /api/users/change-password - Cambiar contraseña
router.put('/change-password', changePasswordValidation, changePassword);

// GET /api/users/:id/teams - Ver equipos públicos de otro usuario
router.get('/:id/teams', getUserTeams);

// DELETE /api/users/account - Eliminar cuenta
router.delete('/account', deleteAccountValidation, deleteAccount);

export default router;