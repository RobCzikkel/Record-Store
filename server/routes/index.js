const express = require('express');
const jwt = require('jsonwebtoken');
const { AuthFromCookie } = require('../services/jwtService')

require('dotenv').config();

const indexRouter = express.Router();
const UserService = require('../services/userService')
const CartService = require('../services/cartService')

const emitter = require('../events');


//HOME PAGE
indexRouter.get('/', (req, res, next) => {
  res.status(200).json("Honey, I\'m home!");
});


//SIGNUP - CREATES USER + JWT + COOKIE
indexRouter.post('/signup', async(req, res, next) => {
  try {
    const ip = req.ip
    const params = {...req.body, ip}

    const user = await UserService.addUser(params);
    const cart = await CartService.createCart(user.id);
    user.cart_id = cart.id;

    const token = jwt.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256'});

    res
        .status(201)
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: false
        })
        .send(token)


    emitter.emit('confirmation', user.email)
  
  } catch (error) {
      next(error);
  }
});


//LOGIN - FINDS USER + CREATES NEW JWT + COOKIE
indexRouter.post('/login', async(req,res,next) => {
  try {
    const user = await UserService.loginUser(req.body);
    const cart = await CartService.getCartByUserID(user.id);
    user.cart_id = cart.id;

    const token = jwt.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256'});

    res
        .status(200)
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: false
        })
        .send(token)
    
  } catch (error) {
    next(error)
  }
});


//LOGOUT - DESTROYS COOKIE
indexRouter.get('/logout', async(req,res,next) => {
  try {
    res
        .clearCookie('jwt')
        .status(200)
        .json({"Message": "Logged out"})
  } catch (error) {
    next(error)
  }
});


//AUTHCHECK - FOR FRONTEND STATE
indexRouter.get('/authcheck', AuthFromCookie, async(req,res,next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error)
  }
});


module.exports = indexRouter;
