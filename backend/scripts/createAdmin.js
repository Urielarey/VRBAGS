require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

/**
 * Script para crear un usuario admin
 * Uso: node scripts/createAdmin.js
 */
async function createAdmin() {
  try {
    await connectDB();
    
    const adminEmail = 'admin@vrbags.com';
    const adminPassword = 'admin123';
    const adminFirstName = 'Admin';
    const adminLastName = 'VRBAGS';

    // Verificar si el admin ya existe
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✓ El usuario admin ya existe');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Rol: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Crear admin
    const admin = new User({
      first_name: adminFirstName,
      last_name: adminLastName,
      email: adminEmail,
      age: 0,
      password: adminPassword,
      role: 'admin'
    });

    await admin.save();

    console.log('✓ Admin creado exitosamente!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Rol: admin`);
    console.log('\n⚠️ Cambia la contraseña después de tu primer login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
