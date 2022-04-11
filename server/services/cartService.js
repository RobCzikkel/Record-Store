const CartModel = require('../db/cartModel');
const Cart = new CartModel();

const CartItemModel = require('../db/cartitemModel');
const CartItem = new CartItemModel();

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
    }
}