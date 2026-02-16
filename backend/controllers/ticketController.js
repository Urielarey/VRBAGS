const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const TicketDTO = require('../dto/TicketDTO');
const CartRepository = require('../repository/CartRepository');
const ProductRepository = require('../repository/ProductRepository');
const ProductDAO = require('../dao/ProductDAO');

/**
 * Controlador de Tickets (Compras)
 */
class TicketController {
  /**
   * POST /api/tickets
   * Crear ticket de compra
   * Valida stock y actualiza productos
   */
  async createTicket(req, res) {
    try {
      const { cartId, purchaser } = req.body;

      // Obtener carrito con productos populados
      const cart = await CartRepository.findById(cartId);
      if (!cart || cart.products.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El carrito está vacío'
        });
      }

      // Validar stock y calcular total
      const productsToPurchase = [];
      const productsWithoutStock = [];
      let totalAmount = 0;

      for (const item of cart.products) {
        const product = item.product;
        const requestedQuantity = item.quantity;

        if (product.stock < requestedQuantity) {
          productsWithoutStock.push({
            product: product.title || product.id,
            requested: requestedQuantity,
            available: product.stock
          });
        } else {
          productsToPurchase.push({
            product: product.id || product._id,
            quantity: requestedQuantity,
            price: product.price
          });
          totalAmount += product.price * requestedQuantity;
        }
      }

      // Si hay productos sin stock, devolver error parcial
      if (productsWithoutStock.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Algunos productos no tienen stock suficiente',
          payload: {
            productsWithoutStock,
            productsToPurchase
          }
        });
      }

      // Crear ticket
      const userEmail = req.user?.email?.toLowerCase() || purchaser?.toLowerCase();
      const ticket = new Ticket({
        purchaser: purchaser || req.user?.email || 'guest',
        purchaserEmail: userEmail,
        userId: req.user?.id || null,
        amount: totalAmount,
        products: productsToPurchase.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        }))
      });

      await ticket.save();

      // Actualizar stock de productos
      for (const item of productsToPurchase) {
        await ProductRepository.updateStock(item.product, item.quantity);
      }

      // Vaciar carrito
      await CartRepository.clear(cartId);

      res.status(201).json({
        status: 'success',
        payload: new TicketDTO(ticket)
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/tickets/guest
   * Crear ticket para usuario NO autenticado usando email
   */
  async createGuestTicket(req, res) {
    try {
      const { purchaser, purchaserName, amount, products } = req.body;

      console.log('createGuestTicket - Request body:', { purchaser, purchaserName, amount, productsCount: products?.length });

      if (!purchaser || !products || products.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Email y productos son requeridos'
        });
      }

      // Validar que los productos existan y tengan stock
      const productsToPurchase = [];
      const productsWithoutStock = [];
      let totalAmount = 0;

      for (const item of products) {
        try {
          if (!item.product) {
            console.error('Item sin product:', item);
            return res.status(400).json({
              status: 'error',
              message: 'Producto inválido: falta ID del producto'
            });
          }

          // Obtener el ID del producto (puede venir como string o ObjectId)
          let productId = item.product;
          if (typeof productId === 'object' && productId !== null) {
            productId = productId._id || productId.id;
          }

          // Validar que el ID sea un ObjectId válido
          if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            console.error('ID de producto inválido:', productId, 'Item completo:', item);
            return res.status(400).json({
              status: 'error',
              message: `ID de producto inválido: ${productId || 'undefined'}`
            });
          }

          // Usar ProductDAO directamente para evitar problemas con DTO
          const productModel = await ProductDAO.findById(productId);
          if (!productModel) {
            console.error('Producto no encontrado en BD:', productId);
            return res.status(400).json({
              status: 'error',
              message: `Producto ${productId} no encontrado en la base de datos`
            });
          }
          
          const requestedQuantity = item.quantity || 1;
          const finalProductId = productModel._id || productModel.id;
          const productStock = productModel.stock || 0;
          const productPrice = item.price || productModel.price || 0;
          
          if (productStock < requestedQuantity) {
            productsWithoutStock.push({
              product: productModel.title || finalProductId,
              requested: requestedQuantity,
              available: productStock
            });
          } else {
            productsToPurchase.push({
              product: finalProductId,
              quantity: requestedQuantity,
              price: productPrice
            });
            totalAmount += productPrice * requestedQuantity;
          }
        } catch (error) {
          console.error('Error validando producto:', error);
          console.error('Item que causó el error:', item);
          return res.status(400).json({
            status: 'error',
            message: `Error al validar producto: ${error.message}`,
            productId: item.product
          });
        }
      }

      if (productsWithoutStock.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Algunos productos no tienen stock suficiente',
          payload: {
            productsWithoutStock,
            productsToPurchase
          }
        });
      }

      console.log('Productos a comprar:', productsToPurchase.map(p => ({
        product: String(p.product),
        quantity: p.quantity,
        price: p.price
      })));
      console.log('Total amount:', amount || totalAmount);
      console.log('Purchaser:', purchaserName || purchaser);
      console.log('Purchaser email:', purchaser.toLowerCase());

      // Crear ticket
      const ticketData = {
        purchaser: purchaserName || purchaser,
        purchaserEmail: purchaser.toLowerCase(),
        amount: amount || totalAmount,
        products: productsToPurchase.map(item => {
          let productId = item.product;
          
          // Convertir a ObjectId si es válido
          if (mongoose.Types.ObjectId.isValid(productId)) {
            productId = new mongoose.Types.ObjectId(productId);
          } else {
            throw new Error(`ID de producto inválido: ${productId}`);
          }
          
          console.log('Mapeando producto:', {
            original: String(item.product),
            converted: String(productId),
            quantity: item.quantity,
            price: item.price
          });
          
          return {
            product: productId,
            quantity: item.quantity,
            price: item.price
          };
        })
      };
      
      console.log('Datos del ticket a crear:', {
        purchaser: ticketData.purchaser,
        purchaserEmail: ticketData.purchaserEmail,
        amount: ticketData.amount,
        productsCount: ticketData.products.length,
        products: ticketData.products.map(p => ({
          product: String(p.product),
          quantity: p.quantity,
          price: p.price
        }))
      });
      
      const ticket = new Ticket(ticketData);
      
      console.log('Ticket creado (antes de save), code:', ticket.code);
      
      await ticket.save();
      
      console.log('Ticket guardado exitosamente, ID:', ticket._id);

      // Actualizar stock de productos
      for (const item of productsToPurchase) {
        try {
          await ProductDAO.updateStock(item.product, item.quantity);
        } catch (stockError) {
          console.error('Error actualizando stock:', stockError);
          // Continuar aunque falle el stock update (el ticket ya se creó)
        }
      }

      console.log('Creando TicketDTO...');
      try {
        const ticketDTO = new TicketDTO(ticket);
        console.log('TicketDTO creado exitosamente');
        
        res.status(201).json({
          status: 'success',
          payload: ticketDTO
        });
      } catch (dtoError) {
        console.error('Error creando TicketDTO:', dtoError);
        // Si falla el DTO, devolver el ticket directamente
        res.status(201).json({
          status: 'success',
          payload: {
            id: ticket._id,
            code: ticket.code,
            purchase_datetime: ticket.purchase_datetime,
            amount: ticket.amount,
            purchaser: ticket.purchaser,
            purchaserEmail: ticket.purchaserEmail,
            products: ticket.products.map(item => ({
              product: String(item.product),
              quantity: item.quantity,
              price: item.price
            })),
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt
          }
        });
      }
    } catch (error) {
      console.error('Error completo en createGuestTicket:', error);
      console.error('Stack trace:', error.stack);
      console.error('Request body recibido:', JSON.stringify(req.body, null, 2));
      res.status(500).json({
        status: 'error',
        message: error.message || 'Error al procesar la compra',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * GET /api/tickets/:tid
   * Obtener ticket por ID
   */
  async getTicketById(req, res) {
    try {
      const { tid } = req.params;
      const ticket = await Ticket.findById(tid).populate('products.product');
      
      if (!ticket) {
        return res.status(404).json({
          status: 'error',
          message: 'Ticket no encontrado'
        });
      }

      res.json({
        status: 'success',
        payload: new TicketDTO(ticket)
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * GET /api/tickets/email/:email
   * Obtener tickets por email (para usuarios no autenticados)
   */
  async getTicketsByEmail(req, res) {
    try {
      const { email } = req.params;
      const tickets = await Ticket.find({ 
        purchaserEmail: email.toLowerCase(),
        userId: null // Solo tickets pendientes de asociar
      }).populate('products.product').sort({ purchase_datetime: -1 });

      res.json({
        status: 'success',
        payload: tickets.map(ticket => new TicketDTO(ticket))
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * GET /api/tickets/all
   * Obtener todos los tickets (solo admin)
   */
  async getAllTickets(req, res) {
    try {
      const tickets = await Ticket.find({})
        .populate('products.product')
        .populate('userId', 'first_name last_name email')
        .sort({ purchase_datetime: -1 });

      res.json({
        status: 'success',
        payload: tickets.map(ticket => new TicketDTO(ticket))
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * GET /api/tickets
   * Obtener tickets del usuario actual
   */
  async getUserTickets(req, res) {
    try {
      const userId = req.user.id;
      const userEmail = req.user.email.toLowerCase();

      // Buscar tickets asociados al usuario (por userId o por email)
      const tickets = await Ticket.find({
        $or: [
          { userId: userId },
          { purchaserEmail: userEmail }
        ]
      }).populate('products.product').sort({ purchase_datetime: -1 });

      res.json({
        status: 'success',
        payload: tickets.map(ticket => new TicketDTO(ticket))
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * PUT /api/tickets/associate
   * Asociar tickets pendientes al usuario actual
   */
  async associateTicketsToUser(req, res) {
    try {
      const userId = req.user.id;
      const userEmail = req.user.email.toLowerCase();

      // Buscar tickets pendientes con el email del usuario
      const pendingTickets = await Ticket.find({
        purchaserEmail: userEmail,
        userId: null
      });

      if (pendingTickets.length === 0) {
        return res.json({
          status: 'success',
          message: 'No hay tickets pendientes para asociar',
          payload: []
        });
      }

      // Asociar tickets al usuario
      const updatedTickets = await Promise.all(
        pendingTickets.map(ticket => {
          ticket.userId = userId;
          ticket.purchaser = userEmail; // Actualizar purchaser al email del usuario
          return ticket.save();
        })
      );

      res.json({
        status: 'success',
        message: `${updatedTickets.length} ticket(s) asociado(s) correctamente`,
        payload: updatedTickets.map(ticket => new TicketDTO(ticket))
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * PUT /api/tickets/:id/status
   * Actualizar estado de un ticket (solo admin)
   */
  async updateTicketStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validar que el estado sea válido
      const validStatuses = ['pendiente', 'en_proceso', 'en_camino', 'rechazado', 'entregado'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`
        });
      }

      const ticket = await Ticket.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('products.product').populate('userId', 'first_name last_name email');

      if (!ticket) {
        return res.status(404).json({
          status: 'error',
          message: 'Ticket no encontrado'
        });
      }

      res.json({
        status: 'success',
        payload: new TicketDTO(ticket)
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new TicketController();
