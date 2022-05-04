const pgp = require('pg-promise')({capSQL: true});
const { pool } = require('./config');

module.exports = class Order {
    async getOrders(id) {
        try {
            const result = await pool.query('SELECT * FROM orders WHERE user_id=$1', [id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getSingleOrder(id) {
        try {
            const result = await pool.query('SELECT * FROM orders WHERE id=$1', [id]);
            return result.rows[0]
        } catch (error) {
            throw(error)
        }
    }

    async createOrder(params) {
        try {
            const statement = pgp.helpers.insert(params, null, 'orders') + ' RETURNING *';
            const result = await pool.query(statement);
            return result.rows[0]
        } catch (error) {
            throw(error);
        }
    }

}