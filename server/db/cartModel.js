const { pool } = require('./config');
const options = {capSQL: true};
const pgp = require('pg-promise')(options);

module.exports = class Cart {
    
    async createCart(params) {
        try {
            const statement = pgp.helpers.insert(params, null, 'cart') + ' RETURNING *';
            const result = await pool.query(statement);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getCartByID(id) {
        try {
            const result = await pool.query('SELECT * FROM cart WHERE id=$1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getCartByUserID(user_id) {
        try {
            const result = await pool.query('SELECT * FROM cart WHERE user_id=$1', [user_id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}