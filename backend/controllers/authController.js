const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const UserDTO = require('../dto/UserDTO');
const CartDAO = require('../dao/CartDAO');
const nodemailer = require('nodemailer');

/**
 * Controlador de Autenticación
 */
class AuthController {
  /**
   * Generar token JWT
   */
  _generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  /**
   * Configurar transporter de email
   */
  _getEmailTransporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  /**
   * POST /api/auth/register
   * Registrar nuevo usuario
   */
  async register(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'El email ya está registrado'
        });
      }

      // Crear carrito para el usuario
      const cart = await CartDAO.create();

      // Crear usuario
      const user = new User({
        first_name,
        last_name,
        email,
        age,
        password,
        cart: cart._id
      });

      await user.save();

      // Generar token
      const token = this._generateToken(user._id);

      res.status(201).json({
        status: 'success',
        payload: {
          user: new UserDTO(user),
          token
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/auth/login
   * Iniciar sesión
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Credenciales inválidas'
        });
      }

      // Generar token
      const token = this._generateToken(user._id);

      res.json({
        status: 'success',
        payload: {
          user: new UserDTO(user),
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * GET /api/auth/current
   * Obtener usuario actual (solo DTO, sin información sensible)
   */
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({
        status: 'success',
        payload: new UserDTO(user)
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Solicitar recuperación de contraseña
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Por seguridad, no revelamos si el email existe o no
        return res.json({
          status: 'success',
          message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
        });
      }

      // Generar token de recuperación
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date();
      resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Expira en 1 hora

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpires;
      await user.save();

      // Enviar email
      const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      try {
        const transporter = this._getEmailTransporter();
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@vrbags.com',
          to: user.email,
          subject: 'Recuperación de contraseña - VRBAGS',
          html: `
            <h2>Recuperación de contraseña</h2>
            <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste este cambio, ignora este email.</p>
          `
        });
      } catch (emailError) {
        console.error('Error enviando email:', emailError);
        // Continuar aunque falle el email (en desarrollo)
      }

      res.json({
        status: 'success',
        message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/auth/reset-password
   * Restablecer contraseña con token
   */
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'Token inválido o expirado'
        });
      }

      // Verificar que no sea la contraseña anterior
      const isSamePassword = await user.comparePassword(password);
      if (isSamePassword) {
        return res.status(400).json({
          status: 'error',
          message: 'No puedes usar la misma contraseña anterior'
        });
      }

      // Actualizar contraseña
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({
        status: 'success',
        message: 'Contraseña restablecida correctamente'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();
