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
    
}, {
    timestamps: true
});

const Emblem = mongoose.model('Emblem', emblemSchema);

export default Emblem;