const CartDAO = require('../dao/CartDAO');
const CartDTO = require('../dto/CartDTO');

/**
 * Repository Pattern para Carritos
 */
class CartRepository {
  /**
   * Crear carrito
   */
  async create() {
    const cart = await CartDAO.create();
    return new CartDTO(cart);
  }

  /**
   * Obtener carrito por ID
   */
  async findById(id) {
    const cart = await CartDAO.findById(id);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return new CartDTO(cart);
  }

  /**
   * Actualizar carrito completo
   */
  async update(id, updateData) {
    const cart = await CartDAO.update(id, updateData);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return new CartDTO(cart);
  }

  /**
   * Agregar producto al carrito
   */
  async addProduct(cartId, productId, quantity = 1) {
    await CartDAO.addProduct(cartId, productId, quantity);
    const cart = await CartDAO.findById(cartId);
    return new CartDTO(cart);
  }

  /**
   * Actualizar cantidad de producto
   */
  async updateProductQuantity(cartId, productId, quantity) {
    await CartDAO.updateProductQuantity(cartId, productId, quantity);
    const cart = await CartDAO.findById(cartId);
    return new CartDTO(cart);
  }

  /**
   * Eliminar producto del carrito
   */
  async removeProduct(cartId, productId) {
    await CartDAO.removeProduct(cartId, productId);
    const cart = await CartDAO.findById(cartId);
    return new CartDTO(cart);
  }

  /**
   * Vaciar carrito
   */
  async clear(cartId) {
    const cart = await CartDAO.clear(cartId);
    return new CartDTO(cart);
  }

  /**
   * Eliminar carrito
   */
  async delete(id) {
    const cart = await CartDAO.delete(id);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return new CartDTO(cart);
  }
}

module.exports = new CartRepository();
