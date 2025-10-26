import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    emblem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emblem',
        required: true
    },
    
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    
    formation: {
        type: String,
        default: '4-4-2',
        enum: ['4-4-2', '4-3-3', '3-4-3', '3-5-2', '5-3-2', '4-2-4']
    },
    
    players: [{
        playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: true
        },
        position: {
            type: String,
            enum: ['GK', 'DF', 'MF', 'FW', 'SUB'],
            required: true
        },
        number: {
            type: Number,
            min: 1,
            max: 16,
            required: true
        },
        fieldPosition: {
            x: { type: Number, min: 0, max: 100 },
            y: { type: Number, min: 0, max: 100 }
        }
    }],
    
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    
    isPublic: {
        type: Boolean,
        default: false
    },
    
    description: {
        type: String,
        maxlength: 500
    }
    
}, {
    timestamps: true
});

teamSchema.pre('save', function(next) {
    if (this.players.length > 16) {
        return next(new Error('Un equipo no puede tener más de 16 jugadores'));
    }
    if (this.players.length < 11) {
        return next(new Error('Un equipo debe tener al menos 11 jugadores'));
    }
    next();
});

teamSchema.pre('save', function(next) {
    const numbers = this.players.map(p => p.number);
    const uniqueNumbers = new Set(numbers);
    
    if (numbers.length !== uniqueNumbers.size) {
        return next(new Error('Los números de los jugadores deben ser únicos'));
    }
    next();
});

teamSchema.pre('save', function(next) {
    const gkCount = this.players.filter(p => p.position === 'GK').length;
    if (gkCount === 0) {
        return next(new Error('El equipo debe tener al menos un portero'));
    }
    next();
});

teamSchema.methods.calculateTeamOverall = async function() {
    await this.populate('players.playerId');
    
    const totalOverall = this.players.reduce((sum, player) => {
        return sum + (player.playerId.overall || 0);
    }, 0);
    
    return Math.round(totalOverall / this.players.length);
};

teamSchema.index({ userId: 1 });
teamSchema.index({ name: 1 });
teamSchema.index({ isPublic: 1 });

const Team = mongoose.model('Team', teamSchema);

export default Team;