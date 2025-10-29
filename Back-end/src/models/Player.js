import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Masculino", "Femenino"],
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      required: true,
      enum: ["PR", "DF", "MD", "DL", "DT"],
    },

    role: {
      type: String,
      required: true,
      enum: ["jugador", "entrenador"],
      default: "jugador",
    },

    stats: {
      patada: { type: Number, default: 0, min: 0, max: 100 },
      control: { type: Number, default: 0, min: 0, max: 100 },
      tecnica: { type: Number, default: 0, min: 0, max: 100 },
      precision: { type: Number, default: 0, min: 0, max: 100 },
      fisico: { type: Number, default: 0, min: 0, max: 100 },
      agilidad: { type: Number, default: 0, min: 0, max: 100 },
      inteligencia: { type: Number, default: 0, min: 0, max: 100 },
    },

    element: {
      type: String,
      enum: ["montaña", "fuego", "bosque", "viento", null],
      default: null,
    },

    number: {
      type: Number,
      min: 1,
      max: 99,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    gameVersion: {
      type: String,
      enum: [
        "IE1",
        "IE2",
        "IE3",
        "IEGO",
        "IEGOCS",
        "Ares/Orion",
        "Victory Road",
        null,
      ],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

playerSchema.index({ role: 1 });
playerSchema.index({ position: 1 });
playerSchema.index({ element: 1 });
playerSchema.index({ name: 1 });

playerSchema.virtual("overall").get(function () {
  if (this.role === "entrenador") return null;

  const stats = this.stats;
  const totalStats =
    stats.patada +
    stats.control +
    stats.tecnica +
    stats.precision +
    stats.fisico +
    stats.agilidad +
    stats.inteligencia;

  return Math.round(totalStats / 7);
});

playerSchema.set("toJSON", { virtuals: true });
playerSchema.set("toObject", { virtuals: true });

const Player = mongoose.model("Player", playerSchema);

export default Player;