const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');
const { authenticate, authorizeCart } = require('../../middleware/auth');

// Rutas públicas (carrito local)
router.get('/:cid', cartController.getCartById.bind(cartController));
router.post('/', cartController.createCart.bind(cartController));

// Rutas que requieren autenticación y autorización
router.put('/:cid', authenticate, authorizeCart, cartController.updateCart.bind(cartController));
router.put('/:cid/products/:pid', authenticate, authorizeCart, cartController.updateProductQuantity.bind(cartController));
router.delete('/:cid/products/:pid', authenticate, authorizeCart, cartController.removeProduct.bind(cartController));
router.delete('/:cid', authenticate, authorizeCart, cartController.deleteCart.bind(cartController));

module.exports = router;
