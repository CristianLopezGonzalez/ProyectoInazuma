import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    role: {
        type: String,
        required: true,
        enum: ['player', 'coach']
    },
    
    number: {
        type: Number,
        min: 1,
        max: 99
    },
    
    position: {
        type: String,
        enum: ['GK', 'DF', 'MF', 'FW', null],
        default: null
    },
    
    element: {
        type: String,
        enum: ['Fire', 'Wind', 'Wood', 'Mountain', null],
        default: null
    },
    
    stats: {
        Technique: { type: Number, default: 0 },
        Control: { type: Number, default: 0 },
        Kick: { type: Number, default: 0 },
        Pressure: { type: Number, default: 0 },
        Physical: { type: Number, default: 0 },
        Agility: { type: Number, default: 0 },
        Intelligence: { type: Number, default: 0 }
    },
    
    techniques: [{
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['Shoot', 'Dribble', 'Block', 'Catch', 'Special']
        },
        element: {
            type: String,
            enum: ['Fire', 'Wind', 'Wood', 'Mountain', null]
        },
        tpCost: {
            type: Number,
            default: 0
        }
    }],
    
    team: {
        type: String,
        required: true
    },
    
    avatar: {
        name: String,
        armed: Boolean
    },
    
    imageUrl: {
        type: String,
        required: true
    },
    
    level: {
        type: Number,
        default: 1,
        min: 1,
        max: 99
    },
    
    evolution: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    },
    
    gender: {
        type: String,
        enum: ['Male', 'Female', null],
        default: null
    },
    
    description: {
        type: String
    },
    
    gameVersion: {
        type: String,
        enum: ['IE1', 'IE2', 'IE3', 'GO', 'CS', 'Ares/Orion', null],
        default: null
    }
    
}, {
    timestamps: true
});

playerSchema.index({ role: 1 });
playerSchema.index({ position: 1 });
playerSchema.index({ element: 1 });
playerSchema.index({ team: 1 });

playerSchema.virtual('overall').get(function() {
    if (this.role === 'coach') return null;
    
    const stats = this.stats;
    return Math.round(
        (stats.kick + stats.dribble + stats.block + stats.catch + 
         stats.speed + stats.stamina + stats.guts) / 7
    );
});

playerSchema.set('toJSON', { virtuals: true });
playerSchema.set('toObject', { virtuals: true });

const Player = mongoose.model('Player', playerSchema);

export default Player;