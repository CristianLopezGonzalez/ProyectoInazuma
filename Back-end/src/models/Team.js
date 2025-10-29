import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 3,
    maxlength: 50
  },
  imageUrl: {
    type: String,
    required: true
  },
  emblemUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  gameVersion: {
    type: String,
    enum: ["IE1", "IE2", "IE3", "IEGO", "IEGOCS", "Ares/Orion", "victory Road", null],
    default: null
  }
}, {
  timestamps: true
});

export default teamSchema;