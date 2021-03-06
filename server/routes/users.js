const express = require('express');
const usersRouter = express.Router();
const { AuthFromCookie } = require('../services/jwtService');
const UserService = require('../services/userService');
const CartService = require('../services/cartService');
require('dotenv').config();


usersRouter.use(AuthFromCookie)  // middleware to extract user from jwt token in cookie

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);


//GET all users 
usersRouter.get('/', async(req, res, next) => {     
  try {
    const user = req.user;
    if (user.role === 'admin') {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } else {
      res.status(404).send('User not authorized');
    }
  } catch (error) {
    next(error);
  }
});


//GET singleuser by ID
usersRouter.get('/:id', async(req,res,next) => {
  try {
    const user = req.user;
    if (user.role === 'admin') {
      const response = await UserService.getUserByID(req.params.id);
      res.status(200).json(response)
    } else {
      res.status(404).send('User not authorized')
    }
    
  } catch (error) {
    next(error)
  }
});

//ADD user to database only by admin 
usersRouter.post('/', async( req,res,next) => {
  try {
    if (req.user.role === 'admin') {
      const customer = await stripe.customers.create();
      const ip = req.ip;
      const stripe_id = customer.id;
      const params = {...req.body, ip, stripe_id}
      const user = await UserService.addUser(params);
      const cart = await CartService.createCart(user.id);
      user.cart_id = cart.id;
      res.status(201).json(user);
    } else {
      res.status(404).send('User not authorized');
    }
  } catch (error) {
    next(error);
  }
})

//UPDATE single user by ID as admin
usersRouter.put('/:id', async(req,res,next) => {
  try {
    if (req.user.role === 'admin') {
      const response = await UserService.updateUser(req.params.id, req.body);
      res.status(201).json(response)
    } else {
      res.status(404).send('User not authorized');
    }
  } catch (error) {
    next(error);
  }
});

//DELETE single user by ID
usersRouter.delete('/:id', async(req,res,next) => {
  try {
    if (req.user.role === 'admin') {
      const response = await UserService.deleteUser(req.params.id);
      res.status(201).json(response);
    } else {
      res.status(404).send('User not authorized')
    }
  } catch (error) {
    next(error)
  }
})




module.exports = usersRouter;
