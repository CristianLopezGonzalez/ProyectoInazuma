import Team from "../models/Team.js";
import Player from "../models/Player.js";
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

    const { search, page = 1, limit = 50 } = req.query;

    const filters = {};
    if (search) filters.name = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;

    const teams = await Team.find(filters)
      .populate("coach players createdBy")
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ name: 1 });

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
    const team = await Team.findById(req.params.id).populate("coach players createdBy");

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

// @desc    Crear equipo (usuarios normales)
// @route   POST /api/teams
// @access  Private/User
export const createTeam = async (req, res) => {
  try {
    const { name, logo, coach, players, formation } = req.body;

    // 1️⃣ Validar coach
    const coachData = await Player.findById(coach);
    if (!coachData || coachData.role !== "coach") {
      return res.status(400).json({
        success: false,
        message: "El coach no existe o no tiene el rol correcto",
      });
    }

    // 2️⃣ Validar jugadores
    if (!players || players.length < 16) {
      return res.status(400).json({
        success: false,
        message: "El equipo debe tener al menos 16 jugadores",
      });
    }

    const playerDocs = await Player.find({ _id: { $in: players } });

    if (playerDocs.length !== players.length) {
      return res.status(400).json({
        success: false,
        message: "Algunos jugadores no existen",
      });
    }

    const invalidPlayers = playerDocs.filter(p => p.role !== "player");
    if (invalidPlayers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Todos los jugadores deben tener rol 'player'",
      });
    }

    // 3️⃣ Validar duplicados
    const uniquePlayers = new Set(players.map(id => id.toString()));
    if (uniquePlayers.size !== players.length) {
      return res.status(400).json({
        success: false,
        message: "No se pueden repetir jugadores en el equipo",
      });
    }

    // 4️⃣ Coach no puede estar en players
    if (players.includes(coach)) {
      return res.status(400).json({
        success: false,
        message: "El coach no puede estar dentro de los jugadores",
      });
    }

    // 5️⃣ Crear equipo
    const team = await Team.create({
      name,
      logo,
      coach,
      players,
      formation,
      createdBy: req.user._id // el usuario logueado
    });

    // 6️⃣ Retornar con populate
    const populatedTeam = await Team.findById(team._id).populate("coach players createdBy");

    res.status(201).json({
      success: true,
      message: "Equipo creado exitosamente",
      team: populatedTeam,
    });
  } catch (error) {
    console.error("Error en createTeam:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear equipo",
      error: error.message,
    });
  }
};

// @desc    Actualizar equipo
// @route   PUT /api/teams/:id
// @access  Private/User (solo creador)
export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    // Validar que el usuario logueado sea el creador
    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para actualizar este equipo",
      });
    }

    Object.assign(team, req.body);
    await team.save();

    const populatedTeam = await Team.findById(team._id).populate("coach players createdBy");

    res.json({
      success: true,
      message: "Equipo actualizado exitosamente",
      team: populatedTeam,
    });
  } catch (error) {
    console.error("Error en updateTeam:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar equipo",
      error: error.message,
    });
  }
};

// @desc    Eliminar equipo
// @route   DELETE /api/teams/:id
// @access  Private/User (solo creador)
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar este equipo",
      });
    }

    await team.deleteOne();

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


export default {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  
};
