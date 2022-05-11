const pgp = require('pg-promise')({capSQL: true});
const { pool } = require('./config');

module.exports = class Address {

    async createAddress(params) {
        try {
            const statement = pgp.helpers.insert(params, null, 'customer_addresses') + ' RETURNING *';
            const result = await pool.query(statement);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getAddress(user_id) {
        try {
            const result = await pool.query('SELECT first, last, city, postcode, country FROM customer_addresses WHERE user_id=$1', [user_id]);
            return result.rows[0]
        } catch (error) {
            throw error;
        }
    }

    async updateAddress(params, user_id) {
        try {
            const statement = pgp.helpers.update(params, null, 'customer_addresses') + ` WHERE user_id=${user_id} RETURNING *`;
            const result = await pool.query(statement);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async deleteAddress(user_id) {
        try {
            const result = await pool.query('DELETE FROM customer_addresses WHERE user_id=$1', [user_id]);
            return true;
        } catch (error) {
            throw error;
        }
    }
}