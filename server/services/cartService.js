const CartModel = require('../db/cartModel');
const Cart = new CartModel();

const CartItemModel = require('../db/cartitemModel');
const CartItem = new CartItemModel();

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51KwT3pFFey9GAD5q9BT2yiIiS2ASUFwT14YuQsQMaKD54R8upSI9T1cKvvitxjhXohj8ZmyMBy2Qc080zsplXAZ700u6XjpgTt');

module.exports = {

    createCart: async(user_id) => {
        params = {
            user_id: user_id
        }
        const cart = Cart.createCart(params);
        return cart;
    },

    getCartByID: async(id) => {
        const cart = Cart.getCartByID(id);
        return cart;
    },

    getCartByUserID: async(user_id) => {
        const cart = Cart.getCartByUserID(user_id);
        return cart;
    },

    loadCart: async(user_id) => {
        const cart = Cart.getCartByUserID(user_id);
        const items = CartItem.getItems(cart.id);
        cart.items = items;
        return cart;
    },

    addItem: async(cart_id, track_id) => {
        const item = await CartItem.addItem(cart_id,track_id);
        return item; 
    },

    deleteItem: async(track_id) => {
        const response = await CartItem.deleteItem(track_id);
        return response;
    },

    clearCart: async(cart_id) => {
        const response = await CartItem.clearCart(cart_id);
        return response;
    },

    checkOut: async(data, user_id) => {
        const { cart_id, id, first, last, email, address, saveCard } = data;
        if(saveCard) {
            const customer = await stripe.customers.create({
                name: `${first} ${last}`,
                email: email,
                address: {
                    line1: address.line1,
                    line2: address.line2,
                    city: address.city,
                    postal_code: address.postal_code,
                    country: address.country
                },
              });
        }
    }
}