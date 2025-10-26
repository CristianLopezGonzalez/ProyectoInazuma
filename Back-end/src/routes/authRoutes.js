import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Validaciones
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('El username debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El username solo puede contener letras, números y guiones bajos'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Introduce un email válido')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    
    body('confirmPassword')
        .notEmpty()
        .withMessage('Debes confirmar la contraseña')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
];

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Introduce un email válido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
];

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

// Rutas públicas
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Rutas protegidas (requieren autenticación)
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, updateProfileValidation, authController.updateProfile);

export default router;