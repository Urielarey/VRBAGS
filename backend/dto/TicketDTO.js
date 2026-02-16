const ProductDTO = require('./ProductDTO');

/**
 * Data Transfer Object para Tickets
 */
class TicketDTO {
  constructor(ticket) {
    try {
    this.id = ticket._id || ticket.id;
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.status = ticket.status || 'pendiente';
      this.products = ticket.products ? ticket.products.map(item => {
        try {
          // Si el producto está poblado (es un objeto con _id), crear ProductDTO
          if (item.product && typeof item.product === 'object' && item.product._id) {
            try {
              return {
                product: new ProductDTO(item.product),
                quantity: item.quantity,
                price: item.price
              };
            } catch (dtoError) {
              console.error('Error creando ProductDTO:', dtoError);
              // Si falla, devolver solo el ID
              return {
                product: item.product._id || item.product.id || item.product,
                quantity: item.quantity,
                price: item.price
              };
            }
          }
          // Si el producto es solo un ID (ObjectId o string)
          return {
            product: item.product?._id || item.product?.id || item.product || null,
            quantity: item.quantity,
            price: item.price
          };
        } catch (error) {
          console.error('Error procesando producto en TicketDTO:', error);
          return {
            product: item.product?._id || item.product?.id || item.product || null,
            quantity: item.quantity || 0,
            price: item.price || 0
          };
        }
      }) : [];
      this.createdAt = ticket.createdAt;
      this.updatedAt = ticket.updatedAt;
    } catch (error) {
      console.error('Error en constructor de TicketDTO:', error);
      throw error;
    }
  }

  /**
   * Convierte un array de tickets a DTOs
   */
  static fromArray(tickets) {
    return tickets.map(ticket => new TicketDTO(ticket));
  }
}

module.exports = TicketDTO;
