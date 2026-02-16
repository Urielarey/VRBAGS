require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

/**
 * Script para convertir un usuario a admin
 * Uso: node scripts/upgradeToAdmin.js
 */
async function upgradeToAdmin() {
  try {
    await connectDB();
    
    const userEmail = 'uro2006arey@gmail.com';

    // Buscar el usuario
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log(`❌ Usuario ${userEmail} no encontrado`);
      process.exit(0);
    }

    // Actualizar rol
    user.role = 'admin';
    await user.save();

    console.log('✓ Usuario actualizado a admin exitosamente!');
    console.log(`Email: ${user.email}`);
    console.log(`Nombre: ${user.first_name} ${user.last_name}`);
    console.log(`Rol: ${user.role}`);
    console.log('\n✅ Ya puedes acceder al panel admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

upgradeToAdmin();
