const express = require('express');
const router = express.Router();
const productsRouter = require('./products');
const cartsRouter = require('./carts');
const authRouter = require('./auth');
const ticketsRouter = require('./tickets');

router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/auth', authRouter);
router.use('/tickets', ticketsRouter);

module.exports = router;
