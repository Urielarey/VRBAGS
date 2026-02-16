const Cart = require('../models/Cart');

/**
 * Data Access Object para Carritos
 */
class CartDAO {
  /**
   * Crear un nuevo carrito
   */
  async create() {
    try {
      const cart = new Cart({ products: [] });
      return await cart.save();
    } catch (error) {
      throw new Error(`Error creando carrito: ${error.message}`);
    }
  }

  /**
   * Obtener carrito por ID con productos populados
   */
  async findById(id) {
    try {
      return await Cart.findById(id).populate('products.product');
    } catch (error) {
      throw new Error(`Error obteniendo carrito: ${error.message}`);
    }
  }

  /**
   * Actualizar carrito completo
   */
  async update(id, updateData) {
    try {
      return await Cart.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).populate('products.product');
    } catch (error) {
      throw new Error(`Error actualizando carrito: ${error.message}`);
    }
  }

  /**
   * Agregar producto al carrito
   */
  async addProduct(cartId, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === productId.toString()
      );

      if (existingProductIndex >= 0) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      return await cart.save();
    } catch (error) {
      throw new Error(`Error agregando producto al carrito: ${error.message}`);
    }
  }

  /**
   * Actualizar cantidad de un producto en el carrito
   */
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId.toString()
      );

      if (productIndex >= 0) {
        if (quantity <= 0) {
          cart.products.splice(productIndex, 1);
        } else {
          cart.products[productIndex].quantity = quantity;
        }
      } else {
        throw new Error('Producto no encontrado en el carrito');
      }

      return await cart.save();
    } catch (error) {
      throw new Error(`Error actualizando cantidad: ${error.message}`);
    }
  }

  /**
   * Eliminar producto del carrito
   */
  async removeProduct(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = cart.products.filter(
        item => item.product.toString() !== productId.toString()
      );

      return await cart.save();
    } catch (error) {
      throw new Error(`Error eliminando producto del carrito: ${error.message}`);
    }
  }

  /**
   * Vaciar carrito
   */
  async clear(cartId) {
    try {
      return await Cart.findByIdAndUpdate(
        cartId,
        { $set: { products: [] } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error vaciando carrito: ${error.message}`);
    }
  }

  /**
   * Eliminar carrito
   */
  async delete(id) {
    try {
      return await Cart.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error eliminando carrito: ${error.message}`);
    }
  }
}

module.exports = new CartDAO();
