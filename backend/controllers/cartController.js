const CartRepository = require('../repository/CartRepository');

/**
 * Controlador de Carritos
 */
class CartController {
  /**
   * DELETE /api/carts/:cid/products/:pid
   * Eliminar producto del carrito
   */
  async removeProduct(req, res) {
    try {
      const { cid, pid } = req.params;
      await CartRepository.removeProduct(cid, pid);
      
      // Obtener carrito actualizado con productos populados
      const cart = await CartRepository.findById(cid);
      
      res.json({
        status: 'success',
        payload: cart
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * PUT /api/carts/:cid
   * Actualizar carrito completo
   */
  async updateCart(req, res) {
    try {
      const { cid } = req.params;
      const cart = await CartRepository.update(cid, req.body);
      
      res.json({
        status: 'success',
        payload: cart
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * PUT /api/carts/:cid/products/:pid
   * Actualizar cantidad de producto en el carrito
   */
  async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({
          status: 'error',
          message: 'La cantidad debe ser mayor a 0'
        });
      }

      const cart = await CartRepository.updateProductQuantity(cid, pid, quantity);
      
      // Obtener carrito actualizado con productos populados
      const updatedCart = await CartRepository.findById(cid);
      
      res.json({
        status: 'success',
        payload: updatedCart
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/carts/:cid
   * Eliminar carrito
   */
  async deleteCart(req, res) {
    try {
      const { cid } = req.params;
      await CartRepository.delete(cid);
      
      res.json({
        status: 'success',
        message: 'Carrito eliminado correctamente'
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * GET /api/carts/:cid
   * Obtener carrito por ID
   */
  async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const cart = await CartRepository.findById(cid);
      
      res.json({
        status: 'success',
        payload: cart
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/carts
   * Crear nuevo carrito
   */
  async createCart(req, res) {
    try {
      const cart = await CartRepository.create();
      
      res.status(201).json({
        status: 'success',
        payload: cart
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new CartController();
