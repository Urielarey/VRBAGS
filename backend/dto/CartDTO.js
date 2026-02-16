const ProductDTO = require('./ProductDTO');

/**
 * Data Transfer Object para Carritos
 */
class CartDTO {
  constructor(cart) {
    this.id = cart._id || cart.id;
    this.products = cart.products ? cart.products.map(item => ({
      product: item.product && typeof item.product === 'object' 
        ? new ProductDTO(item.product) 
        : item.product,
      quantity: item.quantity
    })) : [];
    this.createdAt = cart.createdAt;
    this.updatedAt = cart.updatedAt;
  }

  /**
   * Convierte un array de carritos a DTOs
   */
  static fromArray(carts) {
    return carts.map(cart => new CartDTO(cart));
  }
}

module.exports = CartDTO;
