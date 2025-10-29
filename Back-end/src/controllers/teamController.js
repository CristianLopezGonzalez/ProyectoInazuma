import Team from "../models/Team.js";
import { validationResult } from "express-validator";

// @desc    Obtener todos los equipos con filtros
// @route   GET /api/teams
// @access  Public
export const getAllTeams = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { gameVersion, search, page = 1, limit = 50 } = req.query;

    // Construir filtros
    const filters = {};

    if (gameVersion) filters.gameVersion = gameVersion;
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Obtener equipos
    const teams = await Team.find(filters)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ name: 1 });

    // Contar total
    const total = await Team.countDocuments(filters);

    res.json({
      success: true,
      count: teams.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      teams,
    });
  } catch (error) {
    console.error("Error en getAllTeams:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener equipos",
      error: error.message,
    });
  }
};

// @desc    Obtener un equipo por ID
// @route   GET /api/teams/:id
// @access  Public
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    res.json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("Error en getTeamById:", error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "ID de equipo inválido",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al obtener equipo",
      error: error.message,
    });
  }
};

// @desc    Crear equipo (solo admin)
// @route   POST /api/teams
// @access  Private/Admin
export const createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);

    res.status(201).json({
      success: true,
      message: "Equipo creado exitosamente",
      team,
    });
  } catch (error) {
    console.error("Error en createTeam:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un equipo con ese nombre",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al crear equipo",
      error: error.message,
    });
  }
};

// @desc    Actualizar equipo (solo admin)
// @route   PUT /api/teams/:id
// @access  Private/Admin
export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Equipo actualizado exitosamente",
      team,
    });
  } catch (error) {
    console.error("Error en updateTeam:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al actualizar equipo",
      error: error.message,
    });
  }
};

// @desc    Eliminar equipo (solo admin)
// @route   DELETE /api/teams/:id
// @access  Private/Admin
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Equipo eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error en deleteTeam:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar equipo",
      error: error.message,
    });
  }
};

// @desc    Obtener estadísticas generales de equipos
// @route   GET /api/teams/stats/overview
// @access  Public
export const getTeamsStats = async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments();

    const teamsByGameVersion = await Team.aggregate([
      { $match: { gameVersion: { $ne: null } } },
      { $group: { _id: "$gameVersion", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalTeams,
        byGameVersion: teamsByGameVersion,
      },
    });
  } catch (error) {
    console.error("Error en getTeamsStats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};

export default {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamsStats,
};