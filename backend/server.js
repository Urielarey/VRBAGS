require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://www.vrbags.store'
  ],
  credentials: true
}));


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes y assets)
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/public/assets')));

// Ruta raíz - Información del API
app.get('/', (req, res) => {
  res.json({
    message: 'VRBAGS Ecommerce API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      products: '/api/products',
      carts: '/api/carts',
      auth: '/api/auth',
      tickets: '/api/tickets'
    },
    frontend: process.env.FRONTEND_URL || 'http://localhost:3001',
    note: 'Este es el backend API. Accede al frontend en el puerto 3001'
  });
});

// Rutas API
app.use('/api', apiRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
