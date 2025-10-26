import Team from '../models/Team.js';
import Player from '../models/Player.js';
import Emblem from '../models/Emblem.js';
import { validationResult } from 'express-validator';

// @desc    Obtener equipos públicos
// @route   GET /api/teams
// @access  Public
export const getAllTeams = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const teams = await Team.find({ isPublic: true })
            .populate('userId', 'username avatar')
            .populate('emblem')
            .populate('coach', 'name imageUrl')
            .populate('players.playerId', 'name position imageUrl element')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Team.countDocuments({ isPublic: true });

        res.json({
            success: true,
            count: teams.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            teams
        });

    } catch (error) {
        console.error('Error en getAllTeams:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener equipos',
            error: error.message
        });
    }
};

// @desc    Obtener equipos del usuario autenticado
// @route   GET /api/teams/my-teams
// @access  Private
export const getMyTeams = async (req, res) => {
    try {
        const teams = await Team.find({ userId: req.user.id })
            .populate('emblem')
            .populate('coach', 'name imageUrl')
            .populate('players.playerId', 'name position imageUrl element')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: teams.length,
            teams
        });

    } catch (error) {
        console.error('Error en getMyTeams:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tus equipos',
            error: error.message
        });
    }
};

// @desc    Obtener un equipo específico
// @route   GET /api/teams/:id
// @access  Public
export const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('userId', 'username avatar')
            .populate('emblem')
            .populate('coach', 'name imageUrl team stats')
            .populate('players.playerId', 'name position imageUrl element stats techniques')
            .populate('captain', 'name imageUrl');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Equipo no encontrado'
            });
        }

        // Verificar si el equipo es privado y el usuario no es el dueño
        if (!team.isPublic && (!req.user || team.userId._id.toString() !== req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Este equipo es privado'
            });
        }

        res.json({
            success: true,
            team
        });

    } catch (error) {
        console.error('Error en getTeamById:', error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'ID de equipo inválido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener equipo',
            error: error.message
        });
    }
};

// @desc    Crear nuevo equipo
// @route   POST /api/teams
// @access  Private
export const createTeam = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { name, emblemId, coachId, formation, players, captainId, description, isPublic } = req.body;

        // Verificar que el escudo existe
        const emblem = await Emblem.findById(emblemId);
        if (!emblem) {
            return res.status(404).json({
                success: false,
                message: 'Escudo no encontrado'
            });
        }

        // Verificar que el coach existe y es realmente un coach
        const coach = await Player.findById(coachId);
        if (!coach) {
            return res.status(404).json({
                success: false,
                message: 'Entrenador no encontrado'
            });
        }
        if (coach.role !== 'coach') {
            return res.status(400).json({
                success: false,
                message: 'El personaje seleccionado no es un entrenador'
            });
        }

        // Verificar que todos los jugadores existen y son jugadores (no coaches)
        const playerIds = players.map(p => p.playerId);
        const playersData = await Player.find({ _id: { $in: playerIds } });

        if (playersData.length !== playerIds.length) {
            return res.status(404).json({
                success: false,
                message: 'Uno o más jugadores no encontrados'
            });
        }

        // Verificar que ninguno sea entrenador
        const hasCoach = playersData.some(p => p.role === 'coach');
        if (hasCoach) {
            return res.status(400).json({
                success: false,
                message: 'No puedes incluir entrenadores como jugadores'
            });
        }

        // Verificar números únicos
        const numbers = players.map(p => p.number);
        const uniqueNumbers = new Set(numbers);
        if (numbers.length !== uniqueNumbers.size) {
            return res.status(400).json({
                success: false,
                message: 'Los números de los jugadores deben ser únicos'
            });
        }

        // Verificar que hay al menos un portero
        const hasGK = players.some(p => p.position === 'GK');
        if (!hasGK) {
            return res.status(400).json({
                success: false,
                message: 'El equipo debe tener al menos un portero'
            });
        }

        // Verificar que el capitán está en el equipo (si se especifica)
        if (captainId && !playerIds.includes(captainId)) {
            return res.status(400).json({
                success: false,
                message: 'El capitán debe ser uno de los jugadores del equipo'
            });
        }

        // Crear equipo
        const team = await Team.create({
            name,
            userId: req.user.id,
            emblem: emblemId,
            coach: coachId,
            formation,
            players,
            captain: captainId,
            description,
            isPublic: isPublic || false
        });

        // Poblar datos para la respuesta
        await team.populate('emblem');
        await team.populate('coach', 'name imageUrl');
        await team.populate('players.playerId', 'name position imageUrl element');
        await team.populate('captain', 'name imageUrl');

        res.status(201).json({
            success: true,
            message: 'Equipo creado exitosamente',
            team
        });

    } catch (error) {
        console.error('Error en createTeam:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear equipo',
            error: error.message
        });
    }
};

// @desc    Actualizar equipo
// @route   PUT /api/teams/:id
// @access  Private
export const updateThisTeam = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        // Buscar equipo
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Equipo no encontrado'
            });
        }

        // Verificar que el usuario es el dueño
        if (team.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para editar este equipo'
            });
        }

        // Validaciones similares a createTeam
        const { emblemId, coachId, players, captainId } = req.body;

        if (emblemId) {
            const emblem = await Emblem.findById(emblemId);
            if (!emblem) {
                return res.status(404).json({
                    success: false,
                    message: 'Escudo no encontrado'
                });
            }
        }

        if (coachId) {
            const coach = await Player.findById(coachId);
            if (!coach || coach.role !== 'coach') {
                return res.status(400).json({
                    success: false,
                    message: 'Entrenador inválido'
                });
            }
        }

        if (players) {
            const playerIds = players.map(p => p.playerId);
            const playersData = await Player.find({ _id: { $in: playerIds } });

            if (playersData.length !== playerIds.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Uno o más jugadores no encontrados'
                });
            }

            const hasCoach = playersData.some(p => p.role === 'coach');
            if (hasCoach) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes incluir entrenadores como jugadores'
                });
            }

            const numbers = players.map(p => p.number);
            const uniqueNumbers = new Set(numbers);
            if (numbers.length !== uniqueNumbers.size) {
                return res.status(400).json({
                    success: false,
                    message: 'Los números de los jugadores deben ser únicos'
                });
            }

            const hasGK = players.some(p => p.position === 'GK');
            if (!hasGK) {
                return res.status(400).json({
                    success: false,
                    message: 'El equipo debe tener al menos un portero'
                });
            }

            if (captainId && !playerIds.includes(captainId)) {
                return res.status(400).json({
                    success: false,
                    message: 'El capitán debe ser uno de los jugadores del equipo'
                });
            }
        }

        // Actualizar equipo
        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('emblem')
            .populate('coach', 'name imageUrl')
            .populate('players.playerId', 'name position imageUrl element')
            .populate('captain', 'name imageUrl');

        res.json({
            success: true,
            message: 'Equipo actualizado exitosamente',
            team: updatedTeam
        });

    } catch (error) {
        console.error('Error en updateTeam:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar equipo',
            error: error.message
        });
    }
};

// @desc    Eliminar equipo
// @route   DELETE /api/teams/:id
// @access  Private
export const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Equipo no encontrado'
            });
        }

        // Verificar que el usuario es el dueño
        if (team.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar este equipo'
            });
        }

        await team.deleteOne();

        res.json({
            success: true,
            message: 'Equipo eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error en deleteTeam:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar equipo',
            error: error.message
        });
    }
};

// @desc    Cambiar visibilidad del equipo (público/privado)
// @route   PATCH /api/teams/:id/toggle-public
// @access  Private
export const togglePublic = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Equipo no encontrado'
            });
        }

        // Verificar que el usuario es el dueño
        if (team.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para modificar este equipo'
            });
        }

        team.isPublic = !team.isPublic;
        await team.save();

        res.json({
            success: true,
            message: `Equipo ahora es ${team.isPublic ? 'público' : 'privado'}`,
            isPublic: team.isPublic
        });

    } catch (error) {
        console.error('Error en togglePublic:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar visibilidad',
            error: error.message
        });
    }
};

export default {
    getAllTeams,
    getMyTeams,
    getTeamById,
    createTeam,
    updateThisTeam,
    deleteTeam,
    togglePublic
};