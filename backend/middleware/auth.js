const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticación
 * Verifica el token JWT en las peticiones
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No se proporcionó token de autenticación'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado'
    });
  }
};

/**
 * Middleware de autorización por roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

/**
 * Middleware de autorización de carrito
 * Verifica que el usuario sea propietario del carrito
 */
const authorizeCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado'
      });
    }

    // Verificar que el carrito pertenezca al usuario
    if (user.cart && user.cart.toString() !== cid) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permiso para acceder a este carrito'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  authorizeCart
};
