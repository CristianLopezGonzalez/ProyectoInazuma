import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({

  // Nombre del equipo (custom, lo elige el usuario)
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Logo del equipo (ID o URL predefinida)
  logo: {
    type: String,
    required: true
  },

  // Entrenador elegido
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true
  },

  // Jugadores seleccionados
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true
    }
  ],

  // Formación
  formation: {
    type: String,
    enum: [
      "3-5-2",
      "4-4-2",
      "4-3-3",
      "4-5-1",
      "3-6-1",
      "5-4-1"
    ],
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Team", teamSchema);
