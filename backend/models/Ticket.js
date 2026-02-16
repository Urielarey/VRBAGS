const mongoose = require('mongoose');

/**
 * Modelo de Ticket (compra)
 */
const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: false, // Se generará automáticamente en el pre-save hook
    unique: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  purchaser: {
    type: String,
    required: true
  },
  purchaserEmail: {
    type: String,
    required: false,
    index: true // Índice para búsquedas rápidas
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'en_camino', 'rechazado', 'entregado'],
    default: 'pendiente',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Generar código único antes de guardar (se ejecuta antes de la validación)
ticketSchema.pre('validate', function(next) {
  if (!this.code) {
    this.code = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

// También asegurar en pre-save por si acaso
ticketSchema.pre('save', function(next) {
  if (!this.code) {
    this.code = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
