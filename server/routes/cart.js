const express = require('express');
const cartRouter = express.Router();
const emitter = require('../events');
const CartService = require('../services/cartService');

const { AuthFromCookie } = require('../services/jwtService');
cartRouter.use(AuthFromCookie);    // protecting the whole route

//GET cart of user
cartRouter.get('/', async(req,res,next) => {
    try {
        const cart = await CartService.loadCart(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        next(error)
    }
});
 
//ADD to cart
cartRouter.post('/', async(req,res,next) => {
    try {
        const item = await CartService.addItem(req.user.cart_id, req.body.track_id);
        res.status(200).json(item);
    } catch (error) {
        next(error)
    }
});

//DELETE from cart
cartRouter.delete('/:id', async(req,res,next) => {
    try {
        const response = await CartService.deleteItem(req.params.id)
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
});

//CHECKOUT current cart
cartRouter.post('/checkout', async(req,res,next) => {
    try {

        const response = await CartService.checkOut(req.body, req.user);
        res.status(200).json(response);
        
        // emitter.emit('purchase', req.user.email);

    } catch (error) {
        next(error)
    }
})


module.exports = cartRouter;