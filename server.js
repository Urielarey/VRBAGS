const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Configuración de Mercado Pago
const mercadopago = require('mercadopago');

// Validar que exista el token de Mercado Pago
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
if (!MP_ACCESS_TOKEN) {
  console.error('❌ Error: MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno');
  console.error('📝 Crea un archivo .env con tu token de Mercado Pago');
  process.exit(1);
}

// Configurar Mercado Pago
mercadopago.configure({
  access_token: MP_ACCESS_TOKEN
});

console.log('✅ Mercado Pago configurado correctamente');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'", "https://api.mercadopago.com"]
    }
  }
}));

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.use('/api', require('./routes/api'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de la tienda
app.get('/tienda', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/tienda.html'));
});

// Ruta del carrito
app.get('/carrito', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/carrito.html'));
});

// Rutas para Mercado Pago
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/success.html'));
});

app.get('/failure', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/failure.html'));
});

app.get('/pending', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/pending.html'));
});

// Ruta de estado del servidor
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    mercadopago: MP_ACCESS_TOKEN ? 'Configurado' : 'No configurado'
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err);
  
  res.status(err.status || 500).json({
    error: 'Algo salió mal en el servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Servidor VRBAGS iniciado correctamente');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🛍️  Tienda: http://localhost:${PORT}/tienda`);
  console.log(`🛒 Carrito: http://localhost:${PORT}/carrito`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💳 Mercado Pago: ${MP_ACCESS_TOKEN.startsWith('TEST') ? 'Modo Prueba' : 'Modo Producción'}`);
  console.log(`⏰ Iniciado: ${new Date().toLocaleString('es-AR')}`);
});

module.exports = app;
