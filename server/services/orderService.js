const OrderModel = require('../db/orderModel');
const Order = new OrderModel();

const OrderItemModel = require('../db/orderItemModel');
const OrderItem = new OrderItemModel();


module.exports = {
    getOrders: async(id) => {
        const orders = await Order.getOrders(id);
        const response = await Promise.all(orders.map(async(order) => ({
            ...order,
            tracks: await OrderItem.getItems(order.id)
        })));
        return response;
    },

    findOrder: async(id) => {
        let order = await Order.getSingleOrder(id);
        const tracks = await OrderItem.getItems(order.id)
        order = {...order, tracks: tracks};
        return order;
    }
}