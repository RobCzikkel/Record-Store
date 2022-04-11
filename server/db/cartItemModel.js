const { pool } = require('./config');
const pgp = require('pg-promise')({capSQL:true});

module.exports = class CartItem {

    async addItem(params) {
        try {
            const statement = pgp.helpers.insert(params,null, 'cart_item') + ' RETURNING *';
            const result = await pool.query(statement);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async deleteItem(track_id) {
        try {
            const result = pool.query('DELETE FROM cart_item WHERE track_id=$1', [track_id]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async clearCart(cart_id) {
        try {
            const result = pool.query('DELETE FROM cart_item WHERE cart_id=$1', [cart_id]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getItems(cart_id) {
        try {
            const result = pool.query(`SELECT c.id, c.cart_id, c.track_id, t.title AS track_title, t.playtime, t.price, a.title AS album_title, a.release_date, a.press, a.cover
                                       FROM cart_item c
                                       INNER JOIN tracks t ON c.track_id=t.id
                                       INNER JOIN albums a on t.album_id=albums.id
                                       WHERE cart_id=$1`, [cart_id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}