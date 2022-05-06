const ordersRouter = require('express').Router();
const { AuthFromCookie } = require('../services/jwtService');
const OrderService = require('../services/orderService')

//Protecting the endpoint
ordersRouter.use(AuthFromCookie)

// GET all orders
ordersRouter.get('/', async(req,res,next) => {
    try {
        const response = await OrderService.getOrders(req.user.id)
        res.status(200).json(response)
    } catch (error) {
        next(error);
    }
});

// GET single order
ordersRouter.get('/:id', async(req,res,next) => {
    try {
        const response = await OrderService.findOrder(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
});

module.exports = ordersRouter;