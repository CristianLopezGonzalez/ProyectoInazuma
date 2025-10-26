import User from '../models/user.js';
import Team from '../models/Team.js';
import { validationResult } from 'express-validator';

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('profile.favoriteCharacter', 'name imageUrl');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Error en getProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { username, profile } = req.body;

        // Si se intenta cambiar el username, verificar que no exista
        if (username && username !== req.user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({
                    success: false,
                    message: 'El username ya está en uso'
                });
            }
        }

        // Actualizar usuario
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                ...(username && { username }),
                ...(profile && { profile })
            },
            { new: true, runValidators: true }
        ).populate('profile.favoriteCharacter', 'name imageUrl');

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error en updateProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil',
            error: error.message
        });
    }
};

// @desc    Cambiar contraseña
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { currentPassword, newPassword } = req.body;

        
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña actual incorrecta'
            });
        }

        
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error en changePassword:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar contraseña',
            error: error.message
        });
    }
};

//!  Ver equipos públicos de otro usuario
//!  GET /api/users/:id/teams
//!  Public
export const getUserTeams = async (req, res) => {
    try {
       
        const user = await User.findById(req.params.id).select('username avatar');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        
        const teams = await Team.find({ 
            userId: req.params.id,
            isPublic: true 
        })
            .populate('emblem')
            .populate('coach', 'name imageUrl')
            .populate('players.playerId', 'name position imageUrl element')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            user: {
                username: user.username,
                avatar: user.avatar
            },
            count: teams.length,
            teams
        });

    } catch (error) {
        console.error('Error en getUserTeams:', error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener equipos del usuario',
            error: error.message
        });
    }
};

// @desc    Eliminar cuenta de usuario
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

       
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta'
            });
        }

        
        await Team.deleteMany({ userId: req.user.id });

        
        await user.deleteOne();

        res.json({
            success: true,
            message: 'Cuenta eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error en deleteAccount:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar cuenta',
            error: error.message
        });
    }
};

export default {
    getProfile,
    updateProfile,
    changePassword,
    getUserTeams,
    deleteAccount
};