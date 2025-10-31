import Player from '../models/Player.js';
import { validationResult } from 'express-validator';

// @desc    Obtener todos los jugadores con filtros
// @route   GET /api/players
// @access  Public
export const getAllPlayers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {
      role,
      position,
      element,
      gender,
      gameVersion,
      search,
      page = 1,
      limit = 50,
    } = req.query;

    // Construir filtros
    const filters = {};

    if (role) filters.role = role;
    if (position) filters.position = { $regex: `^${position}$`, $options: 'i' }; // insensible a mayúsculas
    if (element) filters.element = { $regex: `^${element}$`, $options: 'i' };   // insensible a mayúsculas
    if (gender) filters.gender = gender;
    if (gameVersion) filters.gameVersion = gameVersion;
    if (search) filters.name = { $regex: search, $options: 'i' };

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Obtener jugadores
    const players = await Player.find(filters)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ name: 1 });

    // Contar total
    const total = await Player.countDocuments(filters);

    res.json({
      success: true,
      count: players.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      players,
    });
  } catch (error) {
    console.error('Error en getAllPlayers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener jugadores',
      error: error.message,
    });
  }
};

// @desc    Obtener solo jugadores (sin entrenadores)
// @route   GET /api/players/only-players
// @access  Public
export const getOnlyPlayers = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const players = await Player.find({ role: 'jugador' })
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ name: 1 });

    const total = await Player.countDocuments({ role: 'jugador' });

    res.json({
      success: true,
      count: players.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      players,
    });
  } catch (error) {
    console.error('Error en getOnlyPlayers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener jugadores',
      error: error.message,
    });
  }
};

// @desc    Obtener solo entrenadores
// @route   GET /api/players/coaches
// @access  Public
export const getCoaches = async (req, res) => {
  try {
    const coaches = await Player.find({ role: 'entrenador' }).sort({ name: 1 });

    res.json({
      success: true,
      count: coaches.length,
      coaches,
    });
  } catch (error) {
    console.error('Error en getCoaches:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener entrenadores',
      error: error.message,
    });
  }
};

// @desc    Obtener un jugador por ID
// @route   GET /api/players/:id
// @access  Public
export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Jugador no encontrado',
      });
    }

    res.json({
      success: true,
      player,
    });
  } catch (error) {
    console.error('Error en getPlayerById:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'ID de jugador inválido',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al obtener jugador',
      error: error.message,
    });
  }
};

// @desc    Crear jugador (solo admin)
// @route   POST /api/players
// @access  Private/Admin
export const createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Jugador creado exitosamente',
      player,
    });
  } catch (error) {
    console.error('Error en createPlayer:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un jugador con ese nombre',
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear jugador',
      error: error.message,
    });
  }
};



export default {
  getAllPlayers,
  getOnlyPlayers,
  getCoaches,
  getPlayerById,
  createPlayer,
};
