const CartModel = require('../db/cartModel');
const Cart = new CartModel();

const CartItemModel = require('../db/cartitemModel');
const CartItem = new CartItemModel();

const OrderModel = require('../db/orderModel')
const Order = new OrderModel();

const OrderItemModel = require('../db/orderItemModel');
const OrderItem = new OrderItemModel();

const AddressModel = require('../db/addressModel');
const Address = new AddressModel()

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51KwT3pFFey9GAD5q9BT2yiIiS2ASUFwT14YuQsQMaKD54R8upSI9T1cKvvitxjhXohj8ZmyMBy2Qc080zsplXAZ700u6XjpgTt');

module.exports = {

    createCart: async(user_id) => {
        params = {
            user_id: user_id
        }
        const cart = await Cart.createCart(params);
        return cart;
    },

    getCartByID: async(id) => {
        const cart = await Cart.getCartByID(id);
        return cart;
    },

    getCartByUserID: async(user_id) => {
        const cart = await Cart.getCartByUserID(user_id);
        return cart;
    },

    loadCart: async(user_id) => {
        const cart = await Cart.getCartByUserID(user_id);
        const items = await CartItem.getItems(cart.id);
        cart.items = items;
        return cart;
    },

    addItem: async(cart_id, track_id) => {
        const item = await CartItem.addItem({cart_id:cart_id,track_id});
        return item; 
    },

    deleteItem: async(id) => {
        const response = await CartItem.deleteItem(id);
        return response;
    },

    clearCart: async(cart_id) => {
        const response = await CartItem.clearCart(cart_id);
        return response;
    },

    checkOut: async(data, user) => {
        // const { first, last, address, saveCard } = data;
        const { first, last, address, currency, saveCard } = data;

        const tracks = await CartItem.getItems(user.cart_id);
        const total = tracks.reduce((acc, cur) => {
            return acc + Number(cur.price)
        }, 0)
        console.log(tracks)
        const order = await Order.createOrder({user_id: user.id, total: total});
        order.tracks = await Promise.all(tracks.map(async(track) => await OrderItem.addItem({order_id: order.id, track_id: track.track_id, price: track.price})))

        const paymentIntent = await stripe.paymentIntents.create({
            customer: user.stripe_id,
            setup_future_usage: 'on_session',
            amount: total * 100,
            currency: 'gbp',
            payment_method_types: ['card'],
            // automatic_payment_methods: {
            //   enabled: true,
            // },
          });

        const addressData = {
            user_id: user.id,
            first: first,
            last: last,
            street: address.street,
            city: address.city,
            postcode: address.postcode,
            country: address.country
        };

        order.customerAddress = await Address.createAddress(addressData);  
        order.client_secret = paymentIntent.client_secret;

        await CartItem.clearCart(user.cart_id);

        return order;
    }
}