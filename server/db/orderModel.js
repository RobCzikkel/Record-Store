const pgp = require('pg-promise')({capSQL: true});
const { pool } = require('./config');

module.exports = class Order {
    getOrders(id) {
        try {
            const result = await pool.query('SELECT * FROM orders WHERE user_id=$1', [id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

}