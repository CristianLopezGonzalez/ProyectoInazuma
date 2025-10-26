import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Proteger rutas - verificar JWT
export const protect = async (req, res, next) => {
    try {
        let token;

        // Obtener token del header Authorization
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Verificar si existe el token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado, token no encontrado'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Obtener usuario del token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar si el usuario está activo
        if (!req.user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Cuenta desactivada'
            });
        }

        next();

    } catch (error) {
        console.error('Error en protect middleware:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error en autenticación',
            error: error.message
        });
    }
};

// @desc    Verificar si el usuario es admin
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Acceso denegado. Solo administradores'
        });
    }
};

// @desc    Verificar si el usuario es el dueño del recurso
export const isOwner = (resourceUserId) => {
    return (req, res, next) => {
        if (req.user.id === resourceUserId.toString() || req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción'
            });
        }
    };
};

export default {
    protect,
    isAdmin,
    isOwner
};