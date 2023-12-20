const express = require('express');
const authController = require('../Controllers/authController');
const {getCartItems, addToCart, clearCart, removeFromCart, increment, decrement, checkOut} = require('../Controllers/cartController');
const router = express.Router();

router.get('/getCartItems',authController,getCartItems);
router.post('/addToCart',authController,addToCart);

router.patch('/increment',authController,increment);
router.patch('/decrement',authController,decrement);
router.post('/removeFromCart',authController,removeFromCart);
router.post('/clearCart',authController,clearCart);
router.post('/checkOut',authController,checkOut);

module.exports = router;