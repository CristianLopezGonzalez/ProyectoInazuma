import Emblem from '../models/Emblem.js';

// @desc    Obtener todos los escudos disponibles
// @route   GET /api/emblems
// @access  Public
export const getAllEscudos = async (req, res) => {
    try {
        const { gameVersion } = req.query;

        // Construir filtros
        const filters = { isAvailable: true };
        if (gameVersion) {
            filters.$or = [
                { gameVersion: gameVersion },
                { gameVersion: 'All' }
            ];
        }

        const emblems = await Emblem.find(filters).sort({ name: 1 });

        res.json({
            success: true,
            count: emblems.length,
            emblems
        });

    } catch (error) {
        console.error('Error en getAllEmblems:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener escudos',
            error: error.message
        });
    }
};

// @desc    Obtener un escudo por ID
// @route   GET /api/emblems/:id
// @access  Public
export const getEscudoById = async (req, res) => {
    try {
        const emblem = await Emblem.findById(req.params.id);

        if (!emblem) {
            return res.status(404).json({
                success: false,
                message: 'Escudo no encontrado'
            });
        }

        res.json({
            success: true,
            emblem
        });

    } catch (error) {
        console.error('Error en getEmblemById:', error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'ID de escudo inválido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener escudo',
            error: error.message
        });
    }
};

// @desc    Crear escudo (solo admin)
// @route   POST /api/emblems
// @access  Private/Admin
export const createEscudo = async (req, res) => {
    try {
        const emblem = await Emblem.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Escudo creado exitosamente',
            emblem
        });

    } catch (error) {
        console.error('Error en createEmblem:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un escudo con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear escudo',
            error: error.message
        });
    }
};

// @desc    Actualizar escudo (solo admin)
// @route   PUT /api/emblems/:id
// @access  Private/Admin
export const updateEscudo = async (req, res) => {
    try {
        const emblem = await Emblem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!emblem) {
            return res.status(404).json({
                success: false,
                message: 'Escudo no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Escudo actualizado exitosamente',
            emblem
        });

    } catch (error) {
        console.error('Error en updateEmblem:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar escudo',
            error: error.message
        });
    }
};

// @desc    Eliminar escudo (solo admin)
// @route   DELETE /api/emblems/:id
// @access  Private/Admin
export const deleteEscudo = async (req, res) => {
    try {
        const emblem = await Emblem.findByIdAndDelete(req.params.id);

        if (!emblem) {
            return res.status(404).json({
                success: false,
                message: 'Escudo no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Escudo eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error en deleteEmblem:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar escudo',
            error: error.message
        });
    }
};

export default {
    getAllEscudos,
    getEscudoById,
    createEscudo,
    updateEscudo,
    deleteEscudo
};