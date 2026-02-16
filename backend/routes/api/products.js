const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const { authenticate, authorize } = require('../../middleware/auth');

// Rutas públicas
router.get('/', productController.getProducts.bind(productController));
router.get('/:pid', productController.getProductById.bind(productController));

// Rutas protegidas (solo admin)
router.post('/', authenticate, authorize('admin'), productController.createProduct.bind(productController));
router.put('/:pid', authenticate, authorize('admin'), productController.updateProduct.bind(productController));
router.delete('/:pid', authenticate, authorize('admin'), productController.deleteProduct.bind(productController));

module.exports = router;
