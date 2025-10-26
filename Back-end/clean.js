import mongoose from 'mongoose';
import 'dotenv/config';

async function diagnoseAndClean() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');
        
        const db = mongoose.connection.db;
        
        // Listar todas las colecciones
        const collections = await db.listCollections().toArray();
        console.log('📦 Colecciones encontradas:', collections.map(c => c.name).join(', '));
        console.log('\n');
        
        // Revisar índices de cada colección
        for (const collection of collections) {
            const collName = collection.name;
            console.log(`\n📋 Índices en "${collName}":`);
            
            try {
                const indexes = await db.collection(collName).indexes();
                indexes.forEach(index => {
                    const keys = Object.keys(index.key);
                    if (keys.includes('name')) {
                        console.log(`   ⚠️  ${JSON.stringify(index.key)} (index name: ${index.name})`);
                    } else {
                        console.log(`   ✓  ${JSON.stringify(index.key)}`);
                    }
                });
            } catch (e) {
                console.log(`   Error leyendo índices: ${e.message}`);
            }
        }
        
        console.log('\n\n🗑️  ¿Quieres eliminar TODOS los índices (excepto _id) de todas las colecciones?');
        console.log('Esto limpiará: players, users, emblems, teams, etc.\n');
        
        // Eliminar todos los índices
        for (const collection of collections) {
            const collName = collection.name;
            try {
                await db.collection(collName).dropIndexes();
                console.log(`✅ Índices eliminados de: ${collName}`);
            } catch (e) {
                if (e.message.includes('ns not found')) {
                    console.log(`ℹ️  ${collName}: sin índices`);
                } else {
                    console.log(`⚠️  ${collName}: ${e.message}`);
                }
            }
        }
        
        console.log('\n🎉 Limpieza completada!');
        console.log('📌 Reinicia tu servidor: npm run dev\n');
        
        await mongoose.connection.close();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        await mongoose.connection.close();
        process.exit(1);
    }
}

diagnoseAndClean();