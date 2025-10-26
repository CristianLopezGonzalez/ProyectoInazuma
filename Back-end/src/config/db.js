import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const URI = process.env.MONGODB_URI;

export async function connectDB() {
    try {
        await mongoose.connect(URI);
        console.log("Conectado a la base de datos MongoDB");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
        process.exit(1);
    }
}