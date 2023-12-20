
const userModel = require('../models/userModel');
const authController =require('./authController');
const { responseCreator } = require('../utils/responseCreator');

const getCartItems = async (req, res, next) => {
    try {
        const {username} = res.locals.user;
        const data = await userModel.getCartItems(username);
        res.send(responseCreator('Cart items', 200, data));
    } catch (error) {
        next(error);
    }
}

const addToCart = async (req, res, next) => {
    try {
        const product = req.body
        const { username } = res.locals.user;
        const data = await userModel.addToCart(username, product);
        res.send(responseCreator(`${product.title} addeed to cart`,200, data));
        console.log(data)

    } catch (error) {
        next(error)
    }
};
const increment = async (req, res, next) => {
    try {
        const product = req.body
        const { username } = res.locals.user;
        const {cart,totalValue} = await userModel.increment(username, product,true);
        res.send(responseCreator(`${product.title} addeed to cart`,200,{cart,totalValue} ));
        console.log(data)
    } catch (error) {
        next(error)
    }
};
const decrement = async (req, res, next) => {
    try {
        const product = req.body
        const { username } = res.locals.user;
        const {cart,totalValue} = await userModel.increment(username, product,false);
        res.send(responseCreator(`${product.title} removed  from cart`,200, {cart,totalValue}));
        console.log(data)
    } catch (error) {
        next(error)
    }
};
 const removeFromCart = async (req, res, next) => {
    try {
        const product = req.body
        console.log(product);
        const { username } = res.locals.user;
        const data = await userModel.removeFromCart(username, product);
        res.send(responseCreator(`${product.title} removed from cart`,200, data));

    } catch (error) {
        next(error)
    }
};
const clearCart = async (req, res, next) => {
    try {
        const { username } = res.locals.user;
        const {cart,totalValue,totalCount} = await userModel.clearCart(username);
        res.send(responseCreator(`cart is cleared`,200 ,{cart,totalValue,totalCount}));
    } 
    catch (error) 
    {
        next(error);
    }
};
const checkOut = async (req,res,next) =>{
    try {
        const { username } = res.locals.user;
        const data = await userModel.checkOut(username);
        res.send(responseCreator('Order Placed Successfully!!',200,data));

    } catch (error) {
        next(error);
        
    }
}






module.exports = { getCartItems, addToCart,removeFromCart,clearCart,increment,decrement,checkOut }
