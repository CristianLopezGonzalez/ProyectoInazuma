import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El username es obligatorio'],
        unique: true,
        trim: true,
        minlength: [3, 'El username debe tener al menos 3 caracteres'],
        maxlength: [30, 'El username no puede tener más de 30 caracteres']
    },
    
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor introduce un email válido']
    },
    
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false
    },
    
    avatar: {
        type: String,
        default: '/images/avatars/default-avatar.png'
    },
    
    profile: {
        favoriteCharacter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        },
        favoriteElement: {
            type: String,
            enum: ['Fire', 'Wind', 'Wood', 'Mountain', null],
            default: null
        },
        bio: {
            type: String,
            maxlength: 200
        }
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
    
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;