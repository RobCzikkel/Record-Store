const express = require('express');
const cartRouter = express.Router();

const CartService = require('../services/cartService');

//GET cart of user
cartRouter.get('/', async(req,res,next) => {
    try {
        const cart = await CartService.loadCart(req.body.user_id);
        res.status(200).json(cart);
    } catch (error) {
        next(error)
    }
});
 
//ADD to cart
cartRouter.post('/', async(req,res,next) => {
    try {
        const item = await CartService.addItem(req.body.cart_id, req.body.track_id);
        res.status(200).json(item)

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


module.exports = cartRouter;