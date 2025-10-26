import mongoose from 'mongoose';

const emblemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    
    imageUrl: {
        type: String,
        required: true
    },
    
    teamOrigin: {
        type: String,
        required: true
    },
    
    gameVersion: {
        type: String,
        enum: ['IE1', 'IE2', 'IE3', 'GO', 'CS', 'Ares/Orion', 'All'],
        default: 'All'
    },
    
    isAvailable: {
        type: Boolean,
        default: true
    }
    
}, {
    timestamps: true
});

const Emblem = mongoose.model('Emblem', emblemSchema);

export default Emblem;